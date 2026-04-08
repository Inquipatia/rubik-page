"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type FaqGsapTransitionProps = {
  active: boolean;
  onFinished: () => void;
};

export default function FaqGsapTransition({
  active,
  onFinished,
}: FaqGsapTransitionProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  const skyRef = useRef<HTMLDivElement>(null);
  const glowTopRef = useRef<HTMLDivElement>(null);
  const hazeRef = useRef<HTMLDivElement>(null);

  const cloudMassRef = useRef<HTMLDivElement>(null);
  const cloudLeftRef = useRef<HTMLDivElement>(null);
  const cloudRightRef = useRef<HTMLDivElement>(null);
  const cloudMidRef = useRef<HTMLDivElement>(null);
  const cloudBottomRef = useRef<HTMLDivElement>(null);

  const veilRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!active) return;

      const root = rootRef.current;
      const sky = skyRef.current;
      const glowTop = glowTopRef.current;
      const haze = hazeRef.current;
      const cloudMass = cloudMassRef.current;
      const cloudLeft = cloudLeftRef.current;
      const cloudRight = cloudRightRef.current;
      const cloudMid = cloudMidRef.current;
      const cloudBottom = cloudBottomRef.current;
      const veil = veilRef.current;
      const vignette = vignetteRef.current;

      if (
        !root ||
        !sky ||
        !glowTop ||
        !haze ||
        !cloudMass ||
        !cloudLeft ||
        !cloudRight ||
        !cloudMid ||
        !cloudBottom ||
        !veil ||
        !vignette
      ) {
        return;
      }

      gsap.set(root, { autoAlpha: 1 });

      gsap.set(sky, {
        scale: 1,
        yPercent: 0,
        force3D: true,
        transformOrigin: "50% 50%",
      });

      gsap.set(glowTop, {
        autoAlpha: 0.9,
        yPercent: 0,
        force3D: true,
      });

      gsap.set(haze, {
        autoAlpha: 0.72,
        yPercent: 0,
        force3D: true,
      });

      gsap.set(cloudMass, {
        autoAlpha: 1,
        yPercent: 0,
        scale: 1,
        force3D: true,
        transformOrigin: "50% 50%",
      });

      gsap.set([cloudLeft, cloudRight, cloudMid, cloudBottom], {
        autoAlpha: 1,
        yPercent: 0,
        xPercent: 0,
        scale: 1,
        force3D: true,
      });

      gsap.set(veil, {
        autoAlpha: 0.3,
      });

      gsap.set(vignette, {
        autoAlpha: 0.62,
      });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: onFinished,
      });

      tl.to(
        sky,
        {
          duration: 0.9,
          scale: 1.025,
          yPercent: -2,
          ease: "power1.out",
        },
        0
      )
        .to(
          glowTop,
          {
            duration: 1.05,
            autoAlpha: 0.78,
            yPercent: -6,
            ease: "power1.out",
          },
          0
        )
        .to(
          haze,
          {
            duration: 1.05,
            autoAlpha: 0.2,
            yPercent: -8,
            ease: "power1.out",
          },
          0.1
        )
        .to(
          cloudMass,
          {
            duration: 1.2,
            yPercent: -8,
            scale: 1.035,
            autoAlpha: 0.66,
            ease: "power2.out",
          },
          0.12
        )
        .to(
          cloudLeft,
          {
            duration: 1.18,
            xPercent: -7,
            yPercent: -16,
            scale: 1.06,
            autoAlpha: 0.5,
            ease: "power2.out",
          },
          0.18
        )
        .to(
          cloudRight,
          {
            duration: 1.22,
            xPercent: 7,
            yPercent: -15,
            scale: 1.06,
            autoAlpha: 0.48,
            ease: "power2.out",
          },
          0.2
        )
        .to(
          cloudMid,
          {
            duration: 1.1,
            xPercent: 4,
            yPercent: -11,
            scale: 1.04,
            autoAlpha: 0.42,
            ease: "power2.out",
          },
          0.26
        )
        .to(
          cloudBottom,
          {
            duration: 1.04,
            xPercent: -4,
            yPercent: -8,
            scale: 1.03,
            autoAlpha: 0.32,
            ease: "power2.out",
          },
          0.32
        )
        .to(
          veil,
          {
            duration: 0.9,
            autoAlpha: 0.5,
            ease: "power1.out",
          },
          0.46
        )
        .to(
          [cloudMass, cloudLeft, cloudRight, cloudMid, cloudBottom],
          {
            duration: 0.55,
            autoAlpha: 0,
            ease: "power2.out",
          },
          1.02
        )
        .to(
          root,
          {
            duration: 0.42,
            autoAlpha: 0,
            ease: "power2.out",
          },
          1.22
        );

      return () => {
        tl.kill();
      };
    },
    {
      scope: rootRef,
      dependencies: [active, onFinished],
      revertOnUpdate: true,
    }
  );

  if (!active) return null;

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-[80] overflow-hidden"
      aria-hidden="true"
    >
      {/* Cielo morado base */}
      <div
        ref={skyRef}
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #efe6ff 0%, #dcc8ff 14%, #bb94ff 30%, #8a51f6 48%, #4b1b9d 70%, #1b063e 100%)",
        }}
      />

      {/* Luz superior suave */}
      <div
        ref={glowTopRef}
        className="absolute inset-x-[-10%] top-[-14%] h-[54vh] blur-[72px]"
        style={{
          background:
            "radial-gradient(circle at 50% 28%, rgba(255,255,255,0.95) 0%, rgba(242,224,255,0.72) 22%, rgba(203,154,255,0.26) 50%, rgba(255,255,255,0) 78%)",
        }}
      />

      {/* Bruma general */}
      <div
        ref={hazeRef}
        className="absolute inset-x-[-8%] top-[8%] h-[42vh] blur-[68px]"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(222,196,255,0.16) 32%, rgba(164,107,255,0.10) 56%, rgba(255,255,255,0) 100%)",
        }}
      />

      {/* Masa principal de nube, para que se sienta volumen real */}
      <div
        ref={cloudMassRef}
        className="absolute inset-x-[-16%] top-[-10%] h-[72vh] blur-[88px] mix-blend-screen"
        style={{
          background:
            "radial-gradient(ellipse at 50% 34%, rgba(255,255,255,0.88) 0%, rgba(236,216,255,0.58) 24%, rgba(193,143,255,0.24) 52%, rgba(255,255,255,0) 82%)",
        }}
      />

      {/* Nubes moradas visibles */}
      <div
        ref={cloudLeftRef}
        className="absolute left-[-12%] top-[4%] h-[34vh] w-[44vw] rounded-full blur-[54px] mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.88) 0%, rgba(229,205,255,0.74) 28%, rgba(183,126,255,0.34) 58%, rgba(255,255,255,0) 100%)",
        }}
      />

      <div
        ref={cloudRightRef}
        className="absolute right-[-10%] top-[6%] h-[32vh] w-[42vw] rounded-full blur-[56px] mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.86) 0%, rgba(223,194,255,0.68) 30%, rgba(169,107,255,0.30) 60%, rgba(255,255,255,0) 100%)",
        }}
      />

      <div
        ref={cloudMidRef}
        className="absolute left-[18%] top-[24%] h-[24vh] w-[26vw] rounded-full blur-[46px] mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(242,228,255,0.76) 0%, rgba(208,175,255,0.50) 34%, rgba(159,98,255,0.20) 64%, rgba(255,255,255,0) 100%)",
        }}
      />

      <div
        ref={cloudBottomRef}
        className="absolute right-[16%] top-[30%] h-[22vh] w-[24vw] rounded-full blur-[44px] mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(236,222,255,0.62) 0%, rgba(198,162,255,0.38) 34%, rgba(146,88,255,0.14) 66%, rgba(255,255,255,0) 100%)",
        }}
      />

      {/* Velo muy suave para transición */}
      <div
        ref={veilRef}
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.03) 34%, rgba(90,38,180,0.08) 60%, rgba(18,4,45,0.16) 100%)",
        }}
      />

      {/* Viñeta para profundidad */}
      <div
        ref={vignetteRef}
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 38%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.08) 54%, rgba(0,0,0,0.34) 100%)",
        }}
      />
    </div>
  );
}