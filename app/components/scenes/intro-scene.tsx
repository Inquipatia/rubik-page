"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

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
  return (
    <section className="relative h-full w-full overflow-hidden">
      <div className="mx-auto flex h-full w-full max-w-[1320px] items-center px-4 sm:px-5 lg:px-6 xl:px-8">
        <div className="grid w-full items-center gap-4 lg:grid-cols-[0.82fr_1.18fr] xl:grid-cols-[0.92fr_1.08fr] 2xl:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-20 max-w-[640px] md:max-w-[360px] lg:max-w-[420px] xl:max-w-[500px] 2xl:max-w-[540px]"
          >
            <div className="mb-3 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-white/70 backdrop-blur-md sm:text-[11px] xl:px-4 xl:py-2 xl:text-xs">
              Rubik Creaciones
            </div>

            <h1 className="text-[28px] font-light uppercase leading-[0.84] tracking-[-0.03em] text-white sm:text-[34px] md:text-[34px] lg:text-[38px] xl:text-[64px] 2xl:text-[74px]">
              {titleTop}
              <br />
              {titleBottom}
            </h1>

            <p className="mt-4 max-w-[460px] text-[11px] uppercase tracking-[-0.02em] text-white/55 sm:text-[12px] md:max-w-[320px] lg:max-w-[380px] lg:text-[12px] xl:mt-5 xl:max-w-[460px] xl:text-[13px] 2xl:text-[14px]">
              {description}
            </p>

            <div className="mt-5 flex w-fit flex-wrap items-center gap-2.5 xl:mt-6 xl:gap-3">
              <button
                type="button"
                onClick={onOpenCotiza}
                className="rounded-full bg-white px-4 py-2 text-[11px] font-semibold text-[#1b1240] transition duration-300 hover:scale-[1.02] hover:bg-white/90 lg:px-4 lg:py-2 xl:px-5 xl:py-2.5 xl:text-[12px]"
              >
                {primary}
              </button>

              <button
                type="button"
                onClick={onGoToServicios}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] font-semibold text-white backdrop-blur-md transition duration-300 hover:bg-white/10 lg:px-4 lg:py-2 xl:px-5 xl:py-2.5 xl:text-[12px]"
              >
                {secondary}
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              duration: 0.85,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            onMouseEnter={() => onCubeHoverChange?.(true)}
            onMouseLeave={() => onCubeHoverChange?.(false)}
            className="relative z-10 flex justify-center lg:justify-end"
          >
            <div
              className="
                relative
                h-[170px] w-full max-w-[190px]
                sm:h-[210px] sm:max-w-[230px]
                md:h-[250px] md:max-w-[280px]
                lg:h-[320px] lg:max-w-[360px]
                xl:h-[420px] xl:max-w-[470px] xl:translate-x-4
                2xl:h-[460px] 2xl:max-w-[500px] 2xl:translate-x-6
              "
            >
              <Spline scene="https://prod.spline.design/wk0u6G-MY2bbyF6i/scene.splinecode" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}