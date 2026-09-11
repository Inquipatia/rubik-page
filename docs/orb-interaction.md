# Interacción del orbe Spline

## Auditoría y alcance

El componente mantiene su escena, modelo, materiales, escala, posición, sonidos, parpadeos y baile de reposo. No se cambiaron CSS globales, breakpoints ni dependencias.

Antes del cambio, el seguimiento de ojos tomaba todo el wrapper de 320 × 320; el canvas normal mide 260 × 260. Había salidas React tanto por `mouseleave` como por `pointerleave`. La salida limpiaba referencias y ojos, pero no revertía explícitamente `ViewAct` en Spline. No había un reset por `window.blur` o `pointercancel`. Estas diferencias entre el estado local y el de Spline explican el riesgo de desincronización y la reacción en zonas transparentes.

Se revisaron el diff previo (limpio al comenzar esta implementación), los listeners, la API instalada de Spline y la guía local de componentes cliente de Next.js. Se capturó el canvas real en Chrome antes de calibrar. El botón de sonido queda fuera de la zona y conserva sus handlers.

## Implementación

- `app/components/experience/use-orb-interaction.ts`: controlador con refs, callbacks actualizados mediante `useEffectEvent` y estados IDLE → ENTER → ACTIVE → LEAVE → IDLE. Los cambios de estado son inmediatos; únicamente el seguimiento de ojos se agrupa mediante un RAF pendiente.
- Centro normalizado del canvas `(153/260, 139/260)`, radio `50/260` e histéresis `3/260`. Las fracciones proceden de la captura calibrada, no de dimensiones absolutas aplicadas al DOM; siguen el tamaño CSS efectivo, incluidas sus transformaciones y DPR.
- La activación inicial solo ocurre en el círculo. Una vez abierto, se admiten cuatro círculos sobre los botones sociales y corredores estrechos que permiten alcanzarlos. Las esquinas y el resto del canvas transparente quedan excluidos. Los botones no activan el orbe cerrado.
- Captura de Pointer Events antes de Spline, eventos de Spline locales al canvas y llamadas públicas `emitEvent`/`emitEventReverse` para sincronizar `ViewAct`. No se cambia la escena ni se accede a estructuras privadas de Spline.
- Reset por salida, cancelación, blur, documento oculto, scroll, resize y cambio de escena/visibilidad. Se invalidan las medidas con ResizeObserver y al terminar la transición del wrapper. No se añade `preventDefault` a gestos táctiles; el canvas conserva `touch-action: auto`.
- La interacción espera a que Spline termine de cargar. Se cancela también el temporizador inicial de reposo al desmontar. El cleanup no vuelve a iniciar temporizadores de reposo.
- `floating-social-orb.tsx` integra el controlador y elimina los handlers redundantes del wrapper. No hay `setState` por movimiento del cursor.

## Calibración y reproducción

`DEBUG_ORB_INTERACTION` se activó durante la calibración visual: círculo y centro verdes, zonas sociales cian, cursor rojo, estado y última transición. Queda **false**. Además, el overlay está condicionado a `NODE_ENV === development`, por lo que no aparece en producción aunque se active la constante accidentalmente.

Prueba: `node tests/orb-interaction.mjs`. Variables opcionales: `PLAYWRIGHT_MODULE` para el Playwright ya disponible externamente, `UX_BASE_URL`, `UX_WIDTHS`, `UX_EXPECT_NO_DEBUG=1`. No se instaló infraestructura adicional. Capturas en `%TEMP%/rubik-orb`.

La prueba cubre esquinas, áreas transparentes, ocho bordes/diagonales, 20 ciclos por resolución de escritorio/tablet, caminos hacia botones, blur y visibilidad simulados, pointercancel, salida del viewport, scroll simulado, resize, desmontaje/remontaje al cruzar 768 px y tres segundos de movimientos rápidos por resolución. Comprueba que el número de listeners de pointermove no crece y recoge errores JavaScript. Los enlaces sociales se comprobaron interceptando `window.open`: Facebook, Instagram, LinkedIn y WhatsApp conservan sus destinos.

Se inspeccionaron capturas con debug a 1920, 1440, 1280 (DPR 1,5) y 768 px; el círculo sigue el contorno y las zonas auxiliares coinciden con los botones. El test inicial de resize a 768 px se corrigió para esperar el desmontaje legítimo al pasar a 758 px, en lugar de exigir un orbe visible en móvil.

## Límites de las pruebas

Chrome automatizado y emulación táctil no equivalen a Safari/iOS físico. Un intento con Chrome visible y `bringToFront` no generó `document.hidden`; por eso el cambio físico de pestaña/aplicación queda sin verificar. Los eventos de blur/visibilidad se verifican de forma simulada. La salida del viewport se automatiza con coordenadas externas; no equivale a mover un ratón físico fuera de la ventana del sistema. El stress test comprueba estabilidad funcional, no sustituye un perfil GPU/FPS en hardware móvil.

## Compilación

`npm run build`: correcto con Next.js 16.2.1/Turbopack. `npx tsc --noEmit`: correcto. `npm run lint`: 0 errores y las mismas 8 advertencias previas; no se alteraron efectos ajenos a esta interacción para silenciarlas. El primer build detectó un tipo NodeJS.Timeout en el temporizador nuevo del navegador: se corrigió a number antes del build satisfactorio.

## Resultado final en producción local

Pruebas satisfactorias contra `next start`, después del build: 1920×1080, 1440×900, 1366×768, 1280×585 (DPR 1,5), 1024×768, 768×1024 y 390×844. En las seis resoluciones con orbe se completaron 120 ciclos obligatorios en total, además de bordes, reinicios, resize y stress; sin estados atascados ni errores JavaScript observados. Se comprobó la ausencia de overlay de depuración. En 768 px pasó el desmontaje al reducir a 758 px y el posterior remontaje.

En móvil se conserva la decisión original de no montar el orbe. La primera aserción móvil suponía erróneamente que toda la página carecía de listeners pointermove: otras escenas tienen los suyos. Se corrigió el test para comprobar la ausencia del orbe/controlador, sin modificar esas escenas, y se repitió satisfactoriamente en 390×844. No se hizo commit, push ni despliegue.
