"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type ContactFaqCloudTransitionProps = {
  active: boolean;
  onCovered: () => void;
  onFinished: () => void;
};

export default function ContactFaqCloudTransition({
  active,
  onCovered,
  onFinished,
}: ContactFaqCloudTransitionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const coveredOnceRef = useRef(false);

  const skyRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const plumeARef = useRef<HTMLDivElement>(null);
  const plumeBRef = useRef<HTMLDivElement>(null);
  const flareRef = useRef<HTMLDivElement>(null);
  const washRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;

    coveredOnceRef.current = false;

    const root = rootRef.current;
    const sky = skyRef.current;
    const aura = auraRef.current;
    const plumeA = plumeARef.current;
    const plumeB = plumeBRef.current;
    const flare = flareRef.current;
    const wash = washRef.current;
    const vignette = vignetteRef.current;

    if (
      !root ||
      !sky ||
      !aura ||
      !plumeA ||
      !plumeB ||
      !flare ||
      !wash ||
      !vignette
    ) {
      return;
    }

    gsap.set(root, { autoAlpha: 1 });

    gsap.set(sky, {
      scale: 1.06,
      yPercent: 4,
      transformOrigin: "50% 50%",
      force3D: true,
    });

    gsap.set(aura, {
      autoAlpha: 0.3,
      scale: 1.14,
      yPercent: 2,
      transformOrigin: "50% 24%",
      force3D: true,
    });

    gsap.set(plumeA, {
      autoAlpha: 0,
      xPercent: -10,
      yPercent: 16,
      scale: 1.22,
      rotate: -5,
      transformOrigin: "50% 50%",
      force3D: true,
    });

    gsap.set(plumeB, {
      autoAlpha: 0,
      xPercent: 10,
      yPercent: 18,
      scale: 1.2,
      rotate: 6,
      transformOrigin: "50% 50%",
      force3D: true,
    });

    gsap.set(flare, {
      autoAlpha: 0.2,
      scale: 0.86,
      yPercent: 8,
      transformOrigin: "50% 22%",
      force3D: true,
    });

    gsap.set(wash, {
      autoAlpha: 0,
    });

    gsap.set(vignette, {
      autoAlpha: 0.42,
    });

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: onFinished,
    });

    tl.to(
      sky,
      {
        scale: 1,
        yPercent: 0,
        duration: 0.88,
        ease: "power2.out",
      },
      0
    )
      .to(
        aura,
        {
          autoAlpha: 0.9,
          scale: 1.02,
          yPercent: -2,
          duration: 0.72,
          ease: "power3.out",
        },
        0.03
      )
      .to(
        plumeA,
        {
          autoAlpha: 0.72,
          xPercent: 0,
          yPercent: 0,
          scale: 1,
          rotate: -1,
          duration: 0.78,
          ease: "power3.out",
        },
        0.07
      )
      .to(
        plumeB,
        {
          autoAlpha: 0.64,
          xPercent: 0,
          yPercent: -4,
          scale: 1,
          rotate: 1,
          duration: 0.82,
          ease: "power3.out",
        },
        0.1
      )
      .to(
        flare,
        {
          autoAlpha: 1,
          scale: 1.08,
          yPercent: -6,
          duration: 0.6,
          ease: "power3.out",
        },
        0.16
      )
      .to(
        wash,
        {
          autoAlpha: 0.72,
          duration: 0.34,
          ease: "power2.out",
        },
        0.18
      )
      .call(() => {
        if (!coveredOnceRef.current) {
          coveredOnceRef.current = true;
          onCovered();
        }
      }, [], 0.42)
      .to(
        aura,
        {
          autoAlpha: 0.22,
          scale: 1.1,
          duration: 0.5,
          ease: "power2.out",
        },
        0.74
      )
      .to(
        plumeA,
        {
          autoAlpha: 0.14,
          xPercent: 5,
          yPercent: -10,
          scale: 1.08,
          duration: 0.46,
          ease: "power2.out",
        },
        0.76
      )
      .to(
        plumeB,
        {
          autoAlpha: 0.1,
          xPercent: -4,
          yPercent: -12,
          scale: 1.1,
          duration: 0.46,
          ease: "power2.out",
        },
        0.78
      )
      .to(
        flare,
        {
          autoAlpha: 0.16,
          scale: 1.18,
          duration: 0.48,
          ease: "power2.out",
        },
        0.8
      )
      .to(
        wash,
        {
          autoAlpha: 0.16,
          duration: 0.42,
          ease: "power2.out",
        },
        0.84
      )
      .to(
        root,
        {
          autoAlpha: 0,
          duration: 0.32,
          ease: "power2.out",
        },
        0.96
      );

    return () => {
      tl.kill();
    };
  }, [active, onCovered, onFinished]);

  if (!active) return null;

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
      aria-hidden="true"
    >
      {/* Fondo cielo / atmósfera */}
      <div
        ref={skyRef}
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 50% 8%, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0) 24%),
            radial-gradient(circle at 22% 20%, rgba(198,138,255,0.22) 0%, rgba(198,138,255,0) 34%),
            radial-gradient(circle at 78% 24%, rgba(144,104,255,0.18) 0%, rgba(144,104,255,0) 30%),
            linear-gradient(180deg, #f8f2ff 0%, #ebddff 12%, #d7bcff 26%, #b07cff 44%, #6f2cf0 68%, #23074f 100%)
          `,
        }}
      />

      {/* Halo amplio superior */}
      <div
        ref={auraRef}
        className="absolute inset-x-[-16%] top-[-16%] h-[62vh] blur-[100px] mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle at 50% 24%, rgba(255,255,255,0.98) 0%, rgba(248,236,255,0.9) 16%, rgba(229,196,255,0.58) 34%, rgba(176,106,255,0.18) 56%, rgba(255,255,255,0) 78%)",
        }}
      />

      {/* Masa líquida / nube izquierda */}
      <div
        ref={plumeARef}
        className="absolute left-[-10%] top-[26%] h-[52vh] w-[72vw] blur-[76px] mix-blend-screen"
        style={{
          background:
            "radial-gradient(ellipse at 38% 40%, rgba(245,223,255,0.58) 0%, rgba(216,171,255,0.38) 24%, rgba(157,88,245,0.22) 48%, rgba(96,38,197,0.12) 66%, rgba(96,38,197,0) 84%)",
          clipPath: "ellipse(44% 34% at 42% 48%)",
        }}
      />

      {/* Masa líquida / nube derecha */}
      <div
        ref={plumeBRef}
        className="absolute right-[-12%] top-[34%] h-[48vh] w-[68vw] blur-[82px] mix-blend-screen"
        style={{
          background:
            "radial-gradient(ellipse at 60% 36%, rgba(239,220,255,0.44) 0%, rgba(201,146,255,0.28) 26%, rgba(133,70,232,0.18) 50%, rgba(75,27,173,0.12) 68%, rgba(75,27,173,0) 86%)",
          clipPath: "ellipse(40% 30% at 56% 46%)",
        }}
      />

      {/* Luz central que tapa y luego se va */}
      <div
        ref={flareRef}
        className="absolute inset-x-[-8%] top-[-6%] h-[72vh] blur-[74px] mix-blend-screen"
        style={{
          background:
            "radial-gradient(ellipse at 50% 18%, rgba(255,255,255,0.98) 0%, rgba(255,243,255,0.86) 14%, rgba(242,214,255,0.52) 28%, rgba(196,128,255,0.18) 46%, rgba(255,255,255,0) 70%)",
        }}
      />

      {/* Lavado general de luz */}
      <div
        ref={washRef}
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(248,232,255,0.12) 20%, rgba(198,124,255,0.14) 46%, rgba(96,33,198,0.16) 70%, rgba(20,5,48,0.22) 100%)",
        }}
      />

      {/* Viñeta sutil */}
      <div
        ref={vignetteRef}
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 36%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.08) 58%, rgba(0,0,0,0.3) 100%)",
        }}
      />
    </div>
  );
}