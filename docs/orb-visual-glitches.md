# Ojos e Instagram: diagnóstico de los residuos de hover

## Causa comprobada

La duplicación que persistía después de separar las transformaciones no era un tercer ojo ni dos ejecuciones de la animación social. Se reprodujo en el renderizador WebGPU de `@splinetool/runtime` **2.0.53**, con su antialiasing temporal (TAA) activo. El resolve temporal conserva contribuciones de otros frames alrededor de los bordes animados: parecen un fragmento de ojo debajo del actual y un segundo contorno de Instagram.

La comparación mantuvo la escena publicada, objetos y animaciones:

| Experimento | Resultado visual |
| --- | --- |
| WebGPU con TAA | Residuos en bordes de ojos e Instagram |
| WebGL | Contornos limpios al estabilizarse |
| WebGPU sin TAA (`taa=off`) | Desaparecen los residuos |
| WebGPU sin jitter (`nojit=1`) | Desaparecen los residuos |
| WebGPU sin render bundles | No elimina el residuo de Instagram |

Esto identifica el camino temporal/jitter de WebGPU, no una carrera de React como causa del glitch residual. No se afirma haber corregido el shader interno de Spline: se aplica una solución de compatibilidad localizada para esta versión.

## Propiedades y eventos

| Propiedad / comportamiento | Spline | React |
| --- | --- | --- |
| Posición y escala de `eyesControl` | Transición `closed` y retorno | No escribe |
| Posición del padre `eyes` | Sin estados de posición en la exportación auditada | Seguimiento y recentrado existentes |
| Rotación de los ojos | Transformaciones de la jerarquía publicada | Sin rotación individual |
| Escala Y de `eyeLeftBlink`, `eyeRightBlink` | Sus eventos Start están deshabilitados | Blink periódico, un callback en RAF compartido |
| Visibilidad de los ojos | Jerarquía publicada | No crea ni muestra meshes alternativos |
| Hover `ViewAct` | Ejecuta la transición y notifica el callback | Emite una apertura/cierre por cambio lógico |
| Posición, rotación, escala de redes | Transiciones de los cuatro meshes | No escribe |
| Mostrar/ocultar redes | Transición de escala/posición de Spline | Decide cuándo emitir el evento |
| CSS/Framer de iconos | No aplica | No existen iconos DOM ni animaciones individuales |
| Baile de `orbRoot` | Jerarquía | Baile y cancelación existentes |

La exportación contiene exactamente dos instancias activas de ojos. Los meshes llamados `eyeLeftBlink` y `eyeRightBlink` son los propios ojos; no hay un mesh cerrado superpuesto. El componente fuente `眼睛` permanece dentro del grupo oculto `Deleted Components`. No se eliminó ni ocultó ningún objeto.

La cadena DOM auditada tiene opacity 1, sin filter ni transform durante el hover. El wrapper de carga ya terminó su entrada. `app/layaout.tsx` es un archivo con nombre incorrecto que Next.js no usa como layout; el runtime confirma un solo canvas del orbe, no dos montajes superpuestos.

## Eventos y carrera de estados

Se instrumentaron `emitEvent`, `dispatchUserEvent`, `dispatchEnter`, `dispatchLeave` y el callback de Spline, solamente en la prueba. En el hover registrado: una emisión a ~43 ms, un callback a ~49 ms y una ejecución `dispatchUserEvent` a ~49 ms. No hubo entrada/salida adicional por raycast. Los tiempos son de una ejecución de diagnóstico, no constantes del producto.

Sí quedaba una invocación redundante en `floating-social-orb.tsx`: `emitEvent` ya llama sincrónicamente al callback registrado y `onEnter` lo volvía a llamar manualmente. Se eliminó esa llamada manual. No disparaba otra transición Spline, pero repetía el reset del baile y es innecesaria.

La región lógica conserva el timeout cancelable de 350 ms y no reemite hover al reentrar antes del cierre. El seguimiento cancela el recentrado anterior, y seguimiento, blink y baile usan el mismo planificador RAF. No se añadieron loops, timers ni listeners. Los listeners de Application se limpian al disponerla; los de React tienen cleanup. El timeout anidado de `softSceneChangeReset` pertenece a una función preexistente sin llamadas: no interviene en este hover.

## Corrección localizada

En `handleSplineLoad`, se comprueba `controls.renderer.isWebGPUSplineRenderer` y se configura `temporalAAEnabled = false` **solo para la instancia del orbe**. La otra escena conserva TAA activo, comprobado en runtime. WebGL no se modifica. No se cambia el backend global, la escena publicada, IDs, materiales, tamaños, posiciones base o CSS. Blink y seguimiento siguen funcionando.

Esta propiedad pertenece al renderizador del runtime y no es una opción tipada de Application; la dependencia está fijada en 2.0.53 y el acceso queda protegido. Debe reevaluarse al actualizar Spline. Se renuncia al suavizado temporal defectuoso en este canvas, por lo que puede variar el suavizado de bordes subpíxel, sin cambiar la geometría o el diseño.

## Reproducción y pruebas

- `node tests/orb-visual-diagnostic.mjs`: comparación `baseline`/`fixed`, auditoría de objetos/DOM/renderizadores, eventos y muestras de transformaciones durante los primeros 550 ms. La prueba puede reactivar TAA únicamente dentro de su navegador de diagnóstico para reproducir el defecto. Aserta un único disparo de animación.
- `node tests/orb-social-calibration.mjs`: veinte transiciones, movimientos rápidos/lentos, huecos, reentrada, cierre real, los cuatro enlaces y aislamiento del ajuste de TAA.
- `node tests/orb-regression.mjs`: diez cambios de sección, regreso a Inicio, blink, seguimiento, scroll e identidad de objetos/listeners.
- `tests/orb-interaction.mjs`: resize/remontaje y estabilidad de listeners, además de la interacción a distintas resoluciones.

Las pruebas usan Chrome y la escena real. Las capturas y trazas de diagnóstico se guardan en `%TEMP%/rubik-orb-diagnostic`; las veinte transiciones, en `%TEMP%/rubik-orb-calibration`. La instrumentación no entra en producción. El debug del componente permanece desactivado. Las capturas muestreadas no equivalen a comprobar todas las GPU ni Safari físico.

Validación del cambio: `npm run lint` (cero errores, las ocho advertencias previas), `npx tsc --noEmit` y `npm run build` correctos. Calibración de veinte hovers y regresión de diez ciclos aprobadas; diez blinks observados, sin errores JavaScript y sin crecimiento de listeners.

Interacción verificada en 1366×768, 768×1024 y 390×844, incluido desmontaje/remontaje al cruzar el breakpoint. Una primera aserción de grace period a 768 px fue sensible a la latencia de CDP; se movió el muestreo de 160 ms y la cancelación al reloj del navegador. La repetición pasó sin modificar el timeout de producción. La comparación final registró una única ejecución por hover y 20/22 muestras de transformaciones en aproximadamente 560 ms.

Archivos de esta revisión: `app/components/scenes/floating-social-orb.tsx`, `tests/orb-visual-diagnostic.mjs`, `tests/orb-social-calibration.mjs`, `tests/orb-interaction.mjs`, este informe y el enlace desde `docs/orb-interaction.md`. La ejecución de regresión actualizó `tests/orb-regression-results.json` y `tests/orb-after.png`. Los demás cambios pendientes pertenecen a la calibración anterior y se conservaron.
