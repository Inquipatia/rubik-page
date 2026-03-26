"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "@/app/data/projects";

type WorkSceneProps = {
  activeWorkCard: number;
};

export default function WorkScene({ activeWorkCard }: WorkSceneProps) {
  const [hoveredIndex, setHoveredIndex] = useState(activeWorkCard);

 

  const activeProject = projects[hoveredIndex];

  return (
    <section className="grid min-h-[66vh] grid-cols-1 items-start gap-6 lg:grid-cols-[0.82fr_1.18fr]">
      {/* IZQUIERDA: MENU */}
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
                onMouseEnter={() => setHoveredIndex(index)}
                onFocus={() => setHoveredIndex(index)}
                className={`group flex w-full items-center justify-between rounded-[20px] border px-5 py-4 text-left transition-all duration-300 ${isActive
                    ? "border-white/20 bg-white/10 shadow-[0_10px_28px_rgba(0,0,0,0.22)]"
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

      {/* DERECHA: PREVIEW */}
      <div className="flex flex-col items-center gap-4">
        {/* CAJA SUPERIOR */}
        <div className="w-full max-w-[620px] rounded-[20px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_16px_36px_rgba(0,0,0,0.22)] backdrop-blur-xl">
          <div className="text-[11px] uppercase tracking-[0.16em] text-white/40">
            {activeProject.tag}
          </div>

          <p className="mt-3 text-[15px] leading-7 text-white/68">
            {activeProject.description}
          </p>

          <div className="mt-3 text-sm text-white/42">
            Hover sobre cada servicio para cambiar la visual.
          </div>
        </div>

        {/* CAJA VISUAL */}
        <div className="relative w-full max-w-[620px] overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-3 shadow-[0_18px_54px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-black/20">
            <div className="relative aspect-[16/9] w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject.slug}
                  initial={{ opacity: 0, scale: 1.03, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.985, filter: "blur(8px)" }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={activeProject.image}
                    alt={activeProject.title}
                    fill
                    className="object-cover"
                    priority
                  />

                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.45))]" />

                  <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4">
                    <div className="rounded-full border border-white/15 bg-black/25 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-white/80 backdrop-blur">
                      Rubik Creaciones
                    </div>

                    <div className="rounded-full border border-white/15 bg-black/25 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-white/80 backdrop-blur">
                      {activeProject.tag}
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <div className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-[3rem]">
                      {activeProject.title}
                    </div>

                    <div className="mt-2 text-base text-white/75">
                      {activeProject.subtitle}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}