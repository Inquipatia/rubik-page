# Pruebas de UX

Las pruebas usan Playwright contra una build de producción, sin modificar el servidor ni enviar correos. La respuesta de `/api/send-quote` se simula únicamente en el navegador de pruebas.

1. Ejecutar `npm run build` y después `npm run start`.
2. Ejecutar `node tests/ux.mjs` en otra terminal con Playwright disponible.

No se añadieron dependencias al proyecto: se utilizó el runtime de Playwright ya disponible en el entorno. Si Playwright está instalado fuera del proyecto, definir `PLAYWRIGHT_MODULE` con su directorio absoluto. El script también admite `PLAYWRIGHT_CHANNEL` (por defecto `chrome`) y `UX_BASE_URL` (por defecto `http://localhost:3000`).

Los resultados JSON y capturas se guardan fuera del repositorio, en `UX_OUTPUT` o en la carpeta temporal `rubik-ux`.

Cobertura: Marcas y Servicios; apertura; cierre exterior, Escape y botón Cerrar; clic dentro de la imagen; flechas y teclado; foco; bloqueo y conservación del scroll; geometría de la tarjeta; navegación; formulario simulado; cambio de orientación. Resoluciones: 320×568, 390×844, 768×1024, 1366×768, 1440×900, 1536×864, 1920×1080 y 2560×1440.

Para repetir casos concretos, `UX_WIDTHS=390,1366`. Para comprobar movimiento reducido, `UX_REDUCED_MOTION=1`. En PowerShell, las variables se definen con `$env:VARIABLE='valor'`.

Las pruebas validan Chromium con emulación táctil; no sustituyen las pruebas físicas en iOS/Android ni miden INP de usuarios reales.
