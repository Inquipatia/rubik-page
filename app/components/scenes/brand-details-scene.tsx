"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";

type BrandWorkItem = {
  image: string;
  title?: string;
  description?: string;
};

type BrandDetailsSceneProps = {
  brandName: string;
  brandLogo?: string;
  description: string;
  works: BrandWorkItem[];
  onBack: () => void;
};

const PAGE_SIZE = 2;

export default function BrandDetailsScene({
  brandName,
  brandLogo,
  description,
  works,
  onBack,
}: BrandDetailsSceneProps) {
  const safeWorks = useMemo(() => {
    return Array.isArray(works) ? works.filter(Boolean) : [];
  }, [works]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [previewMode, setPreviewMode] = useState<"cover" | "contain">("contain");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
    setPage(0);
    setIsPreviewOpen(false);
    setPreviewMode("contain");
  }, [brandName]);

  useEffect(() => {
    if (!isClient) return;

    const previousOverflow = document.body.style.overflow;

    if (isPreviewOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = previousOverflow;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isClient, isPreviewOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsPreviewOpen(false);
      }

      if (!safeWorks.length) return;

      if (event.key === "ArrowRight") {
        setActiveIndex((prev) => (prev + 1) % safeWorks.length);
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev - 1 + safeWorks.length) % safeWorks.length);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [safeWorks]);

  useEffect(() => {
    const nextPage = Math.floor(activeIndex / PAGE_SIZE);
    if (nextPage !== page) {
      setPage(nextPage);
    }
  }, [activeIndex]);

  const activeWork = useMemo(() => {
    if (!safeWorks.length) {
      return {
        image: "/placeholder.jpg",
        title: "Sin trabajos cargados",
        description: "Aún no hay imágenes asociadas a esta marca.",
      };
    }

    return safeWorks[Math.min(activeIndex, safeWorks.length - 1)];
  }, [safeWorks, activeIndex]);

  const totalPages = Math.max(1, Math.ceil(safeWorks.length / PAGE_SIZE));
  const pagedWorks = safeWorks.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE
  );

  const handlePrevPage = () => {
    const nextPage = (page - 1 + totalPages) % totalPages;
    setPage(nextPage);
    setActiveIndex(nextPage * PAGE_SIZE);
  };

  const handleNextPage = () => {
    const nextPage = (page + 1) % totalPages;
    setPage(nextPage);
    setActiveIndex(nextPage * PAGE_SIZE);
  };

  const handlePrevImage = () => {
    if (!safeWorks.length) return;

    setActiveIndex((prev) => {
      const nextIndex = (prev - 1 + safeWorks.length) % safeWorks.length;
      return nextIndex;
    });
  };

  const handleNextImage = () => {
    if (!safeWorks.length) return;

    setActiveIndex((prev) => {
      const nextIndex = (prev + 1) % safeWorks.length;
      return nextIndex;
    });
  };

  const openPreview = () => {
    setPreviewMode("contain");
    setIsPreviewOpen(true);
  };

  const previewModal =
    isClient && isPreviewOpen
      ? createPortal(
          <AnimatePresence>
            <motion.div
              key="preview-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[220] bg-[rgba(6,3,18,0.88)]"
              onClick={() => setIsPreviewOpen(false)}
            >
              <div
                className="relative h-screen w-screen overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute inset-0">
                  <Image
                    src={activeWork.image}
                    alt={activeWork.title || brandName}
                    fill
                    className="object-cover scale-110 opacity-25 blur-2xl"
                    sizes="100vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,10,40,0.08)_0%,rgba(10,5,20,0.52)_55%,rgba(4,2,12,0.88)_100%)]" />
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
                      onClick={() => setIsPreviewOpen(false)}
                      className="rounded-full border border-white/15 bg-black/28 px-4 py-2 text-sm text-white/85 backdrop-blur transition hover:bg-black/40"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>

                {safeWorks.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/28 text-xl text-white/85 backdrop-blur transition hover:bg-black/40"
                      aria-label="Imagen anterior"
                    >
                      ←
                    </button>

                    <button
                      type="button"
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/28 text-xl text-white/85 backdrop-blur transition hover:bg-black/40"
                      aria-label="Imagen siguiente"
                    >
                      →
                    </button>
                  </>
                )}

                <div className="relative z-20 flex h-full w-full items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${activeWork.image}-${previewMode}`}
                      initial={{ opacity: 0, scale: 1.01 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.99 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className={
                        previewMode === "cover"
                          ? "relative h-full w-full"
                          : "relative h-[78vh] w-[88vw] max-w-[1280px]"
                      }
                    >
                      <Image
                        src={activeWork.image}
                        alt={activeWork.title || brandName}
                        fill
                        className={
                          previewMode === "cover"
                            ? "object-cover"
                            : "object-contain drop-shadow-[0_18px_48px_rgba(0,0,0,0.35)]"
                        }
                        sizes="100vw"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/80 via-black/24 to-transparent p-5 sm:p-6 lg:p-8">
                  <h3 className="text-xl font-medium text-white">
                    {activeWork.title || brandName}
                  </h3>

                  {activeWork.description && (
                    <p className="mt-1 max-w-3xl text-sm text-white/72 sm:text-base">
                      {activeWork.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )
      : null;

  return (
    <>
      <section className="relative mx-auto h-full w-full overflow-hidden rounded-[22px] border border-white/10 bg-white/5 px-4 pb-3 pt-4 backdrop-blur-xl sm:px-5 sm:pb-4 sm:pt-5 lg:px-6 lg:pb-4 lg:pt-5">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[8%] top-[10%] h-20 w-20 rounded-full bg-fuchsia-500/8 blur-3xl" />
          <div className="absolute right-[10%] top-[16%] h-24 w-24 rounded-full bg-violet-500/8 blur-3xl" />
          <div className="absolute bottom-[10%] left-[30%] h-20 w-20 rounded-full bg-blue-500/8 blur-3xl" />
        </div>

        <div className="relative z-10 flex h-full min-h-0 flex-col gap-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onBack}
                className="rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-[13px] text-white transition duration-300 hover:scale-[1.02] hover:bg-white/14"
              >
                Volver
              </button>

              <div>
                <p className="text-[8px] uppercase tracking-[0.22em] text-white/42">
                  Marca destacada
                </p>
                <h2 className="mt-1 text-[1.9rem] font-semibold leading-none text-white sm:text-[2.2rem] lg:text-[2.8rem]">
                  {brandName}
                </h2>
              </div>
            </div>

            {brandLogo && (
              <div className="relative h-8 w-24 shrink-0 opacity-90 lg:h-9 lg:w-28">
                <Image
                  src={brandLogo}
                  alt={brandName}
                  fill
                  className="object-contain"
                  sizes="112px"
                />
              </div>
            )}
          </div>

          <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[1fr_0.95fr]">
            <button
              type="button"
              onClick={openPreview}
              className="relative min-h-0 overflow-hidden rounded-[16px] border border-white/10 bg-[linear-gradient(180deg,rgba(0,0,0,0.26),rgba(0,0,0,0.18))] text-left"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeWork.image}
                  initial={{ opacity: 0, scale: 1.01, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.994, y: -4 }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                  className="relative h-[220px] w-full md:h-[280px] lg:h-[360px]"
                >
                  <Image
                    src={activeWork.image}
                    alt={activeWork.title || brandName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 48vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/28 to-transparent p-4">
                <h3 className="text-[15px] font-medium text-white sm:text-base">
                  {activeWork.title || brandName}
                </h3>

                {activeWork.description && (
                  <p className="mt-1 max-w-2xl text-[10px] leading-4 text-white/70 sm:text-[11px]">
                    {activeWork.description}
                  </p>
                )}

                <span className="mt-2 inline-flex rounded-full border border-white/15 bg-black/25 px-2 py-1 text-[10px] text-white/75">
                  Click para ampliar
                </span>
              </div>
            </button>

            <div className="flex min-h-0 flex-col gap-3">
              <div className="rounded-[16px] border border-white/10 bg-white/6 p-3.5">
                <p className="text-[8px] uppercase tracking-[0.22em] text-white/42">
                  Descripción
                </p>
                <p className="mt-2 text-[11px] leading-5 text-white/78 sm:text-[12px]">
                  {description}
                </p>
              </div>

              <div className="rounded-[16px] border border-white/10 bg-white/6 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-[8px] uppercase tracking-[0.22em] text-white/42">
                    Trabajos realizados
                  </p>

                  {safeWorks.length > PAGE_SIZE && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handlePrevPage}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-white/14 bg-white/8 text-[12px] text-white/80 transition hover:bg-white/14"
                        aria-label="Anterior"
                      >
                        ←
                      </button>

                      <button
                        type="button"
                        onClick={handleNextPage}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-white/14 bg-white/8 text-[12px] text-white/80 transition hover:bg-white/14"
                        aria-label="Siguiente"
                      >
                        →
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {pagedWorks.map((work, localIndex) => {
                    const globalIndex = page * PAGE_SIZE + localIndex;
                    const isActive = globalIndex === activeIndex;

                    return (
                      <button
                        key={`${work.image}-${globalIndex}`}
                        type="button"
                        onClick={() => setActiveIndex(globalIndex)}
                        className={`group flex min-h-[76px] items-center gap-3 overflow-hidden rounded-[12px] border px-2.5 py-2 text-left transition duration-300 ${
                          isActive
                            ? "border-white/28 bg-white/10"
                            : "border-white/10 bg-white/[0.03] hover:border-white/18 hover:bg-white/[0.06]"
                        }`}
                      >
                        <div className="relative h-12 w-14 shrink-0 overflow-hidden rounded-[10px] border border-white/8 bg-black/12">
                          <Image
                            src={work.image}
                            alt={work.title || `${brandName} ${globalIndex + 1}`}
                            fill
                            className="object-contain p-1 transition duration-300 group-hover:scale-[1.03]"
                            sizes="56px"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-[13px] leading-4 text-white/82">
                            {work.title || `Trabajo ${globalIndex + 1}`}
                          </p>

                          {isActive && (
                            <div className="mt-1 inline-flex rounded-full border border-white/20 bg-black/30 px-1.5 py-0.5 text-[7px] uppercase tracking-[0.14em] text-white/80">
                              Active
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {safeWorks.length > PAGE_SIZE && (
                  <div className="mt-2 text-right text-[10px] text-white/42">
                    {page + 1} / {totalPages}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {previewModal}
    </>
  );
}