# Interacción del orbe: auditoría y calibración (2026-09-21)

Diagnóstico posterior del glitch residual de ojos/Instagram: [orb-visual-glitches.md](orb-visual-glitches.md). La comparación A/B identificó residuos del antialiasing temporal de WebGPU, además de los conflictos de interacción documentados aquí.

## Mapa de responsabilidades

| Comportamiento | Responsable |
| --- | --- |
| Geometría, materiales, enlaces, despliegue de redes, squash de `body` | Spline |
| Estado `closed` de `eyesControl` (posición y escala) | Spline |
| Seguimiento y retorno al centro | React, ahora sobre el padre existente `eyes` |
| Parpadeo periódico de `eyeLeftBlink` / `eyeRightBlink` | React; sus eventos Start de Spline están deshabilitados |
| Baile periódico de `orbRoot`, sonidos | React, sin cambios |
| Región lógica, apertura y cierre | `useOrbInteraction`, mediante eventos públicos de Spline |

## Evidencia y causa probable del artefacto

Se inspeccionó la escena publicada con runtime 2.0.53, sus objetos, jerarquía y eventos, además del código local y la guía instalada de Next.js. La escena tiene dos instancias activas (`eye left`, `eye right`). El componente fuente `眼睛` está oculto dentro de `Deleted Components`, también oculto. No se comprobó un tercer ojo visible y no se eliminó ni ocultó ningún objeto.

El estado `closed` de `eyesControl` incluye posición `[0, 0, 311.45]` y escala `[1, 0.1, 1]`. Antes, el seguimiento y el recentrado de JS escribían posición sobre ese mismo objeto mientras Spline ejecutaba su transición. Además, el runtime procesa el hover por raycast de forma independiente a `emitEvent`: el raycast podía volver a entrar/salir de ViewAct y reiniciar o invertir las transiciones manuales. Ambas concurrencias están comprobadas; su relación con la pequeña forma blanca es una causa probable, no una prueba de un ojo duplicado.

Se conserva la transición publicada. El seguimiento usa la posición del padre `eyes`, cuya ausencia de estados/eventos de posición se verificó; compensa su escala para conservar el recorrido. Si falta un objeto, se omite el seguimiento y se mantiene el aviso de desarrollo. No se inventan objetos ni IDs. JS no escribe posición, escala o visibilidad de `eyesControl`.

Se retira únicamente el callback nativo pointermove del handler MouseHover del orbe, comprobando antes que su único objeto sea ViewAct. Es un adaptador específico de runtime 2.0.53, a través de `eventManager`; depende de la estructura del handler y debe revisarse si se actualiza el runtime o la escena. Se conservan los otros listeners de tracking, clicks y scroll, y todas las acciones de Spline. La disposición de Application hace el cleanup. No se accede a estas estructuras en otras escenas.

## Región y temporizadores

La apertura sigue siendo inmediata dentro del círculo calibrado. Una vez abierto se admite la unión del orbe, los iconos y el polígono que conecta sus centros, incluyendo 24 px de padding externo sobre el radio de los botones. Se normaliza con las medidas del canvas. La región es matemática: no añade layout ni una capa que capture clics de controles vecinos.

Salir inicia un único timeout de 350 ms y detiene el seguimiento. Volver cancela el timeout sin reenviar la apertura. `pointerInside` distingue presencia física de menú abierto. Blur, cancelación, ocultación, resize y desmontaje cancelan el cierre pendiente inmediatamente. Scroll solo invalida medidas porque el orbe es fijo. Se reutilizan el listener pointermove existente y el RAF compartido de ojos/parpadeo/baile. No se añadieron listeners globales ni loops paralelos.

El guard de mousemove existente es compatibilidad del runtime, no un segundo controlador de hover. No hay handlers mouseenter/mouseleave de React. El debug sigue deshabilitado. No se modificaron escena publicada, nombres, IDs, dimensiones, colores, navegación ni responsive.

## Verificación

- `npm run lint`: cero errores, ocho advertencias preexistentes.
- `npx tsc --noEmit`: correcto.
- `npm run build`: correcto (Next.js 16.3.4).
- `tests/orb-interaction.mjs`: 1366×768, 768×1024 y 390×844; entradas lentas/rápidas, 20 ciclos por escritorio, grace/reentrada, caminos sociales, blur, cancelación, scroll, resize y stress. Listeners estables y sin errores JS. Móvil conserva el orbe desmontado.
- `tests/orb-social-calibration.mjs`: comprueba expansión y cierre reales de objetos Spline, cuatro enlaces interceptando window.open, huecos entre iconos y padding, 12 reentradas sin reiniciar eventos, propiedad de eyesControl estable y capturas durante movimiento/transiciones. Capturas en `%TEMP%/rubik-orb-calibration`.
- `tests/orb-regression.mjs`: diez ciclos aprobados de seguimiento, parpadeo, navegación y scroll; 11 parpadeos observados, objetos y listeners estables, sin errores JS. Seguimiento actualizado al padre `eyes`.

Las capturas muestreadas sirven para revisión visual, no demuestran ausencia del artefacto en cada frame o GPU. No se probaron Safari ni dispositivos físicos. No se publicó la escena ni el sitio.
