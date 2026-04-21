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

const WORKS_PER_PAGE = 4;

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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [previewMode, setPreviewMode] = useState<"cover" | "contain">("contain");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
    setIsPreviewOpen(false);
    setPreviewMode("contain");
  }, [brandName]);

  useEffect(() => {
    if (!isClient) return;

    const previousOverflow = document.body.style.overflow;

    if (isPreviewOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isClient, isPreviewOpen]);

  const totalPages = Math.max(1, Math.ceil(safeWorks.length / WORKS_PER_PAGE));
  const currentPage = Math.floor(activeIndex / WORKS_PER_PAGE);

  const visibleWorks = useMemo(() => {
    const start = currentPage * WORKS_PER_PAGE;
    return safeWorks.slice(start, start + WORKS_PER_PAGE);
  }, [safeWorks, currentPage]);

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

  const goToPage = (page: number) => {
    if (!safeWorks.length) return;

    const safePage = Math.max(0, Math.min(page, totalPages - 1));
    const nextIndex = safePage * WORKS_PER_PAGE;

    setActiveIndex(Math.min(nextIndex, safeWorks.length - 1));
  };

  const handlePrevPage = () => {
    if (totalPages <= 1) return;
    goToPage(currentPage === 0 ? totalPages - 1 : currentPage - 1);
  };

  const handleNextPage = () => {
    if (totalPages <= 1) return;
    goToPage(currentPage === totalPages - 1 ? 0 : currentPage + 1);
  };

  const handlePrevImage = () => {
    if (!safeWorks.length) return;
    setActiveIndex((prev) => (prev - 1 + safeWorks.length) % safeWorks.length);
  };

  const handleNextImage = () => {
    if (!safeWorks.length) return;
    setActiveIndex((prev) => (prev + 1) % safeWorks.length);
  };

  const openPreview = () => {
    setPreviewMode("contain");
    setIsPreviewOpen(true);
  };

  const handleSelectWork = (index: number) => {
    setActiveIndex(index);
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
              transition={{ duration: 0.22 }}
              className="fixed inset-0 z-[220] bg-[rgba(6,3,18,0.9)]"
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
                    className="object-cover scale-110 opacity-20 blur-3xl"
                    sizes="100vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(32,18,60,0.12)_0%,rgba(12,7,24,0.62)_58%,rgba(4,2,10,0.92)_100%)]" />
                </div>

                <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between p-4 sm:p-5 lg:p-6">
                  <div className="omnes-text rounded-full border border-white/12 bg-black/20 px-4 py-2 text-sm text-white/82 backdrop-blur">
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
                      className="omnes-text rounded-full border border-white/15 bg-black/28 px-4 py-2 text-sm text-white/88 backdrop-blur transition hover:bg-black/40"
                    >
                      {previewMode === "cover" ? "Ver completa" : "Llenar pantalla"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsPreviewOpen(false)}
                      className="omnes-text rounded-full border border-white/15 bg-black/28 px-4 py-2 text-sm text-white/88 backdrop-blur transition hover:bg-black/40"
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

                <div className="relative z-20 flex h-full w-full items-center justify-center px-4 py-20 sm:px-8 lg:px-12">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${activeWork.image}-${previewMode}`}
                      initial={{ opacity: 0, scale: 1.01 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.99 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className={
                        previewMode === "cover"
                          ? "relative h-full w-full overflow-hidden rounded-[24px]"
                          : "relative h-[78vh] w-[90vw] max-w-[1360px] overflow-hidden rounded-[24px] bg-[#05070d]"
                      }
                    >
                      <Image
                        src={activeWork.image}
                        alt={activeWork.title || brandName}
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
                  <h3 className="omnes-title text-[1.5rem] tracking-[-0.03em] text-white sm:text-[1.65rem]">
                    {activeWork.title || brandName}
                  </h3>

                  {activeWork.description && (
                    <p className="omnes-text mt-1 max-w-3xl text-sm text-white/82 sm:text-base">
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
      <div className="relative h-full w-full">
        <button
          type="button"
          aria-label="Volver a marcas"
          onClick={onBack}
          className="absolute inset-0 z-0 block h-full w-full cursor-default bg-transparent"
        />

        <section
          className="relative z-10 mx-auto h-full w-full max-w-[1040px] overflow-hidden rounded-[24px] border border-white/12 bg-white/[0.045] px-4 pb-4 pt-4 backdrop-blur-xl sm:px-5 sm:pb-5 sm:pt-5 lg:px-6 lg:pb-5 lg:pt-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[8%] top-[10%] h-24 w-24 rounded-full bg-fuchsia-500/8 blur-3xl" />
            <div className="absolute right-[10%] top-[16%] h-24 w-24 rounded-full bg-violet-500/8 blur-3xl" />
            <div className="absolute bottom-[10%] left-[30%] h-24 w-24 rounded-full bg-blue-500/8 blur-3xl" />
          </div>

          <div className="relative z-10 flex h-full min-h-0 flex-col gap-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBack();
                  }}
                  className="omnes-text rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-[13px] text-white/88 transition duration-300 hover:scale-[1.02] hover:bg-white/14"
                >
                  Volver
                </button>

                <div>
                  <p className="omnes-text text-[10px] uppercase tracking-[0.16em] text-white/45">
                    Marca destacada
                  </p>
                  <h2 className="omnes-title mt-2 text-[2.05rem] leading-none tracking-[-0.03em] text-white sm:text-[2.35rem] lg:text-[2.9rem]">
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

            <div className="grid min-h-0 flex-1 items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.72fr)]">
              <button
                type="button"
                onClick={openPreview}
                className="group relative block min-h-[420px] overflow-hidden rounded-[22px] border border-white/12 bg-[#05070d] text-left lg:h-[689px] lg:min-h-0"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeWork.image}
                    initial={{ opacity: 0.22, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0.18, scale: 0.985 }}
                    transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={activeWork.image}
                      alt={activeWork.title || brandName}
                      fill
                      className="object-contain object-center"
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.26))]" />

                <div className="omnes-text absolute right-4 top-4 z-20 rounded-full border border-white/14 bg-black/35 px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-white/88">
                  Ampliar
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5">
                  <h3 className="omnes-title text-[1.95rem] tracking-[-0.03em] text-white sm:text-[2.05rem] lg:text-[2.15rem]">
                    {activeWork.title || brandName}
                  </h3>

                  {activeWork.description && (
                    <p className="omnes-text mt-1.5 text-[13px] text-white/84 sm:text-[13.5px]">
                      {activeWork.description}
                    </p>
                  )}
                </div>
              </button>

              <div className="flex min-h-[420px] flex-col gap-4 lg:h-[689px] lg:min-h-0">
                <div className="shrink-0 rounded-[18px] border border-white/12 bg-white/[0.055] p-4 lg:h-[328px]">
                  <p className="omnes-text text-[10px] uppercase tracking-[0.16em] text-white/45">
                    Descripción
                  </p>

                  <div className="mt-3 h-[calc(100%-20px)] overflow-hidden">
                    <p className="omnes-text text-[13px] leading-7 text-white/84 sm:text-[13.5px] lg:text-[14px]">
                      {description}
                    </p>
                  </div>
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[18px] border border-white/12 bg-white/[0.055] p-3.5">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <p className="omnes-text text-[10px] uppercase tracking-[0.16em] text-white/45">
                      Trabajos realizados
                    </p>

                    {totalPages > 1 && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handlePrevPage}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/14 bg-white/8 text-[12px] text-white/80 transition hover:bg-white/14"
                          aria-label="Página anterior"
                        >
                          ←
                        </button>

                        <button
                          type="button"
                          onClick={handleNextPage}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/14 bg-white/8 text-[12px] text-white/80 transition hover:bg-white/14"
                          aria-label="Página siguiente"
                        >
                          →
                        </button>
                      </div>
                    )}
                  </div>

                  {safeWorks.length > 0 && (
                    <div className="omnes-text mb-3 flex items-center justify-between text-[10px] text-white/48">
                      <span>
                        Página {currentPage + 1} / {totalPages}
                      </span>
                      <span>
                        {activeIndex + 1} / {safeWorks.length}
                      </span>
                    </div>
                  )}

                  <div className="grid min-h-0 flex-1 grid-cols-2 content-start gap-2.5">
                    {visibleWorks.map((work, localIndex) => {
                      const realIndex = currentPage * WORKS_PER_PAGE + localIndex;
                      const isActive = realIndex === activeIndex;

                      return (
                        <button
                          key={`${work.image}-${realIndex}`}
                          type="button"
                          onClick={() => handleSelectWork(realIndex)}
                          aria-label={work.title || `Trabajo ${realIndex + 1}`}
                          className={`group relative overflow-hidden rounded-[14px] border transition duration-300 ${
                            isActive
                              ? "border-white/28 bg-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]"
                              : "border-white/10 bg-white/[0.03] hover:border-white/18 hover:bg-white/[0.06]"
                          }`}
                        >
                          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[14px] bg-black/20">
                            <Image
                              src={work.image}
                              alt={work.title || `${brandName} ${realIndex + 1}`}
                              fill
                              className="scale-[1.02] object-cover object-center transition duration-300 group-hover:scale-[1.05]"
                              sizes="(max-width: 640px) 100vw, 14vw"
                            />
                          </div>

                          {isActive && (
                            <div className="pointer-events-none absolute bottom-2 right-2 inline-flex rounded-full border border-white/20 bg-black/40 px-1.5 py-0.5 text-[7px] uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm">
                              Active
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {previewModal}
    </>
  );
}