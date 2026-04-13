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
    cubeRef.current = splineApp.findObjectByName("Cube");

    setIsLoaded(true);
    onReady();

    requestAnimationFrame(() => {
      setIsSettling(true);
    });

    settleTimerRef.current = window.setTimeout(() => {
      setIsInteractive(true);
    }, 1180);

    startAnimTimerRef.current = window.setTimeout(() => {
      try {
        cubeRef.current?.emitEvent("mouseHover");
      } catch {
        // fallback silencioso
      }
    }, 1280);
  }

  return (
    <div className="relative mx-auto flex w-full max-w-[430px] items-center justify-start lg:max-w-[470px] lg:-translate-x-10 lg:-translate-y-3 xl:max-w-[500px] xl:-translate-x-16">
      <div className="pointer-events-none absolute h-44 w-44 rounded-full bg-fuchsia-500/18 blur-3xl sm:h-52 sm:w-52" />
      <div className="pointer-events-none absolute -left-5 top-5 h-32 w-32 rounded-full bg-blue-500/12 blur-3xl sm:h-40 sm:w-40" />
      <div className="pointer-events-none absolute bottom-2 h-14 w-40 rounded-full bg-black/20 blur-2xl" />

      <div
        className="relative z-20 h-[250px] w-[250px] overflow-visible sm:h-[300px] sm:w-[300px] lg:h-[360px] lg:w-[360px] xl:h-[400px] xl:w-[400px]"
        onMouseEnter={() => isInteractive && onCubeHoverChange(true)}
        onMouseLeave={() => onCubeHoverChange(false)}
      >
        <div
          className={`h-full w-full overflow-visible rounded-[24px] transform-gpu will-change-transform will-change-opacity ${
            isLoaded && isSettling ? "hero-cube-settle" : "opacity-0"
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
            transform: translate3d(14px, 20px, 0) scale3d(0.94, 0.94, 1)
              rotate3d(0, 0, 1, 3deg);
          }

          16% {
            opacity: 1;
          }

          70% {
            transform: translate3d(-2px, -3px, 0) scale3d(1.006, 1.006, 1)
              rotate3d(0, 0, 1, -0.35deg);
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
    <section className="grid min-h-[calc(100vh-110px)] grid-cols-1 items-center gap-6 overflow-hidden px-4 py-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-8 lg:px-8 xl:grid-cols-[minmax(0,1fr)_500px] xl:px-10">
      <div
        className={`max-w-[700px] transform-gpu transition-all duration-500 ${
          heroReady ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        <span className="mb-4 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/75 backdrop-blur">
          Rubik Creaciones
        </span>

        <h1 className="mt-3 max-w-[680px] text-[clamp(2.8rem,5.4vw,5.5rem)] font-semibold leading-[0.9] tracking-[-0.06em] text-white">
          {titleTop}
          <span className="block text-white/75">{titleBottom}</span>
        </h1>

        <p className="mt-5 max-w-[600px] text-[clamp(0.94rem,1.05vw,1.08rem)] leading-[1.5] text-white/70">
          {description}
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onOpenCotiza}
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#180d37] transition hover:scale-[1.02]"
          >
            {primary}
          </button>

          <button
            type="button"
            onClick={onGoToServicios}
            className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
          >
            {secondary}
          </button>
        </div>
      </div>

      <div
        className={`transform-gpu transition-all duration-500 ${
          heroReady ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
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