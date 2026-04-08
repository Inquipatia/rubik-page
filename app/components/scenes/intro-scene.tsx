"use client";

import { memo, useEffect, useRef, useState } from "react";
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
  onReady,
}: {
  onCubeHoverChange: (isHovered: boolean) => void;
  onReady: () => void;
}) {
  const cubeRef = useRef<any>(null);
  const settleTimerRef = useRef<number | null>(null);
  const startAnimTimerRef = useRef<number | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isSettling, setIsSettling] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    return () => {
      if (settleTimerRef.current) window.clearTimeout(settleTimerRef.current);
      if (startAnimTimerRef.current) window.clearTimeout(startAnimTimerRef.current);
    };
  }, []);

  function handleLoad(splineApp: any) {
    // Cambia "Cube" por el nombre real del objeto en Spline
    cubeRef.current = splineApp.findObjectByName("Cube");

    setIsLoaded(true);
    onReady();

    requestAnimationFrame(() => {
      setIsSettling(true);
    });

    // recién después del acomodo habilitamos interacción
    settleTimerRef.current = window.setTimeout(() => {
      setIsInteractive(true);
    }, 1180);

    // y un poco después arrancamos la animación interna del cubo
    startAnimTimerRef.current = window.setTimeout(() => {
      try {
        cubeRef.current?.emitEvent("mouseHover");
      } catch {
        // fallback silencioso
      }
    }, 1280);
  }

  return (
    <div className="relative flex items-center justify-center lg:-translate-y-8">
      <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-fuchsia-500/22 blur-3xl" />
      <div className="pointer-events-none absolute -left-4 top-8 h-52 w-52 rounded-full bg-blue-500/18 blur-3xl" />
      <div className="pointer-events-none absolute bottom-3 h-20 w-56 rounded-full bg-black/20 blur-2xl" />

      <div
        className="relative z-20 h-[330px] w-[330px] overflow-visible sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px]"
        onMouseEnter={() => isInteractive && onCubeHoverChange(true)}
        onMouseLeave={() => onCubeHoverChange(false)}
      >
        <div
          className={`h-full w-full overflow-visible rounded-[28px] transform-gpu will-change-transform will-change-opacity ${isLoaded && isSettling ? "hero-cube-settle" : "opacity-0"
            }`}
        >
          <Spline
            scene="https://prod.spline.design/wk0u6G-MY2bbyF6i/scene.splinecode"
            className="h-full w-full"
            onLoad={handleLoad}
          />
        </div>
      </div>

      <style jsx>{`
        .hero-cube-settle {
          opacity: 1;
          animation: cubeSettle 1180ms cubic-bezier(0.22, 1, 0.36, 1) both;
          will-change: transform, opacity;
          transform-origin: center center;
          backface-visibility: hidden;
        }

        @keyframes cubeSettle {
          0% {
           transform: translate3d(26px, 34px, 0) scale3d(0.95, 0.95, 1)
           rotate3d(0, 0, 1, 4deg);
          }

          16% {
            opacity: 1;
          }

          70% {
          transform: translate3d(-3px, -4px, 0) scale3d(1.008, 1.008, 1)
          rotate3d(0, 0, 1, -0.45deg);
          }

          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale3d(1, 1, 1)
              rotate3d(0, 0, 1, 0deg);
          }
        }
      `}</style>
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
  const [heroReady, setHeroReady] = useState(false);

  return (
    <section className="grid h-[calc(100vh-110px)] grid-cols-1 items-center gap-4 overflow-hidden lg:grid-cols-[0.95fr_1.05fr]">
      <div
        className={`max-w-[620px] transform-gpu transition-all duration-500 ${heroReady ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
      >
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

      <div
        className={`transform-gpu transition-all duration-500 ${heroReady ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
      >
        <HeroCube
          onCubeHoverChange={onCubeHoverChange}
          onReady={() => setHeroReady(true)}
        />
      </div>
    </section>
  );
}