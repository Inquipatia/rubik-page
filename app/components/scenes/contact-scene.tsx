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
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
};

const cardVariants = {
  hidden: (direction: "left" | "center" | "right") => ({
    opacity: 0,
    x: direction === "left" ? -28 : direction === "right" ? 28 : 0,
    y: direction === "center" ? 12 : -8,
  }),
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.42,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const innerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.02,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 8,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.32,
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
      border: "border-violet-200/20",
      hoverBorder: hoverBorder ?? "hover:border-violet-300/60",
      glow1: "rgba(139,92,246,0.95)",
      glow2: "rgba(59,130,246,0.72)",
      glow3: "rgba(196,181,253,0.92)",
      aura:
        "radial-gradient(circle at 18% 14%, rgba(139,92,246,0.28), transparent 30%), radial-gradient(circle at 84% 100%, rgba(59,130,246,0.24), transparent 36%)",
      orb: "bg-violet-400/30",
      topLine: "via-violet-200",
      topShadow:
        "0 0 18px rgba(196,181,253,0.95), 0 0 38px rgba(139,92,246,0.65), 0 0 72px rgba(59,130,246,0.38)",
      frameShadow:
        "0 0 0 1px rgba(196,181,253,0.30), inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 0 30px rgba(139,92,246,0.06), 0 0 24px rgba(139,92,246,0.20), 0 0 70px rgba(59,130,246,0.16)",
      neonGradient:
        "linear-gradient(135deg, rgba(196,181,253,0.95), rgba(139,92,246,0.92), rgba(59,130,246,0.88))",
      bloom:
        "radial-gradient(circle at 20% 15%, rgba(139,92,246,0.22), transparent 30%), radial-gradient(circle at 80% 85%, rgba(59,130,246,0.18), transparent 34%)",
    },
    white: {
      border: "border-white/18",
      hoverBorder: hoverBorder ?? "hover:border-white/35",
      glow1: "rgba(255,255,255,0.95)",
      glow2: "rgba(196,181,253,0.62)",
      glow3: "rgba(255,255,255,0.90)",
      aura:
        "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.16), transparent 30%), radial-gradient(circle at 50% 100%, rgba(196,181,253,0.12), transparent 32%)",
      orb: "bg-white/20",
      topLine: "via-white/95",
      topShadow:
        "0 0 18px rgba(255,255,255,0.70), 0 0 38px rgba(255,255,255,0.32), 0 0 68px rgba(196,181,253,0.24)",
      frameShadow:
        "0 0 0 1px rgba(255,255,255,0.22), inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 0 24px rgba(255,255,255,0.05), 0 0 22px rgba(255,255,255,0.13), 0 0 62px rgba(196,181,253,0.12)",
      neonGradient:
        "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(255,255,255,0.86), rgba(196,181,253,0.82))",
      bloom:
        "radial-gradient(circle at 50% 10%, rgba(255,255,255,0.16), transparent 30%), radial-gradient(circle at 50% 90%, rgba(196,181,253,0.14), transparent 34%)",
    },
    fuchsia: {
      border: "border-fuchsia-200/20",
      hoverBorder: hoverBorder ?? "hover:border-fuchsia-300/60",
      glow1: "rgba(236,72,153,0.95)",
      glow2: "rgba(217,70,239,0.72)",
      glow3: "rgba(251,207,232,0.92)",
      aura:
        "radial-gradient(circle at 82% 14%, rgba(244,114,182,0.28), transparent 30%), radial-gradient(circle at 10% 100%, rgba(217,70,239,0.20), transparent 36%)",
      orb: "bg-fuchsia-400/30",
      topLine: "via-fuchsia-200",
      topShadow:
        "0 0 18px rgba(251,207,232,0.90), 0 0 40px rgba(236,72,153,0.64), 0 0 72px rgba(217,70,239,0.38)",
      frameShadow:
        "0 0 0 1px rgba(251,207,232,0.28), inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 0 30px rgba(236,72,153,0.06), 0 0 24px rgba(236,72,153,0.20), 0 0 70px rgba(217,70,239,0.16)",
      neonGradient:
        "linear-gradient(135deg, rgba(251,207,232,0.96), rgba(236,72,153,0.92), rgba(217,70,239,0.88))",
      bloom:
        "radial-gradient(circle at 80% 16%, rgba(244,114,182,0.24), transparent 30%), radial-gradient(circle at 16% 84%, rgba(217,70,239,0.20), transparent 34%)",
    },
  }[accent];

  return (
    <div
      className={`relative flex h-full min-h-[285px] flex-col overflow-hidden rounded-[24px] border ${theme.border} bg-[linear-gradient(180deg,rgba(16,16,26,0.98),rgba(8,8,14,1))] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.32)] transition-all duration-300 ${theme.hoverBorder}`}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[24px]"
        style={{ boxShadow: theme.frameShadow }}
      />

      <div
        className="pointer-events-none absolute inset-0 rounded-[24px]"
        style={{
          padding: "1.2px",
          background: theme.neonGradient,
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          filter: `drop-shadow(0 0 6px ${theme.glow3}) drop-shadow(0 0 14px ${theme.glow1}) drop-shadow(0 0 28px ${theme.glow2})`,
          opacity: 0.95,
        }}
      />

      <div
        className="pointer-events-none absolute -inset-[1px] rounded-[26px] opacity-100"
        style={{
          background: theme.bloom,
          filter: "blur(18px)",
        }}
      />

      <div className="pointer-events-none absolute inset-0 opacity-[0.12]">
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
        className={`pointer-events-none absolute top-0 h-32 w-32 rounded-full ${theme.orb} blur-3xl ${
          accent === "violet" ? "-left-8" : "right-0"
        }`}
        animate={{
          x: accent === "violet" ? [0, 8, 0] : [0, -8, 0],
          y: [0, -6, 0],
          opacity: [0.55, 0.98, 0.55],
        }}
        transition={{
          duration: accent === "fuchsia" ? 5.8 : accent === "white" ? 6.4 : 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className={`pointer-events-none absolute inset-x-5 top-0 h-[2px] rounded-full bg-gradient-to-r from-transparent ${theme.topLine} to-transparent`}
        animate={{
          opacity: [0.72, 1, 0.72],
          scaleX: [0.95, 1, 0.95],
        }}
        transition={{
          duration: accent === "fuchsia" ? 3.6 : accent === "white" ? 4 : 3.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          boxShadow: theme.topShadow,
        }}
      />

      <div
        className="pointer-events-none absolute inset-[8px] rounded-[18px]"
        style={{
          border: "1px solid rgba(255,255,255,0.05)",
          boxShadow:
            accent === "violet"
              ? "inset 0 0 18px rgba(196,181,253,0.08)"
              : accent === "white"
              ? "inset 0 0 18px rgba(255,255,255,0.05)"
              : "inset 0 0 18px rgba(251,207,232,0.07)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default function ContactScene() {
  return (
    <section className="relative flex min-h-[56vh] items-center justify-center py-6">
      <div className="w-full max-w-[1000px] px-4 sm:px-5">
        <div className="mb-5 text-center">
          <span className="omnes-text inline-flex rounded-full border border-white/14 bg-white/[0.05] px-4 py-1 text-[11px] uppercase tracking-[0.16em] text-white/78 backdrop-blur">
            Contacto
          </span>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-3 lg:grid-cols-3"
        >
          {/* CARD 1 · INFORMACIÓN */}
          <motion.div
            custom="left"
            variants={cardVariants}
            initial="hidden"
            animate="show"
            whileHover={{
              y: -3,
              scale: 1.002,
              transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
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
                  <div className="omnes-text text-[10px] uppercase tracking-[0.16em] text-white/58">
                    INFORMACIÓN
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 3 }}
                    transition={{ duration: 0.2 }}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-violet-200/28 bg-violet-400/20 text-violet-100"
                    style={{
                      boxShadow:
                        "0 0 10px rgba(196,181,253,0.45), 0 0 26px rgba(139,92,246,0.42), inset 0 0 18px rgba(196,181,253,0.16)",
                    }}
                  >
                    <MapPin size={15} />
                  </motion.div>
                </motion.div>

                <div className="mt-5 space-y-5">
                  <motion.div variants={itemVariants}>
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-violet-200/28 bg-violet-400/20 text-violet-100"
                        style={{
                          boxShadow:
                            "0 0 10px rgba(196,181,253,0.45), 0 0 26px rgba(139,92,246,0.42), inset 0 0 18px rgba(196,181,253,0.16)",
                        }}
                      >
                        <MapPin size={15} />
                      </div>
                      <div className="omnes-title text-[1.72rem] leading-none text-white">
                        Ubicación
                      </div>
                    </div>

                    <a
                      href="https://maps.app.goo.gl/6JbPNCg9zs2NQCWM9"
                      target="_blank"
                      rel="noreferrer"
                      className="omnes-text mt-3 block text-[13px] leading-5 text-white/82 transition hover:text-white"
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
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-violet-200/28 bg-violet-400/20 text-violet-100"
                        style={{
                          boxShadow:
                            "0 0 10px rgba(196,181,253,0.45), 0 0 26px rgba(139,92,246,0.42), inset 0 0 18px rgba(196,181,253,0.16)",
                        }}
                      >
                        <Clock3 size={15} />
                      </div>
                      <div className="omnes-title text-[1.72rem] leading-none text-white">
                        Horario
                      </div>
                    </div>

                    <div className="mt-3 space-y-2.5">
                      <motion.div
                        whileHover={{ x: 3 }}
                        transition={{ duration: 0.2 }}
                        className="rounded-[16px] border border-violet-200/24 bg-[linear-gradient(180deg,rgba(139,92,246,0.22),rgba(255,255,255,0.08))] px-3.5 py-3.5"
                        style={{
                          boxShadow:
                            "inset 0 0 22px rgba(139,92,246,0.12), 0 0 14px rgba(196,181,253,0.08), 0 0 28px rgba(59,130,246,0.09)",
                        }}
                      >
                        <div className="omnes-text text-[13px] text-white/92">
                          Lunes — Jueves
                        </div>
                        <div className="omnes-text mt-1 text-[13px] text-white/72">
                          09:00 — 19:00
                        </div>
                      </motion.div>

                      <motion.div
                        whileHover={{ x: 3 }}
                        transition={{ duration: 0.2 }}
                        className="rounded-[16px] border border-violet-200/24 bg-[linear-gradient(180deg,rgba(139,92,246,0.22),rgba(255,255,255,0.08))] px-3.5 py-3.5"
                        style={{
                          boxShadow:
                            "inset 0 0 22px rgba(139,92,246,0.12), 0 0 14px rgba(196,181,253,0.08), 0 0 28px rgba(59,130,246,0.09)",
                        }}
                      >
                        <div className="omnes-text text-[13px] text-white/92">
                          Sábados — Domingos
                        </div>
                        <div className="omnes-text mt-1 text-[13px] text-white/72">
                          Closed
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </NeonCard>
          </motion.div>

          {/* CARD 2 · DIRECTO */}
          <motion.div
            custom="center"
            variants={cardVariants}
            initial="hidden"
            animate="show"
            whileHover={{
              y: -3,
              scale: 1.002,
              transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
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
                  <div className="omnes-text text-[10px] uppercase tracking-[0.16em] text-white/58">
                    DIRECTO
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 3 }}
                    transition={{ duration: 0.2 }}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/24 bg-white/[0.10] text-white/90"
                    style={{
                      boxShadow:
                        "0 0 8px rgba(255,255,255,0.30), 0 0 22px rgba(255,255,255,0.18), inset 0 0 14px rgba(255,255,255,0.10)",
                    }}
                  >
                    <Phone size={15} />
                  </motion.div>
                </motion.div>

                <div className="mt-5 space-y-5">
                  <motion.div variants={itemVariants}>
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/24 bg-white/[0.10] text-white/90"
                        style={{
                          boxShadow:
                            "0 0 8px rgba(255,255,255,0.30), 0 0 22px rgba(255,255,255,0.18), inset 0 0 14px rgba(255,255,255,0.10)",
                        }}
                      >
                        <Phone size={15} />
                      </div>
                      <div className="omnes-title text-[1.72rem] leading-none text-white">
                        Celular
                      </div>
                    </div>

                    <a
                      href="tel:+56991330559"
                      className="omnes-text mt-3 block text-[15px] leading-6 text-white/86 transition hover:text-white"
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
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/24 bg-white/[0.10] text-white/90"
                        style={{
                          boxShadow:
                            "0 0 8px rgba(255,255,255,0.30), 0 0 22px rgba(255,255,255,0.18), inset 0 0 14px rgba(255,255,255,0.10)",
                        }}
                      >
                        <Mail size={15} />
                      </div>
                      <div className="omnes-title text-[1.72rem] leading-none text-white">
                        Email
                      </div>
                    </div>

                    <a
                      href="mailto:rubik@rubikcreaciones.cl"
                      className="omnes-text mt-3 block break-all text-[15px] leading-6 text-white/86 transition hover:text-white"
                    >
                      rubik@rubikcreaciones.cl
                    </a>
                  </motion.div>
                </div>
              </motion.div>
            </NeonCard>
          </motion.div>

          {/* CARD 3 · CANALES */}
          <motion.div
            custom="right"
            variants={cardVariants}
            initial="hidden"
            animate="show"
            whileHover={{
              y: -3,
              scale: 1.002,
              transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
            }}
            className="group [transform:translateZ(0)] will-change-transform"
          >
            <NeonCard accent="fuchsia">
              <div className="relative">
                <div className="flex items-start justify-between gap-3">
                  <div className="omnes-text text-[10px] uppercase tracking-[0.16em] text-white/58">
                    CANALES
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 3 }}
                    transition={{ duration: 0.2 }}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-fuchsia-200/28 bg-fuchsia-400/20 text-fuchsia-100"
                    style={{
                      boxShadow:
                        "0 0 10px rgba(251,207,232,0.40), 0 0 26px rgba(236,72,153,0.40), inset 0 0 18px rgba(244,114,182,0.14)",
                    }}
                  >
                    <FaInstagram size={15} />
                  </motion.div>
                </div>

                <div className="mt-5">
                  <div className="omnes-title text-[1.72rem] leading-none text-white">
                    Redes Sociales
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-2.5">
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
                        whileHover={{ x: 4, scale: 1.005 }}
                        transition={{
                          duration: 0.2,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 rounded-[16px] border border-fuchsia-200/24 bg-[linear-gradient(180deg,rgba(255,255,255,0.13),rgba(255,255,255,0.05))] px-3.5 py-2.5 transition duration-300 hover:border-fuchsia-200/40 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.17),rgba(255,255,255,0.06))]"
                        style={{
                          boxShadow:
                            "inset 0 0 20px rgba(244,114,182,0.07), 0 0 12px rgba(251,207,232,0.06), 0 0 24px rgba(236,72,153,0.08)",
                        }}
                      >
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-fuchsia-200/24 bg-fuchsia-400/20 text-fuchsia-100"
                          style={{
                            boxShadow:
                              "0 0 10px rgba(251,207,232,0.34), 0 0 20px rgba(236,72,153,0.28), inset 0 0 12px rgba(244,114,182,0.14)",
                          }}
                        >
                          {item.icon}
                        </div>

                        <span className="omnes-text text-[13px] text-white/88">
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