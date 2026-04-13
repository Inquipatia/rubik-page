"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

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
}: FloatingSocialOrbProps) {
  const [shouldRenderSpline, setShouldRenderSpline] = useState(false);

  useEffect(() => {
    if (!visible || shouldRenderSpline) return;

    const idleWindow = window as IdleWindow;
    let timeoutId: number | null = null;
    let idleId: number | null = null;

    const loadOrb = () => {
      setShouldRenderSpline(true);
    };

    if (typeof idleWindow.requestIdleCallback === "function") {
      idleId = idleWindow.requestIdleCallback(loadOrb, { timeout: 1800 });
    } else {
      timeoutId = window.setTimeout(loadOrb, 900);
    }

    return () => {
      if (idleId !== null && typeof idleWindow.cancelIdleCallback === "function") {
        idleWindow.cancelIdleCallback(idleId);
      }

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [visible, shouldRenderSpline]);

  const handleSplineMouseDown = useCallback((e: SplineMouseEvent) => {
    const clickedName = e?.target?.name;
    const url = resolveSocialUrl(clickedName);

    if (!url) return;

    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  return (
    <div
      className={`fixed bottom-4 right-1 z-50 h-[220px] w-[220px] transform-gpu transition-opacity duration-300 ${
        visible
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!visible}
    >
      <div className="relative h-full w-full overflow-hidden">
        {!shouldRenderSpline && visible && (
          <>
            <div className="pointer-events-none absolute inset-10 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/12 blur-2xl" />
          </>
        )}

        {shouldRenderSpline && (
          <Spline
            scene={SPLINE_SCENE_URL}
            className="h-full w-full"
            onSplineMouseDown={handleSplineMouseDown}
          />
        )}
      </div>
    </div>
  );
}