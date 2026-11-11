# Continuación de seguridad — 6 de noviembre de 2026

Repositorio Inquipatia/rubik-page, rama `resolution-laptop`, base `5992e9b`. El árbol estaba limpio al comenzar. No se hicieron cambios de hosting, DNS, certificados, interfaz, lógica comercial, commit, push ni despliegue.

## 1. CVE-2026-118764: diagnóstico y alcance

Se ejecutaron `npm ls minimatch --all`, `npm explain minimatch`, `npm audit --json` y la variante de producción `--omit=dev`. Las salidas before/after se conservan en esta carpeta.

El [advisory oficial actualizado GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) afecta **>=7.0.0 <11.0.1** y fija el parche en **11.0.1**. Por tanto:

| Versión detectada | Estado para este CVE | Cadena introductora |
| --- | --- | --- |
| 10.2.4, inicialmente | Afectada por rango | eslint-config-next 16.4.5 → typescript-eslint 8.57.2 → @typescript-eslint/typescript-estree 8.57.2 → minimatch |
| 10.2.6, después | Sigue afectada; no es un parche | Misma cadena con typescript-eslint/estree 8.72.1 |
| 3.1.5 | Fuera del rango de este CVE | ESLint 9.39.4 y sus config-array/eslintrc; plugins import, jsx-a11y y react de eslint-config-next |

El aviso describe DoS por amplificación de patrones glob con `optimizationLevel >=2`. Se revisaron app/, el endpoint, configuración ESLint y el uso instalado de typescript-estree: no hay patrones glob proporcionados por usuarios externos al parser. Estree evalúa patrones de configuración `allowDefaultProject` con `{dot:true}`; minimatch tiene nivel 1 por defecto. No se encontró activación del nivel 2 en el flujo revisado. No se ejecutaron exploits.

Todas las copias de minimatch del lockfile son de desarrollo. `npm ls minimatch --omit=dev --all` no encuentra ninguna. Next 16 no ejecuta este lint durante el build; las librerías siguen presentes si el servidor instala también devDependencies, pero no se encontró una ruta de ejecución desde las solicitudes públicas. No debe confundirse instalación en el servidor con alcanzabilidad remota.

**Conclusión:** paquete vulnerable instalado en herramientas, sin explotación pública alcanzable identificada en esta aplicación. El escenario de riesgo sería una herramienta que acepte patrones no confiables y active la optimización afectada. No se declara la biblioteca segura en todos sus usos. Limitar CI/lint a configuración confiable y con límites de recursos hasta que el consumidor soporte el parche.

## 2. Cambios de dependencias y auditoría

Se consultaron versiones y rangos de npm antes de actualizar. eslint-config-next 16.4.5 permite typescript-eslint `^8.56.0`; la versión estable consultada 8.72.1 sigue dependiendo de minimatch `^10.2.2`. La rama 10 publicada llega a 10.2.6, aún incluida en el advisory. No existe una actualización compatible investigada que permita instalar 11.0.1 en ese consumidor.

Se ejecutó `npm update typescript-eslint minimatch` dentro de los rangos existentes. **Solo cambió package-lock.json**, con 14 paquetes de desarrollo: familia typescript-eslint 8.57.2 → 8.72.1, minimatch 10.2.4 → 10.2.6, ignore 7.0.5 → 7.0.14 y semver 7.7.4 → 7.8.6. Versiones individuales en lock-changes.json. Esto mantiene el árbol compatible actualizado, pero **no resuelve este CVE**. No se impuso un override de versión mayor, no se ejecutó `npm audit fix --force` y no se siguió la propuesta automática de cambiar de rama de eslint-config-next.

| Auditoría | Antes | Después |
| --- | --- | --- |
| Críticas / altas / bajas | 0 / 0 / 0 | 0 / 0 / 0 |
| Moderadas completas | 8 | 8 |
| Producción `--omit=dev` | — | 0 vulnerabilidades conocidas |

Las ocho entradas son un advisory en minimatch y su propagación a siete paquetes: @typescript-eslint/typescript-estree, parser, utils, type-utils, eslint-plugin, typescript-eslint y eslint-config-next. `npm audit` completo termina con 1; producción termina con 0. La vulnerabilidad permanece pendiente de un consumidor compatible con el parche, no se ocultó ni se presentó como corregida.

## 3. SSL: hallazgo confirmado en los endpoints públicos

El 6 de noviembre de 2026 se hicieron consultas DNS, conexiones TLS con SNI y validación estricta, y peticiones **HEAD**. No se enviaron formularios ni se desactivó la comprobación de certificados. El resolvedor UDP del entorno devolvió ECONNREFUSED; se contrastó mediante Google Public DNS sobre HTTPS validado. Eso es una limitación del resolvedor local, no una prueba de fallo DNS del dominio.

| Registro público observado | Valor |
| --- | --- |
| A rubikcreaciones.cl | 195.200.3.45 |
| AAAA rubikcreaciones.cl | 2a02:4780:13:1624:0:18c7:a84e:2 |
| CNAME www.rubikcreaciones.cl | rubikcreaciones.cl |
| NS | eoin.ns.cloudflare.com, nataly.ns.cloudflare.com |
| CAA | Incluye autorización `issue letsencrypt.org`; no se identificó una prohibición de ese emisor |

Ambos nombres resuelven a la misma IPv4/IPv6. Las conexiones IPv4 estrictas a **ambos** devuelven `CERT_HAS_EXPIRED`. OpenSSL con `-verify_return_error` confirma error de verificación 10. Los dos SNI presentan el mismo certificado público:

- Sujeto: CN=rubikcreaciones.cl.
- Emisor: Let's Encrypt R11.
- SAN: rubikcreaciones.cl y www.rubikcreaciones.cl.
- Inicio: **18 de junio de 2024, 19:21:28 UTC**.
- Caducidad: **16 de septiembre de 2024, 19:21:27 UTC**.
- SHA-256: `20:87:A7:89:7A:9C:47:CD:78:EB:90:2A:A3:AB:E8:15:91:40:29:E5:4D:0E:6C:9A:79:5E:A0:5D:B1:2B:8E:A6`.

La caducidad del certificado servido es un hallazgo confirmado, compatible con `SSL_DATE_INVALID` de Instagram; no se atribuye simplemente a caché de Instagram o al reloj del teléfono. No se comprobó el dispositivo concreto. No se sabe aún si se está llegando al alojamiento actual o a un servidor antiguo: debe compararse la IP con la asignación del panel.

La red del entorno no dispone de ruta IPv6 (`ENETUNREACH`); queda pendiente comprobar qué certificado sirve la dirección AAAA desde una red con IPv6. Esto no demuestra que el servidor IPv6 esté caído.

### HTTP, HTTPS y dominios antiguos

- `http://rubikcreaciones.cl/` devuelve **301 → https://rubikcreaciones.cl/**.
- `http://www.rubikcreaciones.cl/` devuelve **301 → https://www.rubikcreaciones.cl/**.
- Ambas respuestas HTTP identifican LiteSpeed.
- La validación TLS impide obtener una respuesta HTTP de los destinos HTTPS. No se saltó ese control para seguir redirecciones.
- Una comprobación inicial mediante la herramienta web señaló un posible destino `https://rubikcreaciones.com/`. **No quedó confirmado por la comprobación directa con TLS válido**. Revisar redirecciones del panel, reglas Cloudflare y configuración del servidor tras renovar SSL; no afirmar que actualmente existe esa redirección basándose solo en la herramienta web.

En el repositorio no se encontró configuración de zona DNS, virtual host TLS, archivos de certificado ni redirección al dominio .com. next.config.ts no contiene redirects/rewrites ni una lista de dominios que explique el fallo. Las URLs externas de Spline y redes sociales no reemplazan el certificado del dominio. La negociación TLS ocurre antes de que Next pueda devolver una redirección, por lo que cambiar React/CSS o añadir una redirección no corrige un certificado expirado.

## 4. Intervención específica requerida en el hosting

No hay acceso autenticado a Hostinger/Cloudflare en esta sesión. Pasos para el administrador:

1. En **Hostinger → Websites**, abrir la aplicación Node.js actual y comprobar que `rubikcreaciones.cl` y `www.rubikcreaciones.cl` están asociados a ella. Anotar el destino/IP indicado por el panel y compararlo con los registros anteriores. Si el dominio sigue ligado a un sitio antiguo, corregir esa asociación antes de renovar. [Guía oficial de conexión de dominios Node.js](https://www.hostinger.com/support/how-to-connect-a-custom-domain-to-a-node-js-application/).
2. Los NS observados son de **Cloudflare**: comprobar allí los registros web A/AAAA/CNAME y el estado del proxy. Corregirlos únicamente con los valores de la aplicación actual indicados por Hostinger. Confirmar también la ruta IPv6; no borrar AAAA a ciegas. No hay prueba de que el modo proxy esté activo solo porque los NS sean de Cloudflare.
3. Revisar **Security → SSL** del sitio correspondiente y solicitar **renovación/reemisión del certificado para ambos nombres y cadena completa**. En Node.js gestionado, Hostinger indica instalación automática al conectar correctamente el dominio; si no aparece control manual, solicitar a soporte que repare la emisión/asociación y la renovación automática. Si el panel ofrece reinstalación, seguir el flujo oficial después de validar DNS y el sitio correcto. [Guía de SSL de Hostinger](https://www.hostinger.com/support/1583258-how-to-install-lifetime-ssl-at-hostinger/).
4. Si se usa proxy Cloudflare, verificar también el certificado de borde. Con el certificado de origen vigente y los nombres correctos, usar **Full (strict)** para conservar la validación del origen; no cambiar a Flexible ni rebajar las comprobaciones para esconder el fallo. Si Cloudflare solo presta DNS, el certificado público del origen debe ser válido directamente para los navegadores. [Requisitos oficiales de Full (strict)](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/).
5. Una vez renovado, comprobar que los dos dominios aceptan TLS sin errores y ofrecen fechas vigentes/SAN correctos por IPv4 e IPv6. Mantener HTTP→HTTPS y revisar la cadena de redirecciones para descartar destinos .com u otros sitios antiguos. Solo entonces repetir la prueba en Instagram y navegador normal. No desactivar HTTPS ni usar flags como `-k` para declarar éxito.

Texto útil para soporte: «Ambos SNI rubikcreaciones.cl y www.rubikcreaciones.cl en 195.200.3.45 sirven el mismo certificado Let's Encrypt R11 caducado el 16-09-2024 19:21:27 UTC. Revisar asociación con la app Node, vhost/origen IPv4 e IPv6, renovar la cadena para ambos nombres y reparar renovación automática. NS actuales eoin/nataly.ns.cloudflare.com. Error verificado con TLS estricto, no solo dentro de Instagram».

## 5. Build y alcance de los cambios

Se conserva `build: next build --webpack`, Next 16.4.5, Nodemailer 10.3.1, Tailwind/PostCSS y la configuración existente. No se volvió a activar Turbopack para producción. No se modificaron app/, public/, componentes Spline, animaciones, rutas, pruebas, package.json, next.config.ts ni postcss.config.mjs.

Los resultados de compilación con Node 22, tipos, API simulada y lint se conservan en build-node22.txt, typescript.txt, quote-api.txt, lint.txt y validation.json. El certificado no se considera reparado: requiere la intervención remota anterior. Las ocho moderadas tampoco se consideran solucionadas mientras siga instalado minimatch 10.x.

| Comprobación final | Resultado |
| --- | --- |
| `npm run build`, Node 22.23.4 | Código 0, Next 16.4.5/Webpack; CSS/PostCSS y prerender correctos; sin el error de Turbopack |
| Rutas generadas | `/`, `/_not-found`, `/api/send-quote`, `/apple-icon.png`, `/icon.png`, sin cambios |
| TypeScript `--noEmit` | Código 0 |
| `tests/quote-api.mjs` | Código 0, servicios simulados; validación, fallos DB/SMTP, límites de cuerpo, origen y frecuencia |
| `npm run lint` | Código 1: mismos 4 errores existentes y 8 advertencias del orbe/código previo; no se deshabilitaron reglas ni se modificaron animaciones |
| `npm ls --all --json` | Código 0, árbol sin dependencias inválidas |
| Verificación de alcance | Solo package-lock.json modificado entre los archivos existentes; los 14 cambios de versión son exclusivamente devDependencies |

Se añadieron este informe, el diagnóstico reproducible y evidencias en docs/security-2026-11-06. No se reescribieron las auditorías anteriores. No se hicieron pruebas invasivas ni un despliegue; la validación del build es local en Windows con Node 22, no en la infraestructura Linux de Hostinger. La configuración Webpack que ya resolvía su incompatibilidad permanece intacta.

Evidencias: domains.json conserva el primer diagnóstico; domains-verified.json contiene DNS por HTTPS y conexiones por IP; www/apex-tls.txt y sus errores conservan las respuestas OpenSSL; certificates.json extrae campos públicos del certificado recibido, sin aceptar una conexión TLS inválida. inspect-domains.mjs permite repetir las comprobaciones de solo lectura.
