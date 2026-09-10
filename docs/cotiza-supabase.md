# Cotiza y Supabase

## Implementación

Modificados: `app/api/send-quote/route.ts`, `app/components/scenes/cotiza-scene.tsx`, `package.json`, `package-lock.json`.
Creados: `app/lib/supabase.ts`, `app/lib/quote-validation.ts`, `tests/quote-api.mjs`, `tests/quote-ux.mjs` y este informe.
Dependencia: `@supabase/supabase-js` 2.116.0. No se cambiaron estilos, layout, animaciones ni otras páginas.

El navegador llama a `/api/send-quote`. La API valida y guarda en `public.cotizaciones` usando un único cliente de servidor con clave anon y RLS. Inserta únicamente nombre, telefono, correo, empresa (null si no se indica), detalle y servicio. No manda id, estado ni created_at, y no solicita SELECT. PostgreSQL conserva sus defaults. No se crearon ni modificaron tablas, permisos o policies.

Después del INSERT se conserva Nodemailer con SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS y MAIL_TO originales, replyTo y contenido de correo existentes. Se añadieron tiempos límite SMTP; sendMail realiza la conexión sin una verificación previa redundante. Un fallo de Supabase impide enviar el correo y devuelve un error seguro. Un fallo SMTP posterior al guardado devuelve confirmación de persistencia con `saved:true, notificationSent:false`, conserva la fila y registra `quote_saved_email_failed` en el servidor. La interfaz reconoce notificationSent:false, avisa que la solicitud quedó guardada pero falló el aviso por correo, conserva los campos y bloquea el reenvío de esa solicitud en la vista actual. No muestra éxito total. No hay cola ni reintento automático de correo: revisar las solicitudes en Table Editor y los logs.

## Variables y Hostinger

No se encontraron archivos .env locales, variables de Supabase/SMTP en el proceso ni conectores disponibles a Hostinger/Supabase. Por tanto, los nombres reales de Hostinger no pudieron inspeccionarse.

Se utilizan EXACTAMENTE:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Se eliminaron los fallbacks anteriores. Hostinger ya tiene estas dos variables según lo confirmado por el propietario; no se pudo inspeccionar su valor remoto. No hay .env.local ni variables equivalentes en este proceso. `git check-ignore .env.local` confirma su exclusión.

Para la prueba real, agregar los valores públicos reales en `C:/Users/hp/Documents/GitHub/rubik-page/.env.local` y reiniciar desarrollo. No compartir secret/service_role ni versionar ese archivo. Conservar SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS y MAIL_TO existentes; tampoco están disponibles localmente. En Hostinger las variables públicas deben estar disponibles durante el build; reconstruir después de cambiar sus valores. No se hizo commit, push ni despliegue.

## Validaciones y experiencia

Nombre, teléfono, correo, detalle y servicio obligatorios; empresa opcional. Correo con formato válido; teléfono con dígitos y separadores habituales, entre 9 y 15 dígitos, incluidos +56 9 1234 5678, 56912345678 y 912345678. Servicio restringido a los cinco existentes. Límites de longitud en servidor y navegador. Cuerpos JSON malformados o campos que no son cadenas se rechazan sin revelar errores internos.

Bloqueo síncrono con ref antes del fetch, botón deshabilitado y texto Enviando..., campos de solo lectura y selección bloqueada mientras se procesa. Errores integrados, aria-invalid/describedby, foco en el primer campo inválido, nombres accesibles y tipos/autocomplete conservados. Los campos solo se limpian cuando la API confirma éxito completo; el fallo parcial de correo también conserva los datos. Temporizador de confirmación limpiado al desmontar.

El bloqueo evita clics/envíos simultáneos en el formulario actual, no es idempotencia distribuida: un corte de red después de persistir, una nueva pestaña o recarga puede producir duplicados al reintentar. Resolver ese caso de forma absoluta exige una clave de idempotencia persistente/única en la base de datos; no se alteró el esquema solicitado.

## Pruebas

- `npm run build`: correcto, Next.js 16.2.1/Turbopack y TypeScript. Se corrigió durante el trabajo el tipo del temporizador.
- `npm run lint`: correcto, 0 errores y 8 advertencias heredadas ajenas a Cotiza.
- `node tests/quote-api.mjs`: correcto. Usa el cliente Supabase real con transporte HTTP simulado y SMTP simulado. Verifica payload exacto, ausencia de SELECT/defaults manuales, validaciones, JSON inválido, fallo de INSERT sin correo, éxito con correo y fallo SMTP con solicitud guardada.
- `node tests/quote-ux.mjs`: correcto en 390×900 y 1440×900 sobre `npm run dev -- --port 3001`. API interceptada. Campos vacíos, correo/teléfono inválidos, falta de servicio, dos eventos de envío inmediatos (una petición), estado bloqueado, error, conservación de datos, reintento y limpieza tras éxito. Capturas revisadas visualmente, sin overflow horizontal.
- El proyecto no tiene script `npm test`; se ejecutaron los dos scripts anteriores. El test UX usa Playwright ya disponible en el entorno; admite PLAYWRIGHT_MODULE y UX_BASE_URL, sin instalar otra dependencia en el proyecto.
- No se enviaron correos reales ni se realizó un INSERT real: no hay credenciales disponibles. Ninguna respuesta real de Supabase puede certificarse. Los 201/403 de pruebas son simulados.

## Comprobación en Supabase

Antes del push que activa el despliegue, confirmar las variables de Hostinger. Tras desplegar, enviar una cotización identificada como prueba y revisar en Table Editor: una sola fila, seis campos correctos, id generado, estado con el default previsto y created_at automático. Probar empresa vacía (se inserta null), y verificar que el correo llegue. Una confirmación completa indica persistencia y envío SMTP sin error; no certifica recepción física en la bandeja del destinatario.

Revisar en la consola autenticada que RLS siga habilitado, que anon pueda INSERT y que NO existan policies públicas SELECT, UPDATE, DELETE ni ALL que concedan esas operaciones. No se pudo auditar remotamente el estado real de las policies/defaults. No habilitar SELECT para que funcione este INSERT.

El código puede versionarse tras revisión, pero el push activa producción: configurar primero las variables y verificar RLS/defaults. Sin Supabase configurado, los envíos devolverán error y no se intentará SMTP. No ejecutar actualizaciones masivas de dependencias para este cambio.

Referencia del comportamiento INSERT sin filas retornadas: https://supabase.com/docs/reference/javascript/insert

`npm audit` reportó 12 vulnerabilidades en el árbol instalado (1 baja, 3 moderadas, 7 altas, 1 crítica). Requieren una revisión de dependencias aparte; no se ejecutó audit fix ni se cambiaron Next/Spline para resolverlas en esta tarea.

## Reanudación y estado de pruebas

Al retomar ya estaban modificados route.ts, cotiza-scene.tsx, package.json y package-lock.json; ya existían sin seguimiento app/lib/supabase.ts, app/lib/quote-validation.ts, este documento y los dos tests. Se revisaron status/diff y se conservaron. No se reinstalaron dependencias ni se creó otro cliente.

En esta reanudación se ajustaron supabase.ts (nombres exactos), cotiza-scene.tsx (aviso de guardado parcial y bloqueo), route.ts (diagnóstico seguro de configuración), ambos tests y este informe. No hay nuevos archivos respecto al estado previo.

| Prueba | Clasificación | Alcance |
|---|---|---|
| Validación API y formatos chilenos | CONFIRMADA | Tests locales, sin solicitudes externas con campos inválidos |
| Payload de INSERT y convivencia SMTP | PARCIALMENTE CONFIRMADA | Cliente Supabase real con HTTP simulado; SMTP simulado |
| Datos/defaults en tabla real | NO REALIZADA | Faltan variables locales; no existe registro PRUEBA CODEX SUPABASE creado por esta ejecución |
| Policies/RLS remotos | NO REALIZADA | No se añadieron policies ni SELECT para probar |
| Recepción física del correo | NO REALIZADA | No hay SMTP local ni acceso a bandeja |

Para continuar la prueba real, configurar .env.local y avisar. Se usará nombre PRUEBA CODEX SUPABASE, teléfono +56 9 1111 1111, correo prueba-codex@rubikcreaciones.cl, empresa PRUEBA CODEX, servicio Stands y el detalle indicado por el usuario. Buscar luego ese nombre en Table Editor y comprobar campos, id, estado y created_at. Por ahora no buscar una fila que no se ha creado.

El código queda preparado para revisión, pero la comprobación externa continúa pendiente. No autorizar un push automático hasta revisar ese resultado y las vulnerabilidades existentes documentadas arriba. No se cambió Next.js ni SMTP para resolver problemas ajenos al alcance.

### Resultados verificados al retomar

- **CONFIRMADA — Desarrollo:** servidor existente `npm run dev` en puerto 3001 accesible. Se intentó iniciar otro en 3002; Next detectó correctamente el servidor previo y no creó una segunda instancia.
- **CONFIRMADA — Build:** npm run build finalizó con Next 16.2.1/Turbopack y TypeScript sin errores.
- **CONFIRMADA — Lint/tests:** lint 0 errores, 8 advertencias heredadas; quote-api.mjs y quote-ux.mjs pasaron. No existe script npm test. Se reutilizó Supabase 2.116.0 ya instalado.
- **CONFIRMADA — Navegador:** 390×900 y 1440×900, campos obligatorios, correo/teléfono inválidos, servicio, doble evento de envío (una llamada), error conserva campos, reintento y limpieza tras éxito completo. Sin pageerror. Se comprobó también empresa vacía y fallo parcial SMTP: aviso, datos conservados y nuevos envíos bloqueados. Capturas revisadas. Los servicios externos se simularon en estos recorridos: no certifican filas ni correos reales.
- **CONFIRMADA — Endpoint local real sin interceptación:** formulario con datos PRUEBA CODEX SUPABASE llamó POST /api/send-quote. Respuesta HTTP 500: `{"ok":false,"message":"No pudimos confirmar el guardado de tu solicitud. Tus datos permanecen en el formulario."}`. Nombre conservado y botón nuevamente habilitado. Falta configuración local, por lo que no se alcanzaron Supabase ni SMTP.
- **PARCIALMENTE CONFIRMADA — Flujo externo:** orden INSERT → SMTP probado con transportes simulados. Se mantienen avisos WebGL/Three de shaders existentes; no se modificaron escenas por esta integración.
- **NO REALIZADA — INSERT y correo reales:** no hay variables públicas ni SMTP en local; no se creó ningún registro identificable. No se puede certificar entrega física ni respuesta remota de Supabase.

Necesito las dos variables públicas de Supabase en .env.local para continuar con la prueba real. Ubicación: `C:/Users/hp/Documents/GitHub/rubik-page/.env.local`. Solo `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, con sus valores reales. Git ignora el archivo y no está versionado. No se hizo commit ni push. Tras la prueba real y revisión, Hostinger deberá reconstruir con esas mismas variables y conservar la configuración SMTP; por ahora no se despliega.
