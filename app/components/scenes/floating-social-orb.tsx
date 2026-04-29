"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => null,
});

type FloatingSocialOrbProps = {
  visible?: boolean;
  className?: string;
};

type SplineApp = {
  findObjectByName?: (name: string) => any;
};

const SPLINE_SCENE_URL =
  "https://prod.spline.design/ibmgpFj-KRoqSskz/scene.splinecode?=3";

export default function FloatingSocialOrb({
  visible = true,
  className = "",
}: FloatingSocialOrbProps) {
  const [shouldRenderSpline, setShouldRenderSpline] = useState(false);
  const orbWrapRef = useRef<HTMLDivElement | null>(null);
  const eyesControlRef = useRef<any>(null);
  const centerPositionRef = useRef<{ x: number; y: number; z: number } | null>(
    null
  );

  useEffect(() => {
    if (!visible || shouldRenderSpline) return;

    const timeout = window.setTimeout(() => {
      setShouldRenderSpline(true);
    }, 650);

    return () => window.clearTimeout(timeout);
  }, [visible, shouldRenderSpline]);

  const visibilityClasses = useMemo(() => {
    return visible
      ? "pointer-events-auto opacity-100 translate-y-0 scale-100"
      : "pointer-events-none opacity-0 translate-y-3 scale-95";
  }, [visible]);

  const handleSplineLoad = (splineApp: SplineApp) => {
    const eyesControl =
      splineApp.findObjectByName?.("eyes_control") ||
      splineApp.findObjectByName?.("eyesControl");

    if (!eyesControl) {
      console.warn("No encontré eyes_control / eyesControl en Spline");
      return;
    }

    eyesControlRef.current = eyesControl;

    centerPositionRef.current = {
      x: eyesControl.position.x,
      y: eyesControl.position.y,
      z: eyesControl.position.z,
    };
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

  const resetEyes = () => {
    const eyesControl = eyesControlRef.current;
    const center = centerPositionRef.current;

    if (!eyesControl || !center) return;

    eyesControl.position.x = center.x;
    eyesControl.position.y = center.y;
    eyesControl.position.z = center.z;
  };

  return (
    <div
      ref={orbWrapRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetEyes}
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