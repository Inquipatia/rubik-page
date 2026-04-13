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
    <section className="relative mx-auto min-h-[52vh] max-w-[900px] overflow-hidden rounded-[20px] border border-white/10 bg-white/5 px-4 pt-4 pb-3 backdrop-blur-xl sm:px-5 sm:pt-5 sm:pb-4 lg:px-6 lg:pt-5 lg:pb-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[10%] h-20 w-20 rounded-full bg-fuchsia-500/8 blur-3xl" />
        <div className="absolute right-[10%] top-[16%] h-24 w-24 rounded-full bg-violet-500/8 blur-3xl" />
        <div className="absolute bottom-[10%] left-[30%] h-20 w-20 rounded-full bg-blue-500/8 blur-3xl" />
      </div>

      <div className="relative z-10 flex h-full flex-col gap-3">
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
            <div className="relative h-8 w-24 shrink-0 opacity-90 lg:h-9 lg:w-26">
              <Image
                src={brandLogo}
                alt={brandName}
                fill
                className="object-contain"
                sizes="104px"
              />
            </div>
          )}
        </div>

        <div className="grid flex-1 gap-3 lg:grid-cols-[1fr_0.95fr]">
          <div className="relative overflow-hidden rounded-[16px] border border-white/10 bg-[linear-gradient(180deg,rgba(0,0,0,0.26),rgba(0,0,0,0.18))]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeWork.image}
                initial={{ opacity: 0, scale: 1.015, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.992, y: -6 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="relative h-[170px] w-full md:h-[220px] lg:h-[250px]"
              >
                <Image
                  src={activeWork.image}
                  alt={activeWork.title || brandName}
                  fill
                  className="object-contain p-4 sm:p-5"
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/24 to-transparent p-3">
              <h3 className="text-[15px] font-medium text-white sm:text-base">
                {activeWork.title || brandName}
              </h3>
              {activeWork.description && (
                <p className="mt-1 max-w-2xl text-[10px] leading-4 text-white/70 sm:text-[11px] sm:leading-4.5">
                  {activeWork.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="rounded-[16px] border border-white/10 bg-white/6 p-3.5">
              <p className="text-[8px] uppercase tracking-[0.22em] text-white/42">
                Descripción
              </p>
              <p className="mt-2 text-[11px] leading-5 text-white/78 sm:text-[12px] sm:leading-5.5">
                {description}
              </p>
            </div>

            <div className="rounded-[16px] border border-white/10 bg-white/6 p-3">
              <p className="mb-2 text-[8px] uppercase tracking-[0.22em] text-white/42">
                Trabajos realizados
              </p>

              <div className="grid grid-cols-2 gap-2">
                {works.map((work, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={`${work.image}-${index}`}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`group relative overflow-hidden rounded-[12px] border transition duration-300 ${
                        isActive
                          ? "border-white/28 scale-[1.01]"
                          : "border-white/10 hover:border-white/18"
                      }`}
                    >
                      <div className="relative h-14 w-full bg-black/10 sm:h-16">
                        <Image
                          src={work.image}
                          alt={work.title || `${brandName} ${index + 1}`}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="150px"
                        />
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                      {isActive && (
                        <div className="absolute right-1.5 top-1.5 rounded-full border border-white/20 bg-black/40 px-1.5 py-0.5 text-[7px] uppercase tracking-[0.14em] text-white/80">
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