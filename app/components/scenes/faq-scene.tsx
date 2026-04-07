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
  minHeight: 200.00,
  minWidth: 200.00,
  scale: 1.00,
  scaleMobile: 1.00,
  color: 0x100028,
  shininess: 150.00,
  waveHeight: 24.50,
  waveSpeed: 0.65,
  zoom: 0.76
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
      {/* fondo Vanta ocupando TODO el viewport, también detrás del navbar */}
      <div
        ref={vantaBgRef}
        aria-hidden
        className="fixed inset-0 z-0 h-screen w-screen"
      />

      {/* capa suave para dar lectura */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] bg-[linear-gradient(180deg,rgba(6,4,18,0.06)_0%,rgba(6,4,18,0.14)_28%,rgba(6,4,18,0.28)_60%,rgba(6,4,18,0.42)_100%)]"
      />

      {/* contenido FAQ */}
      <div className="relative z-[2] mx-auto flex h-[100svh] w-full max-w-7xl items-start justify-center px-6 pb-14 pt-28 md:px-10 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl"
        >
          <div className="mb-10 md:mb-12">
            <span className="omnes-text inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-1 text-sm text-white/75 backdrop-blur">
              FAQ
            </span>

            <h2 className="omnes-title mt-5 text-5xl leading-[0.92] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Everything
              <span className="block text-white/75">you may ask.</span>
            </h2>
          </div>

          <div className="space-y-4">
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
                  className="rounded-[28px] border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-md md:px-8 md:py-6"
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? 0 : item.id)}
                    className="flex w-full items-center justify-between gap-4 text-left"
                  >
                    <span className="omnes-title text-[1.35rem] leading-tight text-white md:text-[1.55rem]">
                      {item.question}
                    </span>

                    <span className="omnes-text shrink-0 text-2xl text-white/60">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                      className="omnes-text mt-4 max-w-4xl text-base leading-7 text-white/72 md:text-lg md:leading-8"
                    >
                      {item.answer}
                    </motion.p>
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