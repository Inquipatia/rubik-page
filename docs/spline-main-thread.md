# Spline: perfil del hilo principal y cambios controlados

## Resultado y límites

El coste dominante está en preparar y renderizar las escenas Spline. La versión final reduce el bloqueo acumulado local de **19.090 a 14.192 ms (25,7 %)** y la tarea más larga de **3.392 a 1.975 ms (41,8 %)**. No alcanza la meta de 3.000 ms. No se ha desplegado ni repetido la medición de Hostinger; sus 22.570 ms de TBT siguen siendo la referencia de producción proporcionada por el usuario.

Estos perfiles suman `max(duración - 50, 0)` de tareas largas durante una observación de unos 25 segundos tras DOMContentLoaded. El navegador puede extender esa ventana al estar bloqueado. **No son el TBT oficial de Lighthouse**, que usa su propia ventana. No deben restarse directamente de los 22.570 ms de Hostinger.

## Diagnóstico antes de editar la aplicación

Producción local, Chrome, 1366×768, caché HTTP desactivada, CPU 4×, red 10 Mbps/40 ms. Perfiles CPU mediante Chrome DevTools Protocol, sin otros tests de navegador simultáneos. Una ejecución por variante: sirve para atribuir costes y detectar cambios importantes, no como distribución estadística ni garantía en todos los dispositivos.

| Variante | Bloqueo acumulado | Tarea máxima | FCP | LCP | CLS | Cubo listo | Orbe listo |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WebGPU previo | 19.090 ms | 3.392 ms | 2.176 ms | 2.176 ms | 0 | 16.767 ms | 17.418 ms |
| Sin `.splinecode`, sólo diagnóstico | 2.931 ms | 1.111 ms | 1.252 ms | 1.252 ms | 0 | — | — |
| WebGL diagnóstico | 25.339 ms | 10.996 ms | 1.864 ms | 3.196 ms | 0,000118 | 26.711 ms | 31.807 ms |
| WebGPU final | 14.192 ms | 1.975 ms | 1.304 ms | 1.304 ms | 0 | 6.934 ms | 12.403 ms |

Las tareas >50 ms pasan de 53 a 118: hay más tareas pequeñas, pero menos bloqueo total y menor duración máxima. No se afirma que desaparecieron las tareas largas. El indicador “listo” es el callback de carga y exposición del canvas; no equivale a INP ni garantiza que toda compilación asíncrona haya finalizado.

En el perfil previo, el chunk de WebGPU consume aproximadamente 12,6 s de muestras CPU exclusivas. Sobresalen `_copyImageToTexture` (~2,96 s), construcción/análisis de nodos de materiales, renderizado y preparación de recursos. La evaluación de módulos también aparece (~2,8 s en el cargador Turbopack); no debe confundirse toda esa función con hidratación React. Bloquear las escenas conserva el import del runtime, por lo que los 2.931 ms restantes tampoco son “sólo React”.

Lenis, los wrappers GSAP y las transiciones FAQ no están montados en la ruta activa. Framer Motion participa en la interfaz, pero no domina este perfil. El seguimiento de cursor utiliza refs y un RAF compartido; no actualiza el árbol React a 60 FPS. No se encontró polling continuo para localizar objetos. Los timers de blink/danza ejecutan animaciones existentes y tienen cleanup. No se cambiaron por demoras arbitrarias.

## WebGPU frente a WebGL

Runtime 2.0.53 permite oficialmente `renderer: "webgl" | "webgpu"` y documenta el parámetro diagnóstico `?renderer=webgl`. Se utilizó ese parámetro, sin cambiar el backend definitivo ni la versión del paquete.

Una medición complementaria sin CPU limitada, durante cinco segundos tras cargar ambos canvases, registró aproximadamente 54 FPS por escena con WebGPU y 57 FPS con WebGL. Heap JS observado: 26,9 MB frente a 23,1 MB; son instantáneas sensibles al GC, no memoria total del proceso ni de GPU. Las capturas muestran la misma composición, con diferencias de fase de animación/reflejos. No se certificó equivalencia visual pixel a pixel ni se adoptó WebGL: falla el criterio principal de coste inicial, antes de justificar una regresión funcional exhaustiva en ese backend.

En WebGL destacan subida de texturas y compilación, con una tarea de casi 11 segundos. Se conserva WebGPU y el arreglo previo de temporal AA acotado al orbe.

## Implementación final

| Archivo | Propósito |
| --- | --- |
| `app/components/experience/spline-initialization.ts` | Cola compartida de inicialización gráfica. Un trabajo a la vez, elegibilidad por actividad/visibilidad, cancelación y recuperación tras fallos. Usa `scheduler.postTask` de prioridad background, con MessageChannel como alternativa; no agrega setTimeout ni polling. |
| `app/components/experience/spline-canvas.tsx` | Descarga en paralelo los archivos visibles y comparte el import del runtime. Usa la API pública `start(buffer)`, equivalente al fetch + start de `load()`, dentro de la cola. Antes de liberar el turno espera el evento rendered y que las estadísticas de compilación asíncrona de runtime 2.0.53 no tengan trabajos pendientes. Elimina el ResizeObserver redundante: el runtime ya administra el tamaño. Conserva dispose/AbortController y listeners de interacción. |
| `app/components/experience/smooth-spline.tsx` | Margen inicial de intersección de 0 px y actividad transmitida al canvas. Mantiene dimensiones, poster CSS, crossfade y suspensión del cubo oculto. |

La cola no reduce la complejidad de un shader ni hace que una operación síncrona interna sea interrumpible. Evita que dos inicializaciones compitan y permite tareas del navegador entre ellas. No se parcheó node_modules ni se alteraron materiales, IDs, geometrías, DPR o frecuencias de animación.

El contrato de `renderer.info.asyncCompilation` está verificado en la versión instalada y cubierta por pruebas reales. Debe revisarse al actualizar Spline. No hay un RAF adicional de polling; el listener temporal rendered se limpia al completar o abortar.

## Escenas, persistencia y HTML

- Cubo: `https://prod.spline.design/wk0u6G-MY2bbyF6i/scene.splinecode`, sólo cuando su canvas entra en el viewport activo.
- Orbe: `https://prod.spline.design/rWCCsSXcaU52lNsR/scene.splinecode`, sólo en escritorio, cuando es visible.
- No hay otras escenas Spline en Marcas, Servicios, Contacto o Cotiza. En escritorio ambas pertenecen al primer viewport; no se elimina ninguna para mejorar la métrica.
- En 390×400 el HTML aparece sin solicitud `.splinecode` ni canvas; al desplazar hasta el cubo se crea exactamente una instancia y se reutiliza al regresar.
- Al navegar entre secciones se mantienen las instancias. El cubo oculto no renderiza; al volver no reinicia Start. El cambio estructural entre layout móvil y escritorio puede remontar componentes, con cleanup; no se prometió persistencia entre árboles responsive distintos.
- SplineCanvas sigue siendo un import dinámico con ssr:false y el runtime un import dinámico interno. No se amplió la frontera client de la página ni se ocultó HTML/SEO con loaders.

## Trabajo concreto en Spline Editor

Inventario observado, sin modificar las escenas:

| Recurso | Observación | Revisión recomendada |
| --- | --- | --- |
| Orbe: `Matcap6` | 1920×1920, frente a canvas 260×260 | Probar exportaciones 512/1024 y comparar reflejos/bordes en hover y distintas densidades de pantalla. Es el primer candidato a reducir subida/decodificación y memoria. |
| Orbe: `Matcap Reflection 5`, `Matcap Roughness 1` | 1024×1024 cada una | Evaluar 512 y verificar que no se altere el material aprobado. |
| Orbe: `Glass12` | Transmisión/reflexión; el renderer mantiene 12 render targets y 24 texturas totales (~32,5 MB de texturas, incluidas las generadas) | Perfilar las capas y pasadas de vidrio. Consolidar sólo si una comparación visual mantiene el resultado. Las 24 texturas no significan 24 imágenes descargadas ni prueban duplicación. |
| Redes | `linkedin_orb` y `whatsapp_orb`: 4.225 vértices cada uno; `instragram_orb` y `facebook_orb`: 3.968 cada uno | Probar menos segmentos en una copia, preservando silueta, eventos, transforms y área clicable. |
| Orbe completo | 8 geometrías únicas, 20.526 vértices únicos, 10 materiales | Revisar variantes y materiales “Untitled Material”; coincidir en nombre no demuestra que sean duplicados. No eliminar ViewAct ni elementos de ojos. |
| Cubo | 3 geometrías únicas, 1.800 vértices, un material Metal y `Matcap Roughness 2` 1024×1024 | Geometría relativamente pequeña; revisar resolución de matcap antes de simplificar geometría. |
| Exportación del orbe | El runtime migra schema 122 a 131 una vez por carga | Reexportar desde un editor compatible y validar todas las interacciones para evitar esa migración en cada visita. |

Sólo se encontró una HemisphereLight sin sombras por escena. No hay evidencia para culpar a luces excesivas o eliminar sombras indiscriminadamente. No se observó recreación del inventario en diez navegaciones. La revisión en Editor queda pendiente; no hay acceso al documento editable ni se hizo una reexportación automática.

## Regresiones y herramientas

- `npm run build`: correcto, TypeScript incluido, `/` estática y `/api/send-quote` dinámica.
- ESLint: cero errores, ocho avisos preexistentes.
- `spline-initialization.mjs`: un trabajo a la vez, trabajos ocultos no bloquean visibles, cancelación y recuperación tras errores.
- `spline-viewport.mjs`: ausencia de carga fuera de pantalla, carga al entrar y persistencia al volver.
- `performance-regressions.mjs`: navegación con descargas retrasadas, HTML visible, audio bajo demanda, cubo oculto sin frames, retorno a Home y Start persistente. Un intento falló por una respuesta Playwright dispuesta durante instrumentación; la repetición y la versión final pasaron.
- `orb-social-calibration.mjs`: cuatro redes clicables, padding, Instagram, reentrada rápida, veinte hover, ownership de ojos y AA acotado al orbe.
- `orb-regression.mjs`: diez vueltas con ojos, blink, rueda y referencias estables, sin crecimiento de listeners.
- `ux.mjs` y `services-scroll.mjs`: desktop/móvil, cards, modales, foco, teclado, formularios simulados; nueve zonas de rueda/touch, deltas pequeños sin salto y un gesto de trackpad sin atravesar Servicios. Se conserva la corrección previa del umbral y consumo de gesto; no se modificó la velocidad arbitrariamente.
- `quote-api.mjs`: Supabase y correo simulados; no se cambiaron esas integraciones ni se enviaron correos.

Perfiles resumidos: `tests/main-thread-before.json`, `tests/main-thread-webgl-diagnostic.json`, `tests/main-thread-final.json`. Inventario: `tests/spline-final-audit.json`. Los `.cpuprofile` completos están en el directorio temporal indicado por cada JSON y pueden abrirse en DevTools. Los scripts de auditoría instrumentan el navegador de prueba, nunca la aplicación publicada.
