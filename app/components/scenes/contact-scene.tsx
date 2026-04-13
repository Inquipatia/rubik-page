"use client";

import { motion } from "framer-motion";
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa6";
import { Mail, Phone, MapPin, Clock3 } from "lucide-react";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.035,
      delayChildren: 0.01,
    },
  },
};

const cardVariants = {
  hidden: (direction: "left" | "center" | "right") => ({
    opacity: 0,
    x: direction === "left" ? -16 : direction === "right" ? 16 : 0,
    y: direction === "center" ? 6 : -4,
  }),
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const innerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.018,
      delayChildren: 0.012,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 5,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.22,
      ease: [0.22, 1, 0.36, 1] as const,
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
      className={`relative flex h-full min-h-[182px] flex-col overflow-hidden rounded-[16px] border ${theme.border} bg-[linear-gradient(180deg,rgba(16,16,26,0.98),rgba(8,8,14,1))] p-3 shadow-[0_10px_24px_rgba(0,0,0,0.22)] transition-all duration-300 ${theme.hoverBorder}`}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[16px]"
        style={{ boxShadow: theme.frameShadow }}
      />

      <div
        className="pointer-events-none absolute inset-0 rounded-[16px]"
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
        className="pointer-events-none absolute -inset-[1px] rounded-[18px]"
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
          duration: accent === "fuchsia" ? 5.2 : accent === "white" ? 5.8 : 5.6,
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
          duration: accent === "fuchsia" ? 3.2 : accent === "white" ? 3.6 : 3.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          boxShadow: theme.topShadow,
        }}
      />

      <div
        className="pointer-events-none absolute inset-[6px] rounded-[12px]"
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
    <section className="relative flex min-h-[42vh] items-center justify-center py-1">
      <div className="w-full max-w-[760px] px-3 sm:px-4">
        <div className="mb-2.5 text-center">
          <span className="omnes-text inline-flex rounded-full border border-white/14 bg-white/[0.05] px-3 py-1 text-[8px] uppercase tracking-[0.15em] text-white/74 backdrop-blur">
            Contacto
          </span>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-2 lg:grid-cols-3"
        >
          {/* CARD 1 */}
          <motion.div
            custom="left"
            variants={cardVariants}
            initial="hidden"
            animate="show"
            whileHover={{
              y: -2,
              scale: 1.001,
              transition: { duration: 0.16, ease: [0.22, 1, 0.36, 1] },
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
                  <div className="omnes-text text-[7px] uppercase tracking-[0.15em] text-white/54">
                    INFORMACIÓN
                  </div>

                  <div
                    className="flex h-6.5 w-6.5 items-center justify-center rounded-full border border-violet-200/28 bg-violet-400/18 text-violet-100"
                    style={{
                      boxShadow:
                        "0 0 6px rgba(196,181,253,0.34), 0 0 12px rgba(139,92,246,0.24), inset 0 0 8px rgba(196,181,253,0.1)",
                    }}
                  >
                    <MapPin size={11} />
                  </div>
                </motion.div>

                <div className="mt-2.5 space-y-2.5">
                  <motion.div variants={itemVariants}>
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-violet-200/28 bg-violet-400/18 text-violet-100"
                        style={{
                          boxShadow:
                            "0 0 6px rgba(196,181,253,0.34), 0 0 12px rgba(139,92,246,0.24), inset 0 0 8px rgba(196,181,253,0.1)",
                        }}
                      >
                        <MapPin size={11} />
                      </div>
                      <div className="omnes-title text-[1rem] leading-none text-white">
                        Ubicación
                      </div>
                    </div>

                    <a
                      href="https://maps.app.goo.gl/6JbPNCg9zs2NQCWM9"
                      target="_blank"
                      rel="noreferrer"
                      className="omnes-text mt-1.5 block text-[10px] leading-4 text-white/80 transition hover:text-white"
                    >
                      Abre nuestra ubicación en Google Maps ↗
                    </a>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="h-px w-full bg-white/10"
                  />

                  <motion.div variants={itemVariants}>
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-violet-200/28 bg-violet-400/18 text-violet-100"
                        style={{
                          boxShadow:
                            "0 0 6px rgba(196,181,253,0.34), 0 0 12px rgba(139,92,246,0.24), inset 0 0 8px rgba(196,181,253,0.1)",
                        }}
                      >
                        <Clock3 size={11} />
                      </div>
                      <div className="omnes-title text-[1rem] leading-none text-white">
                        Horario
                      </div>
                    </div>

                    <div className="mt-1.5 space-y-1.5">
                      <div className="rounded-[10px] border border-violet-200/22 bg-[linear-gradient(180deg,rgba(139,92,246,0.16),rgba(255,255,255,0.05))] px-2.5 py-2">
                        <div className="omnes-text text-[10px] text-white/88">
                          Lunes — Jueves
                        </div>
                        <div className="omnes-text mt-0.5 text-[10px] text-white/68">
                          09:00 — 19:00
                        </div>
                      </div>

                      <div className="rounded-[10px] border border-violet-200/22 bg-[linear-gradient(180deg,rgba(139,92,246,0.16),rgba(255,255,255,0.05))] px-2.5 py-2">
                        <div className="omnes-text text-[10px] text-white/88">
                          Viernes
                        </div>
                        <div className="omnes-text mt-0.5 text-[10px] text-white/68">
                          09:00 — 18:00
                        </div>
                      </div>

                      <div className="rounded-[10px] border border-violet-200/22 bg-[linear-gradient(180deg,rgba(139,92,246,0.16),rgba(255,255,255,0.05))] px-2.5 py-2">
                        <div className="omnes-text text-[10px] text-white/88">
                          Sábados — Domingos
                        </div>
                        <div className="omnes-text mt-0.5 text-[10px] text-white/68">
                          Closed
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </NeonCard>
          </motion.div>

          {/* CARD 2 */}
          <motion.div
            custom="center"
            variants={cardVariants}
            initial="hidden"
            animate="show"
            whileHover={{
              y: -2,
              scale: 1.001,
              transition: { duration: 0.16, ease: [0.22, 1, 0.36, 1] },
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
                  <div className="omnes-text text-[7px] uppercase tracking-[0.15em] text-white/54">
                    DIRECTO
                  </div>

                  <div
                    className="flex h-6.5 w-6.5 items-center justify-center rounded-full border border-white/22 bg-white/[0.09] text-white/90"
                    style={{
                      boxShadow:
                        "0 0 6px rgba(255,255,255,0.22), 0 0 12px rgba(255,255,255,0.1), inset 0 0 8px rgba(255,255,255,0.07)",
                    }}
                  >
                    <Phone size={11} />
                  </div>
                </motion.div>

                <div className="mt-2.5 space-y-2.5">
                  <motion.div variants={itemVariants}>
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-white/22 bg-white/[0.09] text-white/90"
                        style={{
                          boxShadow:
                            "0 0 6px rgba(255,255,255,0.22), 0 0 12px rgba(255,255,255,0.1), inset 0 0 8px rgba(255,255,255,0.07)",
                        }}
                      >
                        <Phone size={11} />
                      </div>
                      <div className="omnes-title text-[1rem] leading-none text-white">
                        Celular
                      </div>
                    </div>

                    <a
                      href="tel:+56991330559"
                      className="omnes-text mt-1.5 block text-[10px] leading-4 text-white/84 transition hover:text-white"
                    >
                      +56 9 9133 0559
                    </a>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="h-px w-full bg-white/10"
                  />

                  <motion.div variants={itemVariants}>
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-white/22 bg-white/[0.09] text-white/90"
                        style={{
                          boxShadow:
                            "0 0 6px rgba(255,255,255,0.22), 0 0 12px rgba(255,255,255,0.1), inset 0 0 8px rgba(255,255,255,0.07)",
                        }}
                      >
                        <Mail size={11} />
                      </div>
                      <div className="omnes-title text-[1rem] leading-none text-white">
                        Email
                      </div>
                    </div>

                    <a
                      href="mailto:rubik@rubikcreaciones.cl"
                      className="omnes-text mt-1.5 block break-all text-[10px] leading-4 text-white/84 transition hover:text-white"
                    >
                      rubik@rubikcreaciones.cl
                    </a>
                  </motion.div>
                </div>
              </motion.div>
            </NeonCard>
          </motion.div>

          {/* CARD 3 */}
          <motion.div
            custom="right"
            variants={cardVariants}
            initial="hidden"
            animate="show"
            whileHover={{
              y: -2,
              scale: 1.001,
              transition: { duration: 0.16, ease: [0.22, 1, 0.36, 1] },
            }}
            className="group [transform:translateZ(0)] will-change-transform"
          >
            <NeonCard accent="fuchsia">
              <div className="relative">
                <div className="flex items-start justify-between gap-3">
                  <div className="omnes-text text-[7px] uppercase tracking-[0.15em] text-white/54">
                    CANALES
                  </div>

                  <div
                    className="flex h-6.5 w-6.5 items-center justify-center rounded-full border border-fuchsia-200/24 bg-fuchsia-400/18 text-fuchsia-100"
                    style={{
                      boxShadow:
                        "0 0 6px rgba(251,207,232,0.24), 0 0 12px rgba(236,72,153,0.18), inset 0 0 8px rgba(244,114,182,0.08)",
                    }}
                  >
                    <FaInstagram size={11} />
                  </div>
                </div>

                <div className="mt-2.5">
                  <div className="omnes-title text-[1rem] leading-none text-white">
                    Redes Sociales
                  </div>

                  <div className="mt-2 grid grid-cols-1 gap-1.5">
                    {[
                      {
                        href: "https://instagram.com/rubikcreaciones.cl",
                        label: "Instagram",
                        icon: <FaInstagram size={10} />,
                      },
                      {
                        href: "https://web.facebook.com/profile.php?id=100083381976669",
                        label: "Facebook",
                        icon: <FaFacebookF size={10} />,
                      },
                      {
                        href: "https://tiktok.com/@rubikcreaciones",
                        label: "TikTok",
                        icon: <FaTiktok size={10} />,
                      },
                      {
                        href: "https://www.linkedin.com/in/rubik-creaciones-9b13063b5/",
                        label: "LinkedIn",
                        icon: <FaLinkedinIn size={10} />,
                      },
                      {
                        href: "https://wa.me/56991330559",
                        label: "WhatsApp",
                        icon: <FaWhatsapp size={10} />,
                      },
                    ].map((item) => (
                      <motion.a
                        key={item.label}
                        whileHover={{ x: 2, scale: 1.002 }}
                        transition={{
                          duration: 0.16,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 rounded-[10px] border border-fuchsia-200/22 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04))] px-2.5 py-1.5 transition duration-300 hover:border-fuchsia-200/38 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.13),rgba(255,255,255,0.05))]"
                      >
                        <div
                          className="flex h-5.5 w-5.5 items-center justify-center rounded-full border border-fuchsia-200/22 bg-fuchsia-400/18 text-fuchsia-100"
                          style={{
                            boxShadow:
                              "0 0 6px rgba(251,207,232,0.22), 0 0 10px rgba(236,72,153,0.16), inset 0 0 6px rgba(244,114,182,0.08)",
                          }}
                        >
                          {item.icon}
                        </div>

                        <span className="omnes-text text-[10px] text-white/84">
                          {item.label}
                        </span>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </NeonCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}