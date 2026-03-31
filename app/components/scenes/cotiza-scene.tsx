"use client";

import { motion } from "framer-motion";

type CotizaSceneProps = {
  onClose: () => void;
};

const serviceOptions = ["Neón", "Stands", "Impresión", "Volumétricas"];

const shellTransition = {
  duration: 0.36,
  ease: [0.22, 1, 0.36, 1] as const,
};

const cardTransition = {
  duration: 0.38,
  ease: [0.22, 1, 0.36, 1] as const,
};

export default function CotizaScene({ onClose }: CotizaSceneProps) {
  return (
    <section className="relative flex min-h-[calc(100vh-118px)] w-full items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.992 }}
        transition={shellTransition}
        className="relative mx-auto w-full max-w-[1180px] px-4 will-change-transform transform-gpu lg:px-6"
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-[10%] top-[8%] h-40 w-40 rounded-full bg-fuchsia-500/18 blur-3xl" />
          <div className="absolute bottom-[10%] right-[8%] h-44 w-44 rounded-full bg-violet-500/18 blur-3xl" />
          <div className="absolute left-1/2 top-[18%] h-28 w-28 -translate-x-1/2 rounded-full bg-white/8 blur-2xl" />
        </div>

        <div className="mb-5 flex items-start justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.04, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="will-change-transform transform-gpu"
          >
            <h2 className="omnes-title mt-4 text-2xl text-white lg:text-[2.45rem]">
              Cuéntanos tu proyecto
            </h2>

            <p className="omnes-text mt-2 max-w-[58ch] text-sm text-white/68 lg:text-base">
              Déjanos tus datos y selecciona el servicio que necesitas.
            </p>
          </motion.div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, x: -24, y: 10, scale: 0.992 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -12, y: -6, scale: 0.995 }}
            transition={{ delay: 0.08, ...cardTransition }}
            className="group relative overflow-hidden rounded-[30px] border border-white/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.035))] p-5 shadow-[0_18px_44px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md will-change-transform transform-gpu lg:p-6"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-10 top-10 h-28 w-28 rounded-full bg-violet-400/14 blur-3xl transition duration-500 group-hover:bg-violet-400/20" />
              <div className="absolute bottom-0 right-0 h-36 w-36 rounded-full bg-blue-400/10 blur-3xl transition duration-500 group-hover:bg-blue-400/18" />
            </div>

            <div className="relative [transform:translateZ(0)]">
              <p className="omnes-title mb-4 text-xs uppercase tracking-[0.18em] text-white/62">
                Datos de contacto
              </p>

              <form className="grid gap-3.5">
                <input
                  type="text"
                  placeholder="Nombre"
                  className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition duration-300 placeholder:text-white/32 focus:border-white/28 focus:bg-white/[0.07] focus:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_0_18px_rgba(143,92,255,0.12)]"
                />

                <input
                  type="tel"
                  placeholder="Teléfono"
                  className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition duration-300 placeholder:text-white/32 focus:border-white/28 focus:bg-white/[0.07] focus:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_0_18px_rgba(143,92,255,0.12)]"
                />

                <input
                  type="email"
                  placeholder="Correo"
                  className="h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition duration-300 placeholder:text-white/32 focus:border-white/28 focus:bg-white/[0.07] focus:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_0_18px_rgba(143,92,255,0.12)]"
                />

                <textarea
                  placeholder="Detalle cotización"
                  className="min-h-[110px] rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition duration-300 placeholder:text-white/32 focus:border-white/28 focus:bg-white/[0.07] focus:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_0_18px_rgba(143,92,255,0.12)]"
                />

                <div className="flex flex-wrap items-center gap-3 pt-1">
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
            initial={{ opacity: 0, x: 24, y: 10, scale: 0.992 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 12, y: -6, scale: 0.995 }}
            transition={{ delay: 0.12, ...cardTransition }}
            className="group relative overflow-hidden rounded-[30px] border border-white/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.085),rgba(255,255,255,0.03))] p-5 shadow-[0_18px_44px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md will-change-transform transform-gpu lg:p-6"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-fuchsia-400/14 blur-3xl transition duration-500 group-hover:bg-fuchsia-400/22" />
              <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-violet-500/12 blur-3xl transition duration-500 group-hover:bg-violet-500/18" />
            </div>

            <div className="relative [transform:translateZ(0)]">
              <p className="omnes-title mb-4 text-xs uppercase tracking-[0.18em] text-white/62">
                Selecciona un servicio
              </p>

              <div className="grid gap-3">
                {serviceOptions.map((item, index) => (
                  <motion.label
                    key={item}
                    initial={{ opacity: 0, x: 14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.16 + index * 0.05,
                      duration: 0.28,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group/option flex cursor-pointer items-center gap-3 rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white/82 transition duration-300 hover:-translate-y-[1px] hover:border-white/20 hover:bg-white/[0.08] hover:shadow-[0_8px_22px_rgba(167,110,255,0.10)]"
                  >
                    <input
                      type="radio"
                      name="service"
                      value={item}
                      className="h-4 w-4 accent-white"
                    />
                    <span className="omnes-title text-sm lg:text-[15px]">
                      {item}
                    </span>
                  </motion.label>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.26, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="mt-5 rounded-[22px] border border-white/10 bg-black/20 px-4 py-4"
              >
                <p className="omnes-text text-sm leading-relaxed text-white/62">
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