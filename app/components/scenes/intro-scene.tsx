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
    <section className="relative h-full w-full overflow-visible">
      <div className="mx-auto flex h-full w-full max-w-[1560px] items-center px-1 sm:px-2 lg:px-2 xl:px-3">
        <div className="grid w-full items-center gap-6 lg:grid-cols-[0.88fr_1.12fr] xl:grid-cols-[1.02fr_0.98fr] xl:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-20 max-w-[760px] md:max-w-[520px] lg:max-w-[640px] lg:-translate-x-8 lg:origin-left lg:scale-[0.84] xl:max-w-[620px] xl:-translate-x-12 xl:scale-100 2xl:max-w-[680px] 2xl:-translate-x-14"
          >
            <div className="omnes-text mb-4 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[12px] font-medium uppercase tracking-[0.14em] text-white/78 sm:text-[13px] lg:px-4 lg:py-2 lg:text-[12px] xl:px-4 xl:py-2 xl:text-sm">
              Rubik Creaciones
            </div>

            <h1 className="omnes-title text-[42px] leading-[0.9] tracking-[-0.04em] text-white sm:text-[54px] md:text-[62px] lg:text-[64px] xl:text-[92px] 2xl:text-[104px]">
              {titleTop}
              <br />
              {titleBottom}
            </h1>

            <p className="omnes-text mt-5 max-w-[560px] text-[14px] leading-6 text-white/78 sm:text-[15px] sm:leading-7 md:max-w-[470px] md:text-[15px] lg:max-w-[500px] lg:text-[15px] xl:mt-6 xl:text-[16px] xl:leading-7">
              {description}
            </p>

            <div className="mt-6 flex w-fit flex-wrap items-center gap-3 md:mt-7">
              <button
                type="button"
                onClick={onOpenCotiza}
                className="omnes-text rounded-full bg-white px-6 py-3 text-[13px] font-semibold text-[#1b1240] transition duration-300 hover:scale-[1.02] hover:bg-white/90 lg:px-5 lg:py-2.5 lg:text-[12px] xl:px-7 xl:py-4 xl:text-[15px]"
              >
                {primary}
              </button>

              <button
                type="button"
                onClick={onGoToServicios}
                className="omnes-text rounded-full border border-white/15 bg-white/5 px-6 py-3 text-[13px] font-semibold text-white transition duration-300 hover:bg-white/10 lg:px-5 lg:py-2.5 lg:text-[12px] xl:px-7 xl:py-4 xl:text-[15px]"
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
                h-[220px] w-full max-w-[240px]
                sm:h-[270px] sm:max-w-[290px]
                md:h-[320px] md:max-w-[350px]
                lg:h-[390px] lg:max-w-[430px]
                xl:h-[500px] xl:max-w-[560px] xl:translate-x-8
                2xl:h-[500px] 2xl:max-w-[560px] 2xl:translate-x-12
              "
            >
              <div
                className={`h-full w-full transition-opacity duration-500 ${
                  isSplineReady ? "opacity-100" : "opacity-0"
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