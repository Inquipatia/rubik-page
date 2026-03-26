"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "@/app/data/projects";

type WorkSceneProps = {
  activeWorkCard: number;
};

export default function WorkScene({ activeWorkCard }: WorkSceneProps) {
  const [hoveredIndex, setHoveredIndex] = useState(activeWorkCard);
  const [direction, setDirection] = useState(1);

  const activeProject = projects[hoveredIndex];

  const handleHoverChange = (index: number) => {
    if (index === hoveredIndex) return;
    setDirection(index > hoveredIndex ? 1 : -1);
    setHoveredIndex(index);
  };

  const previewVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 90 : -90,
      y: dir > 0 ? 14 : -14,
      opacity: 0,
      scale: 0.98,
      rotate: dir > 0 ? 2 : -2,
    }),
    center: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      y: dir > 0 ? -8 : 8,
      opacity: 0,
      scale: 0.985,
      rotate: dir > 0 ? -1.4 : 1.4,
    }),
  };

  const stackedProjects = useMemo(() => {
    return projects.slice(hoveredIndex + 1, hoveredIndex + 4);
  }, [hoveredIndex]);

  return (
    <section className="grid min-h-[66vh] grid-cols-1 items-start gap-6 lg:grid-cols-[0.82fr_1.18fr]">
      {/* IZQUIERDA */}
      <div className="max-w-xl">
        <span className="mb-3 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-1 text-sm text-white/75 backdrop-blur">
          Selected Work
        </span>

        <div className="mt-4 space-y-2.5">
          {projects.map((project, index) => {
            const isActive = index === hoveredIndex;

            return (
              <button
                key={project.id}
                type="button"
                onMouseEnter={() => handleHoverChange(index)}
                onFocus={() => handleHoverChange(index)}
                className={`group flex w-full items-center justify-between rounded-[20px] border px-5 py-4 text-left transition-all duration-300 ${isActive
                  ? "border-white/25 bg-white/10 shadow-[0_14px_34px_rgba(0,0,0,0.28)]"
                  : "border-white/8 bg-white/[0.03] hover:border-white/14 hover:bg-white/[0.06]"
                  }`}
              >
                <div>
                  <div
                    className={`text-[11px] uppercase tracking-[0.16em] transition ${isActive ? "text-white/55" : "text-white/35"
                      }`}
                  >
                    {project.tag}
                  </div>

                  <div
                    className={`mt-2 text-[2rem] font-semibold leading-none tracking-[-0.03em] transition ${isActive ? "text-white" : "text-white/72"
                      }`}
                  >
                    {project.title}
                  </div>

                  <div
                    className={`mt-2 text-sm transition ${isActive ? "text-white/65" : "text-white/45"
                      }`}
                  >
                    {project.subtitle}
                  </div>
                </div>

                <div
                  className={`ml-4 text-sm transition ${isActive
                    ? "translate-x-0 text-white/70"
                    : "-translate-x-1 text-white/25"
                    }`}
                >
                  ↗
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* DERECHA */}
      <div
        className="relative w-full max-w-[660px] justify-self-center pr-16 pt-6"
        style={{ perspective: "1600px" }}
      >
        {/* ABANICO DE FOTOS DETRÁS */}
        {stackedProjects.map((project, i) => {
          const depth = stackedProjects.length - i;

          const fanX = depth * 34;
          const fanY = depth * -18;
          const fanRotate = depth * 4.5;
          const fanScale = 1 - depth * 0.045;
          const fanOpacity = 1;

          return (
            <motion.div
              key={`fan-${project.slug}-${hoveredIndex}`}
              initial={{
                opacity: 0,
                x: fanX + 90,
                y: fanY - 26,
                rotate: fanRotate + 6,
                rotateX: 18,
                rotateY: -10,
                scale: fanScale - 0.14,
                filter: "blur(12px)",
              }}
              animate={{
                opacity: fanOpacity,
                x: fanX,
                y: fanY,
                rotate: fanRotate,
                rotateX: 0,
                rotateY: 0,
                scale: fanScale,
                filter: "blur(0px)",
              }}
              transition={{
                duration: 0.72,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute inset-0 origin-bottom-left"
              style={{ zIndex: i + 1 }}
            >
              <div className="overflow-hidden rounded-[28px] border border-white/18 bg-[#1a1234] p-[6px] shadow-[0_24px_40px_rgba(0,0,0,0.28)]">
                <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-black">
                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.38))]" />

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="text-xl font-semibold tracking-[-0.03em] text-white/88">
                        {project.title}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* CARD PRINCIPAL: SÓLIDA */}
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={activeProject.slug}
            custom={direction}
            variants={previewVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.82,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative"
            style={{ zIndex: 20 }}
          >
            <div className="overflow-hidden rounded-[32px] border border-white/18 bg-[#24124d] p-[6px] shadow-[0_30px_80px_rgba(0,0,0,0.38)]">
              <div className="rounded-[27px] bg-[#2c1760] p-4">
                {/* CAJA SUPERIOR */}
                <div className="mb-4 rounded-[22px] border border-white/10 bg-[#3a1f7b] p-4 shadow-[0_16px_30px_rgba(0,0,0,0.18)]">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-white/45">
                    {activeProject.tag}
                  </div>

                  <p className="mt-3 text-[15px] leading-7 text-white/78">
                    {activeProject.description}
                  </p>

                  <div className="mt-3 text-sm text-white/52">
                    Hover sobre cada servicio para cambiar la visual.
                  </div>
                </div>

                {/* FOTO PRINCIPAL */}
                <div className="relative overflow-hidden rounded-[26px] border border-white/12 bg-black shadow-[0_18px_50px_rgba(0,0,0,0.25)]">
                  <div className="relative aspect-[16/9] w-full">
                    <Image
                      src={activeProject.image}
                      alt={activeProject.title}
                      fill
                      className="object-cover"
                      priority
                    />

                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.46))]" />

                    <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4">
                      <div className="rounded-full border border-white/15 bg-black/35 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-white/88">
                        Rubik Creaciones
                      </div>

                      <div className="rounded-full border border-white/15 bg-black/35 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-white/88">
                        {activeProject.tag}
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                      <div className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-[3rem]">
                        {activeProject.title}
                      </div>

                      <div className="mt-2 text-base text-white/80">
                        {activeProject.subtitle}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}