"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "@/app/data/projects";

type WorkSceneProps = {
  activeWorkCard: number;
};

export default function WorkScene({ activeWorkCard }: WorkSceneProps) {
  const [hoveredIndex, setHoveredIndex] = useState(activeWorkCard);
  const [direction, setDirection] = useState(1);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const activeProject = projects[hoveredIndex];

  const handleHoverChange = (index: number) => {
    if (index === hoveredIndex) return;
    setDirection(index > hoveredIndex ? 1 : -1);
    setHoveredIndex(index);
    setIsPreviewOpen(false);
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsPreviewOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <section className="grid min-h-[66vh] grid-cols-1 items-start gap-6 lg:grid-cols-[0.82fr_1.18fr]">
        {/* IZQUIERDA */}
        <div className="max-w-xl">
          <span className="omnes-text mb-3 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-1 text-sm text-white/75 backdrop-blur">
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
                  onClick={() => handleHoverChange(index)}
                  aria-pressed={isActive}
                  className={`group flex w-full items-center justify-between rounded-[20px] border px-5 py-4 text-left transition-all duration-300 ${
                    isActive
                      ? "border-white/25 bg-white/10 shadow-[0_14px_34px_rgba(0,0,0,0.28)]"
                      : "border-white/8 bg-white/[0.03] hover:border-white/14 hover:bg-white/[0.06]"
                  }`}
                >
                  <div>
                    <div
                      className={`omnes-text text-[11px] uppercase tracking-[0.16em] transition ${
                        isActive ? "text-white/55" : "text-white/35"
                      }`}
                    >
                      {project.tag}
                    </div>

                    <div
                      className={`omnes-title mt-2 text-[2rem] leading-none tracking-[-0.03em] transition ${
                        isActive ? "text-white" : "text-white/72"
                      }`}
                    >
                      {project.title}
                    </div>

                    <div
                      className={`omnes-text mt-2 text-sm transition ${
                        isActive ? "text-white/65" : "text-white/45"
                      }`}
                    >
                      {project.subtitle}
                    </div>
                  </div>

                  <div
                    className={`omnes-text ml-4 text-sm transition ${
                      isActive
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
                }}
                animate={{
                  opacity: fanOpacity,
                  x: fanX,
                  y: fanY,
                  rotate: fanRotate,
                  rotateX: 0,
                  rotateY: 0,
                  scale: fanScale,
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
                        sizes="(max-width: 1024px) 100vw, 660px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.38))]" />

                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="omnes-title text-xl tracking-[-0.03em] text-white/88">
                          {project.title}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* CARD PRINCIPAL */}
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
                  <div className="mb-4 rounded-[22px] border border-white/10 bg-[#3a1f7b] p-4 shadow-[0_16px_30px_rgba(0,0,0,0.18)]">
                    <div className="omnes-text text-[11px] uppercase tracking-[0.16em] text-white/45">
                      {activeProject.tag}
                    </div>

                    <p className="omnes-text mt-3 text-[15px] leading-7 text-white/78">
                      {activeProject.description}
                    </p>

                    <div className="omnes-text mt-3 text-sm text-white/52">
                      Hover para cambiar servicio. Click en la visual para desplegar.
                    </div>

                    {/* FOTO PRINCIPAL CLICKEABLE */}
                    <button
                      type="button"
                      onClick={() => setIsPreviewOpen(true)}
                      className="relative block w-full overflow-hidden rounded-[26px] border border-white/12 bg-black text-left shadow-[0_18px_50px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:scale-[1.01]"
                    >
                      <div className="relative aspect-[16/9] w-full">
                        <Image
                          src={activeProject.image}
                          alt={activeProject.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 660px"
                          className="object-cover"
                          priority
                        />

                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.46))]" />

                        <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4">
                          <div className="omnes-text rounded-full border border-white/15 bg-black/35 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-white/88">
                            Rubik Creaciones
                          </div>

                          <div className="omnes-text rounded-full border border-white/15 bg-black/35 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-white/88">
                            {activeProject.tag}
                          </div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                          <div className="omnes-title text-3xl tracking-[-0.03em] text-white sm:text-[3rem]">
                            {activeProject.title}
                          </div>

                          <div className="omnes-text mt-2 text-base text-white/80">
                            {activeProject.subtitle}
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* OVERLAY DESPLEGABLE */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/72 px-4 py-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setIsPreviewOpen(false)}
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 34,
                scale: 0.94,
                rotateX: 10,
                clipPath: "inset(0 0 100% 0 round 28px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
                clipPath: "inset(0 0 0% 0 round 28px)",
              }}
              exit={{
                opacity: 0,
                y: 18,
                scale: 0.97,
                rotateX: 6,
                clipPath: "inset(0 0 100% 0 round 28px)",
              }}
              transition={{
                duration: 0.52,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative w-full max-w-5xl overflow-hidden rounded-[30px] border border-white/14 bg-[#140d24] p-[6px] shadow-[0_32px_90px_rgba(0,0,0,0.5)]"
              style={{ perspective: "1400px" }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative overflow-hidden rounded-[24px] bg-black">
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={activeProject.image}
                    alt={activeProject.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1200px"
                    className="object-cover"
                    priority
                  />

                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.48))]" />

                  <motion.div
                    key={`overlay-shine-${activeProject.slug}`}
                    initial={{ x: "-130%", opacity: 0 }}
                    animate={{ x: "165%", opacity: [0, 0.3, 0] }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.08 }}
                    className="pointer-events-none absolute inset-y-0 w-[22%] rotate-[14deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)]"
                  />

                  <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4 sm:p-5">
                    <div className="omnes-text rounded-full border border-white/15 bg-black/35 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-white/88">
                      Rubik Creaciones
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsPreviewOpen(false)}
                      className="omnes-text rounded-full border border-white/15 bg-black/35 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-white/88 transition hover:bg-white/10"
                    >
                      Close
                    </button>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                    <div className="omnes-title text-3xl tracking-[-0.03em] text-white sm:text-5xl">
                      {activeProject.title}
                    </div>

                    <div className="omnes-text mt-2 max-w-2xl text-base text-white/80 sm:text-lg">
                      {activeProject.description}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}