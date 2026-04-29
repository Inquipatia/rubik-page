"use client";

import { motion, type Variants } from "framer-motion";
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa6";
import { Mail, Phone, MapPin, Clock3 } from "lucide-react";

const headerContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const headerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: "blur(14px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.45,
    },
  },
};

const cardVariants: Variants = {
  hidden: (direction: "left" | "center" | "right") => ({
    opacity: 0,
    x: direction === "left" ? -34 : direction === "right" ? 34 : 0,
    y: direction === "center" ? 34 : 18,
    scale: 0.965,
    filter: "blur(18px)",
  }),
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const innerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
    filter: "blur(8px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

type NeonCardProps = {
  children: React.ReactNode;
  accent: "violet" | "white" | "fuchsia";
  hoverBorder?: string;
};

function NeonCard({ children, accent, hoverBorder }: NeonCardProps) {
  const theme = {
    violet: {
      border: "border-violet-200/18",
      hoverBorder: hoverBorder ?? "hover:border-violet-300/52",
      glow1: "rgba(139,92,246,0.9)",
      glow2: "rgba(59,130,246,0.66)",
      glow3: "rgba(196,181,253,0.88)",
      aura:
        "radial-gradient(circle at 18% 14%, rgba(139,92,246,0.2), transparent 30%), radial-gradient(circle at 84% 100%, rgba(59,130,246,0.14), transparent 36%)",
      orb: "bg-violet-400/24",
      topLine: "via-violet-200",
      topShadow:
        "0 0 12px rgba(196,181,253,0.82), 0 0 26px rgba(139,92,246,0.48), 0 0 48px rgba(59,130,246,0.24)",
      frameShadow:
        "0 0 0 1px rgba(196,181,253,0.22), inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 0 18px rgba(139,92,246,0.05), 0 0 14px rgba(139,92,246,0.12), 0 0 42px rgba(59,130,246,0.1)",
      neonGradient:
        "linear-gradient(135deg, rgba(196,181,253,0.9), rgba(139,92,246,0.84), rgba(59,130,246,0.8))",
      bloom:
        "radial-gradient(circle at 20% 15%, rgba(139,92,246,0.16), transparent 30%), radial-gradient(circle at 80% 85%, rgba(59,130,246,0.12), transparent 34%)",
    },
    white: {
      border: "border-white/16",
      hoverBorder: hoverBorder ?? "hover:border-white/30",
      glow1: "rgba(255,255,255,0.86)",
      glow2: "rgba(196,181,253,0.48)",
      glow3: "rgba(255,255,255,0.84)",
      aura:
        "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.12), transparent 30%), radial-gradient(circle at 50% 100%, rgba(196,181,253,0.08), transparent 32%)",
      orb: "bg-white/16",
      topLine: "via-white/95",
      topShadow:
        "0 0 12px rgba(255,255,255,0.5), 0 0 26px rgba(255,255,255,0.22), 0 0 44px rgba(196,181,253,0.16)",
      frameShadow:
        "0 0 0 1px rgba(255,255,255,0.18), inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 0 16px rgba(255,255,255,0.04), 0 0 14px rgba(255,255,255,0.08), 0 0 42px rgba(196,181,253,0.08)",
      neonGradient:
        "linear-gradient(135deg, rgba(255,255,255,0.94), rgba(255,255,255,0.8), rgba(196,181,253,0.72))",
      bloom:
        "radial-gradient(circle at 50% 10%, rgba(255,255,255,0.11), transparent 30%), radial-gradient(circle at 50% 90%, rgba(196,181,253,0.08), transparent 34%)",
    },
    fuchsia: {
      border: "border-fuchsia-200/18",
      hoverBorder: hoverBorder ?? "hover:border-fuchsia-300/52",
      glow1: "rgba(236,72,153,0.88)",
      glow2: "rgba(217,70,239,0.62)",
      glow3: "rgba(251,207,232,0.86)",
      aura:
        "radial-gradient(circle at 82% 14%, rgba(244,114,182,0.2), transparent 30%), radial-gradient(circle at 10% 100%, rgba(217,70,239,0.14), transparent 36%)",
      orb: "bg-fuchsia-400/24",
      topLine: "via-fuchsia-200",
      topShadow:
        "0 0 12px rgba(251,207,232,0.8), 0 0 28px rgba(236,72,153,0.48), 0 0 48px rgba(217,70,239,0.24)",
      frameShadow:
        "0 0 0 1px rgba(251,207,232,0.2), inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 0 18px rgba(236,72,153,0.05), 0 0 14px rgba(236,72,153,0.12), 0 0 42px rgba(217,70,239,0.1)",
      neonGradient:
        "linear-gradient(135deg, rgba(251,207,232,0.88), rgba(236,72,153,0.84), rgba(217,70,239,0.8))",
      bloom:
        "radial-gradient(circle at 80% 16%, rgba(244,114,182,0.18), transparent 30%), radial-gradient(circle at 16% 84%, rgba(217,70,239,0.14), transparent 34%)",
    },
  }[accent];

  return (
    <div
      className={`relative flex h-full min-h-[260px] flex-col overflow-hidden rounded-[20px] border ${theme.border} bg-[linear-gradient(180deg,rgba(16,16,26,0.98),rgba(8,8,14,1))] p-5 shadow-[0_14px_34px_rgba(0,0,0,0.26)] transition-all duration-300 xl:min-h-[360px] xl:rounded-[24px] xl:p-6 2xl:min-h-[390px] ${theme.hoverBorder}`}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[18px]"
        style={{ boxShadow: theme.frameShadow }}
      />

      <div
        className="pointer-events-none absolute inset-0 rounded-[18px]"
        style={{
          padding: "1px",
          background: theme.neonGradient,
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          filter: `drop-shadow(0 0 3px ${theme.glow3}) drop-shadow(0 0 7px ${theme.glow1}) drop-shadow(0 0 14px ${theme.glow2})`,
          opacity: 0.88,
        }}
      />

      <div
        className="pointer-events-none absolute -inset-[1px] rounded-[20px]"
        style={{
          background: theme.bloom,
          filter: "blur(10px)",
        }}
      />

      <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.10) 0.6px, transparent 0.6px)",
            backgroundSize: "14px 14px",
            backgroundPosition: "0 0",
          }}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: theme.aura }}
      />

      <motion.div
        className={`pointer-events-none absolute top-0 h-16 w-16 rounded-full ${theme.orb} blur-3xl ${
          accent === "violet" ? "-left-5" : "right-0"
        }`}
        animate={{
          x: accent === "violet" ? [0, 4, 0] : [0, -4, 0],
          y: [0, -3, 0],
          opacity: [0.4, 0.72, 0.4],
        }}
        transition={{
          duration:
            accent === "fuchsia" ? 5.2 : accent === "white" ? 5.8 : 5.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className={`pointer-events-none absolute inset-x-4 top-0 h-[2px] rounded-full bg-gradient-to-r from-transparent ${theme.topLine} to-transparent`}
        animate={{
          opacity: [0.62, 0.9, 0.62],
          scaleX: [0.96, 1, 0.96],
        }}
        transition={{
          duration:
            accent === "fuchsia" ? 3.2 : accent === "white" ? 3.6 : 3.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          boxShadow: theme.topShadow,
        }}
      />

      <div
        className="pointer-events-none absolute inset-[6px] rounded-[14px]"
        style={{
          border: "1px solid rgba(255,255,255,0.05)",
          boxShadow:
            accent === "violet"
              ? "inset 0 0 10px rgba(196,181,253,0.06)"
              : accent === "white"
              ? "inset 0 0 10px rgba(255,255,255,0.04)"
              : "inset 0 0 10px rgba(251,207,232,0.05)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default function ContactScene() {
  return (
    <section className="relative flex min-h-[58vh] items-center justify-center py-4 xl:min-h-[68vh] 2xl:min-h-[72vh]">
      <div className="w-full max-w-[1380px] px-4 sm:px-5 xl:px-8">
        <motion.div
          variants={headerContainerVariants}
          initial="hidden"
          animate="show"
          className="mb-5 text-center xl:mb-6"
        >
          <motion.div
            variants={headerItemVariants}
            className="omnes-text inline-flex rounded-full border border-white/14 bg-white/[0.05] px-3 py-1 text-[8px] uppercase tracking-[0.15em] text-white/74 backdrop-blur xl:px-4 xl:py-1.5 xl:text-[9px]"
          >
            Contacto
          </motion.div>

          <div className="mt-3 overflow-hidden">
            <motion.h2
              variants={headerItemVariants}
              className="omnes-title text-[clamp(2rem,3.4vw,3.85rem)] leading-[1.02] tracking-[-0.05em] text-white"
            >
              Hablemos de tu próximo proyecto
            </motion.h2>
          </div>

          <motion.p
            variants={headerItemVariants}
            className="omnes-text mx-auto mt-3 max-w-[620px] text-[13px] leading-6 text-white/70 sm:text-[14px] xl:text-[15px]"
          >
            Cuéntanos qué necesitas desarrollar y te ayudamos a convertirlo en
            una solución gráfica clara, producible y lista para ejecutarse.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3 xl:gap-5"
        >
          <motion.div
            custom="left"
            variants={cardVariants}
            whileHover={{
              y: -5,
              scale: 1.006,
              transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
            }}
            className="group [transform:translateZ(0)] will-change-transform"
          >
            <NeonCard accent="violet">
              <motion.div
                variants={innerVariants}
                initial="hidden"
                animate="show"
                className="relative"
              >
                <motion.div
                  variants={itemVariants}
                  className="flex items-start justify-between gap-3"
                >
                  <div className="omnes-text text-[8px] uppercase tracking-[0.15em] text-white/54 xl:text-[9px]">
                    INFORMACIÓN
                  </div>

                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-violet-200/28 bg-violet-400/18 text-violet-100 xl:h-10 xl:w-10"
                    style={{
                      boxShadow:
                        "0 0 6px rgba(196,181,253,0.34), 0 0 12px rgba(139,92,246,0.24), inset 0 0 8px rgba(196,181,253,0.1)",
                    }}
                  >
                    <MapPin size={15} />
                  </div>
                </motion.div>

                <div className="mt-4 space-y-4 xl:mt-4.5 xl:space-y-4.5">
                  <motion.div variants={itemVariants}>
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-violet-200/28 bg-violet-400/18 text-violet-100 xl:h-11 xl:w-11"
                        style={{
                          boxShadow:
                            "0 0 6px rgba(196,181,253,0.34), 0 0 12px rgba(139,92,246,0.24), inset 0 0 8px rgba(196,181,253,0.1)",
                        }}
                      >
                        <MapPin size={15} />
                      </div>

                      <div className="omnes-title text-[1.15rem] leading-none text-white xl:text-[1.3rem]">
                        Ubicación
                      </div>
                    </div>

                    <a
                      href="https://maps.app.goo.gl/6JbPNCg9zs2NQCWM9"
                      target="_blank"
                      rel="noreferrer"
                      className="omnes-text mt-2.5 block text-[12px] leading-5 text-white/80 transition hover:text-white xl:text-[13px]"
                    >
                      Abre nuestra ubicación en Google Maps ↗
                    </a>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="h-px w-full bg-white/10"
                  />

                  <motion.div variants={itemVariants}>
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-violet-200/28 bg-violet-400/18 text-violet-100 xl:h-11 xl:w-11"
                        style={{
                          boxShadow:
                            "0 0 6px rgba(196,181,253,0.34), 0 0 12px rgba(139,92,246,0.24), inset 0 0 8px rgba(196,181,253,0.1)",
                        }}
                      >
                        <Clock3 size={15} />
                      </div>

                      <div className="omnes-title text-[1.15rem] leading-none text-white xl:text-[1.3rem]">
                        Horario
                      </div>
                    </div>

                    <div className="mt-3 space-y-2.5">
                      {[
                        ["Lunes — Jueves", "09:00 — 19:00"],
                        ["Viernes", "09:00 — 18:00"],
                        ["Sábados — Domingos", "Cerrado"],
                      ].map(([day, hour]) => (
                        <motion.div
                          key={day}
                          variants={itemVariants}
                          whileHover={{ x: 3 }}
                          className="rounded-[13px] border border-violet-200/22 bg-[linear-gradient(180deg,rgba(139,92,246,0.16),rgba(255,255,255,0.05))] px-3.5 py-3"
                        >
                          <div className="omnes-text text-[11px] text-white/88 xl:text-[12px]">
                            {day}
                          </div>
                          <div className="omnes-text mt-0.5 text-[11px] text-white/68 xl:text-[12px]">
                            {hour}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </NeonCard>
          </motion.div>

          <motion.div
            custom="center"
            variants={cardVariants}
            whileHover={{
              y: -5,
              scale: 1.006,
              transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
            }}
            className="group [transform:translateZ(0)] will-change-transform"
          >
            <NeonCard accent="white">
              <motion.div
                variants={innerVariants}
                initial="hidden"
                animate="show"
                className="relative"
              >
                <motion.div
                  variants={itemVariants}
                  className="flex items-start justify-between gap-3"
                >
                  <div className="omnes-text text-[8px] uppercase tracking-[0.15em] text-white/54 xl:text-[9px]">
                    DIRECTO
                  </div>

                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/22 bg-white/[0.09] text-white/90 xl:h-10 xl:w-10"
                    style={{
                      boxShadow:
                        "0 0 6px rgba(255,255,255,0.22), 0 0 12px rgba(255,255,255,0.1), inset 0 0 8px rgba(255,255,255,0.07)",
                    }}
                  >
                    <Phone size={15} />
                  </div>
                </motion.div>

                <div className="mt-4 space-y-4 xl:mt-4.5 xl:space-y-4.5">
                  <motion.div variants={itemVariants}>
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/22 bg-white/[0.09] text-white/90 xl:h-11 xl:w-11"
                        style={{
                          boxShadow:
                            "0 0 6px rgba(255,255,255,0.22), 0 0 12px rgba(255,255,255,0.1), inset 0 0 8px rgba(255,255,255,0.07)",
                        }}
                      >
                        <Phone size={15} />
                      </div>

                      <div className="omnes-title text-[1.15rem] leading-none text-white xl:text-[1.3rem]">
                        Celular
                      </div>
                    </div>

                    <a
                      href="tel:+56991330559"
                      className="omnes-text mt-2.5 block text-[12px] leading-5 text-white/84 transition hover:text-white xl:text-[13px]"
                    >
                      +56 9 9133 0559
                    </a>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="h-px w-full bg-white/10"
                  />

                  <motion.div variants={itemVariants}>
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/22 bg-white/[0.09] text-white/90 xl:h-11 xl:w-11"
                        style={{
                          boxShadow:
                            "0 0 6px rgba(255,255,255,0.22), 0 0 12px rgba(255,255,255,0.1), inset 0 0 8px rgba(255,255,255,0.07)",
                        }}
                      >
                        <Mail size={15} />
                      </div>

                      <div className="omnes-title text-[1.15rem] leading-none text-white xl:text-[1.3rem]">
                        Email
                      </div>
                    </div>

                    <a
                      href="mailto:rubik@rubikcreaciones.cl"
                      className="omnes-text mt-2.5 block break-all text-[12px] leading-5 text-white/84 transition hover:text-white xl:text-[13px]"
                    >
                      rubik@rubikcreaciones.cl
                    </a>
                  </motion.div>
                </div>
              </motion.div>
            </NeonCard>
          </motion.div>

          <motion.div
            custom="right"
            variants={cardVariants}
            whileHover={{
              y: -5,
              scale: 1.006,
              transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
            }}
            className="group [transform:translateZ(0)] will-change-transform"
          >
            <NeonCard accent="fuchsia">
              <motion.div
                variants={innerVariants}
                initial="hidden"
                animate="show"
                className="relative"
              >
                <motion.div
                  variants={itemVariants}
                  className="flex items-start justify-between gap-3"
                >
                  <div className="omnes-text text-[8px] uppercase tracking-[0.15em] text-white/54 xl:text-[9px]">
                    CANALES
                  </div>

                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-fuchsia-200/24 bg-fuchsia-400/18 text-fuchsia-100 xl:h-10 xl:w-10"
                    style={{
                      boxShadow:
                        "0 0 6px rgba(251,207,232,0.24), 0 0 12px rgba(236,72,153,0.18), inset 0 0 8px rgba(244,114,182,0.08)",
                    }}
                  >
                    <FaInstagram size={15} />
                  </div>
                </motion.div>

                <div className="mt-4">
                  <motion.div
                    variants={itemVariants}
                    className="omnes-title text-[1.15rem] leading-none text-white xl:text-[1.3rem]"
                  >
                    Redes Sociales
                  </motion.div>

                  <div className="mt-3 grid grid-cols-1 gap-2.5 xl:gap-3">
                    {[
                      {
                        href: "https://instagram.com/rubikcreaciones.cl",
                        label: "Instagram",
                        icon: <FaInstagram size={13} />,
                      },
                      {
                        href: "https://web.facebook.com/profile.php?id=100083381976669",
                        label: "Facebook",
                        icon: <FaFacebookF size={13} />,
                      },
                      {
                        href: "https://tiktok.com/@rubikcreaciones",
                        label: "TikTok",
                        icon: <FaTiktok size={13} />,
                      },
                      {
                        href: "https://www.linkedin.com/in/rubik-creaciones-9b13063b5/",
                        label: "LinkedIn",
                        icon: <FaLinkedinIn size={13} />,
                      },
                      {
                        href: "https://wa.me/56991330559",
                        label: "WhatsApp",
                        icon: <FaWhatsapp size={13} />,
                      },
                    ].map((item) => (
                      <motion.a
                        key={item.label}
                        variants={itemVariants}
                        whileHover={{ x: 5, scale: 1.01 }}
                        transition={{
                          duration: 0.18,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 rounded-[13px] border border-fuchsia-200/22 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04))] px-3.5 py-2.5 transition duration-300 hover:border-fuchsia-200/38 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.13),rgba(255,255,255,0.05))] xl:px-4 xl:py-3"
                      >
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-fuchsia-200/22 bg-fuchsia-400/18 text-fuchsia-100 xl:h-9 xl:w-9"
                          style={{
                            boxShadow:
                              "0 0 6px rgba(251,207,232,0.22), 0 0 10px rgba(236,72,153,0.16), inset 0 0 6px rgba(244,114,182,0.08)",
                          }}
                        >
                          {item.icon}
                        </div>

                        <span className="omnes-text text-[12px] text-white/84 xl:text-[13px]">
                          {item.label}
                        </span>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </NeonCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}