# Auditoría y refinamiento de UX — Rubik Creaciones

Fecha: 10 de septiembre de 2026. Next.js 16.2.1, React 19.2.4, Tailwind 4 y Turbopack. Se mantuvieron las escenas, imágenes, fuentes, colores, estructura de navegación y bibliotecas existentes. No se cambiaron dependencias ni la API de envío de cotizaciones.

## Archivos y motivos

La lista incluye las dos tandas de esta sesión; la primera quedó incorporada al commit `3976e5c` durante el trabajo.

| Archivo | Cambio |
|---|---|
| `app/components/experience/gallery-image.tsx` | Capa compartida para conservar la imagen anterior hasta decodificar la siguiente; fundido de 280 ms y desplazamiento de 8 px; respaldo para zoom; precarga de hasta dos vecinas; clic dentro de la imagen y fuera del área pintada. |
| `app/components/experience/use-dialog-focus.ts` | Foco inicial, recorrido de Tab contenido, Escape, flechas izquierda/derecha y devolución del foco sin desplazar la página. |
| `app/components/scenes/brand-details-scene.tsx` | Galería y zoom estables; salida animada; controles accesibles; miniaturas con `aria-pressed`; tamaños de descarga; panel móvil sin altura rígida; scroll de contenido largo. |
| `app/components/scenes/work-scene.tsx` | Mismas mejoras de galería; tarjeta de detalle en portal para evitar ancestros transformados; bloqueo del scroll de fondo; estados de reinicio sin efectos redundantes; eliminación de dos hooks condicionales. |
| `app/components/experience/scene-stage.tsx` | Transiciones de entrada de 320–350 ms y salida de 200 ms; variante de movimiento reducido. |
| `app/globals.css` | Tamaño fluido de la tarjeta; modelo de columnas sin sumar porcentajes y gap; mínimos de grid; foco visible; targets táctiles; movimiento reducido; alineación segura con poca altura y acceso por scroll cuando el contenido no cabe. |
| `app/page.tsx` | Preferencia de movimiento en scroll, `MotionConfig`, limpieza del temporizador de navegación y protección de scroll/zoom frente al listener de rueda. |
| `app/components/layout/fixed-header.tsx` | Menú móvil desplazable, foco y restauración de overflow; cierre al alcanzar el breakpoint de escritorio. Diseño y botones conservados. |
| `app/components/scenes/cotiza-scene.tsx` | Nombres accesibles/autocompletado; estados anunciados; progreso con `scaleX`; confirmación sin mínimo de ancho que sobresalga. |
| `app/layout.tsx` | Precarga de Omnes Light y traslado de la carga de Three.js antiguo al componente que lo necesita. Viewport original conservado. |
| `app/components/scenes/faq-scene.tsx` | Carga local de su script Three.js y tipos concretos para Vanta. |
| `app/components/scenes/floating-social-orb.tsx` | Activación de sonido desde teclado, tipos concretos y prevención del inicio del baile automático con movimiento reducido. Escena e interacción conservadas. |
| `eslint.config.mjs` | Exclusión de assets de terceros en `public`; reglas de la aplicación sin desactivar. |
| `tests/ux.mjs`, `tests/README.md` | Pruebas reproducibles sobre producción utilizando Playwright ya disponible, sin instalarlo en el proyecto. |

## Hallazgos y decisiones

- El reset ya incluía `border-box`, multimedia fluida y controles con fuente heredada; Tailwind Preflight aporta la normalización de márgenes. No se reemplazó ni se añadió un reset destructivo.
- El viewport ya exportaba `width: device-width` e `initialScale: 1`; no se duplicaron etiquetas.
- Las galerías retiraban la imagen anterior antes de mostrar la siguiente. Ahora la siguiente se prepara antes del intercambio; el contenedor permanece estable. El zoom mantiene `object-contain` y el detalle `object-cover`.
- `AnimatePresence` estaba dentro de una condición que lo desmontaba al cerrar: ahora permanece montado para ejecutar la salida de 220 ms.
- Los lightboxes no tenían Escape/flechas/foco gestionado. Ahora conservan índice y scroll, admiten clic exterior, botón Cerrar y teclado. Las bandas vacías de `object-contain` cuentan como fondo.
- La tarjeta de Servicios de 643×689 px, más paneles y padding, se recortaba a 1366×768. Su ancestro animado alteraba el containing block del overlay fijo. El portal sigue el patrón que el proyecto ya utilizaba para ampliar imágenes.
- Tras la corrección solicitada, Servicios toma como referencia los 1040 × 742,6 px de Marcas: ancho de 1040 px y altura de 700 px (94,3%). Solo se reduce la altura en ventanas bajas para dejar espacio al header y 32 px inferiores. A 1366×768 mide 1040×616: mantener el 90–95% allí sería incompatible con mostrarla completa bajo el header. El panel de información toma su altura del contenido, sin la división rígida anterior. Las cinco descripciones a 1920×1080 se verificaron sin overflow interno. Esta última corrección solo cambia reglas de tamaño de Servicios y las expectativas de pruebas; no modifica Marcas ni otras funcionalidades.
- El menú móvil podía quedar bloqueando el scroll al redimensionar a escritorio; ahora restaura el valor anterior y puede desplazarse en pantallas bajas.
- El centrado vertical del hero podía colocar texto por encima del viewport en landscape. `safe center` conserva el centro cuando cabe y evita el desbordamiento negativo cuando no cabe.
- Se conservaron los breakpoints de 768 y 1024 px, incluidos los ajustes heredados por altura/DPR. No se creó una media query por cada resolución. Se añadieron condiciones de dispositivo táctil y movimiento reducido.
- No se alteró la familia tipográfica. Solo el título del panel de Servicios se adapta fluidamente dentro de su nueva tarjeta; los máximos se conservan. Los controles del formulario usan 1rem en pantallas pequeñas para evitar zoom al enfocar.
- La página cargaba 768.639 bytes de Three.js antiguo, cuyo único consumidor identificado es FAQ. El archivo permanece en `public` y se carga desde FAQ; Spline mantiene su propio runtime e imports dinámicos.
- Las imágenes adyacentes se precargan únicamente en el lightbox, usando las URLs optimizadas de Next y como máximo dos imágenes. Se respeta `Save-Data` cuando el navegador lo expone.

## Validación

Build de producción y comprobación TypeScript: correctas. Lint: código de salida 0, sin errores y con ocho advertencias heredadas. No se ocultaron advertencias de código propio para mejorar el resultado.

Las pruebas usan Chromium/Google Chrome, con emulación de Mobile Chrome y dispositivos táctiles. Los envíos del formulario están interceptados y simulados; no se enviaron correos. Firefox, WebKit y dispositivos físicos no se verificaron.

Se capturó la carga inicial antes/después en 320×568, 360×640, 375×667, 390×844, 412×915, 430×932, 768×1024, 820×1180, 1024×768, 1280×720, 1366×768, 1440×900, 1536×864, 1920×1080, 2560×1440, 3840×2160, 844×390 y 3440×1440. No hubo scroll horizontal del documento ni imágenes HTML rotas en esa matriz. Las capturas iniciales pueden preceder a la carga completa de Spline; las pruebas funcionales esperan adicionalmente y registran los canvas presentes.

Los recorridos completos abarcan Marcas, Servicios, contacto y formulario en ocho resoluciones. Verifican abrir/cerrar, clic en imagen, fondo, Escape, Cerrar, flechas, Tab, índice, scroll, tamaño de tarjeta y resize. Las instrucciones reproducibles están en `tests/README.md`.

En una primera ejecución hubo un 500 de recurso estático a 1920 px que dejó la página sin estilos; no se reprodujo en las ejecuciones posteriores con servidor de producción reiniciado. También se corrigieron dos supuestos de las pruebas: el `role=alert` del anunciador de Next y el desplazamiento automático de Playwright antes del clic. No se atribuyeron esos fallos de prueba a la aplicación.

## Límites y pendientes

| Prioridad | Pendiente | Decisión |
|---|---|---|
| ALTO | Carga/ejecución inicial del runtime y escenas Spline en CPU limitada. | Conservar la experiencia 3D; no sustituir ni modificar la escena para elevar puntuaciones. |
| MEDIO | Advertencias de dependencias de efectos del orbe. | Requieren revisión específica de sus ciclos de audio, pestaña y animación; no añadir dependencias ciegamente que reinicien timers. |
| MEDIO | Validación física en Safari/iOS y Android; INP de usuarios reales. | La emulación Chromium y Lighthouse no sustituyen esas mediciones. |
| BAJO | Funciones de respaldo sin uso y un `img` en una transición GSAP no montada. | No eliminar componentes funcionales o de respaldo ni refactorizar secciones ajenas. |
| BAJO | Consolidación de las reglas CSS heredadas por DPR y altura. | No realizar una limpieza masiva durante una mejora incremental. |

No se detectaron pendientes críticos en los recorridos verificados. No se probó el envío SMTP real ni se garantizaron todos los enlaces externos. Las escenas Spline y los callbacks de GSAP se conservaron; las bibliotecas React Three, Lenis y Vanta no se eliminaron aunque varias no participan en la ruta visible.

Recomendaciones futuras: medir INP con tráfico real; repetir Lighthouse en un equipo estable y dispositivo físico; evaluar assets Spline con su autor; revisar de forma aislada los efectos del orbe; considerar WOFF2 y métricas de fallback para fuentes en una tarea independiente.

## Corrección final de tamaño de Servicios

Referencia medida: Marcas 1040 × 742,6 px al terminar su transición en escritorio. No se modificó su implementación durante esta corrección.

| Viewport | Servicios | Margen inferior |
|---|---|---|
| 1366×768 | 1040×616 | 32 px |
| 1440×900 | 1040×700 | 53 px |
| 1536×864 | 1040×700 | 37,5 px |
| 1920×1080 | 1040×700 | 130,4 px |
| 2560×1440 | 1040×700 | 306 px |

Las cinco resoluciones pasaron el recorrido completo y fueron revisadas visualmente. A 1920×1080 las cinco descripciones presentan `scrollHeight === clientHeight`: no hay texto recortado ni scroll interno. Se mantiene el breakpoint existente de 1024 px. Las reglas móviles no cambian en esta corrección. Build y lint volvieron a pasar (0 errores, 8 advertencias heredadas).

## Lighthouse y métricas locales

Lighthouse 13.4.1 sobre producción local, una pasada por perfil antes y después. Son mediciones de laboratorio, no datos de usuarios reales ni evidencia causal de cada cambio.

| Perfil | Performance antes → después | Accesibilidad | Best Practices | SEO | LCP antes → después | CLS antes → después | TBT antes → después |
|---|---|---|---|---|---|---|---|
| mobile | 42 → 45 | 96 → 96 | 100 → 100 | 100 → 100 | 6.80 → 5.32 s | 0.036 → 0.000 | 5636 → 5988 ms |
| desktop | 41 → 51 | 100 → 100 | 100 → 100 | 100 → 100 | 4.04 → 2.12 s | 0.007 → 0.000 | 3746 → 6102 ms |

Los JSON se generaron correctamente, sin `runtimeError`. La CLI terminó con código 1 al limpiar la carpeta temporal de Chrome (`EPERM` en Windows), después de guardar cada informe. No se presenta ese código como ejecución limpia de la CLI.

El LCP móvil identificado es el texto «Marcas que han confiado en Rubik»; en escritorio es «EL EQUIPO QUE» dentro del hero. Las cifras simuladas de Lighthouse pueden diferir del instante de render observado en la traza. TTFB del servidor local: unos pocos milisegundos; no representa alojamiento real. INP no está disponible; TBT no lo sustituye.

El coste de JavaScript sigue siendo alto y TBT no presenta una mejora consistente. Se mantiene Spline y se recomienda perfilar sus escenas por separado. Accesibilidad móvil conserva avisos de contraste de aproximadamente 4,47–4,48:1 en etiquetas de Servicio, por debajo de 4,5:1; no se alteraron colores en la corrección final solicitada.

Informes completos y capturas de esta sesión: `C:/Users/hp/AppData/Local/Temp/rubik-frontend-audit/`.
