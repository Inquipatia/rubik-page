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

  const backdropRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const wavesWrapRef = useRef<HTMLDivElement>(null);
  const waveARef = useRef<SVGPathElement>(null);
  const waveBRef = useRef<SVGPathElement>(null);
  const waveCRef = useRef<SVGPathElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const logoGlowRef = useRef<HTMLDivElement>(null);
  const seaRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);

  const rafRef = useRef<number | null>(null);
  const coveredOnceRef = useRef(false);
  const finishedOnceRef = useRef(false);

  const onCoveredRef = useRef(onCovered);
  const onFinishedRef = useRef(onFinished);

  useEffect(() => {
    onCoveredRef.current = onCovered;
    onFinishedRef.current = onFinished;
  }, [onCovered, onFinished]);

  useEffect(() => {
    const root = rootRef.current;
    const backdrop = backdropRef.current;
    const glow = glowRef.current;
    const wavesWrap = wavesWrapRef.current;
    const waveA = waveARef.current;
    const waveB = waveBRef.current;
    const waveC = waveCRef.current;
    const logoWrap = logoWrapRef.current;
    const logoGlow = logoGlowRef.current;
    const sea = seaRef.current;
    const veil = veilRef.current;
    const vignette = vignetteRef.current;

    if (
      !root ||
      !backdrop ||
      !glow ||
      !wavesWrap ||
      !waveA ||
      !waveB ||
      !waveC ||
      !logoWrap ||
      !logoGlow ||
      !sea ||
      !veil ||
      !vignette
    ) {
      return;
    }

    let tl: gsap.core.Timeline | null = null;
    let waveTweenA: gsap.core.Tween | null = null;
    let waveTweenB: gsap.core.Tween | null = null;
    let waveTweenC: gsap.core.Tween | null = null;

    const cleanupAnimation = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      tl?.kill();
      waveTweenA?.kill();
      waveTweenB?.kill();
      waveTweenC?.kill();

      gsap.killTweensOf([
        root,
        backdrop,
        glow,
        wavesWrap,
        waveA,
        waveB,
        waveC,
        logoWrap,
        logoGlow,
        sea,
        veil,
        vignette,
      ]);

      gsap.set(root, { autoAlpha: 0 });
    };

    if (!active) {
      cleanupAnimation();
      return;
    }

    coveredOnceRef.current = false;
    finishedOnceRef.current = false;

    gsap.set(root, { autoAlpha: 0 });

    gsap.set(backdrop, {
      autoAlpha: 1,
      scale: 1.03,
      filter: "brightness(1.02)",
      transformOrigin: "50% 50%",
      force3D: true,
    });

    gsap.set(glow, {
      autoAlpha: 0,
      scale: 0.88,
      yPercent: 6,
      transformOrigin: "50% 24%",
      force3D: true,
    });

    gsap.set(wavesWrap, {
      autoAlpha: 0,
      yPercent: 4,
      force3D: true,
    });

    gsap.set([waveA, waveB, waveC], {
      strokeDasharray: 2200,
      strokeDashoffset: 2200,
      autoAlpha: 0,
      force3D: true,
    });

    gsap.set(logoWrap, {
      autoAlpha: 0,
      yPercent: 12,
      scale: 0.92,
      filter: "blur(18px)",
      transformOrigin: "50% 50%",
      force3D: true,
    });

    gsap.set(logoGlow, {
      autoAlpha: 0,
      scale: 0.82,
      force3D: true,
    });

    gsap.set(sea, {
      autoAlpha: 0,
      yPercent: 24,
      scaleY: 0.8,
      transformOrigin: "50% 100%",
      force3D: true,
    });

    gsap.set(veil, { autoAlpha: 0 });
    gsap.set(vignette, { autoAlpha: 0.42 });

    rafRef.current = requestAnimationFrame(() => {
      gsap.set(root, { autoAlpha: 1 });

      waveTweenA = gsap.to(waveA, {
        xPercent: 3.5,
        yPercent: -1,
        duration: 3.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      waveTweenB = gsap.to(waveB, {
        xPercent: -2.8,
        yPercent: 0.9,
        duration: 4.1,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      waveTweenC = gsap.to(waveC, {
        xPercent: 2.2,
        yPercent: -0.7,
        duration: 3.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
          if (finishedOnceRef.current) return;
          finishedOnceRef.current = true;
          onFinishedRef.current();
        },
      });

      tl.to(
        glow,
        {
          autoAlpha: 0.88,
          scale: 1.04,
          yPercent: 0,
          duration: 0.95,
          ease: "power3.out",
        },
        0
      )
        .to(
          backdrop,
          {
            scale: 1,
            filter: "brightness(0.96)",
            duration: 2.2,
            ease: "sine.out",
          },
          0
        )
        .to(
          wavesWrap,
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.75,
            ease: "power2.out",
          },
          0.45
        )
        .to(
          waveA,
          {
            strokeDashoffset: 0,
            autoAlpha: 0.52,
            duration: 1.1,
            ease: "power2.out",
          },
          0.55
        )
        .to(
          waveB,
          {
            strokeDashoffset: 0,
            autoAlpha: 0.38,
            duration: 1.15,
            ease: "power2.out",
          },
          0.72
        )
        .to(
          waveC,
          {
            strokeDashoffset: 0,
            autoAlpha: 0.24,
            duration: 1.2,
            ease: "power2.out",
          },
          0.9
        )
        .to(
          logoGlow,
          {
            autoAlpha: 0.5,
            scale: 1.05,
            duration: 0.55,
            ease: "power3.out",
          },
          1.45
        )
        .to(
          logoWrap,
          {
            autoAlpha: 1,
            yPercent: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.85,
            ease: "power3.out",
          },
          1.5
        )
        .call(() => {
          if (coveredOnceRef.current) return;
          coveredOnceRef.current = true;
          onCoveredRef.current();
        }, [], 2.2)
        .to(
          logoWrap,
          {
            yPercent: -1.5,
            duration: 1.2,
            ease: "sine.inOut",
          },
          2.25
        )
        .to(
          sea,
          {
            autoAlpha: 0.68,
            yPercent: 0,
            scaleY: 1,
            duration: 1.05,
            ease: "power2.out",
          },
          3.1
        )
        .to(
          veil,
          {
            autoAlpha: 0.16,
            duration: 0.7,
            ease: "power2.out",
          },
          3.2
        )
        .to(
          glow,
          {
            autoAlpha: 0.52,
            scale: 1.08,
            duration: 1.1,
            ease: "sine.out",
          },
          3.35
        )
        .to(
          logoGlow,
          {
            autoAlpha: 0.16,
            scale: 1.12,
            duration: 0.55,
            ease: "power2.out",
          },
          4.45
        )
        .to(
          logoWrap,
          {
            autoAlpha: 0.06,
            yPercent: -4,
            scale: 1.02,
            duration: 0.62,
            ease: "power2.out",
          },
          4.5
        )
        .to(
          wavesWrap,
          {
            autoAlpha: 0.16,
            duration: 0.5,
            ease: "power2.out",
          },
          4.8
        )
        .to(
          sea,
          {
            autoAlpha: 0.4,
            duration: 0.55,
            ease: "power2.out",
          },
          5.05
        )
        .to(
          root,
          {
            autoAlpha: 0,
            duration: 0.45,
            ease: "power2.out",
          },
          5.55
        );
    });

    return cleanupAnimation;
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden opacity-0 invisible"
      aria-hidden="true"
    >
      <div
        ref={backdropRef}
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 50% 18%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 22%),
            radial-gradient(circle at 50% 30%, rgba(189,129,255,0.08) 0%, rgba(189,129,255,0) 36%),
            linear-gradient(180deg, #1b0838 0%, #16062f 18%, #120427 36%, #0f0320 56%, #0a0217 76%, #06010d 100%)
          `,
        }}
      />

      <div
        ref={glowRef}
        className="absolute inset-x-[-16%] top-[-12%] h-[58vh] blur-[88px] mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle at 50% 26%, rgba(255,255,255,0.8) 0%, rgba(240,217,255,0.42) 22%, rgba(181,105,255,0.18) 42%, rgba(181,105,255,0) 72%)",
        }}
      />

      <div ref={wavesWrapRef} className="absolute inset-0">
        <svg
          viewBox="0 0 1600 900"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id="rubikWaveA" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="18%" stopColor="rgba(255,255,255,0.1)" />
              <stop offset="50%" stopColor="rgba(225,161,255,0.72)" />
              <stop offset="82%" stopColor="rgba(255,255,255,0.1)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>

            <linearGradient id="rubikWaveB" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="20%" stopColor="rgba(209,152,255,0.07)" />
              <stop offset="50%" stopColor="rgba(233,199,255,0.46)" />
              <stop offset="80%" stopColor="rgba(209,152,255,0.07)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>

            <linearGradient id="rubikWaveC" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="20%" stopColor="rgba(168,113,255,0.05)" />
              <stop offset="50%" stopColor="rgba(219,178,255,0.24)" />
              <stop offset="80%" stopColor="rgba(168,113,255,0.05)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>

          <path
            ref={waveARef}
            d="M -120 438 C 120 396, 310 510, 590 456 S 1090 382, 1750 470"
            stroke="url(#rubikWaveA)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <path
            ref={waveBRef}
            d="M -160 505 C 140 452, 420 572, 760 516 S 1220 446, 1780 542"
            stroke="url(#rubikWaveB)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            ref={waveCRef}
            d="M -180 372 C 120 338, 410 438, 690 404 S 1120 348, 1800 430"
            stroke="url(#rubikWaveC)"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div
        ref={logoGlowRef}
        className="absolute left-1/2 top-[33%] h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle, rgba(239,199,255,0.24) 0%, rgba(198,123,255,0.12) 38%, rgba(198,123,255,0) 72%)",
        }}
      />

      <div
        ref={logoWrapRef}
        className="absolute left-1/2 top-[38%] z-[2] w-[min(66vw,34rem)] -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
      >
        <img
          src="/img/rubik-transition-logo.png"
          alt="Rubik Digital"
          className="h-auto w-full object-contain opacity-95 [filter:drop-shadow(0_0_16px_rgba(255,105,210,0.12))]"
          draggable={false}
        />
      </div>

      <div
        ref={seaRef}
        className="absolute inset-x-[-12%] bottom-[-8%] h-[32vh] overflow-hidden blur-[10px]"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, rgba(224,177,255,0.12) 0%, rgba(224,177,255,0.05) 18%, rgba(224,177,255,0) 40%),
            linear-gradient(180deg, rgba(88,35,166,0.02) 0%, rgba(52,19,110,0.16) 28%, rgba(25,8,56,0.46) 62%, rgba(8,2,18,0.96) 100%)
          `,
          clipPath: "ellipse(74% 100% at 50% 100%)",
        }}
      >
        <div
          className="absolute inset-x-[10%] top-[7%] h-px opacity-38"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(238,214,255,0.36) 22%, rgba(255,255,255,0.56) 50%, rgba(238,214,255,0.36) 78%, rgba(255,255,255,0) 100%)",
          }}
        />
      </div>

      <div
        ref={veilRef}
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(183,113,255,0.03) 28%, rgba(80,28,172,0.05) 56%, rgba(8,2,18,0.1) 100%)",
        }}
      />

      <div
        ref={vignetteRef}
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 38%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.12) 62%, rgba(0,0,0,0.42) 100%)",
        }}
      />
    </div>
  );
}