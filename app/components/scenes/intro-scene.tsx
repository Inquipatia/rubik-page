"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useRef } from "react";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => null,
});

type SplineApp = {
  emitEvent?: (eventName: any, nameOrUuid: string) => void;
  findObjectByName?: (name: string) => unknown;
};

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

const revealLine = {
  hidden: {
    y: "140%",
    opacity: 0,
    filter: "blur(14px)",
  },
  visible: {
    y: "0%",
    opacity: 1,
    filter: "blur(0px)",
  },
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
  const startTimersRef = useRef<number[]>([]);

  const handleSplineLoad = (app: SplineApp) => {
    startTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    startTimersRef.current = [];

    const triggerCubeStart = () => {
      try {
        app.emitEvent?.("start" as any, "Orbit_Helper");
        app.emitEvent?.("start" as any, "Cube_Master");
      } catch {
        // Si Spline no acepta "start" desde runtime, simplemente no rompe la página.
      }
    };

    startTimersRef.current = [
      window.setTimeout(triggerCubeStart, 300),
      window.setTimeout(triggerCubeStart, 900),
      window.setTimeout(triggerCubeStart, 1600),
    ];
  };

  return (
    <section className="relative h-full w-full overflow-visible">
      <div className="mx-auto flex h-full w-full max-w-[1560px] items-center px-1 sm:px-2 lg:px-2 xl:px-3">
        <div className="grid w-full items-center gap-6 lg:grid-cols-[0.88fr_1.12fr] xl:grid-cols-[1.02fr_0.98fr] xl:gap-8">
          <div className="relative z-20 max-w-[760px] md:max-w-[520px] lg:max-w-[640px] lg:-translate-x-8 lg:origin-left lg:scale-[0.84] xl:max-w-[620px] xl:-translate-x-12 xl:scale-100 2xl:max-w-[680px] 2xl:-translate-x-14">
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.75,
                delay: 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="omnes-text mb-4 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[12px] font-medium uppercase tracking-[0.14em] text-white/78 sm:text-[13px] lg:px-4 lg:py-2 lg:text-[12px] xl:px-4 xl:py-2 xl:text-sm"
            >
              Rubik Creaciones
            </motion.div>

            <h1 className="omnes-title text-[42px] leading-[0.9] tracking-[-0.04em] text-white sm:text-[54px] md:text-[62px] lg:text-[64px] xl:text-[92px] 2xl:text-[104px]">
              <span className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block"
                  variants={revealLine}
                  initial="hidden"
                  animate="visible"
                  transition={{
                    duration: 1.15,
                    delay: 0.25,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {titleTop}
                </motion.span>
              </span>

              <span className="block overflow-hidden pb-[0.1em]">
                <motion.span
                  className="block bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent"
                  variants={revealLine}
                  initial="hidden"
                  animate="visible"
                  transition={{
                    duration: 1.25,
                    delay: 0.55,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {titleBottom}
                </motion.span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.85,
                delay: 0.95,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="omnes-text mt-5 max-w-[560px] text-[14px] leading-6 text-white/78 sm:text-[15px] sm:leading-7 md:max-w-[470px] md:text-[15px] lg:max-w-[500px] lg:text-[15px] xl:mt-6 xl:text-[16px] xl:leading-7"
            >
              {description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.75,
                delay: 1.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-6 flex w-fit flex-wrap items-center gap-3 md:mt-7"
            >
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
            </motion.div>
          </div>

          <div
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
              <Spline
                scene="https://prod.spline.design/wk0u6G-MY2bbyF6i/scene.splinecode"
                onLoad={handleSplineLoad}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}