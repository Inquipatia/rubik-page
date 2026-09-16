# Carga y navegación — 15 septiembre 2026

## Auditoría previa

- Hay una sola ruta visual (`/`). Inicio, Marcas, Servicios, Contacto, Cotiza y BrandDetails son estados de React, no rutas del App Router. El encabezado ya es persistente. Añadir `Link`/prefetch de rutas ficticias no aportaría nada.
- **Cubo principal:** `intro-scene.tsx`, visible en Inicio tanto en desktop como en móvil. Importación dinámica con `ssr: false`, fallback `null`, demora artificial de 1800 ms y ningún callback de carga ni transición. La escena se desmontaba al abandonar Inicio en desktop.
- **Orbe secundario:** `floating-social-orb.tsx`, fijo y visible en desktop; su ausencia en móvil es una decisión anterior a este cambio. Tenía un retraso de 100 ms y retiraba el placeholder al montar el módulo, antes de completar la carga. Sus interacciones usan `onLoad`, eventos locales, ojos, parpadeo y audio.
- No hay otros Spline debajo del fold. Los dos contenedores ya reservaban dimensiones: el problema principal era el vacío visual, no una altura inexistente. La grabación muestra además las entradas secuenciales del texto.
- `AnimatePresence mode="wait"` esperaba la salida antes de montar la siguiente escena. Títulos, párrafos, botones y tarjetas añadían sus propios delays. La navegación por botones podía ser ignorada durante el bloqueo de rueda de 550 ms.
- Lenis existe como componente, pero **no está montado** en `app/layout.tsx` ni en la página. No había doble instancia de Lenis que corregir. El scroll móvil usa el comportamiento nativo y respeta movimiento reducido. GSAP está en las transiciones de FAQ, fuera del árbol activo de esta página.
- Las imágenes activas ya utilizan `next/image`, `sizes`, contenedores dimensionados y un crossfade en `GalleryImage` que conserva la imagen anterior. Se detectó una prioridad innecesaria en Servicios y dos usos de prioridad para el logo.
- En las pruebas apareció otro problema de navegación: en tablet el logo invadía Inicio y el portal de detalle de Servicios cubría el encabezado.

## Implementación

### Spline

`app/components/experience/smooth-spline.tsx` centraliza la importación dinámica y la transición:

1. Contenedor y placeholder CSS presentes desde el render inicial, sin imágenes externas, spinner ni texto técnico.
2. Cubo con `priority`: inicia la carga tras hidratar, sin esperar un temporizador ni un observador.
3. Orbe con observación anticipada de **400 px**, seguido de `requestIdleCallback` (timeout de planificación de 1500 ms); fallback a un frame si la API no existe. El componente también sirve para futuras escenas realmente debajo del fold.
4. El `onLoad` de la versión instalada se ejecuta después de `Application.load()`. Se conservan los callbacks del orbe y se permiten dos frames para que React exponga el canvas antes de iniciar la transición. No se utiliza una espera artificial para simular carga.
5. Crossfade CSS de **800 ms**, escala **0.97 → 1** y blur **6 → 0 px**. El placeholder permanece hasta entonces. En móvil se omite el blur; con movimiento reducido sólo queda un fade de 180 ms.
6. Error boundary local: si falla el módulo o la escena, permanece el placeholder y la página continúa funcionando. Sin reintentos en bucle.
7. `Application.stop()`/`play()` al ocultarse la pestaña, salir del viewport o abandonar Inicio. La instancia del cubo permanece montada e inerte en desktop; volver no crea otro canvas. La librería sigue encargándose de `dispose()` al desmontar.

Se mantienen las interacciones, sonidos y transformaciones programadas del orbe. No se modifica ninguna escena `.splinecode`, ni se impone un DPR mediante APIs privadas.

### Navegación y animaciones

- `scene-stage.tsx`: Inicio persistente, capas de grid para conservar el flujo y crossfade simultáneo de 150–220 ms para las demás escenas. Encabezado estable. Inicio oculto queda fuera de interacción y foco mediante `inert`/`aria-hidden`.
- `intro-scene.tsx`: texto y CTA disponibles desde el primer render, sin su secuencia de espera.
- `page.tsx`: los clics del menú ya no se descartan por el bloqueo de rueda; protección de rueda reducida a 320 ms.
- `brand-showcase.tsx`, `contact-scene.tsx`, `cotiza-scene.tsx`: menos delays acumulados y títulos/contenido principal inmediatos. Los tres glows de Cotiza conservan su apariencia estática: se eliminan sus bucles infinitos, que seguían trabajando debajo del fold en móvil.
- `fixed-header.tsx` y `globals.css`: logo ajustado sólo en tablet y detalle de Servicios situado bajo el encabezado para mantener accesible la navegación.
- `work-scene.tsx`: imagen secundaria con carga lazy. Logo principal usa `preload` de Next 16; logo del menú sólo carga al abrirlo. Se conserva la precarga acotada de imágenes adyacentes que ya ofrecía la galería.

## Validación

Se utiliza build de producción y Chromium/Playwright. `tests/spline-loading.mjs` cubre 1920×1080, 1366×768, 768×1024 y 390×844 con red normal y red limitada (1.6 Mbps de bajada, latencia 150 ms), más CPU ×4. Comprueba dimensiones, regreso a Inicio sin reemplazar canvas, carga real, recarga, rueda, cursor y fallback de error con movimiento reducido.

`tests/ux.mjs` comprueba galerías de Marcas y Servicios, cierre, teclado, foco, scroll, navegación y formulario con respuesta simulada; no se envían correos reales. `tests/orb-interaction.mjs` verifica las interacciones existentes del orbe.

Para ejecutar: build/start, definir `PLAYWRIGHT_MODULE` si Playwright está fuera del proyecto y lanzar los scripts con Node. `UX_BASE_URL` permite elegir el servidor. Capturas y resultados quedan en el directorio temporal o `UX_OUTPUT`.

### Resultados obtenidos

- Build de producción correcta y lint con **0 errores, 8 advertencias preexistentes**.
- UX: **4/4 resoluciones aprobadas**, incluyendo el formulario con envío simulado y navegación desde el detalle de Servicios en tablet.
- Spline: **8/8 combinaciones aprobadas** (cuatro resoluciones × dos condiciones de red/CPU), más fallback de error y movimiento reducido.
- Orbe: pruebas aprobadas en desktop/laptop/tablet; 20 ciclos de entrada/salida, trayectorias hacia controles sociales, cambio de pestaña, resize y estrés de cursor. Sin listeners acumulados ni errores JS. Se comprobó la ausencia previa del orbe en móvil.
- Revisión visual de capturas con solicitudes `.splinecode` retenidas, durante el crossfade y con escenas listas. Se ajustaron las siluetas al tamaño/posición de los objetos reales.

### Medición local antes/después

Una ejecución por resolución, misma máquina, Chromium headless y producción, sin otras suites en paralelo durante la medición. Ventana de observación de 12 segundos, mediante `PerformanceObserver`. **No es Lighthouse, no son medianas y las cachés del navegador/SO/CDN no se controlaron completamente**; sirve como comprobación local de disponibilidad visual, no como promesa de resultados en producción.

| Resolución | LCP antes → después | CLS antes → después | Exceso de tareas largas antes → después |
| --- | --- | --- | --- |
| 1920×1080 | 9960 → 648 ms | 0 → 0 | 8544 → 5760 ms |
| 1366×768 | 2996 → 184 ms | 0 → 0 | 1578 → 693 ms |
| 768×1024 | 2260 → 212 ms | 0 → 0 | 1168 → 934 ms |
| 390×844 | 2776 → 152 ms | 0 → 0 | 842 → 201 ms |

El exceso de tareas largas es la suma de `max(0, duración − 50 ms)` durante esa ventana: **no debe presentarse como TBT de Lighthouse**. La primera solicitud del cubo comenzó a 877/584/646/698 ms después del cambio, frente a 10248/3306/2537/3436 ms antes, en el orden de la tabla. Las escenas terminaron listas sin errores JS en los cuatro casos.

La primera ejecución de 1920 sigue mostrando un coste alto de inicialización de Spline: mejorar LCP y la aparición visual no significa haber eliminado sus bloqueos internos. No se midieron INP de campo, FPS sostenidos ni una comparativa fiable del peso inicial JS.

## Límites y trabajo de escena

- CSS e idle scheduling no trasladan la inicialización WebGL a un worker: Spline todavía puede producir tareas largas. No se promete que la navegación tenga cero bloqueo en cualquier dispositivo.
- La pausa conserva memoria de dos escenas en desktop a cambio de evitar reinicialización. No se fusionan los RAF privados de Spline y Framer con el controlador interactivo del orbe.
- Para reducir más el coste real: revisar geometría, texturas, materiales transparentes, sombras, luces y animaciones desde Spline; exportar una escena menos pesada para móvil si la medición en dispositivos físicos lo requiere.
- Las pruebas de navegador emuladas no sustituyen iOS/Android físicos ni mediciones de INP en usuarios reales. Tampoco constituyen una garantía universal de FPS o ausencia de flashes en todas las GPU.
