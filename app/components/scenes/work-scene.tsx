"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { createPortal } from "react-dom";
import { projects } from "@/app/data/projects";

type WorkSceneProps = {
  activeWorkCard: number;
};

type ProjectVariant = {
  key: string;
  label: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription?: string;
  image: string;
  gallery?: string[];
};

type ProjectItem = {
  id: number;
  slug: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription?: string;
  image: string;
  gallery?: string[];
  variants?: ProjectVariant[];
};

export default function WorkScene({ activeWorkCard }: WorkSceneProps) {
  const typedProjects = projects as ProjectItem[];

  const [hoveredIndex, setHoveredIndex] = useState(activeWorkCard);
  const [direction, setDirection] = useState(1);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailImageIndex, setDetailImageIndex] = useState(0);
  const [otherVariantIndex, setOtherVariantIndex] = useState(0);
  const [isImageZoomOpen, setIsImageZoomOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [previewMode, setPreviewMode] = useState<"cover" | "contain">("contain");

  const activeProject = typedProjects[hoveredIndex];
  const isOtrosProject = activeProject?.slug === "otros";
  const projectVariants = isOtrosProject ? activeProject.variants ?? [] : [];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setOtherVariantIndex(0);
    setDetailImageIndex(0);
    setIsImageZoomOpen(false);
    setPreviewMode("contain");
  }, [hoveredIndex]);

  useEffect(() => {
    if (!isClient) return;

    const previousOverflow = document.body.style.overflow;

    if (isImageZoomOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isClient, isImageZoomOpen]);

  const activeVariant =
    isOtrosProject && projectVariants.length > 0
      ? projectVariants[Math.min(otherVariantIndex, projectVariants.length - 1)]
      : null;

  const resolvedProject: ProjectItem =
    activeVariant && activeProject
      ? {
        ...activeProject,
        tag: activeVariant.tag,
        title: activeVariant.title,
        subtitle: activeVariant.subtitle,
        description: activeVariant.description,
        longDescription:
          activeVariant.longDescription ?? activeVariant.description,
        image: activeVariant.image,
        gallery:
          activeVariant.gallery && activeVariant.gallery.length > 0
            ? activeVariant.gallery
            : [activeVariant.image],
      }
      : activeProject;

  const handleHoverChange = (index: number) => {
    if (index === hoveredIndex) return;
    setDirection(index > hoveredIndex ? 1 : -1);
    setHoveredIndex(index);
    setDetailImageIndex(0);
    setOtherVariantIndex(0);
    setIsImageZoomOpen(false);
    setPreviewMode("contain");
  };

  const openDetail = (index?: number) => {
    if (typeof index === "number") {
      setDirection(index > hoveredIndex ? 1 : -1);
      setHoveredIndex(index);
      setOtherVariantIndex(0);
    }
    setDetailImageIndex(0);
    setIsImageZoomOpen(false);
    setPreviewMode("contain");
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setIsImageZoomOpen(false);
    setPreviewMode("contain");
  };

  const openZoom = (index?: number) => {
    if (typeof index === "number") {
      setDetailImageIndex(index);
    }
    setPreviewMode("contain");
    setIsImageZoomOpen(true);
  };

  const closeZoom = () => {
    setIsImageZoomOpen(false);
    setPreviewMode("contain");
  };

  const previewVariants: Variants = {
    enter: {
      x: direction > 0 ? 42 : -42,
      y: 10,
      opacity: 0,
      scale: 0.978,
      rotate: direction > 0 ? 3.5 : -3.5,
      rotateY: direction > 0 ? -5 : 5,
    },
    center: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      rotate: -2.2,
      rotateY: -3.5,
    },
    exit: {
      x: direction > 0 ? -24 : 24,
      y: -6,
      opacity: 0,
      scale: 0.988,
      rotate: direction > 0 ? -2.5 : 2.5,
      rotateY: direction > 0 ? 3.5 : -3.5,
    },
  };

  const detailVariants: Variants = {
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
    return typedProjects.slice(hoveredIndex + 1, hoveredIndex + 4);
  }, [hoveredIndex, typedProjects]);

  const detailGallery =
    resolvedProject?.gallery && resolvedProject.gallery.length > 0
      ? resolvedProject.gallery
      : [resolvedProject.image];

  const compactDetailGallery = detailGallery.slice(0, 4);

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

  const previewModal =
    isClient && isImageZoomOpen
      ? createPortal(
        <AnimatePresence>
          <motion.div
            key="service-preview-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[220] bg-[rgba(6,3,18,0.9)]"
            onClick={closeZoom}
          >
            <div
              className="relative h-screen w-screen overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0">
                <Image
                  src={detailGallery[detailImageIndex]}
                  alt={`${resolvedProject.title} ampliada ${detailImageIndex + 1}`}
                  fill
                  className="object-cover scale-110 opacity-20 blur-3xl"
                  sizes="100vw"
                  priority
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(32,18,60,0.12)_0%,rgba(12,7,24,0.62)_58%,rgba(4,2,10,0.92)_100%)]" />
              </div>

              <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between p-4 sm:p-5 lg:p-6">
                <div className="rounded-full border border-white/12 bg-black/20 px-4 py-2 text-sm text-white/78 backdrop-blur">
                  Vista ampliada
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewMode((prev) =>
                        prev === "cover" ? "contain" : "cover"
                      )
                    }
                    className="rounded-full border border-white/15 bg-black/28 px-4 py-2 text-sm text-white/85 backdrop-blur transition hover:bg-black/40"
                  >
                    {previewMode === "cover" ? "Ver completa" : "Llenar pantalla"}
                  </button>

                  <button
                    type="button"
                    onClick={closeZoom}
                    className="rounded-full border border-white/15 bg-black/28 px-4 py-2 text-sm text-white/85 backdrop-blur transition hover:bg-black/40"
                  >
                    Cerrar
                  </button>
                </div>
              </div>

              {detailGallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevDetailImage}
                    className="absolute left-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/28 text-xl text-white/85 backdrop-blur transition hover:bg-black/40"
                    aria-label="Imagen anterior"
                  >
                    ←
                  </button>

                  <button
                    type="button"
                    onClick={nextDetailImage}
                    className="absolute right-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/28 text-xl text-white/85 backdrop-blur transition hover:bg-black/40"
                    aria-label="Imagen siguiente"
                  >
                    →
                  </button>
                </>
              )}

              <div className="relative z-20 flex h-full w-full items-center justify-center px-4 py-20 sm:px-8 lg:px-12">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${detailGallery[detailImageIndex]}-${previewMode}`}
                    initial={{ opacity: 0, scale: 1.01 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className={
                      previewMode === "cover"
                        ? "relative h-full w-full overflow-hidden rounded-[24px]"
                        : "relative h-[78vh] w-[90vw] max-w-[1360px] overflow-hidden rounded-[24px]"
                    }
                  >
                    <Image
                      src={detailGallery[detailImageIndex]}
                      alt={`${resolvedProject.title} ampliada ${detailImageIndex + 1}`}
                      fill
                      className={
                        previewMode === "cover"
                          ? "object-cover"
                          : "object-contain drop-shadow-[0_18px_48px_rgba(0,0,0,0.38)]"
                      }
                      sizes="100vw"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/80 via-black/24 to-transparent p-5 sm:p-6 lg:p-8">
                <h3 className="omnes-title text-xl tracking-[-0.03em] text-white sm:text-[1.4rem]">
                  {resolvedProject.title}
                </h3>

                <p className="omnes-text mt-1 max-w-3xl text-sm text-white/72 sm:text-base">
                  {resolvedProject.subtitle}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )
      : null;

  return (
    <>
      <section className="relative w-full overflow-visible">
        <div className="grid h-full w-full max-w-[1320px] grid-cols-1 items-start gap-3 px-3 pb-3 pt-0 min-[1700px]:max-w-[1440px] min-[1700px]:gap-4 min-[1700px]:px-4 2xl:max-w-[1520px] 2xl:gap-5 2xl:px-6">
          {!isDetailOpen ? (
            <motion.div
              key="work-overview"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="grid min-h-0 grid-cols-1 gap-4 lg:grid-cols-[0.84fr_1.16fr] min-[1700px]:gap-5 2xl:gap-6"
            >
              <div className="max-w-[500px] justify-self-start min-[1700px]:max-w-[530px] 2xl:max-w-[560px]">
                <div className="mb-3 inline-flex rounded-full border border-white/10 bg-white/[0.08] px-4 py-1.5 text-[12px] text-white/78">
                  Seleccione un servicio para ver detalles
                </div>

                <div className="space-y-3">
                  {typedProjects.map((project, index) => {
                    const isActive = index === hoveredIndex;

                    return (
                      <button
                        key={project.id}
                        type="button"
                        onMouseEnter={() => handleHoverChange(index)}
                        onFocus={() => handleHoverChange(index)}
                        onClick={() => openDetail(index)}
                        className={`group flex w-full items-center justify-between rounded-[18px] border px-5 py-3.5 text-left transition-all duration-300 ${isActive
                          ? "border-white/25 bg-white/10 shadow-[0_14px_34px_rgba(0,0,0,0.28)]"
                          : "border-white/8 bg-white/[0.03] hover:border-white/14 hover:bg-white/[0.06]"
                          } min-[1700px]:px-5 min-[1700px]:py-4`}
                      >
                        <div>
                          <div
                            className={`omnes-text text-[10.5px] uppercase tracking-[0.16em] transition ${isActive ? "text-white/55" : "text-white/35"
                              }`}
                          >
                            {project.tag}
                          </div>

                          <div
                            className={`omnes-title mt-2 text-[1.68rem] leading-none tracking-[-0.03em] transition ${isActive ? "text-white" : "text-white/72"
                              } min-[1700px]:text-[1.76rem] 2xl:text-[1.86rem]`}
                          >
                            {project.title}
                          </div>

                          <div
                            className={`omnes-text mt-1.5 text-[13px] transition ${isActive ? "text-white/65" : "text-white/45"
                              } min-[1700px]:text-[13.5px]`}
                          >
                            {project.subtitle}
                          </div>
                        </div>

                        <div
                          className={`omnes-text ml-4 text-sm transition ${isActive
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

              <div
                className="relative w-full max-w-[680px] justify-self-center pt-4 min-[1700px]:max-w-[760px] min-[1700px]:pt-5 2xl:max-w-[840px] 2xl:pt-5"
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
                              sizes="(max-width: 1024px) 100vw, (max-width: 1699px) 680px, (max-width: 1919px) 760px, 840px"
                              className="object-cover object-center"
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

                <AnimatePresence initial={false} mode="popLayout">
                  <motion.div
                    key={`${resolvedProject.slug}-${activeVariant?.key ?? "base"}`}
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
                            {resolvedProject.tag}
                          </div>

                          <p className="omnes-text mt-2 text-[12.5px] leading-6 text-white/78 min-[1700px]:text-[13px] 2xl:text-[13.5px]">
                            {resolvedProject.description}
                          </p>

                          <div className="omnes-text mt-2 text-[12px] text-white/52 min-[1700px]:text-[12.5px]">
                            Hover para posicionar. Click en la visual para abrir la vista del servicio.
                          </div>

                          {isOtrosProject && projectVariants.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {projectVariants.map((variant, index) => {
                                const isActiveVariant = index === otherVariantIndex;

                                return (
                                  <button
                                    key={variant.key}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOtherVariantIndex(index);
                                      setDetailImageIndex(0);
                                    }}
                                    className={`omnes-text rounded-full border px-3 py-1.5 text-[11px] transition ${isActiveVariant
                                      ? "border-white/24 bg-white/12 text-white"
                                      : "border-white/10 bg-white/[0.04] text-white/62 hover:bg-white/[0.08]"
                                      }`}
                                  >
                                    {variant.label}
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => openDetail()}
                            className="relative mt-3.5 block w-full overflow-hidden rounded-[20px] border border-white/12 bg-[#07070d] text-left shadow-[0_14px_30px_rgba(0,0,0,0.22)] transition-transform duration-300 hover:scale-[1.01] min-[1700px]:rounded-[22px]"
                          >
                            <div className="relative aspect-[16/9.15] w-full overflow-hidden rounded-[18px] min-[1700px]:rounded-[20px]">
                              <Image
                                src={resolvedProject.image}
                                alt={resolvedProject.title}
                                fill
                                sizes="(max-width: 1024px) 100vw, (max-width: 1699px) 565px, (max-width: 1919px) 615px, 665px"
                                className="object-cover object-center"
                                priority
                              />

                              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.34))]" />

                              <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-3 min-[1700px]:p-3.5">
                                <div className="omnes-text rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[9.5px] uppercase tracking-[0.16em] text-white/88 min-[1700px]:text-[10px]">
                                  RUBIK CREACIONES
                                </div>

                                <div className="omnes-text rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[9.5px] uppercase tracking-[0.16em] text-white/88 min-[1700px]:text-[10px]">
                                  {resolvedProject.tag}
                                </div>
                              </div>

                              <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-4 min-[1700px]:p-4.5">
                                <div className="omnes-title text-[1.75rem] tracking-[-0.03em] text-white sm:text-[1.9rem] min-[1700px]:text-[2rem] 2xl:text-[2.15rem]">
                                  {resolvedProject.title}
                                </div>

                                <div className="omnes-text mt-1.5 text-[12.8px] text-white/80 min-[1700px]:text-[13.5px]">
                                  {resolvedProject.subtitle}
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
              key={`detail-${resolvedProject.slug}-${activeVariant?.key ?? "base"}`}
              variants={detailVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.58,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mx-auto w-full max-w-[1120px]"
            >
              <div className="overflow-hidden rounded-[28px] border border-white/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.32)] backdrop-blur-xl min-[1700px]:p-5">
                <div className="grid items-stretch gap-4 lg:grid-cols-[0.96fr_1.04fr]">
                  <div className="relative h-full min-h-[640px] overflow-hidden rounded-[22px] border border-white/10 bg-black/20">
                    <button
                      type="button"
                      onClick={() => openZoom()}
                      className="relative block h-full w-full overflow-hidden text-left"
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={detailGallery[detailImageIndex]}
                          initial={{ opacity: 0.22, scale: 1.02 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0.18, scale: 0.985 }}
                          transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute inset-0"
                        >
                          <Image
                            src={detailGallery[detailImageIndex]}
                            alt={`${resolvedProject.title} ${detailImageIndex + 1}`}
                            fill
                            className="object-cover object-center"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            priority
                          />
                        </motion.div>
                      </AnimatePresence>

                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.4))]" />

                      <div className="absolute right-4 top-4 z-20 rounded-full border border-white/14 bg-black/35 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-white/82">
                        Ampliar
                      </div>

                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <div className="omnes-title text-[1.9rem] tracking-[-0.03em] text-white min-[1700px]:text-[2.1rem]">
                          {resolvedProject.title}
                        </div>

                        <div className="omnes-text mt-1.5 text-[13px] text-white/78 min-[1700px]:text-[13.5px]">
                          {resolvedProject.subtitle}
                        </div>
                      </div>
                    </button>
                  </div>

                  <div className="flex flex-col rounded-[22px] border border-white/10 bg-white/[0.04] p-4 min-[1700px]:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="omnes-text text-[10px] uppercase tracking-[0.16em] text-white/45">
                          {resolvedProject.tag}
                        </div>

                        <div className="omnes-title mt-2 text-[1.75rem] tracking-[-0.03em] text-white">
                          {resolvedProject.title}
                        </div>

                        <div className="omnes-text mt-1.5 text-[13px] text-white/68">
                          {resolvedProject.subtitle}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={closeDetail}
                        className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-2 text-white/78 transition hover:bg-white/[0.09]"
                      >
                        Cerrar
                      </button>
                    </div>

                    {isOtrosProject && projectVariants.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {projectVariants.map((variant, index) => {
                          const isActiveVariant = index === otherVariantIndex;

                          return (
                            <button
                              key={variant.key}
                              type="button"
                              onClick={() => {
                                setOtherVariantIndex(index);
                                setDetailImageIndex(0);
                                setIsImageZoomOpen(false);
                                setPreviewMode("contain");
                              }}
                              className={`omnes-text rounded-full border px-3 py-1.5 text-[12px] transition ${isActiveVariant
                                ? "border-white/22 bg-white/12 text-white"
                                : "border-white/10 bg-white/[0.04] text-white/62 hover:bg-white/[0.08]"
                                }`}
                            >
                              {variant.label}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <p className="omnes-text mt-5 text-[13px] leading-6 text-white/78">
                      {resolvedProject.longDescription ?? resolvedProject.description}
                    </p>

                    {compactDetailGallery.length > 1 && (
                      <div className="mt-5 rounded-[18px] border border-white/10 bg-white/[0.035] p-3.5">
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <p className="omnes-text text-[10px] uppercase tracking-[0.18em] text-white/42">
                            Trabajos realizados
                          </p>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={prevDetailImage}
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/14 bg-white/8 text-[13px] text-white/80 transition hover:bg-white/14"
                              aria-label="Anterior"
                            >
                              ←
                            </button>

                            <button
                              type="button"
                              onClick={nextDetailImage}
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/14 bg-white/8 text-[13px] text-white/80 transition hover:bg-white/14"
                              aria-label="Siguiente"
                            >
                              →
                            </button>
                          </div>
                        </div>

                        <div className="mb-3 text-right">
                          <span className="omnes-text text-[10px] text-white/38">
                            {Math.min(detailImageIndex + 1, compactDetailGallery.length)}/
                            {compactDetailGallery.length}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          {compactDetailGallery.map((image, index) => (
                            <button
                              key={`${image}-${index}`}
                              type="button"
                              onClick={() => openZoom(index)}
                              className={`group relative overflow-hidden rounded-[14px] border transition ${detailImageIndex === index
                                ? "border-white/24 bg-white/[0.06] shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
                                : "border-white/8 bg-white/[0.02] hover:border-white/16 hover:bg-white/[0.04]"
                                }`}
                            >
                              <div className="relative aspect-[4/3] w-full overflow-hidden">
                                <Image
                                  src={image}
                                  alt={`${resolvedProject.title} ${index + 1}`}
                                  fill
                                  className="object-cover object-center transition duration-300 group-hover:scale-[1.03]"
                                  sizes="260px"
                                />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {previewModal}
    </>
  );
}