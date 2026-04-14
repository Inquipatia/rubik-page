"use client";

import { motion } from "framer-motion";

type CotizaSceneProps = {
  onClose: () => void;
};

const serviceOptions = ["Neón", "Stands", "Impresión", "Volumétricas", "Otros"];

const shellTransition = {
  duration: 0.62,
  ease: [0.16, 1, 0.3, 1] as const,
};

const cardTransition = {
  duration: 0.38,
  ease: [0.22, 1, 0.36, 1] as const,
};

export default function CotizaScene({ onClose }: CotizaSceneProps) {
  return (
    <section className="relative flex min-h-[calc(100vh-118px)] w-full items-start justify-center overflow-hidden px-4 pt-2 sm:pt-3 lg:px-6 lg:pt-4">
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.98, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -14, scale: 0.985, filter: "blur(8px)" }}
        transition={shellTransition}
        className="relative mx-auto w-full max-w-[860px] will-change-transform transform-gpu lg:max-w-[900px]"
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-[10%] top-[8%] h-20 w-20 rounded-full bg-fuchsia-500/12 blur-3xl" />
          <div className="absolute bottom-[10%] right-[8%] h-24 w-24 rounded-full bg-violet-500/12 blur-3xl" />
          <div className="absolute left-1/2 top-[18%] h-16 w-16 -translate-x-1/2 rounded-full bg-white/6 blur-2xl" />
        </div>

        <div className="mb-2.5 flex items-start justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.04,
              duration: 0.32,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="will-change-transform transform-gpu"
          >
            <h2 className="omnes-title text-[1.22rem] text-white lg:text-[1.55rem]">
              Cuéntanos tu proyecto
            </h2>

            <p className="omnes-text mt-1 max-w-[46ch] text-[11px] text-white/68 lg:text-[12px]">
              Déjanos tus datos y selecciona el servicio que necesitas.
            </p>
          </motion.div>
        </div>

        <div className="grid gap-2 lg:grid-cols-[1fr_0.94fr] lg:gap-2.5">
          <motion.div
            initial={{ opacity: 0, x: -20, y: 8, scale: 0.992 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, y: -4, scale: 0.995 }}
            transition={{ delay: 0.08, ...cardTransition }}
            className="group relative overflow-hidden rounded-[22px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.085),rgba(255,255,255,0.03))] p-3 shadow-[0_18px_40px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md will-change-transform transform-gpu lg:p-3.5"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-8 top-8 h-16 w-16 rounded-full bg-violet-400/10 blur-3xl transition duration-500 group-hover:bg-violet-400/14" />
              <div className="absolute bottom-0 right-0 h-20 w-20 rounded-full bg-blue-400/8 blur-3xl transition duration-500 group-hover:bg-blue-400/12" />
            </div>

            <div className="relative [transform:translateZ(0)]">
              <p className="omnes-title mb-2 text-[10px] uppercase tracking-[0.18em] text-white/62">
                Datos de contacto
              </p>

              <form className="grid gap-2">
                <input
                  type="text"
                  placeholder="Nombre"
                  className="h-[34px] rounded-[15px] border border-white/10 bg-black/20 px-3 text-[13px] text-white outline-none transition duration-300 placeholder:text-white/32 focus:border-white/24 focus:bg-white/[0.07] focus:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_0_16px_rgba(143,92,255,0.10)]"
                />

                <input
                  type="tel"
                  placeholder="Teléfono"
                  className="h-[34px] rounded-[15px] border border-white/10 bg-black/20 px-3 text-[13px] text-white outline-none transition duration-300 placeholder:text-white/32 focus:border-white/24 focus:bg-white/[0.07] focus:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_0_16px_rgba(143,92,255,0.10)]"
                />

                <input
                  type="email"
                  placeholder="Correo"
                  className="h-[34px] rounded-[15px] border border-white/10 bg-black/20 px-3 text-[13px] text-white outline-none transition duration-300 placeholder:text-white/32 focus:border-white/24 focus:bg-white/[0.07] focus:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_0_16px_rgba(143,92,255,0.10)]"
                />

                <textarea
                  placeholder="Detalle cotización"
                  className="min-h-[74px] rounded-[15px] border border-white/10 bg-black/20 px-3 py-2.5 text-[13px] text-white outline-none transition duration-300 placeholder:text-white/32 focus:border-white/24 focus:bg-white/[0.07] focus:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_0_16px_rgba(143,92,255,0.10)]"
                />

                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <button type="submit" className="menu-shell">
                    <span className="menu-pill is-active cotiza-pill">
                      Enviar solicitud
                    </span>
                  </button>

                  <button type="button" onClick={onClose} className="menu-shell">
                    <span className="menu-pill">Regresar</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20, y: 8, scale: 0.992 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, y: -4, scale: 0.995 }}
            transition={{ delay: 0.12, ...cardTransition }}
            className="group relative overflow-hidden rounded-[22px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.028))] p-3 shadow-[0_18px_40px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md will-change-transform transform-gpu lg:p-3.5"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-fuchsia-400/10 blur-3xl transition duration-500 group-hover:bg-fuchsia-400/16" />
              <div className="absolute bottom-0 left-0 h-16 w-16 rounded-full bg-violet-500/8 blur-3xl transition duration-500 group-hover:bg-violet-500/12" />
            </div>

            <div className="relative [transform:translateZ(0)]">
              <p className="omnes-title mb-2 text-[10px] uppercase tracking-[0.18em] text-white/62">
                Selecciona un servicio
              </p>

              <div className="grid gap-2">
                {serviceOptions.map((item, index) => (
                  <motion.label
                    key={item}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.16 + index * 0.05,
                      duration: 0.28,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group/option flex cursor-pointer items-center gap-2 rounded-[15px] border border-white/10 bg-white/[0.04] px-3 py-2 text-white/82 transition duration-300 hover:-translate-y-[1px] hover:border-white/18 hover:bg-white/[0.08] hover:shadow-[0_8px_18px_rgba(167,110,255,0.08)]"
                  >
                    <input
                      type="radio"
                      name="service"
                      value={item}
                      className="h-3.5 w-3.5 accent-white"
                    />
                    <span className="omnes-title text-[13px] lg:text-[14px]">
                      {item}
                    </span>
                  </motion.label>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.26,
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-2.5 rounded-[15px] border border-white/10 bg-black/20 px-3 py-2.5"
              >
                <p className="omnes-text text-[12px] leading-relaxed text-white/62">
                  Elige el tipo de trabajo para orientar mejor la cotización y
                  preparar una propuesta visual más precisa.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}