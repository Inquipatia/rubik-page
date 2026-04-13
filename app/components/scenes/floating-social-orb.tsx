"use client";

import { useCallback } from "react";
import Spline from "@splinetool/react-spline";

type SplineMouseEvent = {
  target?: {
    name?: string;
  };
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

export default function FloatingSocialOrb() {
  const handleSplineMouseDown = useCallback((e: SplineMouseEvent) => {
    const clickedName = e?.target?.name;
    const url = resolveSocialUrl(clickedName);

    if (!url) {
      console.log("Objeto clickeado sin red asignada:", clickedName);
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  return (
    <div className="fixed bottom-4 right-1 z-50 h-[220px] w-[220px]">
      <div className="relative h-full w-full overflow-hidden">
        <Spline
          scene={SPLINE_SCENE_URL}
          className="h-full w-full"
          onSplineMouseDown={handleSplineMouseDown}
        />
      </div>
    </div>
  );
}