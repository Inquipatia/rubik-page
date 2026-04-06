"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { faqs } from "@/app/data/faqs";

declare global {
  interface Window {
    VANTA?: any;
  }
}

export default function FaqScene() {
  const [openId, setOpenId] = useState<number>(4);
  const vantaBgRef = useRef<HTMLDivElement | null>(null);
  const vantaEffect = useRef<any>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    let attempts = 0;

    const initVanta = () => {
      if (!vantaBgRef.current || !window.VANTA || vantaEffect.current) return;

      vantaEffect.current = window.VANTA.WAVES({
        el: vantaBgRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 1,
        color: 0x100028,
        shininess: 24,
        waveHeight: 6,
        waveSpeed: 0.16,
        zoom: 0.95,
      });
    };

    interval = setInterval(() => {
      attempts += 1;
      initVanta();

      if (vantaEffect.current || attempts > 40) {
        if (interval) clearInterval(interval);
      }
    }, 180);

    return () => {
      if (interval) clearInterval(interval);

      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  return (
    <section className="relative h-[100svh] w-full overflow-hidden">
      {/* fondo real full viewport detrás de todo */}
      <div
        ref={vantaBgRef}
        className="fixed inset-0 z-0 h-screen w-screen"
      />

      {/* overlay suave */}
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[linear-gradient(180deg,rgba(6,4,18,0.08)_0%,rgba(6,4,18,0.16)_30%,rgba(6,4,18,0.32)_100%)]" />

      {/* contenido */}
      <div className="relative z-[2] mx-auto flex h-[100svh] w-full max-w-7xl items-start justify-center px-6 pb-14 pt-28 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-4xl"
        >
          <div className="mb-10">
            <span className="omnes-text inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-1 text-sm text-white/75 backdrop-blur">
              FAQ
            </span>

            <h2 className="omnes-title mt-5 text-5xl leading-[0.92] tracking-[-0.04em] sm:text-6xl">
              Everything
              <span className="block text-white/75">you may ask.</span>
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((item, index) => {
              const isOpen = openId === item.id;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.42,
                    delay: 0.18 + index * 0.05,
                    ease: "easeOut",
                  }}
                  className="rounded-3xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur"
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? 0 : item.id)}
                    className="flex w-full items-center justify-between gap-4 text-left"
                  >
                    <span className="omnes-title text-2xl leading-tight text-white">
                      {item.question}
                    </span>

                    <span className="omnes-text text-xl text-white/60">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <p className="omnes-text mt-4 max-w-3xl text-lg leading-8 text-white/70">
                      {item.answer}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}