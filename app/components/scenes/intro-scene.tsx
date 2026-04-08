"use client";

import { memo, useState } from "react";
import Spline from "@splinetool/react-spline";

type IntroSceneProps = {
  titleTop: string;
  titleBottom: string;
  description: string;
  primary: string;
  secondary: string;
  onCubeHoverChange: (isHovered: boolean) => void;
  onOpenCotiza: () => void;
  onGoToServicios: () => void;
};

const HeroCube = memo(function HeroCube({
  onCubeHoverChange,
}: {
  onCubeHoverChange: (isHovered: boolean) => void;
}) {
  const [isReady, setIsReady] = useState(false);

  return (
    <div className="relative flex items-center justify-center lg:-translate-y-8">
      <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-fuchsia-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -left-4 top-8 h-52 w-52 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-3 h-20 w-56 rounded-full bg-black/20 blur-2xl" />

      <div className="relative z-20 h-[330px] w-[330px] overflow-visible sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px]">
        <div
          className={`relative h-full w-full overflow-visible rounded-[28px] transition-all duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isReady
              ? "translate-x-0 translate-y-0 scale-100 opacity-100"
              : "translate-x-10 translate-y-6 scale-[0.88] opacity-0"
          }`}
          onMouseEnter={() => isReady && onCubeHoverChange(true)}
          onMouseLeave={() => onCubeHoverChange(false)}
        >
          <Spline
            scene="https://prod.spline.design/wk0u6G-MY2bbyF6i/scene.splinecode"
            className={`h-full w-full transition-opacity duration-500 ${
              isReady ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
            }`}
            onLoad={() => {
              requestAnimationFrame(() => {
                setIsReady(true);
              });
            }}
          />
        </div>
      </div>
    </div>
  );
});

export default function IntroScene({
  titleTop,
  titleBottom,
  description,
  primary,
  secondary,
  onCubeHoverChange,
  onOpenCotiza,
  onGoToServicios,
}: IntroSceneProps) {
  return (
    <section className="grid h-[calc(100vh-110px)] grid-cols-1 items-center gap-4 overflow-hidden lg:grid-cols-[0.95fr_1.05fr]">
      <div className="max-w-[620px]">
        <span className="mb-3 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-1 text-sm text-white/75 backdrop-blur">
          Rubik Creaciones
        </span>

        <h1 className="mt-3 text-5xl font-semibold leading-[0.9] tracking-[-0.055em] sm:text-6xl lg:text-[5.6rem]">
          {titleTop}
          <span className="block text-white/75">{titleBottom}</span>
        </h1>

        <p className="mt-5 max-w-[520px] text-base leading-7 text-white/70 sm:text-lg">
          {description}
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={onOpenCotiza}
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#180d37] transition hover:scale-[1.02]"
          >
            {primary}
          </button>

          <button
            type="button"
            onClick={onGoToServicios}
            className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
          >
            {secondary}
          </button>
        </div>
      </div>

      <HeroCube onCubeHoverChange={onCubeHoverChange} />
    </section>
  );
}