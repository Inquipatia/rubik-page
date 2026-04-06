"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Share2, X } from "lucide-react";
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa6";
import type { IconType } from "react-icons";

type SocialItem = {
  name: string;
  href: string;
  icon: IconType;
  x: number;
  y: number;
};

const socialItems: SocialItem[] = [
  {
    name: "Instagram",
    href: "https://instagram.com/rubikcreaciones.cl",
    icon: FaInstagram,
    x: -18,
    y: -112,
  },
  {
    name: "Facebook",
    href: "https://facebook.com/",
    icon: FaFacebookF,
    x: -62,
    y: -90,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/",
    icon: FaLinkedinIn,
    x: -96,
    y: -58,
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/56991330559",
    icon: FaWhatsapp,
    x: -114,
    y: -18,
  },
  
];

export default function FloatingSocialOrb() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!wrapperRef.current) return;

      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none fixed bottom-6 right-6 z-[90] sm:bottom-8 sm:right-8"
    >
      <div className="pointer-events-auto relative h-[240px] w-[240px]">
        <AnimatePresence>
          {open &&
            socialItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.name}
                  title={item.name}
                  initial={{
                    opacity: 0,
                    scale: 0.82,
                    x: -6,
                    y: -6,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: item.x,
                    y: item.y,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.82,
                    x: -4,
                    y: -4,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 22,
                    mass: 0.9,
                    delay: index * 0.03,
                  }}
                  whileHover={{
                    scale: 1.06,
                    y: item.y - 2,
                  }}
                  whileTap={{ scale: 0.96 }}
                  className="absolute bottom-0 right-0 flex h-[46px] w-[46px] items-center justify-center rounded-full border border-white/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04))] text-white/90 shadow-[0_8px_24px_rgba(94,58,170,0.16)] backdrop-blur-xl transition duration-300 hover:border-white/24 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.06))] hover:text-white hover:shadow-[0_10px_28px_rgba(124,82,206,0.20)]"
                >
                  <span className="absolute inset-[3px] rounded-full border border-white/8" />
                  <Icon className="relative z-[1] h-[15px] w-[15px]" />
                </motion.a>
              );
            })}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          animate={
            open
              ? {
                  boxShadow:
                    "0 0 0 6px rgba(147,108,255,0.08), 0 10px 36px rgba(92,58,168,0.22)",
                }
              : {
                  boxShadow:
                    "0 0 0 0 rgba(147,108,255,0), 0 8px 26px rgba(92,58,168,0.16)",
                }
          }
          transition={{ duration: 0.2, ease: "easeOut" }}
          aria-expanded={open}
          aria-label={open ? "Close social media menu" : "Open social media menu"}
          className="absolute bottom-0 right-0 flex h-[82px] w-[82px] items-center justify-center rounded-full border border-white/16 bg-[linear-gradient(180deg,rgba(138,94,255,0.28),rgba(58,32,118,0.38))] text-white backdrop-blur-2xl"
        >
          <span className="absolute inset-[5px] rounded-full border border-white/10" />
          <span className="absolute inset-[11px] rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.03))]" />

          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "close" : "share"}
              initial={{ opacity: 0, rotate: -14, scale: 0.9 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 14, scale: 0.9 }}
              transition={{ duration: 0.16 }}
              className="relative z-[1] flex items-center justify-center text-white"
            >
              {open ? <X className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}