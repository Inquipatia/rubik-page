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
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailImageIndex, setDetailImageIndex] = useState(0);
  const [selectedOtherTab, setSelectedOtherTab] = useState<string | null>(null);

  const activeProject = projects[hoveredIndex] ?? projects[0];

  useEffect(() => {
    setHoveredIndex(activeWorkCard);
  }, [activeWorkCard]);

  useEffect(() => {
    setDetailImageIndex(0);

    if (activeProject?.slug === "otros" && activeProject.tabs?.length) {
      setSelectedOtherTab((prev) => {
        const exists = activeProject.tabs?.some((tab) => tab.id === prev);
        return exists ? prev : activeProject.tabs?.[0]?.id ?? null;
      });
    } else {
      setSelectedOtherTab(null);
    }
  }, [activeProject]);

  const activeTab =
    activeProject?.slug === "otros" && activeProject.tabs?.length
      ? activeProject.tabs.find((tab) => tab.id === selectedOtherTab) ??
        activeProject.tabs[0]
      : null;

  const detailGallery =
    activeProject?.slug === "otros" && activeTab?.gallery?.length
      ? activeTab.gallery
      : activeProject.gallery && activeProject.gallery.length > 0
        ? activeProject.gallery
        : [activeProject.image];

  const previewImage =
    activeProject?.slug === "otros" && activeTab?.gallery?.length
      ? activeTab.gallery[0]
      : activeProject.image;

  const detailTitle =
    activeProject?.slug === "otros" && activeTab?.label
      ? activeTab.label
      : activeProject.title;

  const detailDescription =
    activeProject?.slug === "otros" && activeTab?.description
      ? activeTab.description
      : activeProject.longDescription ?? activeProject.description;

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
      x: dir > 0 ? 18 : -18,
      y: 4,
      opacity: 0,
      scale: 0.992,
      rotate: dir > 0 ? 0.7 : -0.7,
    }),
    center: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -12 : 12,
      y: -2,
      opacity: 0,
      scale: 0.996,
      rotate: dir > 0 ? -0.4 : 0.4,
    }),
  };

  const detailVariants = {
    enter: {
      opacity: 0,
      y: 16,
      scale: 0.985,
      filter: "blur(7px)",
      clipPath: "inset(0 0 100% 0 round 20px)",
    },
    center: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      clipPath: "inset(0 0 0% 0 round 20px)",
    },
    exit: {
      opacity: 0,
      y: -8,
      scale: 0.992,
      filter: "blur(6px)",
      clipPath: "inset(0 0 100% 0 round 20px)",
    },
  };

  const stackedProjects = useMemo(() => {
    return projects.slice(hoveredIndex + 1, hoveredIndex + 4);
  }, [hoveredIndex]);

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
    <section className="relative h-[calc(100svh-170px)] min-h-0">
      <AnimatePresence mode="wait">
        {!isDetailOpen ? (
          <motion.div
            key="browse-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="grid h-full min-h-0 grid-cols-1 items-start gap-3 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]"
          >
            <div className="flex h-full min-h-0 flex-col">
              <span className="omnes-text mb-2 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] text-white/70 backdrop-blur">
                Seleccione un servicio para ver detalles
              </span>

              <div
                className="grid h-full min-h-0 gap-1.5"
                style={{
                  gridTemplateRows: `repeat(${projects.length}, minmax(0, 1fr))`,
                }}
              >
                {projects.map((project, index) => {
                  const isActive = index === hoveredIndex;

                  return (
                    <button
                      key={project.id}
                      type="button"
                      onMouseEnter={() => handleHoverChange(index)}
                      onFocus={() => handleHoverChange(index)}
                      onClick={() => openDetail(index)}
                      className={`group flex min-h-0 w-full items-center justify-between rounded-[13px] border px-3 py-1.5 text-left transition-all duration-300 ${
                        isActive
                          ? "border-white/22 bg-white/9 shadow-[0_8px_20px_rgba(0,0,0,0.22)]"
                          : "border-white/8 bg-white/[0.03] hover:border-white/14 hover:bg-white/[0.06]"
                      }`}
                    >
                      <div className="min-w-0">
                        <div
                          className={`omnes-text text-[7px] uppercase tracking-[0.14em] transition ${
                            isActive ? "text-white/52" : "text-white/34"
                          }`}
                        >
                          {project.tag}
                        </div>

                        <div
                          className={`omnes-title mt-1 text-[0.96rem] leading-none tracking-[-0.03em] transition sm:text-[1.04rem] lg:text-[1.12rem] ${
                            isActive ? "text-white" : "text-white/72"
                          }`}
                        >
                          {project.title}
                        </div>

                        <div
                          className={`omnes-text mt-1 line-clamp-1 text-[10px] leading-4 transition ${
                            isActive ? "text-white/60" : "text-white/42"
                          }`}
                        >
                          {project.subtitle}
                        </div>
                      </div>

                      <div
                        className={`omnes-text ml-3 shrink-0 text-[10px] transition ${
                          isActive
                            ? "translate-x-0 text-white/64"
                            : "-translate-x-1 text-white/22"
                        }`}
                      >
                        ↗
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              className="relative h-full min-h-0 w-full max-w-[400px] justify-self-center pr-1 pt-0 xl:max-w-[430px]"
              style={{ perspective: "1600px" }}
            >
              {stackedProjects.map((project, i) => {
                const depth = stackedProjects.length - i;
                const fanX = depth * 12;
                const fanY = depth * -5;
                const fanRotate = depth * 4;
                const fanScale = 1 - depth * 0.052;

                return (
                  <motion.div
                    key={`fan-${project.slug}-${hoveredIndex}`}
                    initial={{
                      opacity: 0,
                      x: fanX + 18,
                      y: fanY + 8,
                      rotate: fanRotate + 6,
                      rotateX: 7,
                      rotateY: -10,
                      scale: fanScale - 0.08,
                    }}
                    animate={{
                      opacity: 1,
                      x: fanX,
                      y: fanY,
                      rotate: fanRotate,
                      rotateX: 0,
                      rotateY: -4,
                      scale: fanScale,
                    }}
                    transition={{
                      duration: 0.42,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="absolute inset-0 origin-bottom-left"
                    style={{ zIndex: i + 1 }}
                  >
                    <div className="overflow-hidden rounded-[17px] border border-white/14 bg-[#1a1234] p-[4px] shadow-[0_12px_24px_rgba(0,0,0,0.2)]">
                      <div className="relative overflow-hidden rounded-[13px] border border-white/10 bg-black">
                        <div className="relative aspect-[16/10] w-full">
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 430px"
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.38))]" />

                          <div className="absolute bottom-0 left-0 right-0 p-2">
                            <div className="omnes-title text-[0.8rem] tracking-[-0.03em] text-white/86">
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
                  key={`${activeProject.slug}-${activeTab?.id ?? "default"}`}
                  custom={direction}
                  variants={previewVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    duration: 0.44,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative"
                  style={{ zIndex: 20 }}
                >
                  <div className="overflow-hidden rounded-[18px] border border-white/16 bg-[#24124d] p-[4px] shadow-[0_16px_34px_rgba(0,0,0,0.24)]">
                    <div className="rounded-[15px] bg-[#2c1760] p-2">
                      <div className="mb-2 rounded-[13px] border border-white/10 bg-[#3a1f7b] p-2.5 shadow-[0_10px_20px_rgba(0,0,0,0.14)]">
                        <div className="omnes-text text-[8px] uppercase tracking-[0.14em] text-white/44">
                          {activeProject.tag}
                        </div>

                        <p className="omnes-text mt-2 text-[10px] leading-5 text-white/74">
                          {activeProject.description}
                        </p>

                        <div className="omnes-text mt-2 text-[10px] text-white/48">
                          Click en la visual para abrir la vista del servicio.
                        </div>

                        {activeProject.slug === "otros" &&
                        activeProject.tabs?.length ? (
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {activeProject.tabs.map((tab) => {
                              const isActive = activeTab?.id === tab.id;

                              return (
                                <button
                                  key={tab.id}
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setSelectedOtherTab(tab.id);
                                    setDetailImageIndex(0);
                                  }}
                                  className={`omnes-text rounded-full border px-2.5 py-1 text-[8px] transition ${
                                    isActive
                                      ? "border-white/24 bg-white/10 text-white/88"
                                      : "border-white/10 bg-white/[0.03] text-white/52 hover:border-white/18 hover:text-white/76"
                                  }`}
                                >
                                  {tab.label}
                                </button>
                              );
                            })}
                          </div>
                        ) : null}

                        <button
                          type="button"
                          onClick={() => openDetail()}
                          className="relative mt-2.5 block w-full overflow-hidden rounded-[14px] border border-white/12 bg-black text-left shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition-transform duration-300 hover:scale-[1.01]"
                        >
                          <div className="relative aspect-[16/9] w-full">
                            <Image
                              src={previewImage}
                              alt={detailTitle}
                              fill
                              sizes="(max-width: 1024px) 100vw, 430px"
                              className="object-cover"
                              priority
                            />

                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.46))]" />

                            <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-2">
                              <div className="omnes-text rounded-full border border-white/15 bg-black/35 px-2 py-1 text-[7px] uppercase tracking-[0.14em] text-white/84">
                                Rubik Creaciones
                              </div>

                              <div className="omnes-text rounded-full border border-white/15 bg-black/35 px-2 py-1 text-[7px] uppercase tracking-[0.14em] text-white/84">
                                {activeProject.tag}
                              </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-2.5">
                              <div className="omnes-title text-[1.06rem] tracking-[-0.03em] text-white sm:text-[1.18rem]">
                                {detailTitle}
                              </div>

                              <div className="omnes-text mt-1 text-[10px] text-white/78">
                                {activeProject.slug === "otros"
                                  ? activeProject.subtitle
                                  : activeProject.subtitle}
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
            key={`detail-${activeProject.slug}-${activeTab?.id ?? "default"}`}
            variants={detailVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.42,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative mx-auto w-full max-w-[940px] xl:max-w-[1040px]"
          >
            <div className="overflow-hidden rounded-[20px] border border-white/12 bg-[linear-gradient(180deg,rgba(36,18,77,0.96),rgba(18,11,33,0.98))] p-[4px] shadow-[0_16px_40px_rgba(0,0,0,0.28)]">
              <div className="rounded-[16px] border border-white/8 bg-[linear-gradient(180deg,#20113f_0%,#140d24_100%)] p-2.5 sm:p-3">
                <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-[1.02fr_0.98fr] lg:items-stretch xl:grid-cols-[1.05fr_0.95fr]">
                  <div className="relative flex h-full min-h-[250px] flex-col overflow-hidden rounded-[15px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-2.5 lg:min-h-[350px] xl:min-h-[390px]">
                    <div className="relative flex flex-1 items-center justify-center">
                      {detailGallery.map((image, index) => {
                        const offset = index - detailImageIndex;
                        const absOffset = Math.abs(offset);
                        const isActive = offset === 0;

                        if (absOffset > 2) return null;

                        return (
                          <motion.button
                            key={`${activeProject.slug}-${activeTab?.id ?? "default"}-detail-${index}`}
                            type="button"
                            onClick={() => setDetailImageIndex(index)}
                            initial={false}
                            animate={{
                              x: offset * 82,
                              y: isActive ? 0 : 12,
                              scale: isActive ? 0.9 : 0.74,
                              rotate: isActive ? 0 : offset < 0 ? -5 : 5,
                              opacity: absOffset === 2 ? 0.12 : isActive ? 1 : 0.5,
                              zIndex: isActive ? 30 : 20 - absOffset,
                            }}
                            transition={{
                              duration: 0.3,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="absolute block w-[62%] max-w-[270px] origin-center text-left lg:max-w-[300px]"
                          >
                            <div className="overflow-hidden rounded-[14px] border border-white/14 bg-[#120d20] p-[4px] shadow-[0_12px_22px_rgba(0,0,0,0.2)]">
                              <div className="relative overflow-hidden rounded-[10px] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),rgba(0,0,0,0.2))]">
                                <div className="relative aspect-[5/6] w-full">
                                  <Image
                                    src={image}
                                    alt={`${detailTitle} ${index + 1}`}
                                    fill
                                    sizes="(max-width: 1024px) 90vw, 340px"
                                    className="object-contain object-center"
                                    priority={isActive}
                                  />
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    <div className="relative mt-auto pt-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={prevDetailImage}
                          className="omnes-text inline-flex h-8 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] px-3 text-[11px] text-white/80 transition hover:bg-white/[0.08]"
                        >
                          Anterior
                        </button>

                        <div className="omnes-text text-[10px] text-white/56">
                          {detailImageIndex + 1} / {detailGallery.length}
                        </div>

                        <button
                          type="button"
                          onClick={nextDetailImage}
                          className="omnes-text inline-flex h-8 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] px-3 text-[11px] text-white/80 transition hover:bg-white/[0.08]"
                        >
                          Siguiente
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex h-full flex-col rounded-[15px] border border-white/8 bg-white/[0.03] px-3 py-3">
                    <div>
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div>
                          <div className="omnes-text text-[8px] uppercase tracking-[0.16em] text-white/34">
                            {activeProject.tag}
                          </div>

                          <h2 className="omnes-title mt-1.5 text-[1.45rem] leading-none tracking-[-0.04em] text-white sm:text-[1.6rem] lg:text-[1.9rem] xl:text-[2rem]">
                            {detailTitle}
                          </h2>

                          <div className="omnes-text mt-1.5 text-[11px] text-white/58">
                            {activeProject.subtitle}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={closeDetail}
                          className="omnes-text inline-flex h-8 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] px-3 text-[11px] text-white/74 transition hover:bg-white/[0.08]"
                        >
                          Volver
                        </button>
                      </div>

                      {activeProject.slug === "otros" && activeProject.tabs?.length ? (
                        <div className="mb-3 flex flex-wrap gap-2">
                          {activeProject.tabs.map((tab) => {
                            const isActive = activeTab?.id === tab.id;

                            return (
                              <button
                                key={tab.id}
                                type="button"
                                onClick={() => {
                                  setSelectedOtherTab(tab.id);
                                  setDetailImageIndex(0);
                                }}
                                className={`omnes-text rounded-full border px-3 py-1.5 text-[10px] transition ${
                                  isActive
                                    ? "border-white/24 bg-white/10 text-white/88"
                                    : "border-white/10 bg-white/[0.03] text-white/52 hover:border-white/18 hover:text-white/76"
                                }`}
                              >
                                {tab.label}
                              </button>
                            );
                          })}
                        </div>
                      ) : null}

                      <p className="omnes-text mt-2.5 text-[11px] leading-5 text-white/66">
                        {detailDescription}
                      </p>
                    </div>

                    <div className="mt-3 grid gap-2">
                      <div>
                        <div className="omnes-text text-[8px] uppercase tracking-[0.16em] text-white/34">
                          Enfoque
                        </div>
                        <div className="omnes-text mt-1 text-[11px] leading-5 text-white/62">
                          Diseño, producción y presencia visual coherente con la marca.
                        </div>
                      </div>

                      <div>
                        <div className="omnes-text text-[8px] uppercase tracking-[0.16em] text-white/34">
                          Aplicación
                        </div>
                        <div className="omnes-text mt-1 text-[11px] leading-5 text-white/62">
                          Retail, vitrinas, eventos, fachadas y activaciones.
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto" />
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