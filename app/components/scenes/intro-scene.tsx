"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useState } from "react";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
});

type IntroSceneProps = {
  titleTop: string;
  titleBottom: string;
  description: string;
  primary: string;
  secondary: string;
  onCubeHoverChange?: (isHovered: boolean) => void;
  onOpenCotiza?: () => void;
  onGoToServicios?: () => void;
};

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
  const [isSplineReady, setIsSplineReady] = useState(false);

  return (
    <section className="relative h-full w-full overflow-hidden">
      <div className="mx-auto flex h-full w-full max-w-[1400px] items-center px-4 sm:px-6 lg:px-6 xl:px-10">
        <div className="grid w-full items-center gap-5 lg:grid-cols-[0.78fr_1.22fr] xl:grid-cols-[1.02fr_0.98fr] xl:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-20 max-w-[720px] md:max-w-[430px] lg:max-w-[560px] lg:origin-left lg:scale-[0.68] xl:max-w-[560px] xl:scale-100 2xl:max-w-[620px]"
          >
            <div className="mb-4 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-white/70 sm:text-sm lg:px-3 lg:py-1.5 lg:text-[11px] xl:px-4 xl:py-2 xl:text-sm">
              Rubik Creaciones
            </div>

            <h1 className="text-[34px] font-light uppercase leading-[0.86] tracking-[-0.03em] text-white sm:text-[42px] md:text-[44px] lg:text-[44px] xl:text-[92px] 2xl:text-[104px]">
              {titleTop}
              <br />
              {titleBottom}
            </h1>

            <p className="mt-4 max-w-[520px] text-[12px] uppercase tracking-[-0.02em] text-white/55 sm:text-[13px] md:max-w-[400px] md:text-[12px] lg:max-w-[430px] lg:text-[12px] xl:mt-6 xl:text-base">
              {description}
            </p>

            <div className="mt-5 flex w-fit flex-wrap items-center gap-3 md:mt-6">
              <button
                type="button"
                onClick={onOpenCotiza}
                className="rounded-full bg-white px-5 py-2.5 text-[12px] font-semibold text-[#1b1240] transition duration-300 hover:scale-[1.02] hover:bg-white/90 lg:px-4 lg:py-2 lg:text-[11px] xl:px-7 xl:py-4 xl:text-sm"
              >
                {primary}
              </button>

              <button
                type="button"
                onClick={onGoToServicios}
                className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-[12px] font-semibold text-white transition duration-300 hover:bg-white/10 lg:px-4 lg:py-2 lg:text-[11px] xl:px-7 xl:py-4 xl:text-sm"
              >
                {secondary}
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 18, scale: 0.985 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              duration: 0.48,
              delay: 0.04,
              ease: [0.22, 1, 0.36, 1],
            }}
            onMouseEnter={() => onCubeHoverChange?.(true)}
            onMouseLeave={() => onCubeHoverChange?.(false)}
            className="relative z-10 flex justify-center lg:justify-end"
          >
            <div
              className="
      relative
      h-[200px] w-full max-w-[220px]
      sm:h-[250px] sm:max-w-[270px]
      md:h-[300px] md:max-w-[330px]
      lg:h-[360px] lg:max-w-[400px]
      xl:h-[500px] xl:max-w-[560px] xl:translate-x-8
      2xl:h-[500px] 2xl:max-w-[560px] 2xl:translate-x-12
    "
            >
              <div
                className={`h-full w-full transition-opacity duration-500 ${isSplineReady ? "opacity-100" : "opacity-0"
                  }`}
              >
                <Spline
                  scene="https://prod.spline.design/wk0u6G-MY2bbyF6i/scene.splinecode"
                  onLoad={() => setIsSplineReady(true)}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}