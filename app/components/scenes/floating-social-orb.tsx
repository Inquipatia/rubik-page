"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => null,
});

type FloatingSocialOrbProps = {
  visible?: boolean;
  className?: string;
};

type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: () => void,
    options?: { timeout: number }
  ) => number;
  cancelIdleCallback?: (id: number) => void;
};

const SPLINE_SCENE_URL =
  "https://prod.spline.design/6mY5DQbKv1vnH5GE/scene.splinecode?v=10";

export default function FloatingSocialOrb({
  visible = true,
  className = "",
}: FloatingSocialOrbProps) {
  const [shouldRenderSpline, setShouldRenderSpline] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !visible || shouldRenderSpline) return;

    const idleWindow = window as IdleWindow;
    let timeoutId: number | null = null;
    let idleId: number | null = null;

    const loadOrb = () => {
      setShouldRenderSpline(true);
    };

    if (typeof idleWindow.requestIdleCallback === "function") {
      idleId = idleWindow.requestIdleCallback(loadOrb, { timeout: 1400 });
    } else {
      timeoutId = window.setTimeout(loadOrb, 650);
    }

    return () => {
      if (
        idleId !== null &&
        typeof idleWindow.cancelIdleCallback === "function"
      ) {
        idleWindow.cancelIdleCallback(idleId);
      }

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [isMounted, visible, shouldRenderSpline]);

  const visibilityClasses = useMemo(() => {
    return visible
      ? "pointer-events-auto opacity-100 translate-y-0 scale-100"
      : "pointer-events-none opacity-0 translate-y-3 scale-95";
  }, [visible]);

  return (
    <div
      className={[
        "fixed bottom-2 right-2 z-50 hidden md:block",
        "h-[320px] w-[320px]",
        "transform-gpu transition-all duration-300 ease-out",
        visibilityClasses,
        className,
      ].join(" ")}
      aria-hidden={!visible}
    >
      <div className="relative h-full w-full">
        {!shouldRenderSpline && visible && (
          <>
            <div className="pointer-events-none absolute inset-[34px] rounded-full border border-white/10 bg-white/5 backdrop-blur-sm" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/15 blur-3xl" />
          </>
        )}

        {shouldRenderSpline && (
          <div className="absolute inset-0">
            <Spline
              key={SPLINE_SCENE_URL}
              scene={SPLINE_SCENE_URL}
              className="h-full w-full scale-[1.02]"
            />
          </div>
        )}
      </div>
    </div>
  );
}