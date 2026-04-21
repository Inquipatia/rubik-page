"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => null,
});

type SplineMouseEvent = {
  target?: {
    name?: string;
  };
};

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
  "https://prod.spline.design/6mY5DQbKv1vnH5GE/scene.splinecode";

const SOCIAL_URLS = {
  instagram: "PEGA_AQUI_TU_LINK_DE_INSTAGRAM",
  linkedin: "PEGA_AQUI_TU_LINK_DE_LINKEDIN",
  facebook: "PEGA_AQUI_TU_LINK_DE_FACEBOOK",
  whatsapp: "https://wa.me/56991330559",
};

function resolveSocialUrl(rawName?: string) {
  const name = rawName?.toLowerCase().trim() ?? "";

  if (!name) return null;

  if (name.includes("instagram") || name.includes("instragram")) {
    return SOCIAL_URLS.instagram;
  }

  if (name.includes("linkedin")) {
    return SOCIAL_URLS.linkedin;
  }

  if (name.includes("facebook")) {
    return SOCIAL_URLS.facebook;
  }

  if (name.includes("whatsapp") || name.includes("whats")) {
    return SOCIAL_URLS.whatsapp;
  }

  return null;
}

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
      idleId = idleWindow.requestIdleCallback(loadOrb, { timeout: 1500 });
    } else {
      timeoutId = window.setTimeout(loadOrb, 700);
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

  const handleSplineMouseDown = useCallback((e: SplineMouseEvent) => {
    const clickedName = e?.target?.name;
    const url = resolveSocialUrl(clickedName);

    if (!url) return;

    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const visibilityClasses = useMemo(() => {
    return visible
      ? "pointer-events-auto opacity-100 translate-y-0"
      : "pointer-events-none opacity-0 translate-y-3";
  }, [visible]);

  return (
    <div
      className={[
        "fixed bottom-4 right-2 z-50",
        "h-[220px] w-[220px]",
        "transform-gpu transition-all duration-300 ease-out",
        visibilityClasses,
        className,
      ].join(" ")}
      aria-hidden={!visible}
    >
      <div className="relative h-full w-full overflow-hidden rounded-full">
        {!shouldRenderSpline && visible && (
          <>
            <div className="pointer-events-none absolute inset-6 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/15 blur-2xl" />
          </>
        )}

        {shouldRenderSpline && (
          <div className="h-full w-full">
            <Spline
              scene={SPLINE_SCENE_URL}
              className="h-full w-full"
              onSplineMouseDown={handleSplineMouseDown}
            />
          </div>
        )}
      </div>
    </div>
  );
}