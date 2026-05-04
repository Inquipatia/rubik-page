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
  name?: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  scale?: {
    x: number;
    y: number;
    z: number;
  };
};

type SplineApp = {
  findObjectByName?: (name: string) => any;
  setVariable?: (name: string, value: string | number | boolean) => void;
};

const SPLINE_SCENE_URL =
  "https://prod.spline.design/gyhTRlBZZbn7O6eL/scene.splinecode";

const BLINK_INTERVAL_MS = 3200;
const BLINK_CLOSE_MS = 70;
const BLINK_OPEN_MS = 105;

const IDLE_DANCE_DELAY_MS = 60000;
const IDLE_DANCE_REPEAT_MS = 60000;

const IDLE_DANCE_VARIABLE_NAME = "jump";

export default function FloatingSocialOrb({
  visible = true,
  className = "",
  resetKey = null,
}: FloatingSocialOrbProps) {
  const pathname = usePathname();

  const [shouldRenderSpline, setShouldRenderSpline] = useState(false);

  const orbWrapRef = useRef<HTMLDivElement | null>(null);
  const splineAppRef = useRef<SplineApp | null>(null);

  const viewActRef = useRef<SplineObject | null>(null);
  const eyesControlRef = useRef<SplineObject | null>(null);
  const eyeLeftRef = useRef<SplineObject | null>(null);
  const eyeRightRef = useRef<SplineObject | null>(null);

  const centerPositionRef = useRef<{ x: number; y: number; z: number } | null>(
    null
  );

  const targetEyesPositionRef = useRef<{
    x: number;
    y: number;
    z: number;
  } | null>(null);

  const originalEyeScalesRef = useRef<{
    left?: { x: number; y: number; z: number };
    right?: { x: number; y: number; z: number };
  }>({});

  const blinkIntervalRef = useRef<number | null>(null);
  const blinkTimeoutsRef = useRef<number[]>([]);
  const resetTimeoutsRef = useRef<number[]>([]);

  const idleDanceValueRef = useRef(0);
  const idleDanceTimerRef = useRef<number | null>(null);
  const idleDanceIntervalRef = useRef<number | null>(null);

  const eyesRafRef = useRef<number | null>(null);
  const isPointerInsideViewActRef = useRef(false);

  const visibilityClasses = useMemo(() => {
    return visible
      ? "pointer-events-auto opacity-100 translate-y-0 scale-100"
      : "pointer-events-none opacity-0 translate-y-3 scale-95";
  }, [visible]);

  const clearBlinkTimeouts = () => {
    blinkTimeoutsRef.current.forEach((timeout) => {
      window.clearTimeout(timeout);
    });

    blinkTimeoutsRef.current = [];
  };

  const clearResetTimeouts = () => {
    resetTimeoutsRef.current.forEach((timeout) => {
      window.clearTimeout(timeout);
    });

    resetTimeoutsRef.current = [];
  };

  const restoreEyesOpen = () => {
    const eyeLeft = eyeLeftRef.current;
    const eyeRight = eyeRightRef.current;

    const leftScale = originalEyeScalesRef.current.left;
    const rightScale = originalEyeScalesRef.current.right;

    if (eyeLeft?.scale && leftScale) {
      eyeLeft.scale.x = leftScale.x;
      eyeLeft.scale.y = leftScale.y;
      eyeLeft.scale.z = leftScale.z;
    }

    if (eyeRight?.scale && rightScale) {
      eyeRight.scale.x = rightScale.x;
      eyeRight.scale.y = rightScale.y;
      eyeRight.scale.z = rightScale.z;
    }
  };

  const closeEyes = () => {
    const eyeLeft = eyeLeftRef.current;
    const eyeRight = eyeRightRef.current;

    const leftScale = originalEyeScalesRef.current.left;
    const rightScale = originalEyeScalesRef.current.right;

    if (eyeLeft?.scale && leftScale) {
      eyeLeft.scale.x = leftScale.x;
      eyeLeft.scale.y = leftScale.y * 0.08;
      eyeLeft.scale.z = leftScale.z;
    }

    if (eyeRight?.scale && rightScale) {
      eyeRight.scale.x = rightScale.x;
      eyeRight.scale.y = rightScale.y * 0.08;
      eyeRight.scale.z = rightScale.z;
    }
  };

  const setEyesTargetToCenter = () => {
    const center = centerPositionRef.current;

    if (!center) return;

    targetEyesPositionRef.current = {
      x: center.x,
      y: center.y,
      z: center.z,
    };
  };

  const resetEyesPosition = () => {
    const eyesControl = eyesControlRef.current;
    const center = centerPositionRef.current;

    if (!eyesControl || !center) return;

    eyesControl.position.x = center.x;
    eyesControl.position.y = center.y;
    eyesControl.position.z = center.z;

    setEyesTargetToCenter();
  };

  const resetEyes = () => {
    resetEyesPosition();
    restoreEyesOpen();
  };

  const hardResetEyes = () => {
    clearBlinkTimeouts();
    resetEyes();
  };

  const scheduleHardResetEyes = () => {
    clearResetTimeouts();

    hardResetEyes();

    const reset1 = window.setTimeout(() => {
      hardResetEyes();
    }, 80);

    const reset2 = window.setTimeout(() => {
      hardResetEyes();
    }, 180);

    const reset3 = window.setTimeout(() => {
      hardResetEyes();
    }, 420);

    const reset4 = window.setTimeout(() => {
      hardResetEyes();
    }, 750);

    resetTimeoutsRef.current = [reset1, reset2, reset3, reset4];
  };

  const doBlink = () => {
    clearBlinkTimeouts();

    restoreEyesOpen();

    const closeTimeout = window.setTimeout(() => {
      closeEyes();
    }, BLINK_CLOSE_MS);

    const openTimeout = window.setTimeout(() => {
      restoreEyesOpen();
    }, BLINK_CLOSE_MS + BLINK_OPEN_MS);

    const safetyOpenTimeout = window.setTimeout(() => {
      restoreEyesOpen();
    }, BLINK_CLOSE_MS + BLINK_OPEN_MS + 260);

    blinkTimeoutsRef.current = [
      closeTimeout,
      openTimeout,
      safetyOpenTimeout,
    ];
  };

  const stopBlinkLoop = () => {
    if (blinkIntervalRef.current) {
      window.clearInterval(blinkIntervalRef.current);
      blinkIntervalRef.current = null;
    }

    clearBlinkTimeouts();
    restoreEyesOpen();
  };

  const startBlinkLoop = () => {
    stopBlinkLoop();

    const firstBlink = window.setTimeout(() => {
      doBlink();
    }, 900);

    blinkTimeoutsRef.current.push(firstBlink);

    blinkIntervalRef.current = window.setInterval(() => {
      doBlink();
    }, BLINK_INTERVAL_MS);
  };

  const triggerIdleDance = () => {
    const splineApp = splineAppRef.current;

    if (!visible) return;

    if (!splineApp?.setVariable) {
      console.warn("Spline todavía no tiene disponible setVariable");
      return;
    }

    idleDanceValueRef.current += 1;

    try {
      splineApp.setVariable(
        IDLE_DANCE_VARIABLE_NAME,
        idleDanceValueRef.current
      );

      console.log("Baile idle activado:", idleDanceValueRef.current);
    } catch (error) {
      console.warn(
        `No se pudo activar la variable ${IDLE_DANCE_VARIABLE_NAME}:`,
        error
      );
    }
  };

  const stopIdleDanceLoop = () => {
    if (idleDanceTimerRef.current) {
      window.clearTimeout(idleDanceTimerRef.current);
      idleDanceTimerRef.current = null;
    }

    if (idleDanceIntervalRef.current) {
      window.clearInterval(idleDanceIntervalRef.current);
      idleDanceIntervalRef.current = null;
    }
  };

  const startIdleDanceLoop = () => {
    stopIdleDanceLoop();

    if (!visible || !splineAppRef.current) return;

    idleDanceTimerRef.current = window.setTimeout(() => {
      triggerIdleDance();

      idleDanceIntervalRef.current = window.setInterval(() => {
        triggerIdleDance();
      }, IDLE_DANCE_REPEAT_MS);
    }, IDLE_DANCE_DELAY_MS);
  };

  const registerUserActivity = () => {
    startIdleDanceLoop();
  };

  const updateEyesTargetFromPointer = (clientX: number, clientY: number) => {
    const wrap = orbWrapRef.current;
    const center = centerPositionRef.current;

    if (!wrap || !center) return;

    const rect = wrap.getBoundingClientRect();

    /**
     * IMPORTANTE:
     * En Spline el hover está en el rectángulo "ViewAct".
     * Ese ViewAct ocupa prácticamente todo el área del Spline,
     * no solamente el cuerpo morado.
     *
     * Por eso usamos el contenedor completo como zona activa.
     */
    const viewActLeft = rect.left;
    const viewActRight = rect.right;
    const viewActTop = rect.top;
    const viewActBottom = rect.bottom;
    const viewActWidth = rect.width;
    const viewActHeight = rect.height;

    const isInside =
      clientX >= viewActLeft &&
      clientX <= viewActRight &&
      clientY >= viewActTop &&
      clientY <= viewActBottom;

    isPointerInsideViewActRef.current = isInside;

    if (!isInside) {
      setEyesTargetToCenter();
      return;
    }

    const normalizedX = ((clientX - viewActLeft) / viewActWidth - 0.5) * 2;
    const normalizedY = ((clientY - viewActTop) / viewActHeight - 0.5) * 2;

    /**
     * Estos valores son los que hacen que se note bien el movimiento.
     * Si queda demasiado fuerte, baja a 35 y 30.
     */
    const maxX = 52;
    const maxY = 42;

    targetEyesPositionRef.current = {
      x: center.x + normalizedX * maxX,
      y: center.y - normalizedY * maxY,
      z: center.z,
    };

    restoreEyesOpen();
  };

  const startEyesAnimationLoop = () => {
    if (eyesRafRef.current) {
      window.cancelAnimationFrame(eyesRafRef.current);
      eyesRafRef.current = null;
    }

    const animate = () => {
      const eyesControl = eyesControlRef.current;
      const center = centerPositionRef.current;
      const target = targetEyesPositionRef.current;

      if (eyesControl && center && target) {
        const ease = isPointerInsideViewActRef.current ? 0.34 : 0.18;

        eyesControl.position.x += (target.x - eyesControl.position.x) * ease;
        eyesControl.position.y += (target.y - eyesControl.position.y) * ease;
        eyesControl.position.z = center.z;
      }

      eyesRafRef.current = window.requestAnimationFrame(animate);
    };

    eyesRafRef.current = window.requestAnimationFrame(animate);
  };

  const stopEyesAnimationLoop = () => {
    if (eyesRafRef.current) {
      window.cancelAnimationFrame(eyesRafRef.current);
      eyesRafRef.current = null;
    }
  };

  const handleSplineLoad = (splineApp: SplineApp) => {
    splineAppRef.current = splineApp;

    const viewAct = splineApp.findObjectByName?.("ViewAct");

    const eyesControl =
      splineApp.findObjectByName?.("eyesControl") ||
      splineApp.findObjectByName?.("eyes_control");

    const eyeLeft =
      splineApp.findObjectByName?.("eye left") ||
      splineApp.findObjectByName?.("eyeLeft");

    const eyeRight =
      splineApp.findObjectByName?.("eye right") ||
      splineApp.findObjectByName?.("eyeRight");

    if (viewAct) {
      viewActRef.current = viewAct;
      console.log("ViewAct encontrado:", viewAct.name);
    } else {
      console.warn("No encontré ViewAct en Spline");
    }

    if (!eyesControl) {
      console.warn("No encontré eyesControl / eyes_control en Spline");
    }

    if (!eyeLeft || !eyeRight) {
      console.warn("No encontré eye left / eye right en Spline");
    }

    if (eyesControl) {
      eyesControlRef.current = eyesControl;

      centerPositionRef.current = {
        x: eyesControl.position.x,
        y: eyesControl.position.y,
        z: eyesControl.position.z,
      };

      targetEyesPositionRef.current = {
        x: eyesControl.position.x,
        y: eyesControl.position.y,
        z: eyesControl.position.z,
      };

      console.log("eyesControl encontrado:", eyesControl.name);
    }

    if (eyeLeft) {
      eyeLeftRef.current = eyeLeft;

      if (eyeLeft.scale) {
        originalEyeScalesRef.current.left = {
          x: eyeLeft.scale.x,
          y: eyeLeft.scale.y,
          z: eyeLeft.scale.z,
        };
      }

      console.log("eye left encontrado:", eyeLeft.name);
    }

    if (eyeRight) {
      eyeRightRef.current = eyeRight;

      if (eyeRight.scale) {
        originalEyeScalesRef.current.right = {
          x: eyeRight.scale.x,
          y: eyeRight.scale.y,
          z: eyeRight.scale.z,
        };
      }

      console.log("eye right encontrado:", eyeRight.name);
    }

    scheduleHardResetEyes();
    startBlinkLoop();
    startEyesAnimationLoop();
    startIdleDanceLoop();
  };

  const handleOrbPointerDown = () => {
    registerUserActivity();
    scheduleHardResetEyes();
  };

  const handleOrbPointerUp = () => {
    registerUserActivity();
    scheduleHardResetEyes();
  };

  const handleOrbClick = () => {
    registerUserActivity();
    scheduleHardResetEyes();
  };

  const handleOrbLeave = () => {
    isPointerInsideViewActRef.current = false;
    registerUserActivity();
    scheduleHardResetEyes();
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
      stopBlinkLoop();
      clearResetTimeouts();
      stopIdleDanceLoop();
      stopEyesAnimationLoop();
    };
  }, []);

  useEffect(() => {
    if (!visible) {
      stopIdleDanceLoop();
      return;
    }

    startIdleDanceLoop();
  }, [visible]);

  useEffect(() => {
    scheduleHardResetEyes();
    registerUserActivity();
  }, [pathname]);

  useEffect(() => {
    scheduleHardResetEyes();
    registerUserActivity();
  }, [resetKey]);

  useEffect(() => {
    if (!visible) return;

    const handlePointerMove = (event: PointerEvent) => {
      registerUserActivity();
      updateEyesTargetFromPointer(event.clientX, event.clientY);
    };

    const handleActivity = () => {
      registerUserActivity();
    };

    const handleWindowLeave = () => {
      isPointerInsideViewActRef.current = false;
      setEyesTargetToCenter();
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    window.addEventListener("mousedown", handleActivity, { passive: true });
    window.addEventListener("touchstart", handleActivity, { passive: true });
    window.addEventListener("keydown", handleActivity, { passive: true });
    window.addEventListener("scroll", handleActivity, { passive: true });
    window.addEventListener("wheel", handleActivity, { passive: true });
    window.addEventListener("blur", handleWindowLeave);

    startIdleDanceLoop();

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mousedown", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("wheel", handleActivity);
      window.removeEventListener("blur", handleWindowLeave);
    };
  }, [visible]);

  return (
    <div
      ref={orbWrapRef}
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
                className="h-full w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}