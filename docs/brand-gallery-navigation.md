# Navegación de galerías de marcas

## Causa y cambio

`BrandDetailsContent` en `app/components/scenes/brand-details-scene.tsx` controlaba la tarjeta mediante estado React. El botón «Volver a marcas» usaba `absolute inset-0` dentro de un wrapper de sección, no del viewport. Sus ancestros animados/limitados por ancho dejaban el header y zonas alejadas fuera del área de cierre. En el zoom, una fila transparente de controles y las bandas de object-contain también detenían clics exteriores.

Se conserva la tarjeta dentro de sus ancestros responsive: no se la trasladó a otro layout ni se cambiaron sus medidas, fuentes, colores o animaciones. `BrandDismissBackdrop` crea un portal transparente a body, `fixed inset-0`, z-index 200 y pointer-events nativo auto. Un recorte even-odd excluye el rectángulo visible real de la tarjeta: dentro llegan los eventos nativos al contenido, fuera los recibe el fondo. Se actualiza durante la entrada, resize y scroll, con limpieza del observer/listeners/frame al desmontar. La capa queda por encima del header y debajo del zoom existente (220). Su cursor es pointer.

El contenido conserva stopPropagation. En el zoom, solo los controles concretos detienen el clic, no toda la fila transparente; las bandas vacías de object-contain vuelven a considerarse fondo. La imagen pintada y las flechas siguen siendo interactivas. Un movimiento de más de 8 px iniciado en el backdrop no dispara el cierre al terminar.

Se reutiliza useDialogFocus para Escape, Tab y prioridad del modal superior: cerrar el zoom conserva la marca. La tarjeta tiene role dialog, aria-modal y nombre accesible. Al cerrar se restauran foco, scroll de ventana y scroll del frame al abrir. Se eliminó el salto móvil forzado al inicio de «Marcas». La página de fondo queda con overflow hidden; el wrapper existente permite scroll interno si la tarjeta no cabe. Sus límites son de viewport, no se comprime la tarjeta.

## Archivos

Modificados en esta continuación: brand-details-scene.tsx, gallery-image.tsx, use-dialog-focus.ts, app/page.tsx, app/globals.css y tests/image-modals.mjs (ajuste a la nueva semántica de bandas vacías de Marcas). Nuevos: app/components/experience/brand-dismiss-backdrop.tsx, tests/brand-backdrop.mjs y este informe. Se conservaron los cambios pendientes anteriores de Servicios; no se modificaron en esta continuación.

## Validación y límites

`npm run build` pasó con Next.js 16.2.1/Turbopack y TypeScript. `npm run lint` pasó con 0 errores y 8 advertencias heredadas del orbe, un componente GSAP de respaldo y una función sin uso. No existe script npm test; se ejecutan los scripts de navegador mediante Node/Playwright disponible en el entorno, sin dependencias nuevas.

La validación usa Chrome local y emulación táctil. No equivale a pruebas físicas de Safari/iOS o Firefox. La implementación usa clip-path polygon evenodd; esos otros motores quedan pendientes de comprobación real. No se hizo commit, push ni despliegue.

Prueba reproducible: `node tests/brand-backdrop.mjs`, con PLAYWRIGHT_MODULE si Playwright está fuera del proyecto y UX_BASE_URL para el servidor. UX_WIDTHS permite filtrar resoluciones. Capturas: carpeta temporal rubik-brand-backdrop.
