# Ajustes de contacto, iconos y carga — 16 septiembre 2026

- `app/components/scenes/contact-scene.tsx`: contacto directo con grupos verticales de teléfonos y correos, enlaces `tel:`/`mailto:`, foco visible y hover de color. Firma «Rubik Studio - by Ht» en una línea, con firma secundaria de 11–12 px. Se mantienen colores, marcos y estructura general.
- En la misma escena se eliminan los filtros de blur animados y seis bucles decorativos permanentes, conservando el brillo estático, entradas por opacidad/transformación y hover. Las entradas internas pasan de 500 a 300 ms.
- `app/page.tsx` y `app/components/experience/scene-stage.tsx`: detalle de marcas importado mediante `next/dynamic` al abrirlo, con espacio reservado durante la carga. Se conserva el ciclo de vida persistente del cubo; no se cambia su stop/play, que ya había causado saltos según el código existente.
- `app/icon.png` (64 px), `app/apple-icon.png` (180 px) y `app/favicon.ico` (32 px) derivados de `public/img/mini-logo.png`, cuadrado de 1254 px. El original se conserva. El ICO anterior se reemplaza para que todos los iconos representen la misma marca. Next genera los enlaces y versiones de caché automáticamente, sin metadata duplicada.

## Validación

- `npm run lint`: 0 errores y 8 advertencias existentes (orbe, transición FAQ y panel social sin uso).
- `npx tsc --noEmit`: correcto.
- `npm run build`: correcto; rutas nativas de iconos generadas y enlaces del HTML verificados.
- `tests/ux.mjs`: aprobado en 320×568, 390×844 y 1366×768. Galerías, teclado, foco, cierres, scroll, navegación y formulario con envío simulado. Esta suite corrió dentro del sandbox sin escenas Spline; su carga real se verificó por separado.
- `tests/contact-performance.mjs`: Chrome, producción, 390×844 y 1366×844. Contacto, enlaces, favicon, ausencia de overflow horizontal y recorrido Inicio → Marcas → Servicios → Contacto → Inicio. Spline cargado en ambas resoluciones y canvas persistente en desktop. Sin errores JS, de consola ni solicitudes fallidas con acceso de red. Capturas revisadas en ambas resoluciones.
- Comprobación adicional de 320×844 con Spline real: aprobada, sin errores de consola ni overflow horizontal; LCP 1184 ms y CLS 0.

Medición local exploratoria, una muestra por tamaño y ventana de 12 segundos:

| Ancho | LCP | CLS | Exceso de tareas largas |
| --- | --- | --- | --- |
| 390 | 1592 ms | 0 | 2392 ms |
| 1366 | 876 ms | 0 | 10405 ms |

El exceso es la suma de `max(0, duración − 50 ms)`, no TBT de Lighthouse. La medición anterior al cambio tenía Spline bloqueado por la red del sandbox y **no es comparable** con estas cifras. No se afirma una mejora porcentual ni una reducción demostrada de JS total. Las cifras son diagnósticas, no resultados de campo; hubo otras pruebas ejecutándose en el equipo.

La principal optimización pendiente es reducir geometría, texturas y efectos en las escenas Spline: su inicialización todavía produce tareas largas. Conviene medir varias ejecuciones aisladas y dispositivos físicos antes de valorar mejoras de INP o FPS.

## Repetir

Con la build de producción sirviéndose en el puerto 3100, ejecutar `node tests/contact-performance.mjs`. Requiere Playwright, Chrome y acceso a `prod.spline.design`. Admite `UX_BASE_URL`, `UX_WIDTHS` y `UX_PHASE`; guarda JSON y capturas en `%TEMP%/rubik-contact-performance`. `UX_ALLOW_NETWORK_FAILURES=1` permite revisar el fallback sin considerar esa ejecución una validación de Spline.

Tras desplegar, la pestaña y el icono principal deben mostrar el mini-logo. Next incorpora una versión en las URLs; si una pestaña antigua conserva el favicon anterior, cerrarla y reabrirla o realizar una recarga completa. Los marcadores o accesos instalados pueden conservar su propia caché.
