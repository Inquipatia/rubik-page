# Compilación de producción con Webpack

Repositorio local: Inquipatia/rubik-page, rama `resolution-laptop`, base `8f01107`. El árbol estaba limpio al comenzar. Fecha: 4 de noviembre de 2026.

## Diagnóstico y cambio mínimo

Se inspeccionaron package.json, lockfile, next.config.ts, postcss.config.mjs y globals.css. Next y eslint-config-next permanecen en 16.4.5, Nodemailer en 10.3.1, Tailwind y @tailwindcss/postcss en 4.2.2. El CSS importa `tailwindcss`, usa fuentes/cursores locales, media queries y animaciones existentes; no fue necesario editarlo. PostCSS conserva el plugin oficial de Tailwind 4.

El mensaje aportado coincide con el [problema documentado por Hostinger](https://www.hostinger.com/support/how-to-fix-next-js-16-turbopack-build-errors-on-hostinger/): el auxiliar de CSS termina antes de conectarse mediante un puerto local. Hostinger describe restricciones de conexión entre procesos y una limitación adicional de glibc para Turbopack desde Next 16.3.3, y prescribe Webpack para esas versiones. Es una coincidencia del error y entorno informado; no se accedió al servidor para medir su libc ni reproducir allí el fallo.

Se consultó también la guía CLI incluida en `node_modules/next/dist/docs/01-app/03-api-reference/06-cli/next.md`: `--webpack` selecciona el Webpack integrado en Next, sin instalar otro compilador.

Primero pasó `npm run build -- --webpack`, con el script original intacto (`build-probe.txt`). Después se cambió **una única línea de package.json**:

```diff
- "build": "next build",
+ "build": "next build --webpack",
```

No se modificaron package-lock.json, dependencias, next.config.ts, PostCSS, Tailwind, componentes, estilos, animaciones, lógica de negocio, recursos públicos ni rutas. No fue necesario migrar `turbopack.root`: solamente delimita la raíz del compilador de desarrollo y Webpack usa por defecto la raíz del proyecto. `dev` continúa con Turbopack y `start` continúa con next start. No se añadieron opciones experimentales ni se desactivaron cabeceras de seguridad.

## Auditoría de dependencias

La nueva consulta `npm audit --json` conserva **8 paquetes moderados, 0 altos, 0 críticos y 0 bajos**; código de salida 1. `npm audit --omit=dev --json` devuelve **0 vulnerabilidades conocidas** y código 0. Respuestas completas en audit.json y audit-production.json; cadena en minimatch-tree.txt. El cambio de compilador no elimina ni oculta avisos.

Los ocho registros corresponden a **un solo advisory directo**, [GHSA-g3hv-75wg-m249 / CVE-2026-118764](https://github.com/advisories/GHSA-g3hv-75wg-m249), y siete dependientes propagados:

| Paquete | Versión instalada | Relación con el aviso | Aplicabilidad al sitio publicado |
| --- | --- | --- | --- |
| minimatch | 10.2.4 | Paquete afectado directamente | No se identificó un flujo HTTP hasta esta copia de desarrollo |
| @typescript-eslint/typescript-estree | 8.57.2 | Consume minimatch | Herramienta de análisis TypeScript |
| @typescript-eslint/parser | 8.57.2 | Depende de typescript-estree | Solo lint |
| @typescript-eslint/utils | 8.57.2 | Depende de typescript-estree | Solo lint |
| @typescript-eslint/type-utils | 8.57.2 | Cadena estree/utils | Solo lint |
| @typescript-eslint/eslint-plugin | 8.57.2 | Cadena parser/type-utils/utils | Solo lint |
| typescript-eslint | 8.57.2 | Integra parser/plugin/utils | Solo lint |
| eslint-config-next | 16.4.5 | Integra typescript-eslint | Dependencia directa de desarrollo |

El advisory afecta a minimatch >=7 y <11.0.1 y describe consumo excesivo de CPU/memoria con patrones controlados por un atacante cuando `optimizationLevel >= 2`. No se encontró una entrada pública que entregue patrones a ese parser. En el uso inspeccionado de typescript-estree (`dist/useProgramFromProjectService.js`), la llamada pasa `{dot:true}`; minimatch usa nivel 1 por defecto. La copia 3.1.5 usada por otros plugins ESLint queda fuera de ese rango.

**Clasificación:** aviso real de una biblioteca instalada, pero sin explotación alcanzable demostrada en las rutas públicas ni en el uso de lint inspeccionado. **Potencialmente explotable en otras condiciones:** herramientas que acepten globs no confiables y activen el nivel >=2. No se declara que la biblioteca esté parcheada o sea universalmente segura. En CI deben usarse repositorios/configuraciones confiables y límites de recursos. Actualizar el consumidor cuando admita la versión corregida; no imponer un override de versión mayor sin probar compatibilidad. No se usó `npm audit fix --force` ni se revirtió Next.

## Validación y límites

La prueba inicial con Webpack pasó compilación, TypeScript, generación estática y trazas de producción bajo Node 24.15.0 local (`build-probe.txt`). Después pasó **el script definitivo `npm run build` bajo Node 22.23.4**, con npm 12.0.2 y Next.js 16.4.5/Webpack (`build-node22.txt`, código 0). Para esta comprobación se descargó el binario de Node 22 en una carpeta temporal; no se instaló en el proyecto ni se cambió la versión de Node del sistema.

La tabla de rutas conserva `/`, `/_not-found`, `/api/send-quote`, `/apple-icon.png` e `/icon.png`. La build se sirvió con Node 22 en loopback. Los siete controles HTTP pasaron (`http.json`): página 200, rutas privadas inexistentes/.env 404, método API no admitido 405, validación 400, origen externo 403 y optimizador de imagen local 200. Se comprobaron nosniff, DENY y no-store de la API. No se envió una cotización válida a servicios reales.

`node tests/quote-api.mjs` pasó validación, persistencia y fallos simulados, límites de cuerpo, origen y frecuencia (`quote-api.txt`). `tsc --noEmit` pasó, además de la comprobación de tipos integrada en ambos builds. La verificación Git contra HEAD de app/, public/, package-lock.json, next.config.ts y postcss.config.mjs no encontró cambios.

Regresiones contra el servidor de producción Webpack ejecutado con Node 22:

| Prueba | Resultado |
| --- | --- |
| `tests/quote-ux.mjs` | PASS a 390 y 1440 px: campos, validación, doble envío, estado de espera, reintento, éxito, conservación de datos y ausencia de overflow horizontal |
| `tests/ux.mjs` | PASS a 390×844 y 1440×900: navegación, galerías de marcas/servicios, ampliación, flechas/teclado, Escape, foco, scroll y formulario simulado; cero errores de navegador, canvas Spline presentes |
| `tests/orb-interaction.mjs` | PASS escritorio: bordes/esquinas, 20 ciclos, rutas sociales, blur/cancel/scroll, salida de ventana, resize, 163 movimientos de estrés y listeners estables, sin errores JS; PASS móvil: orbe/controlador conservan su desmontaje previsto |
| Revisión de capturas | Revisadas Contacto a 1440 px y Marcas a 390 px; sin defectos nuevos observados. No es una garantía de igualdad píxel a píxel en todos los dispositivos |

Salidas en quote-ux.txt, ux.txt y orb-interaction.txt. Las capturas se generaron fuera del repositorio en la carpeta temporal `rubik-webpack-ux`; las pruebas del orbe usan `rubik-orb`. No se modificaron los scripts de pruebas ni las evidencias históricas de docs/security-audit.

Los tests del formulario simulan los servicios externos: no insertan cotizaciones reales ni envían correo externo. Las verificaciones locales no certifican la versión de glibc, credenciales, RLS, SMTP ni el despliegue de Hostinger.

Lint mantiene los cuatro errores existentes y ocho advertencias documentados en la auditoría previa (immutability/purity del orbe, dependencias de hooks y advertencias de código existente). Este cambio no toca esos archivos ni suprime reglas. TypeScript y el build son comprobaciones independientes de lint.

No se realizó commit, push ni despliegue. Publicar posteriormente con el comando `npm run build`; debe mostrar `Next.js 16.4.5 (webpack)` en el registro. Conservar el lockfile y los ajustes de seguridad actuales.
