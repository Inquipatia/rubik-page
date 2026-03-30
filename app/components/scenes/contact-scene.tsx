"use client";

import { motion } from "framer-motion";
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa6";
import { Mail, Phone, MapPin } from "lucide-react";

const cards = [
  {
    eyebrow: "LOCATION",
    title: "Map",
    description: "Open our location in Google Maps.",
    href: "https://maps.app.goo.gl/6JbPNCg9zs2NQCWM9",
    label: "Open map ↗",
    accent: "text-white/88",
    icon: <FaInstagram size={16} />,
  },
  {
    eyebrow: "CHANNEL",
    title: "Instagram",
    description: "@rubikcreaciones.cl",
    href: "https://instagram.com/rubikcreaciones.cl",
    label: "Visit profile ↗",
    accent: "text-[#bfe3ff]",
    icon: <FaInstagram size={16} />,
  },
  {
    eyebrow: "CHANNEL",
    title: "Facebook",
    description: "Rubik Creaciones",
    href: "https://web.facebook.com/profile.php?id=100083381976669",
    label: "Visit page ↗",
    accent: "text-white/78",
    icon: <FaInstagram size={16} />,
  },
  {
    eyebrow: "CHANNEL",
    title: "TikTok",
    description: "@rubikcreaciones",
    href: "https://tiktok.com/@rubikcreaciones",
    label: "Watch content ↗",
    accent: "text-white/88",
    icon: <FaInstagram size={16} />,
  },
  {
    eyebrow: "CHANNEL",
    title: "LinkedIn",
    description: "Rubik Creaciones",
    href: "https://www.linkedin.com/in/rubik-creaciones-9b13063b5/",
    label: "Open profile ↗",
    accent: "text-[#d7dfff]",
    icon: <FaInstagram size={16} />,
  },
  {
    eyebrow: "CHANNEL",
    title: "WhatsApp",
    description: "+56 9 9133 0559",
    href: "https://wa.me/56991330559",
    label: "Start chat ↗",
    accent: "text-[#d8ffd8]",
    icon: <FaInstagram size={16} />,
  },
  {
    eyebrow: "AVAILABILITY",
    title: "Schedule",
    description: "Mon — Fri · 09:00 — 18:00",
    href: "#",
    label: "By coordination on Saturdays",
    accent: "text-white/88",
    staticCard: true,
    icon: <FaInstagram size={16} />,
  },
  {
    eyebrow: "DIRECT",
    title: "Email",
    description: "rubik@rubikcreaciones.cl",
    href: "mailto:rubik@rubikcreaciones.cl",
    label: "Send email ↗",
    accent: "text-white/88",
    icon: <FaInstagram size={16} />,
  },
  {
    eyebrow: "CONTACT",
    title: "Phone",
    description: "+56 9 9133 0559",
    href: "tel:+56991330559",
    label: "Get in touch ↗",
    accent: "text-white/88",
    icon: <FaInstagram size={16} />,
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.985,
    filter: "blur(8px)",
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function ContactScene() {
  return (
    <section className="relative flex min-h-[62vh] items-center justify-center py-8">
      <div className="w-full max-w-[1040px] px-4 sm:px-6">
        <div className="mb-6 text-center">
          <span className="omnes-text inline-flex rounded-full border border-white/12 bg-white/[0.03] px-4 py-1 text-[12px] uppercase tracking-[0.16em] text-white/65 backdrop-blur">
            Contact
          </span>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {cards.map((card, index) => {
            const CardTag = card.staticCard ? "div" : "a";

            return (
              <motion.div
                key={card.title}
                variants={cardVariants}
                whileHover={{
                  y: -4,
                  scale: 1.012,
                  transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
                }}
                className="group"
              >
                <CardTag
                  {...(!card.staticCard
                    ? {
                      href: card.href,
                      target:
                        card.href.startsWith("http") ? "_blank" : undefined,
                      rel:
                        card.href.startsWith("http")
                          ? "noreferrer"
                          : undefined,
                    }
                    : {})}
                  className="relative flex h-[210px] w-full flex-col justify-between overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,13,20,0.96),rgba(6,6,10,0.98))] p-5 shadow-[0_14px_40px_rgba(0,0,0,0.28)] transition-colors duration-300 hover:border-white/18"
                >
                  <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          "radial-gradient(rgba(255,255,255,0.08) 0.6px, transparent 0.6px)",
                        backgroundSize: "14px 14px",
                        backgroundPosition: "0 0",
                      }}
                    />
                  </div>

                  <div className="pointer-events-none absolute inset-x-5 top-[52px] h-px bg-white/10" />

                  <div className="relative flex items-start justify-between gap-3">
                    <div className="omnes-text text-[12px] uppercase tracking-[0.12em] text-white/60">
                      {card.eyebrow}
                    </div>

                    <div className="text-white/30 transition duration-300 group-hover:text-white/65">
                      {card.icon}
                    </div>
                  </div>

                  <div className="relative flex-1 py-4">
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <div className="omnes-text text-lg italic text-white/42">
                        {index === 0
                          ? "open"
                          : card.title === "Schedule"
                            ? "available"
                            : "connect"}
                      </div>

                      <h3
                        className={`omnes-title mt-2 text-[2rem] leading-none tracking-[-0.04em] ${card.accent}`}
                      >
                        {card.title}
                      </h3>

                      <p className="omnes-text mt-4 max-w-[220px] break-words text-sm leading-6 text-white/58">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="mb-3 h-px w-full bg-white/10" />

                    <div className="omnes-text text-[11px] uppercase tracking-[0.16em] text-white/34 transition duration-300 group-hover:text-white/58">
                      {card.label}
                    </div>
                  </div>
                </CardTag>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}