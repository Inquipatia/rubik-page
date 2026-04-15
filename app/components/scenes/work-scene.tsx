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
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailImageIndex, setDetailImageIndex] = useState(0);

  const activeProject = projects[hoveredIndex];

  const handleHoverChange = (index: number) => {
    if (index === hoveredIndex) return;
    setDirection(index > hoveredIndex ? 1 : -1);
    setHoveredIndex(index);
    setDetailImageIndex(0);
  };

  const openDetail = (index?: number) => {
    if (typeof index === "number") {
      setDirection(index > hoveredIndex ? 1 : -1);
      setHoveredIndex(index);
    }
    setDetailImageIndex(0);
    setIsDetailOpen(true);
  };

  const closeDetail = () => setIsDetailOpen(false);

  const previewVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 42 : -42,
      y: 10,
      opacity: 0,
      scale: 0.978,
      rotate: dir > 0 ? 3.5 : -3.5,
      rotateY: dir > 0 ? -5 : 5,
    }),
    center: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      rotate: -2.2,
      rotateY: -3.5,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -24 : 24,
      y: -6,
      opacity: 0,
      scale: 0.988,
      rotate: dir > 0 ? -2.5 : 2.5,
      rotateY: dir > 0 ? 3.5 : -3.5,
    }),
  };

  const detailVariants = {
    enter: {
      opacity: 0,
      y: 24,
      scale: 0.98,
      filter: "blur(10px)",
      clipPath: "inset(0 0 100% 0 round 28px)",
    },
    center: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      clipPath: "inset(0 0 0% 0 round 28px)",
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.988,
      filter: "blur(8px)",
      clipPath: "inset(0 0 100% 0 round 28px)",
    },
  };

  const stackedProjects = useMemo(() => {
    return projects.slice(hoveredIndex + 1, hoveredIndex + 4);
  }, [hoveredIndex]);

  const detailGallery =
    activeProject.gallery && activeProject.gallery.length > 0
      ? activeProject.gallery
      : [activeProject.image];

  const prevDetailImage = () => {
    setDetailImageIndex((prev) =>
      prev === 0 ? detailGallery.length - 1 : prev - 1
    );
  };

  const nextDetailImage = () => {
    setDetailImageIndex((prev) =>
      prev === detailGallery.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section className="relative min-h-[66vh]">
      <AnimatePresence mode="wait">
        {!isDetailOpen ? (
          <motion.div
            key="browse-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: 8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto grid w-full max-w-[1180px] grid-cols-1 items-start gap-3 pt-3 lg:grid-cols-[0.92fr_1.08fr] min-[1700px]:max-w-[1260px] min-[1700px]:gap-4 min-[1700px]:pt-4 2xl:max-w-[1320px] 2xl:grid-cols-[0.92fr_1.08fr] 2xl:gap-5"
          >
            {/* IZQUIERDA */}
            <div className="max-w-[460px] justify-self-start min-[1700px]:max-w-[480px] 2xl:max-w-[500px]">
              <span className="omnes-text mb-3 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-1 text-[13px] text-white/75 backdrop-blur">
                Seleccione un servicio para ver detalles
              </span>

              <div className="mt-3 space-y-2.5 2xl:space-y-3">
                {projects.map((project, index) => {
                  const isActive = index === hoveredIndex;

                  return (
                    <button
                      key={project.id}
                      type="button"
                      onMouseEnter={() => handleHoverChange(index)}
                      onFocus={() => handleHoverChange(index)}
                      onClick={() => openDetail(index)}
                      className={`group flex w-full items-center justify-between rounded-[18px] border px-5 py-3.5 text-left transition-all duration-300 ${
                        isActive
                          ? "border-white/25 bg-white/10 shadow-[0_14px_34px_rgba(0,0,0,0.28)]"
                          : "border-white/8 bg-white/[0.03] hover:border-white/14 hover:bg-white/[0.06]"
                      } min-[1700px]:px-5 min-[1700px]:py-4`}
                    >
                      <div>
                        <div
                          className={`omnes-text text-[10.5px] uppercase tracking-[0.16em] transition ${
                            isActive ? "text-white/55" : "text-white/35"
                          }`}
                        >
                          {project.tag}
                        </div>

                        <div
                          className={`omnes-title mt-2 text-[1.68rem] leading-none tracking-[-0.03em] transition ${
                            isActive ? "text-white" : "text-white/72"
                          } min-[1700px]:text-[1.76rem] 2xl:text-[1.86rem]`}
                        >
                          {project.title}
                        </div>

                        <div
                          className={`omnes-text mt-1.5 text-[13px] transition ${
                            isActive ? "text-white/65" : "text-white/45"
                          } min-[1700px]:text-[13.5px]`}
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
              className="relative w-full max-w-[505px] justify-self-center pt-4 min-[1700px]:max-w-[565px] min-[1700px]:pt-5 2xl:max-w-[615px] 2xl:pt-5"
              style={{ perspective: "1600px" }}
            >
              {stackedProjects.map((project, i) => {
                const depth = stackedProjects.length - i;
                const fanX = depth * 22;
                const fanY = depth * -8;
                const fanRotate = depth * 6.2;
                const fanScale = 1 - depth * 0.055;

                return (
                  <motion.div
                    key={`fan-${project.slug}-${hoveredIndex}`}
                    initial={{
                      opacity: 0,
                      x: fanX + 34,
                      y: fanY + 14,
                      rotate: fanRotate + 8,
                      rotateX: 8,
                      rotateY: -10,
                      scale: fanScale - 0.06,
                    }}
                    animate={{
                      opacity: 1,
                      x: fanX,
                      y: fanY,
                      rotate: fanRotate,
                      rotateX: 0,
                      rotateY: -3,
                      scale: fanScale,
                    }}
                    transition={{
                      duration: 0.56,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="absolute inset-0 origin-bottom-left"
                    style={{ zIndex: i + 1 }}
                  >
                    <div className="rounded-[22px] border border-white/18 bg-[#1a1234] p-[4px] shadow-[0_18px_30px_rgba(0,0,0,0.24)] min-[1700px]:rounded-[24px]">
                      <div className="relative overflow-hidden rounded-[17px] border border-white/10 bg-[#07070d] min-[1700px]:rounded-[18px]">
                        <div className="relative aspect-[16/10.6] w-full">
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, (max-width: 1699px) 505px, (max-width: 1919px) 565px, 615px"
                            className="object-contain"
                          />
                          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.22))]" />

                          <div className="absolute bottom-0 left-0 right-0 p-2.5">
                            <div className="omnes-title text-[0.92rem] tracking-[-0.03em] text-white/82 min-[1700px]:text-[1rem]">
                              {project.title}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={activeProject.slug}
                  custom={direction}
                  variants={previewVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    duration: 0.68,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative"
                  style={{ zIndex: 20 }}
                >
                  <div className="rounded-[24px] border border-white/18 bg-[#24124d] p-[4px] shadow-[0_20px_48px_rgba(0,0,0,0.32)] min-[1700px]:rounded-[26px] 2xl:rounded-[28px]">
                    <div className="rounded-[20px] bg-[#2c1760] p-2.5 min-[1700px]:rounded-[22px] min-[1700px]:p-3 2xl:rounded-[24px] 2xl:p-3.5">
                      <div className="mb-2.5 rounded-[17px] border border-white/10 bg-[#3a1f7b] p-2.5 shadow-[0_12px_22px_rgba(0,0,0,0.15)] min-[1700px]:mb-3 min-[1700px]:rounded-[18px] min-[1700px]:p-3 2xl:mb-3.5 2xl:rounded-[20px] 2xl:p-3.5">
                        <div className="omnes-text text-[10px] uppercase tracking-[0.16em] text-white/45">
                          {activeProject.tag}
                        </div>

                        <p className="omnes-text mt-2 text-[12.5px] leading-6 text-white/78 min-[1700px]:text-[13px] 2xl:text-[13.5px]">
                          {activeProject.description}
                        </p>

                        <div className="omnes-text mt-2 text-[12px] text-white/52 min-[1700px]:text-[12.5px]">
                          Hover para posicionar. Click en la visual para abrir la vista del servicio.
                        </div>

                        <button
                          type="button"
                          onClick={() => openDetail()}
                          className="relative mt-3.5 block w-full overflow-hidden rounded-[20px] border border-white/12 bg-[#07070d] text-left shadow-[0_14px_30px_rgba(0,0,0,0.22)] transition-transform duration-300 hover:scale-[1.01] min-[1700px]:rounded-[22px]"
                        >
                          <div className="relative aspect-[16/9.15] w-full">
                            <Image
                              src={activeProject.image}
                              alt={activeProject.title}
                              fill
                              sizes="(max-width: 1024px) 100vw, (max-width: 1699px) 505px, (max-width: 1919px) 565px, 615px"
                              className="object-contain"
                              priority
                            />

                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.28))]" />

                            <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-3 min-[1700px]:p-3.5">
                              <div className="omnes-text rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[9.5px] uppercase tracking-[0.16em] text-white/88 min-[1700px]:text-[10px]">
                                RUBIK CREACIONES
                              </div>

                              <div className="omnes-text rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[9.5px] uppercase tracking-[0.16em] text-white/88 min-[1700px]:text-[10px]">
                                {activeProject.tag}
                              </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-4 min-[1700px]:p-4.5">
                              <div className="omnes-title text-[1.75rem] tracking-[-0.03em] text-white sm:text-[1.9rem] min-[1700px]:text-[2rem] 2xl:text-[2.15rem]">
                                {activeProject.title}
                              </div>

                              <div className="omnes-text mt-1.5 text-[12.8px] text-white/80 min-[1700px]:text-[13.5px]">
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
          </motion.div>
        ) : (
          <motion.div
            key={`detail-${activeProject.slug}`}
            variants={detailVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.58,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative mx-auto w-full max-w-[1240px] min-[1700px]:max-w-[1320px] 2xl:max-w-[1380px]"
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 5.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <div className="overflow-hidden rounded-[32px] border border-white/12 bg-[linear-gradient(180deg,rgba(36,18,77,0.96),rgba(18,11,33,0.98))] p-[6px] shadow-[0_30px_90px_rgba(0,0,0,0.36)]">
              <div className="rounded-[26px] border border-white/8 bg-[linear-gradient(180deg,#20113f_0%,#140d24_100%)] p-5 sm:p-6 lg:p-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
                  <div className="relative min-h-[400px] overflow-hidden rounded-[26px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-4 sm:p-5">
                    <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `
                            radial-gradient(rgba(255,255,255,0.18) 0.6px, transparent 0.6px),
                            linear-gradient(180deg, rgba(255,255,255,0.04), transparent 35%)
                          `,
                          backgroundSize: "14px 14px, 100% 100%",
                          backgroundPosition: "0 0, 0 0",
                        }}
                      />
                    </div>

                    <div className="relative flex h-full min-h-[360px] items-center justify-center">
                      {detailGallery.map((image, index) => {
                        const offset = index - detailImageIndex;
                        const absOffset = Math.abs(offset);
                        const isActive = offset === 0;

                        if (absOffset > 2) return null;

                        return (
                          <motion.button
                            key={`${activeProject.slug}-detail-${index}`}
                            type="button"
                            onClick={() => setDetailImageIndex(index)}
                            initial={false}
                            animate={{
                              x: offset * 128,
                              y: isActive ? 0 : 24,
                              scale: isActive ? 1 : 0.8,
                              rotate: isActive ? 0 : offset < 0 ? -10 : 10,
                              opacity: absOffset === 2 ? 0.22 : isActive ? 1 : 0.58,
                              zIndex: isActive ? 30 : 20 - absOffset,
                            }}
                            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute block w-[60%] max-w-[390px] origin-center text-left"
                          >
                            <div className="overflow-hidden rounded-[26px] border border-white/14 bg-[#120d20] p-[6px] shadow-[0_24px_60px_rgba(0,0,0,0.32)]">
                              <div className="relative overflow-hidden rounded-[20px] bg-black">
                                <div className="relative aspect-[4/5] w-full">
                                  <Image
                                    src={image}
                                    alt={`${activeProject.title} ${index + 1}`}
                                    fill
                                    sizes="(max-width: 1024px) 90vw, 480px"
                                    className="object-cover"
                                    priority={isActive}
                                  />
                                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.38))]" />
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    <div className="relative mt-4 flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={prevDetailImage}
                        className="omnes-text inline-flex h-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] px-4 text-sm text-white/82 transition hover:bg-white/[0.08]"
                      >
                        Anterior
                      </button>

                      <div className="omnes-text text-sm text-white/58">
                        {detailImageIndex + 1} / {detailGallery.length}
                      </div>

                      <button
                        type="button"
                        onClick={nextDetailImage}
                        className="omnes-text inline-flex h-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] px-4 text-sm text-white/82 transition hover:bg-white/[0.08]"
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between rounded-[26px] border border-white/8 bg-white/[0.03] p-5 sm:p-6 lg:min-h-[480px]">
                    <div>
                      <div className="mb-5 flex items-start justify-between gap-4">
                        <div>
                          <div className="omnes-text text-[11px] uppercase tracking-[0.16em] text-white/48">
                            {activeProject.tag}
                          </div>

                          <h2 className="omnes-title mt-3 text-[2.2rem] leading-none tracking-[-0.04em] text-white sm:text-[2.8rem]">
                            {activeProject.title}
                          </h2>

                          <div className="omnes-text mt-3 text-[15px] text-white/70 sm:text-[17px]">
                            {activeProject.subtitle}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={closeDetail}
                          className="omnes-text inline-flex h-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] px-4 text-sm text-white/82 transition hover:bg-white/[0.08]"
                        >
                          Volver
                        </button>
                      </div>

                      <p className="omnes-text mt-5 text-[15px] leading-7 text-white/82">
                        {activeProject.longDescription ?? activeProject.description}
                      </p>
                    </div>

                    <div className="mt-7 grid gap-4">
                      <div>
                        <div className="omnes-text text-[11px] uppercase tracking-[0.16em] text-white/45">
                          Enfoque
                        </div>
                        <div className="omnes-text mt-2 text-white/82">
                          Diseño, producción y presencia visual coherente con la marca.
                        </div>
                      </div>

                      <div>
                        <div className="omnes-text text-[11px] uppercase tracking-[0.16em] text-white/45">
                          Aplicación
                        </div>
                        <div className="omnes-text mt-2 text-white/82">
                          Retail, vitrinas, eventos, fachadas y activaciones.
                        </div>
                      </div>

                      <div>
                        <div className="omnes-text text-[11px] uppercase tracking-[0.16em] text-white/45">
                          Resultado
                        </div>
                        <div className="omnes-text mt-2 text-white/82">
                          La imagen principal toma protagonismo, las laterales quedan como apoyo y toda la cinta se siente más viva.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}