"use client";

import { useEffect, useMemo, useState, type ComponentProps } from "react";
import Image from "next/image";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { createPortal } from "react-dom";
import { projects } from "@/app/data/projects";

type WorkSceneProps = {
  activeWorkCard: number;
  servicesResetKey?: number;
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
  zoomGallery?: string[];
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
  zoomGallery?: string[];
  variants?: ProjectVariant[];
};

const DETAIL_ITEMS_PER_PAGE = 4;

function getServiceCoverImage(project: Pick<ProjectItem, "slug" | "image">) {
  const serviceCoverFolders: Record<string, string> = {
    impresion: "impresion",
    neon: "neon",
    otros: "otros",
    stands: "stands",
    volumetricos: "Volumetricos",
  };

  const folderFromImage = project.image.match(/^\/img\/([^/]+)\//)?.[1];
  const folder = serviceCoverFolders[project.slug] ?? folderFromImage ?? project.slug;

  return `/img/${folder}/cover.png`;
}

type ZoomFallbackImageProps = Omit<ComponentProps<typeof Image>, "src"> & {
  src: string;
  fallbackSrc: string;
};

function ZoomFallbackImage({
  src,
  fallbackSrc,
  alt,
  ...props
}: ZoomFallbackImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}

const servicesIntroVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.08,
    },
  },
};

const servicesItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.96,
    filter: "blur(12px)",
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.68,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const servicesPreviewVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 34,
    y: 18,
    scale: 0.965,
    filter: "blur(16px)",
  },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.82,
      delay: 0.25,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function WorkScene({
  activeWorkCard,
  servicesResetKey = 0,
}: WorkSceneProps) {
  const typedProjects = projects as ProjectItem[];

  const safeInitialIndex = Math.min(
    Math.max(activeWorkCard, 0),
    Math.max(typedProjects.length - 1, 0)
  );

  const [hoveredIndex, setHoveredIndex] = useState(safeInitialIndex);
  const [direction, setDirection] = useState(1);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailImageIndex, setDetailImageIndex] = useState(0);
  const [otherVariantIndex, setOtherVariantIndex] = useState(0);
  const [isImageZoomOpen, setIsImageZoomOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const activeProject = typedProjects[hoveredIndex] ?? typedProjects[0];
  const isOtrosProject = activeProject?.slug === "otros";
  const projectVariants = isOtrosProject ? activeProject.variants ?? [] : [];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!typedProjects.length) return;

    const nextIndex = Math.min(
      Math.max(activeWorkCard, 0),
      typedProjects.length - 1
    );

    setHoveredIndex(nextIndex);
    setDirection(1);
    setIsDetailOpen(false);
    setIsImageZoomOpen(false);
    setDetailImageIndex(0);
    setOtherVariantIndex(0);
  }, [activeWorkCard, servicesResetKey, typedProjects.length]);

  useEffect(() => {
    setOtherVariantIndex(0);
    setDetailImageIndex(0);
    setIsImageZoomOpen(false);
  }, [hoveredIndex]);

  useEffect(() => {
    setIsDetailOpen(false);
    setIsImageZoomOpen(false);
    setDetailImageIndex(0);
    setOtherVariantIndex(0);
  }, [servicesResetKey]);

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

  if (!activeProject) {
    return (
      <section className="relative flex min-h-[66vh] items-center justify-center">
        <div className="omnes-text rounded-[24px] border border-white/10 bg-white/[0.04] px-6 py-5 text-center text-white/72">
          No hay servicios cargados.
        </div>
      </section>
    );
  }

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
        zoomGallery:
          activeVariant.zoomGallery && activeVariant.zoomGallery.length > 0
            ? activeVariant.zoomGallery
            : undefined,
      }
      : activeProject;

  const handleHoverChange = (index: number) => {
    if (index === hoveredIndex) return;

    setDirection(index > hoveredIndex ? 1 : -1);
    setHoveredIndex(index);
    setDetailImageIndex(0);
    setOtherVariantIndex(0);
    setIsImageZoomOpen(false);
  };

  const openDetail = (index?: number) => {
    if (typeof index === "number") {
      setDirection(index > hoveredIndex ? 1 : -1);
      setHoveredIndex(index);
      setOtherVariantIndex(0);
    }

    setDetailImageIndex(0);
    setIsImageZoomOpen(false);
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setIsImageZoomOpen(false);
  };

  const openZoom = (index?: number) => {
    if (typeof index === "number") {
      setDetailImageIndex(index);
    }

    setIsImageZoomOpen(true);
  };

  const closeZoom = () => {
    setIsImageZoomOpen(false);
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
      y: 42,
      scale: 0.955,
      filter: "blur(18px)",
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
      y: -14,
      scale: 0.985,
      filter: "blur(10px)",
      clipPath: "inset(0 0 100% 0 round 28px)",
    },
  };

  const detailPanelVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 22,
      scale: 0.975,
      filter: "blur(14px)",
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.72,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const detailSideContainerVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.22,
      },
    },
  };

  const detailSideItemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 16,
      scale: 0.97,
      filter: "blur(10px)",
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.58,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const detailThumbVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 14,
      scale: 0.92,
      filter: "blur(8px)",
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.42,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const stackedProjects = useMemo(() => {
    return typedProjects.slice(hoveredIndex + 1, hoveredIndex + 4);
  }, [hoveredIndex, typedProjects]);

  const detailGallery =
    resolvedProject?.gallery && resolvedProject.gallery.length > 0
      ? resolvedProject.gallery
      : [resolvedProject.image];

  const zoomDetailGallery =
    resolvedProject?.zoomGallery && resolvedProject.zoomGallery.length > 0
      ? resolvedProject.zoomGallery
      : detailGallery;

  const activeDetailImage = detailGallery[detailImageIndex];
  const activeZoomDetailImage =
    zoomDetailGallery[detailImageIndex] ?? activeDetailImage;

  const detailTotalPages = Math.max(
    1,
    Math.ceil(detailGallery.length / DETAIL_ITEMS_PER_PAGE)
  );

  const detailCurrentPage = Math.floor(detailImageIndex / DETAIL_ITEMS_PER_PAGE);

  const pagedDetailGallery = useMemo(() => {
    const start = detailCurrentPage * DETAIL_ITEMS_PER_PAGE;
    return detailGallery.slice(start, start + DETAIL_ITEMS_PER_PAGE);
  }, [detailGallery, detailCurrentPage]);

  const goToDetailPage = (page: number) => {
    if (!detailGallery.length) return;

    const safePage = Math.max(0, Math.min(page, detailTotalPages - 1));
    const nextIndex = safePage * DETAIL_ITEMS_PER_PAGE;

    setDetailImageIndex(Math.min(nextIndex, detailGallery.length - 1));
  };

  const prevDetailPage = () => {
    if (detailTotalPages <= 1) return;

    goToDetailPage(
      detailCurrentPage === 0 ? detailTotalPages - 1 : detailCurrentPage - 1
    );
  };

  const nextDetailPage = () => {
    if (detailTotalPages <= 1) return;

    goToDetailPage(
      detailCurrentPage === detailTotalPages - 1 ? 0 : detailCurrentPage + 1
    );
  };

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
            <div className="relative h-screen w-screen overflow-hidden">
              <div className="absolute inset-0">
                <ZoomFallbackImage
                  src={activeZoomDetailImage}
                  fallbackSrc={activeDetailImage}
                  alt={`${resolvedProject.title} ampliada ${detailImageIndex + 1
                    }`}
                  fill
                  className="scale-110 object-cover opacity-20 blur-3xl"
                  sizes="100vw"
                  priority
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(32,18,60,0.12)_0%,rgba(12,7,24,0.62)_58%,rgba(4,2,10,0.92)_100%)]" />
              </div>

              <div
                className="absolute inset-x-0 top-0 z-30 flex items-center justify-between p-4 sm:p-5 lg:p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="omnes-text rounded-full border border-white/12 bg-black/20 px-4 py-2 text-sm text-white/82 backdrop-blur">
                  Vista ampliada
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeZoom();
                  }}
                  className="omnes-text rounded-full border border-white/15 bg-black/28 px-4 py-2 text-sm text-white/88 backdrop-blur transition hover:bg-black/40"
                >
                  Cerrar
                </button>
              </div>

              {detailGallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevDetailImage();
                    }}
                    className="absolute left-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/28 text-xl text-white/85 backdrop-blur transition hover:bg-black/40"
                    aria-label="Imagen anterior"
                  >
                    ←
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextDetailImage();
                    }}
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
                    key={activeZoomDetailImage}
                    initial={{ opacity: 0, scale: 1.01 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{
                      duration: 0.22,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative flex items-center justify-center"
                  >
                    <ZoomFallbackImage
                      src={activeZoomDetailImage}
                      fallbackSrc={activeDetailImage}
                      alt={`${resolvedProject.title} ampliada ${detailImageIndex + 1
                        }`}
                      width={1300}
                      height={1384}
                      className="h-[min(82vh,1384px)] w-auto max-w-[92vw] rounded-[24px] object-contain drop-shadow-[0_18px_48px_rgba(0,0,0,0.38)]"
                      sizes="(max-width: 1024px) 92vw, 1300px"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/80 via-black/24 to-transparent p-5 sm:p-6 lg:p-8">
                <h3 className="omnes-title text-[1.5rem] tracking-[-0.03em] text-white sm:text-[1.65rem]">
                  {resolvedProject.title}
                </h3>

                <p className="omnes-text mt-1 max-w-3xl text-sm text-white/82 sm:text-base">
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
        <div
          className={`rubik-work-frame ${isDetailOpen ? "is-detail" : "is-overview"
            } grid h-full w-full max-w-[1320px] grid-cols-1 items-start gap-3 px-3 pb-3 pt-0 min-[1700px]:max-w-[1440px] min-[1700px]:gap-4 min-[1700px]:px-4 2xl:max-w-[1520px] 2xl:gap-5 2xl:px-6`}
        >
          {!isDetailOpen ? (
            <motion.div
              key="work-overview"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="rubik-work-overview grid min-h-0 grid-cols-1 gap-4 lg:grid-cols-[0.84fr_1.16fr] min-[1700px]:gap-5 2xl:gap-6"
            >
              <motion.div
                variants={servicesIntroVariants}
                initial="hidden"
                animate="show"
                className="max-w-[500px] justify-self-start min-[1700px]:max-w-[530px] 2xl:max-w-[560px]"
              >
                <motion.div
                  variants={servicesItemVariants}
                  className="omnes-text mb-3 inline-flex rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-[13px] text-white/84"
                >
                  Seleccione un servicio para ver detalles
                </motion.div>

                <motion.div
                  variants={servicesIntroVariants}
                  className="space-y-3"
                >
                  {typedProjects.map((project, index) => {
                    const isActive = index === hoveredIndex;

                    return (
                      <motion.button
                        key={project.id}
                        type="button"
                        variants={servicesItemVariants}
                        whileHover={{
                          x: 8,
                          scale: 1.015,
                          transition: {
                            duration: 0.22,
                            ease: [0.22, 1, 0.36, 1],
                          },
                        }}
                        whileTap={{ scale: 0.985 }}
                        onMouseEnter={() => handleHoverChange(index)}
                        onFocus={() => handleHoverChange(index)}
                        onClick={() => openDetail(index)}
                        className={`group relative flex w-full items-center justify-between overflow-hidden rounded-[18px] border px-5 py-3.5 text-left transition-all duration-300 ${isActive
                          ? "border-white/25 bg-white/10 shadow-[0_14px_34px_rgba(0,0,0,0.28)]"
                          : "border-white/8 bg-white/[0.03] hover:border-white/14 hover:bg-white/[0.06]"
                          } min-[1700px]:px-5 min-[1700px]:py-4`}
                      >
                        <motion.div
                          aria-hidden
                          className="pointer-events-none absolute inset-y-0 left-0 w-[3px] rounded-full bg-white/70"
                          initial={false}
                          animate={{
                            opacity: isActive ? 1 : 0,
                            scaleY: isActive ? 1 : 0.35,
                          }}
                          transition={{
                            duration: 0.28,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        />

                        <motion.div
                          aria-hidden
                          className="pointer-events-none absolute -right-10 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-white/8 blur-2xl"
                          initial={false}
                          animate={{
                            opacity: isActive ? 0.72 : 0,
                            scale: isActive ? 1 : 0.72,
                          }}
                          transition={{
                            duration: 0.32,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        />

                        <div className="relative z-10">
                          <div
                            className={`omnes-text text-[11.5px] uppercase tracking-[0.14em] transition ${isActive ? "text-white/62" : "text-white/45"
                              }`}
                          >
                            {project.tag}
                          </div>

                          <div
                            className={`omnes-title mt-2 text-[1.88rem] leading-none tracking-[-0.03em] transition ${isActive ? "text-white" : "text-white/80"
                              } min-[1700px]:text-[1.96rem] 2xl:text-[2.06rem]`}
                          >
                            {project.title}
                          </div>

                          <div
                            className={`omnes-text mt-1.5 text-[14px] transition ${isActive ? "text-white/78" : "text-white/58"
                              } min-[1700px]:text-[14.5px]`}
                          >
                            {project.subtitle}
                          </div>
                        </div>

                        <motion.div
                          className={`omnes-text relative z-10 ml-4 text-base transition ${isActive ? "text-white/78" : "text-white/35"
                            }`}
                          initial={false}
                          animate={{
                            x: isActive ? 0 : -4,
                            rotate: isActive ? 0 : -10,
                            scale: isActive ? 1.08 : 1,
                          }}
                          transition={{
                            duration: 0.25,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          ↗
                        </motion.div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </motion.div>

              <motion.div
                variants={servicesPreviewVariants}
                initial="hidden"
                animate="show"
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
                              src={getServiceCoverImage(project)}
                              alt={project.title}
                              fill
                              sizes="(max-width: 1024px) 100vw, (max-width: 1699px) 680px, (max-width: 1919px) 760px, 840px"
                              className="object-cover object-center"
                            />

                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.22))]" />

                            <div className="absolute bottom-0 left-0 right-0 p-2.5">
                              <div className="omnes-title text-[1.02rem] tracking-[-0.03em] text-white/86 min-[1700px]:text-[1.08rem]">
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
                    key={`${resolvedProject.slug}-${activeVariant?.key ?? "base"
                      }`}
                    variants={previewVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    whileHover={{
                      y: -3,
                      rotate: -1.4,
                      transition: {
                        duration: 0.28,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    }}
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
                          <div className="omnes-text text-[11px] uppercase tracking-[0.14em] text-white/52">
                            {resolvedProject.tag}
                          </div>

                          <p className="omnes-text mt-2.5 text-[13.5px] leading-6 text-white/84 min-[1700px]:text-[14px] 2xl:text-[14.5px]">
                            {resolvedProject.description}
                          </p>

                          <div className="omnes-text mt-2.5 text-[13px] text-white/68 min-[1700px]:text-[13.5px]">
                            Hover para posicionar. Click en la visual para abrir
                            la vista del servicio.
                          </div>

                          {isOtrosProject && projectVariants.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {projectVariants.map((variant, index) => {
                                const isActiveVariant =
                                  index === otherVariantIndex;

                                return (
                                  <button
                                    key={variant.key}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOtherVariantIndex(index);
                                      setDetailImageIndex(0);
                                    }}
                                    className={`omnes-text rounded-full border px-3 py-1.5 text-[12px] transition ${isActiveVariant
                                      ? "border-white/24 bg-white/12 text-white"
                                      : "border-white/10 bg-white/[0.04] text-white/68 hover:bg-white/[0.08]"
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
                                src={getServiceCoverImage(activeProject)}
                                alt={resolvedProject.title}
                                fill
                                sizes="(max-width: 1024px) 100vw, (max-width: 1699px) 565px, (max-width: 1919px) 615px, 665px"
                                className="object-cover object-center"
                                priority
                              />

                              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.34))]" />

                              <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-3 min-[1700px]:p-3.5">
                                <div className="omnes-text rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-white/90 min-[1700px]:text-[10.5px]">
                                  RUBIK CREACIONES
                                </div>

                                <div className="omnes-text rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-white/90 min-[1700px]:text-[10.5px]">
                                  {resolvedProject.tag}
                                </div>
                              </div>

                              <motion.div
                                aria-hidden
                                className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,transparent_42%,rgba(255,255,255,0.18)_50%,transparent_58%,transparent_100%)]"
                                initial={{ x: "-120%" }}
                                animate={{ x: ["-120%", "120%"] }}
                                transition={{
                                  duration: 3.4,
                                  repeat: Infinity,
                                  repeatDelay: 3.2,
                                  ease: "easeInOut",
                                }}
                              />

                              <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-4 min-[1700px]:p-4.5">
                                <div className="omnes-title text-[1.95rem] tracking-[-0.03em] text-white sm:text-[2.08rem] min-[1700px]:text-[2.16rem] 2xl:text-[2.28rem]">
                                  {resolvedProject.title}
                                </div>

                                <div className="omnes-text mt-1.5 text-[14px] text-white/86 min-[1700px]:text-[14.5px]">
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
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              className="rubik-work-detail-overlay fixed inset-0 z-[60] overflow-y-auto bg-[rgba(7,3,18,0.86)] px-4 pb-6 pt-[120px] backdrop-blur-[10px] sm:px-5 sm:pt-[128px] md:pt-[136px] lg:z-[180] lg:flex lg:items-center lg:justify-center lg:bg-transparent lg:px-4 lg:py-6 lg:backdrop-blur-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                aria-label="Volver a servicios"
                onClick={closeDetail}
                className="fixed inset-0 z-0 bg-transparent"
              />

              <motion.div
                key={`detail-${resolvedProject.slug}-${activeVariant?.key ?? "base"
                  }`}
                variants={detailVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: 0.78,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative z-10 mx-auto w-full max-w-[720px] pb-8 lg:max-w-[1160px] lg:pb-0"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative overflow-visible rounded-[28px] border border-white/10 bg-white/[0.018] p-3 shadow-[0_18px_46px_rgba(0,0,0,0.18)] backdrop-blur-[2px] sm:p-4 lg:p-4">
                  <div className="pointer-events-none absolute inset-0 rounded-[28px] border border-white/[0.045]" />

                  <div className="relative grid items-stretch gap-4 bg-transparent p-0 shadow-none backdrop-blur-0 lg:grid-cols-[643px_minmax(0,1fr)] lg:justify-between">
                    <motion.div
                      variants={detailPanelVariants}
                      initial="hidden"
                      animate="show"
                      className="relative h-[390px] overflow-hidden rounded-[22px] border border-white/10 bg-black/20 sm:h-[430px] lg:h-[689px] lg:w-[643px]"
                    >
                      <button
                        type="button"
                        onClick={() => openZoom()}
                        className="relative block h-full w-full overflow-hidden text-left"
                      >
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={detailGallery[detailImageIndex]}
                            initial={{
                              opacity: 0.22,
                              scale: 1.025,
                              filter: "blur(8px)",
                            }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                              filter: "blur(0px)",
                            }}
                            exit={{
                              opacity: 0.18,
                              scale: 0.985,
                              filter: "blur(8px)",
                            }}
                            transition={{
                              duration: 0.34,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="absolute inset-0"
                          >
                            <Image
                              src={detailGallery[detailImageIndex]}
                              alt={`${resolvedProject.title} ${detailImageIndex + 1
                                }`}
                              fill
                              sizes="(max-width: 1024px) 100vw, 643px"
                              className="object-cover object-center"
                              priority
                            />

                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.32))]" />
                          </motion.div>
                        </AnimatePresence>

                        <motion.div
                          variants={detailSideItemVariants}
                          className="absolute right-4 top-4 z-20 rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-white/80 backdrop-blur-md"
                        >
                          Ampliar
                        </motion.div>

                        <motion.div
                          variants={detailSideItemVariants}
                          className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/70 via-black/18 to-transparent p-5"
                        >
                          <div className="omnes-title text-[1.75rem] tracking-[-0.03em] text-white sm:text-[1.95rem]">
                            {resolvedProject.title}
                          </div>

                          <p className="omnes-text mt-1.5 text-[13px] text-white/82 sm:text-[13.5px]">
                            {resolvedProject.subtitle}
                          </p>
                        </motion.div>
                      </button>

                      {detailGallery.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              prevDetailImage();
                            }}
                            className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/14 bg-black/30 text-lg text-white/88 backdrop-blur-md transition duration-300 hover:scale-[1.03] hover:bg-black/45"
                            aria-label="Imagen anterior"
                          >
                            ←
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              nextDetailImage();
                            }}
                            className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/14 bg-black/30 text-lg text-white/88 backdrop-blur-md transition duration-300 hover:scale-[1.03] hover:bg-black/45"
                            aria-label="Imagen siguiente"
                          >
                            →
                          </button>
                        </>
                      )}
                    </motion.div>

                    <motion.div
                      variants={detailSideContainerVariants}
                      initial="hidden"
                      animate="show"
                      className="grid h-auto gap-4 lg:h-[689px] lg:grid-rows-[260px_minmax(0,1fr)]"
                    >
                      <motion.div
                        variants={detailSideItemVariants}
                        className="flex flex-col rounded-[22px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl min-[1700px]:p-5"
                      >
                        <div className="mb-4 flex items-start justify-between gap-4">
                          <div>
                            <div className="omnes-text text-[10px] uppercase tracking-[0.14em] text-white/48 sm:text-[11px]">
                              {resolvedProject.tag}
                            </div>

                            <h2 className="omnes-title mt-3 text-[2.1rem] leading-none tracking-[-0.04em] text-white sm:text-[2.6rem]">
                              {resolvedProject.title}
                            </h2>

                            <div className="omnes-text mt-2 text-[14px] text-white/72 sm:text-[15px]">
                              {resolvedProject.subtitle}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={closeDetail}
                            className="omnes-text shrink-0 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-[13px] text-white/82 transition hover:bg-white/[0.08]"
                          >
                            Volver
                          </button>
                        </div>

                        <div className="min-h-0 overflow-hidden">
                          <p className="omnes-text text-[13px] leading-7 text-white/82 sm:text-[13.5px]">
                            {resolvedProject.longDescription ??
                              resolvedProject.description}
                          </p>
                        </div>
                      </motion.div>

                      {detailGallery.length > 1 ? (
                        <motion.div
                          variants={detailSideItemVariants}
                          className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur-xl min-[1700px]:p-4"
                        >
                          <div className="mb-3">
                            <div className="flex items-center justify-between gap-2">
                              <p className="omnes-text text-[10px] uppercase tracking-[0.14em] text-white/48 sm:text-[11px]">
                                Trabajos realizados
                              </p>

                              {detailTotalPages > 1 && (
                                <div className="flex items-center gap-2">
                                  <motion.button
                                    type="button"
                                    onClick={prevDetailPage}
                                    whileHover={{ scale: 1.08, x: -2 }}
                                    whileTap={{ scale: 0.94 }}
                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/14 bg-white/8 text-[12px] text-white/84 transition hover:bg-white/14 sm:h-9 sm:w-9 sm:text-[13px]"
                                    aria-label="Página anterior"
                                  >
                                    ←
                                  </motion.button>

                                  <motion.button
                                    type="button"
                                    onClick={nextDetailPage}
                                    whileHover={{ scale: 1.08, x: 2 }}
                                    whileTap={{ scale: 0.94 }}
                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/14 bg-white/8 text-[12px] text-white/84 transition hover:bg-white/14 sm:h-9 sm:w-9 sm:text-[13px]"
                                    aria-label="Página siguiente"
                                  >
                                    →
                                  </motion.button>
                                </div>
                              )}
                            </div>

                            <div className="mt-2 flex items-center justify-between">
                              <span className="omnes-text text-[10px] text-white/48 sm:text-[11px]">
                                {detailImageIndex + 1}/{detailGallery.length}
                              </span>

                              <span className="omnes-text text-right text-[10px] text-white/48 sm:text-[11px]">
                                Página {detailCurrentPage + 1}/
                                {detailTotalPages}
                              </span>
                            </div>
                          </div>

                          <div className="grid min-h-0 flex-1 grid-cols-2 content-start gap-2.5">
                            {pagedDetailGallery.map((image, localIndex) => {
                              const realIndex =
                                detailCurrentPage * DETAIL_ITEMS_PER_PAGE +
                                localIndex;

                              const isActive = detailImageIndex === realIndex;

                              return (
                                <motion.button
                                  key={`${image}-${realIndex}`}
                                  type="button"
                                  variants={detailThumbVariants}
                                  initial="hidden"
                                  animate="show"
                                  whileHover={{ y: -3, scale: 1.025 }}
                                  whileTap={{ scale: 0.96 }}
                                  transition={{
                                    delay: 0.42 + localIndex * 0.055,
                                  }}
                                  onClick={() => setDetailImageIndex(realIndex)}
                                  aria-label={`${resolvedProject.title} ${realIndex + 1
                                    }`}
                                  className={`group relative overflow-hidden rounded-[14px] border transition duration-300 ${isActive
                                    ? "border-white/28 bg-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]"
                                    : "border-white/10 bg-white/[0.03] hover:border-white/18 hover:bg-white/[0.06]"
                                    }`}
                                >
                                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[14px] bg-black/20">
                                    <Image
                                      src={image}
                                      alt={`${resolvedProject.title} ${realIndex + 1
                                        }`}
                                      fill
                                      className="scale-[1.02] object-cover object-center transition duration-300 group-hover:scale-[1.05]"
                                      sizes="(max-width: 1024px) 50vw, 260px"
                                    />
                                  </div>

                                  {isActive && (
                                    <div className="pointer-events-none absolute bottom-2 right-2 inline-flex rounded-full border border-white/20 bg-black/40 px-1.5 py-0.5 text-[7px] uppercase tracking-[0.14em] text-white/82 backdrop-blur-sm sm:text-[8px]">
                                      Active
                                    </div>
                                  )}
                                </motion.button>
                              );
                            })}
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          variants={detailSideItemVariants}
                          className="rounded-[22px] border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur-xl min-[1700px]:p-4"
                        >
                          <div className="omnes-text text-[10px] uppercase tracking-[0.14em] text-white/48 sm:text-[11px]">
                            Trabajos realizados
                          </div>

                          <p className="omnes-text mt-2 text-[13px] leading-6 text-white/68">
                            Este servicio tiene una imagen principal disponible.
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>

      {previewModal}
    </>
  );
}