"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => null,
});

type FloatingSocialOrbProps = {
  visible?: boolean;
  className?: string;
  resetKey?: string | number | boolean | null;
};

type SplineObject = {
  position: {
    x: number;
    y: number;
    z: number;
  };
};

type SplineApp = {
  findObjectByName?: (name: string) => any;
  setVariable?: (name: string, value: number | boolean | string) => void;
  setVariables?: (variables: Record<string, number | boolean | string>) => void;
  getVariable?: (name: string) => any;
};

const SPLINE_SCENE_URL =
  "https://prod.spline.design/42jS12fjmGmSM15i/scene.splinecode";

const HOVER_SOUND_URL = "/sounds/openningbbpop.mp3";

const HOVER_SOUND_COOLDOWN_MS = 650;

const VIEW_ACT_OBJECT_NAME = "ViewAct";
const EYES_CONTROL_OBJECT_NAME = "eyesControl";

const IDLE_DANCE_VARIABLE_NAME = "idleDanceTrigger";
const IDLE_DANCE_EVERY_MS = 60_000;

// Para probar rápido, cambia temporalmente a 5_000.
// const IDLE_DANCE_EVERY_MS = 5_000;

const VIEW_ACT_HOVER_RESET_MS = 180;

export default function FloatingSocialOrb({
  visible = true,
  className = "",
  resetKey = null,
}: FloatingSocialOrbProps) {
  const pathname = usePathname();

  const [shouldRenderSpline, setShouldRenderSpline] = useState(false);

  const orbWrapRef = useRef<HTMLDivElement | null>(null);

  const splineAppRef = useRef<SplineApp | null>(null);

  const idleDanceValueRef = useRef(0);
  const idleDanceStartTimeoutRef = useRef<number | null>(null);
  const idleDanceIntervalRef = useRef<number | null>(null);
  const idleDanceLoopStartedRef = useRef(false);

  const eyesControlRef = useRef<SplineObject | null>(null);
  const centerPositionRef = useRef<{ x: number; y: number; z: number } | null>(
    null
  );

  const resetTimeoutsRef = useRef<number[]>([]);

  const hoverAudioRef = useRef<HTMLAudioElement | null>(null);
  const lastHoverSoundAtRef = useRef(0);
  const audioUnlockedRef = useRef(false);

  const isViewActHoveringRef = useRef(false);
  const viewActHoverResetTimeoutRef = useRef<number | null>(null);

  const visibleRef = useRef(visible);

  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  useEffect(() => {
    const audio = new Audio(HOVER_SOUND_URL);
    audio.volume = 0.35;
    audio.preload = "auto";
    hoverAudioRef.current = audio;

    const unlockAudio = () => {
      const currentAudio = hoverAudioRef.current;
      if (!currentAudio || audioUnlockedRef.current) return;

      currentAudio.muted = true;
      currentAudio.currentTime = 0;

      currentAudio
        .play()
        .then(() => {
          currentAudio.pause();
          currentAudio.currentTime = 0;
          currentAudio.muted = false;
          audioUnlockedRef.current = true;
        })
        .catch(() => {
          currentAudio.muted = false;
        });
    };

    window.addEventListener("pointerdown", unlockAudio, { once: true });
    window.addEventListener("click", unlockAudio, { once: true });
    window.addEventListener("touchstart", unlockAudio, { once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);

      if (hoverAudioRef.current) {
        hoverAudioRef.current.pause();
        hoverAudioRef.current.src = "";
        hoverAudioRef.current = null;
      }
    };
  }, []);

  const playHoverSound = () => {
    if (!visibleRef.current) return;

    const now = Date.now();

    if (now - lastHoverSoundAtRef.current < HOVER_SOUND_COOLDOWN_MS) {
      return;
    }

    lastHoverSoundAtRef.current = now;

    const audio = hoverAudioRef.current;
    if (!audio) return;

    audio.muted = false;
    audio.currentTime = 0;

    audio.play().catch(() => {
      // El navegador puede bloquear el audio si aún no hubo interacción real.
    });
  };

  const clearResetTimeouts = () => {
    resetTimeoutsRef.current.forEach((timeout) => {
      window.clearTimeout(timeout);
    });

    resetTimeoutsRef.current = [];
  };

  const resetEyesPosition = () => {
    const eyesControl = eyesControlRef.current;
    const center = centerPositionRef.current;

    if (!eyesControl || !center) return;

    eyesControl.position.x = center.x;
    eyesControl.position.y = center.y;
    eyesControl.position.z = center.z;
  };

  const scheduleEyesPositionReset = () => {
    clearResetTimeouts();

    resetEyesPosition();

    const reset1 = window.setTimeout(() => {
      resetEyesPosition();
    }, 80);

    const reset2 = window.setTimeout(() => {
      resetEyesPosition();
    }, 180);

    const reset3 = window.setTimeout(() => {
      resetEyesPosition();
    }, 420);

    resetTimeoutsRef.current = [reset1, reset2, reset3];
  };

  const clearIdleDanceTimers = () => {
    if (idleDanceStartTimeoutRef.current) {
      window.clearTimeout(idleDanceStartTimeoutRef.current);
      idleDanceStartTimeoutRef.current = null;
    }

    if (idleDanceIntervalRef.current) {
      window.clearInterval(idleDanceIntervalRef.current);
      idleDanceIntervalRef.current = null;
    }

    idleDanceLoopStartedRef.current = false;
  };

  const setSplineVariable = (
    name: string,
    value: number | boolean | string
  ) => {
    const splineApp = splineAppRef.current;

    if (!splineApp) {
      console.warn("No existe splineAppRef para cambiar variable:", name);
      return false;
    }

    let didSet = false;

    if (typeof splineApp.setVariable === "function") {
      splineApp.setVariable(name, value);
      didSet = true;
    }

    if (typeof splineApp.setVariables === "function") {
      splineApp.setVariables({
        [name]: value,
      });
      didSet = true;
    }

    if (!didSet) {
      console.warn("Spline no expone setVariable ni setVariables");
      console.log("Métodos disponibles:", Object.keys(splineApp));
    }

    return didSet;
  };

  const triggerIdleDance = () => {
    if (!visibleRef.current) return;

    idleDanceValueRef.current += 1;

    const nextValue = idleDanceValueRef.current;

    console.log("Disparando idleDanceTrigger:", nextValue);

    const didSet = setSplineVariable(IDLE_DANCE_VARIABLE_NAME, nextValue);

    if (!didSet) return;

    playHoverSound();
    scheduleEyesPositionReset();
  };

  const startIdleDanceLoop = () => {
    if (!visibleRef.current) return;
    if (!shouldRenderSpline) return;
    if (!splineAppRef.current) return;

    /**
     * Seguro principal:
     * evita que se creen dos timeouts/intervalos al mismo tiempo.
     */
    if (idleDanceLoopStartedRef.current) return;

    idleDanceLoopStartedRef.current = true;

    idleDanceStartTimeoutRef.current = window.setTimeout(() => {
      triggerIdleDance();

      idleDanceIntervalRef.current = window.setInterval(() => {
        triggerIdleDance();
      }, IDLE_DANCE_EVERY_MS);
    }, IDLE_DANCE_EVERY_MS);
  };

  const restartIdleDanceLoop = () => {
    /**
     * Este es el detalle nuevo:
     * cada vez que el usuario hace hover real sobre ViewAct,
     * se reinicia el contador del baile.
     *
     * Ejemplo:
     * - Iba en segundo 45 de 60.
     * - Usuario pasa el mouse por el orbe.
     * - El contador vuelve a 0.
     * - El próximo baile ocurre 60 segundos después de ese hover.
     */
    clearIdleDanceTimers();
    startIdleDanceLoop();
  };

  useEffect(() => {
    if (!visible) {
      clearIdleDanceTimers();
      return;
    }

    startIdleDanceLoop();

    return () => {
      clearIdleDanceTimers();
    };
  }, [visible, shouldRenderSpline]);

  const handleSplineMouseHover = (eventRaw: any) => {
    const targetName = eventRaw?.target?.name;

    if (targetName !== VIEW_ACT_OBJECT_NAME) return;

    if (viewActHoverResetTimeoutRef.current) {
      window.clearTimeout(viewActHoverResetTimeoutRef.current);
    }

    viewActHoverResetTimeoutRef.current = window.setTimeout(() => {
      isViewActHoveringRef.current = false;
      viewActHoverResetTimeoutRef.current = null;
    }, VIEW_ACT_HOVER_RESET_MS);

    if (isViewActHoveringRef.current) {
      return;
    }

    isViewActHoveringRef.current = true;

    playHoverSound();
    restartIdleDanceLoop();
  };

  useEffect(() => {
    if (!visible || shouldRenderSpline) return;

    const timeout = window.setTimeout(() => {
      setShouldRenderSpline(true);
    }, 100);

    return () => window.clearTimeout(timeout);
  }, [visible, shouldRenderSpline]);

  useEffect(() => {
    return () => {
      clearResetTimeouts();
      clearIdleDanceTimers();

      if (viewActHoverResetTimeoutRef.current) {
        window.clearTimeout(viewActHoverResetTimeoutRef.current);
        viewActHoverResetTimeoutRef.current = null;
      }
    };
  }, []);

  const visibilityClasses = useMemo(() => {
    return visible
      ? "pointer-events-auto opacity-100 translate-y-0 scale-100"
      : "pointer-events-none opacity-0 translate-y-3 scale-95";
  }, [visible]);

  const handleSplineLoad = (splineAppRaw: any) => {
    const splineApp = splineAppRaw as SplineApp;

    splineAppRef.current = splineApp;

    console.log("Spline app cargado:", splineApp);
    console.log("Métodos disponibles:", Object.keys(splineApp));

    const eyesControl = splineApp.findObjectByName?.(
      EYES_CONTROL_OBJECT_NAME
    );

    if (!eyesControl) {
      console.warn(`No encontré ${EYES_CONTROL_OBJECT_NAME} en Spline`);
    }

    if (eyesControl) {
      eyesControlRef.current = eyesControl;

      centerPositionRef.current = {
        x: eyesControl.position.x,
        y: eyesControl.position.y,
        z: eyesControl.position.z,
      };
    }

    scheduleEyesPositionReset();

    /**
     * Esperamos un poco después del onLoad para que Spline termine de estabilizar.
     * No dispara el baile altiro; solo inicia el reloj.
     */
    window.setTimeout(() => {
      startIdleDanceLoop();
    }, 600);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const wrap = orbWrapRef.current;
    const eyesControl = eyesControlRef.current;
    const center = centerPositionRef.current;

    if (!wrap || !eyesControl || !center) return;

    const rect = wrap.getBoundingClientRect();

    const normalizedX =
      ((event.clientX - rect.left) / rect.width - 0.5) * 2;

    const normalizedY =
      ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    const maxX = 45;
    const maxY = 38;

    const targetX = center.x + normalizedX * maxX;
    const targetY = center.y - normalizedY * maxY;

    eyesControl.position.x += (targetX - eyesControl.position.x) * 0.45;
    eyesControl.position.y += (targetY - eyesControl.position.y) * 0.45;
    eyesControl.position.z = center.z;
  };

  const handleOrbPointerEnter = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
  };

  const handleOrbPointerDown = () => {
    scheduleEyesPositionReset();
  };

  const handleOrbPointerUp = () => {
    scheduleEyesPositionReset();
  };

  const handleOrbClick = () => {
    scheduleEyesPositionReset();
  };

  const handleOrbLeave = () => {
    isViewActHoveringRef.current = false;

    if (viewActHoverResetTimeoutRef.current) {
      window.clearTimeout(viewActHoverResetTimeoutRef.current);
      viewActHoverResetTimeoutRef.current = null;
    }

    scheduleEyesPositionReset();
  };

  useEffect(() => {
    scheduleEyesPositionReset();
  }, [visible]);

  useEffect(() => {
    scheduleEyesPositionReset();
  }, [pathname]);

  useEffect(() => {
    scheduleEyesPositionReset();
  }, [resetKey]);

  return (
    <div
      ref={orbWrapRef}
      onPointerEnter={handleOrbPointerEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleOrbLeave}
      onPointerLeave={handleOrbLeave}
      onPointerDown={handleOrbPointerDown}
      onPointerUp={handleOrbPointerUp}
      onClick={handleOrbClick}
      className={[
        "fixed bottom-2 right-2 z-[9999] hidden md:block",
        "h-[320px] w-[320px]",
        "overflow-visible",
        "transition-all duration-300 ease-out",
        visibilityClasses,
        className,
      ].join(" ")}
      aria-hidden={!visible}
    >
      <div className="relative h-full w-full overflow-visible">
        {!shouldRenderSpline && visible && (
          <>
            <div className="pointer-events-none absolute inset-[34px] rounded-full border border-white/10 bg-white/5 backdrop-blur-sm" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/15 blur-3xl" />
          </>
        )}

        {shouldRenderSpline && (
          <div className="absolute inset-0 flex items-center justify-center overflow-visible">
            <div className="h-[260px] w-[260px] overflow-visible">
              <Spline
                key={SPLINE_SCENE_URL}
                scene={SPLINE_SCENE_URL}
                onLoad={handleSplineLoad}
                onSplineMouseHover={handleSplineMouseHover}
                className="h-full w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}