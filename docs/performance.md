# Rendimiento y navegación — 22 septiembre 2026

## Diagnóstico

- El listener `wheel` de `app/page.tsx` aceptaba apenas 1 px en Servicios, frente a 52 px en las otras secciones. El bloqueo de 320 ms podía terminar antes que la inercia del trackpad. Lenis y GSAP/ScrollTrigger no están montados en esta ruta; no hay scroll-snap controlando este salto.
- Las cuatro secciones secundarias se importaban estáticamente tanto desde la página como desde SceneStage.
- Spline ya tenía import dinámico, placeholder CSS, dimensiones reservadas y crossfade. El cubo persistente continuaba renderizando al estar oculto. El runtime, la compilación de la escena y su trabajo por frame dominan el coste; no basta con comprimir recursos.
- Se descargaban sonidos aunque el sonido estuviera desactivado. Las fuentes eran TTF; Light y Hairline sumaban 110.291 bytes transferidos en esta medición.
- Las imágenes de las secciones activas ya usan next/image, sizes y carga diferida; la prioridad del logo y de imágenes ampliadas al abrir el modal es deliberada. No se añadieron prioridades globales ni cambios visuales.

## Cambios y alcance

| Archivo | Cambio |
| --- | --- |
| `app/components/experience/deferred-scenes.tsx`, `scene-stage.tsx`, `app/page.tsx` | Imports dinámicos compartidos de Marcas, Servicios, Contacto y Cotiza. En móvil las secciones siguen formando el documento natural. |
| `app/page.tsx` | Umbral uniforme de 52 px normalizados, sin acumular deltas pequeños. Un gesto se consume una sola vez y se renueva tras 180 ms sin eventos. El scroll interno conserva prioridad; llegar a su límite no reutiliza la misma inercia para saltar a Contacto. |
| `smooth-spline.tsx`, `intro-scene.tsx` | Montaje tras intersección y frame, condicionado por actividad. El cubo usa renderMode manual mientras está oculto y auto al regresar; conserva instancia, reloj y handlers, sin stop/play ni reinicio de Start. |
| `floating-social-orb.tsx` | Audios con preload none, sin load inicial. Se descargan al activar sonido. No se modifican ojos, hover, objetos, área social ni animaciones en esta optimización. |
| `public/fonts/omnes/*.woff2`, `app/globals.css`, `app/layout.tsx` | Las mismas ocho fuentes convertidas sin alterar cmap ni métricas hmtx. Se mantiene font-display swap y solamente Light precargada. Los TTF originales quedan como fuente de origen. |

Se conservan dos aplicaciones Spline en escritorio (cubo y orbe, ambas visibles en Inicio) y una en móvil. No se recrean en cada navegación. El orbe conserva su control de visibilidad y el arreglo anterior de antialiasing temporal; la suspensión nueva se aplica solamente al cubo. No se modificaron versiones de dependencias, Supabase ni `/api/send-quote`.

## Método de medición

Producción local (`npm run build`, `npm run start -- --port 3200`), Chrome headless, caché HTTP deshabilitada, red de 10 Mbps/40 ms, CPU 4x, DPR 1, viewports 1366×768 y 390×844, tres ejecuciones por caso. Se comparan medianas de `tests/perf-baseline.json` y `tests/perf-after.json` mediante `tests/performance.mjs`. La medición final se ejecuta sin las otras pruebas de navegador en paralelo.

LCP se recoge con PerformanceObserver y CLS suma desplazamientos sin interacción durante la ventana inicial. Los bytes corresponden a recursos completados durante los primeros 20 segundos, incluido Spline, no al tamaño bruto del bundle. La interacción medida es el peor evento observado al pulsar cuatro botones de navegación por ejecución: es una muestra de laboratorio, **no INP de usuarios reales**. En móvil no hay una muestra válida de interacción de botón; el cero del JSON significa no medido. Lighthouse no estaba instalado: no se atribuyen puntuaciones Performance ni TBT oficial a este experimento.

## Resultados (medianas)

| Métrica | Escritorio antes → después | Móvil antes → después |
| --- | --- | --- |
| LCP | 1.288 → 1.944 ms | 656 → 1.060 ms |
| CLS | 0 → 0 | 0 → 0 |
| Transferencia inicial, todos los recursos | 1.832.794 → 1.674.989 bytes (−8,6 %) | 1.254.093 → 1.121.778 bytes (−10,6 %) |
| JavaScript transferido en la ventana inicial | 931.328 → 912.771 bytes (−2,0 %) | 895.560 → 902.469 bytes (+0,8 %) |
| Fuentes transferidas | 110.291 → 84.156 bytes (−23,7 %) | 110.291 → 84.156 bytes (−23,7 %) |
| Peor interacción de navegación por ejecución | 888 → 688 ms (−22,5 %) | No medido |
| Cubo listo | 10.250 → 19.140 ms | 9.642 → 18.330 ms |
| Orbe listo | 11.215 → 19.804 ms | No se monta |
| Suma de excesos sobre 50 ms de long tasks, ventana inicial | 13.804 → 16.932 ms | 6.561 → 12.634 ms |

La reducción de transferencia y la suspensión del cubo oculto están verificadas. **No se demostró una mejora del tiempo total de carga**: la tanda posterior tuvo LCP, preparación 3D y tareas largas peores. No se encontraron procesos headless/Playwright sobrantes al finalizar; estas muestras pequeñas en una máquina compartida no permiten atribuir la diferencia temporal exclusivamente al código ni descartarla como simple ruido. Se conservan los resultados sin seleccionar sólo las ejecuciones favorables. El splitting de secciones reduce JS en escritorio; en móvil, al montar todas las secciones, agrega un pequeño coste de chunks.

Los LCP medidos siguen bajo 2,5 s y CLS bajo 0,1. No se alcanzó una respuesta de interacción de laboratorio bajo 200 ms; tampoco se acredita INP de campo. El renderizado y preparación de las escenas publicadas continúan siendo la limitación principal. Una mejora grande adicional requerirá perfilar/optimizar las escenas 3D y repetir mediciones en hardware estable, comprobando que no cambie su apariencia o interacción.

## Verificación

- Build y TypeScript correctos; `/` estática y `/api/send-quote` dinámica. ESLint: cero errores, ocho avisos preexistentes.
- `performance-regressions.mjs`: HTML/navegación durante descarga retrasada de escenas, cero frames del cubo oculto durante la observación, reanudación y handlers Start persistentes, audio diferido y activación correcta.
- `services-scroll.mjs`: nueve zonas de rueda en 1366 y 768 px, ±4 px sin salto, ±180 px con navegación deliberada en el límite, gesto sostenido sin atravesar dos secciones, nueve zonas táctiles en 390 px.
- `ux.mjs`: escritorio y móvil; tarjetas, modales, zoom, galería, teclado, Escape, foco, scroll, navegación y formulario con envío simulado. Sin errores JavaScript.
- `orb-regression.mjs`: diez ciclos de navegación con seguimiento de ojos, parpadeo, scroll y referencias persistentes, sin crecimiento de listeners.
- `orb-social-calibration.mjs`: cuatro enlaces, espacios entre redes y padding, reentrada rápida, veinte transiciones, propiedad de transforms de ojos y arreglo temporal AA acotado al orbe. Una ejecución paralela falló en una aserción de tiempo de reentrada; la repetición aislada pasó completa.
- `quote-api.mjs`: validaciones, payload Supabase y rutas de éxito/fallo de base de datos y correo; servicios externos simulados, sin enviar correos.
- Capturas antes/después revisadas: composición y tipografía conservadas; la fase del cubo animado difiere naturalmente.
