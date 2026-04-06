"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

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

export default function BrandDetailsScene({
  brandName,
  brandLogo,
  description,
  works,
  onBack,
}: BrandDetailsSceneProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeWork = useMemo(() => {
    if (!works.length) {
      return {
        image: "/placeholder.jpg",
        title: "Sin trabajos cargados",
        description: "Aún no hay imágenes asociadas a esta marca.",
      };
    }

    return works[activeIndex];
  }, [works, activeIndex]);

  return (
    <section className="relative mx-auto min-h-[68vh] max-w-[1100px] overflow-hidden rounded-[26px] border border-white/10 bg-white/5 px-6 pt-10 pb-6 backdrop-blur-xl sm:px-8 sm:pt-12 sm:pb-7 lg:px-12 lg:pt-14 lg:pb-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[10%] h-32 w-32 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute right-[10%] top-[16%] h-36 w-36 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-[10%] left-[30%] h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex h-full flex-col gap-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-white transition duration-300 hover:scale-[1.03] hover:bg-white/14"
            >
              Volver
            </button>

            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/45">
                Marca destacada
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-white lg:text-4xl">
                {brandName}
              </h2>
            </div>
          </div>

          {brandLogo && (
            <div className="relative h-10 w-28 shrink-0 opacity-90">
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

        <div className="grid flex-1 gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-black/20">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeWork.image}
                initial={{ opacity: 0, scale: 1.03, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.99, y: -10 }}
                transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                className="relative h-[280px] w-full md:h-[360px] lg:h-[420px]"
              >
                <Image
                  src={activeWork.image}
                  alt={activeWork.title || brandName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4">
              <h3 className="text-lg font-medium text-white">
                {activeWork.title || brandName}
              </h3>
              {activeWork.description && (
                <p className="mt-1.5 max-w-2xl text-xs leading-5 text-white/72 sm:text-sm">
                  {activeWork.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-[20px] border border-white/10 bg-white/6 p-5">
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/45">
                Descripción
              </p>
              <p className="mt-3 text-xs leading-6 text-white/80 sm:text-sm">
                {description}
              </p>
            </div>

            <div className="rounded-[20px] border border-white/10 bg-white/6 p-4">
              <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-white/45">
                Trabajos realizados
              </p>

              <div className="grid grid-cols-2 gap-3">
                {works.map((work, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={`${work.image}-${index}`}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`group relative overflow-hidden rounded-[16px] border transition duration-300 ${
                        isActive
                          ? "border-white/30 scale-[1.01]"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="relative h-20 w-full sm:h-24">
                        <Image
                          src={work.image}
                          alt={work.title || `${brandName} ${index + 1}`}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="180px"
                        />
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {isActive && (
                        <div className="absolute right-2 top-2 rounded-full border border-white/20 bg-black/40 px-2 py-1 text-[9px] uppercase tracking-[0.18em] text-white/80">
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
  );
}