# Actualización de seguridad — 11 de septiembre de 2026

## Alcance y versiones

Se inspeccionaron package.json, package-lock.json, npm list, npm audit, las cadenas con npm ls y los avisos de los mantenedores antes de instalar. El árbol Git estaba limpio. No se ejecutó npm audit fix ni --force.

| Dependencia | Antes | Después | Motivo |
| --- | --- | --- | --- |
| next | 16.2.1 | 16.3.4 | Parches de Next y mínimo Sharp 0.35.4; 16.3.3 todavía permite Sharp 0.35.3 |
| nodemailer | 8.0.5, rango ^8.0.5 | 8.0.11 exacta | Última versión publicada de 8.x; corrige avisos iniciales pero no todos los posteriores |
| sharp | 0.34.5 | 0.35.4 | Dependencia nativa del optimizador de imágenes de Next |
| postcss | 8.5.8 y copia 8.4.31 | 8.5.23 | Correcciones de lectura de archivos/source maps; se elimina la copia antigua de Next |
| nanoid | 3.3.11 | 3.3.19 | Parche transitivo compatible |
| fflate | 0.8.2 / 0.6.10 | 0.8.3 / 0.6.11 | Correcciones ZIP64 en las dos ramas existentes |
| @babel/core | 7.29.0 | 7.29.7 | Lectura de archivos a través de sourceMappingURL; actualiza sus helpers compatibles |
| @humanfs/node | 0.16.7 | 0.16.8 | Copia recursiva que sigue enlaces fuera del árbol |
| baseline-browser-mapping | 2.10.10 | 2.11.22 | Corrección de terminación del proceso con entradas inválidas |
| brace-expansion | 1.1.12 / 5.0.5 | 1.1.18 / 5.0.9 | Correcciones DoS en las ramas existentes |
| browserslist | 4.28.1 | 4.28.9 | Correcciones de consumo de memoria y procesamiento de estadísticas |
| js-yaml | 4.1.1 | 4.3.2 | Correcciones de complejidad excesiva al resolver YAML |

El lockfile también recoge los paquetes SWC/env de Next, binarios de Sharp/libvips para cada plataforma y dependencias requeridas por los paquetes anteriores. No se actualizaron React, React DOM, Tailwind, Spline, GSAP, Framer Motion, Supabase, ESLint ni TypeScript. eslint-config-next permanece en 16.2.1: sus peers siguen siendo compatibles y lint pasó; no fue necesario cambiarlo.

Comandos de actualización: `npm install --save-exact next@16.3.4 nodemailer@8.0.11`, seguido de `npm update @babel/core @humanfs/node baseline-browser-mapping brace-expansion browserslist fflate js-yaml nanoid postcss`, y `npm install` de verificación. No se actualizaron globalmente todos los paquetes.

## Auditoría antes y después

| Severidad por paquete, según npm audit | Antes | Después |
| --- | ---: | ---: |
| CRITICAL | 1 | 0 |
| HIGH | 7 | 1 |
| MODERATE | 3 | 0 |
| LOW | 1 | 0 |
| Total | 12 | 1 |

Estos son paquetes agrupados por su máxima severidad, no el número de avisos individuales. No se accedió al informe de Hostinger para reconciliar exactamente sus 28 avisos. El paquete restante agrupa **cinco advisories: dos HIGH y tres MODERATE**. npm audit continúa terminando con código 1; no se presenta como una auditoría limpia.

## Vulnerabilidades corregidas

Next deja de aparecer en audit, incluyendo [GHSA-2xp9-vwfh-vxw4](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4) (optimización AVIF) y [GHSA-p293-qw3h-jr36 / CVE-2026-75604](https://github.com/vercel/next.js/security/advisories/GHSA-p293-qw3h-jr36) (servidores Windows). Ambos tienen parche desde 16.3.3. La aplicación usa Next/Image; por ello la actualización del optimizador importa, aunque no se probó explotación. La aplicabilidad del segundo depende del sistema de archivos y routers del despliegue; no se verificó el sistema operativo de Hostinger.

Los otros diez paquetes transitivos enumerados antes dejan de aparecer. Los de Babel/ESLint se usan principalmente durante desarrollo/build; Sharp está en el procesamiento de imágenes y fflate llega por las bibliotecas 3D. No se asumió que un aviso de herramientas fuese una vulnerabilidad remota de una página publicada.

Nodemailer 8.0.11 elimina los avisos iniciales [List-* CRLF](https://github.com/nodemailer/nodemailer/security/advisories/GHSA-268h-hp4c-crq3), [jsonTransport](https://github.com/nodemailer/nodemailer/security/advisories/GHSA-wqvq-jvpq-h66f) y [OAuth2 TLS](https://github.com/nodemailer/nodemailer/security/advisories/GHSA-r7g4-qg5f-qqm2). El endpoint usa SMTP con usuario/contraseña y no utiliza esas funciones, pero el paquete sí estaba dentro de sus rangos afectados.

## Avisos restantes y alcance real

Se revisaron `app/api/send-quote/route.ts` y `app/lib/quote-validation.ts`. Solo hay un uso de Nodemailer en app/. El servidor fija from/to mediante configuración; el usuario controla replyTo mediante email, limitado a 254 caracteres. name y message se incorporan a asunto/texto/HTML, no a opciones raw o rutas de archivos. El HTML se escapa. El handler no acepta objetos de configuración de Nodemailer desde el cliente.

| Aviso | Severidad | Funcionalidad y alcance en este flujo | Parche mínimo publicado |
| --- | --- | --- | --- |
| [GHSA-p6gq-j5cr-w38f](https://github.com/nodemailer/nodemailer/security/advisories/GHSA-p6gq-j5cr-w38f) | HIGH | raw con path/href puede saltarse restricciones de acceso. No alcanzable por los campos aceptados: no se envía raw ni adjuntos ni rutas del usuario. | 9.0.1 |
| [GHSA-8m3c-c648-2xjj](https://github.com/nodemailer/nodemailer/security/advisories/GHSA-8m3c-c648-2xjj) | MODERATE | resolveContent con firma antigua omite restricciones. No hay plugins ni llamadas a esa API en la aplicación. El sendMail ordinario no activa por sí solo esa ruta. | 9.1.1 |
| [GHSA-wmmp-3585-3rmp](https://github.com/nodemailer/nodemailer/security/advisories/GHSA-wmmp-3585-3rmp) | MODERATE | Diferencias IDN/Punycode pueden saltarse listas de dominios permitidos. El destino SMTP es MAIL_TO, no el email del formulario, y no existe una lista de dominios usada como frontera de confianza. replyTo sí pasa por normalización; no se demostró desvío del correo enviado por el servidor. | 9.1.0 |
| [GHSA-2x7j-588g-ccc2](https://github.com/nodemailer/nodemailer/security/advisories/GHSA-2x7j-588g-ccc2) | HIGH | El parser de direcciones tiene complejidad cuadrática. **El parser sí es alcanzable** mediante replyTo; la entrada se valida y limita a 254 caracteres antes de sendMail. Esto acota la entrada que dispara el coste, pero no parchea la biblioteca. | 9.1.0 |
| [GHSA-cc9r-2j5m-2m83](https://github.com/nodemailer/nodemailer/security/advisories/GHSA-cc9r-2j5m-2m83) | MODERATE | Comentarios RFC 5322 pueden producir diferencias respecto a validaciones de dominio. El parsing puede intervenir en replyTo, pero el usuario no controla los destinatarios SMTP y aquí no se autoriza por dominio. No se identifica la condición de desvío de destinatarios descrita. | 9.1.0 |

No existe una versión publicada 8.x que elimine los cinco avisos al consultar el registro. Los de raw y resolveContent permanecen en el inventario sin una ruta alcanzable desde el código actual. Los de direcciones no deben etiquetarse todos como «no usados»: replyTo sí los atraviesa, aunque el límite de longitud y MAIL_TO fijo reducen su impacto concreto.

**Riesgo de conservar 8.0.11:** exposición limitada en este handler comparada con los escenarios completos de los avisos, pero residual y no equivalente a un paquete parcheado. No se demostró un exploit exitoso en este flujo; tampoco se garantiza ausencia de explotación. Añadir adjuntos, raw, plugins o destinatarios controlados por el cliente cambiaría esta evaluación. El límite de email no constituye una protección general contra abuso del endpoint ni sustituye un parche del parser.

## Alternativa 9.x, investigada sin cambiar el proyecto

Nodemailer **9.1.1** cubre los cinco parches. Se instaló únicamente en una carpeta temporal aislada: `npm audit` allí devolvió cero vulnerabilidades y el mismo handler pasó un envío SMTP local con esa biblioteca. El proyecto permanece en 8.0.11, respetando la rama solicitada.

El [changelog oficial de 9.0.0](https://github.com/nodemailer/nodemailer/blob/master/CHANGELOG.md) señala validación TLS por defecto al obtener contenido HTTPS remoto, endpoints OAuth2 y conexiones proxy; certificados autofirmados, caducados o con nombre incorrecto dejan de aceptarse. Este proyecto no usa esas rutas. Los cambios posteriores endurecen STARTTLS y el parsing/normalización de direcciones; estos sí aconsejan comprobar el servidor SMTP real y sus certificados antes de migrar. No se requiere cambiar la arquitectura ni la firma del sendMail actual según la prueba local, pero esa prueba no valida Hostinger.

## Pruebas y cambios ajenos a dependencias

El commit inicial a0fc43a tenía la URL del orbe sin protocolo, que causaba un 404 local y un error de lectura de Spline antes de esta actualización. Con autorización explícita se restauró **solo** `https://` en `floating-social-orb.tsx`; scene ID, tamaño, posición, animaciones y apariencia no se tocaron.

- `npm install`: correcto. npm 12 informa del postinstall bloqueado de unrs-resolver según su política de scripts; lint/build funcionaron sin cambiar esa política.
- `npm run build`: correcto, repetido después de corregir la URL, Next 16.3.4/Turbopack.
- `npx tsc --noEmit`: correcto.
- `npm run lint`: 0 errores, las mismas 8 advertencias previas.
- `tests/ux.mjs`: 390×844 y 1440×900, navegación, Marcas, Servicios, zoom, flechas, Escape, foco/scroll, Contacto y Cotiza. Sin errores de navegador. Los envíos del formulario se simularon.
- `tests/orb-interaction.mjs`: 20 ciclos a 1440×900, bordes, transparencia, blur/cancel/scroll simulados, salida, resize y movimientos rápidos; sin errores. A 390×844 se conserva el desmontaje móvil existente.
- `tests/quote-api.mjs`: validación, persistencia, fallos DB/SMTP y configuración, con servicios simulados.
- HTTP real local a `/api/send-quote`: JSON roto y campos faltantes devuelven 400.
- Handler real y Nodemailer 8.0.11 contra SMTP de loopback: AUTH, envelope, mensaje MIME text/html y entrega aceptada; Supabase simulado. Sin correo externo.
- Prueba adicional de producción con `next start` tras el último build: la URL HTTPS exacta del orbe respondió **200**, Next/Image respondió **200**, el orbe pasó de ACTIVE a IDLE, `/api/send-quote` devolvió 400 ante datos incompletos y no hubo excepciones JavaScript.

El primer intento del test general agotó su timeout de 15 s durante la compilación inicial; el siguiente encontró el error previo de URL. Tras corregirla, la batería general pasó. Las pruebas usan Chrome local/emulación, no dispositivos físicos ni el despliegue de Hostinger. No hay credenciales SMTP/Supabase locales: TLS, autenticación, RLS y entrega final en Hostinger siguen pendientes.

La consola no está completamente libre de advertencias: Spline informa `updating from 131 to 122` y que la escena publicada es más reciente que el runtime, tanto en desarrollo como en producción. En desarrollo también aparecieron avisos de objetos orbRoot/eyesControl/parpadeo no encontrados y advertencias de shaders WebGL; estos últimos no aparecieron en la comprobación de producción. La escena se renderizó, devolvió 200 y volvió visualmente a reposo, pero no se afirma haber resuelto esa diferencia de versiones. Runtime y scene ID no se cambiaron; comprobar esa compatibilidad queda fuera de esta actualización y debe tratarse por separado. No se ocultaron avisos ni se actualizó Spline para silenciarlos.

Entorno probado: Node 24.15.0, npm 12.0.2, Windows. Next y Sharp requieren Node >=20.9.0. La revisión automática bloqueó una operación conjunta para cerrar servidores antiguos y limpiar copias nativas bloqueadas; se dejaron intactas y las pruebas usaron puertos nuevos. Esas copias de node_modules no forman parte del lockfile ni se deben subir a Hostinger.

No se hizo commit, push ni despliegue. Hostinger seguirá usando sus dependencias anteriores hasta publicar el cambio e instalar el lockfile actualizado.
