"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FixedHeader from "@/app/components/fixed-header";
import SceneStage from "@/app/components/scene-stage";
import ScrollProgress from "@/app/components/scroll-progress";

export default function Home() {
  const [activeScene, setActiveScene] = useState(0);
  const [activeWorkCard] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const wheelLockRef = useRef(false);
  const totalMainScenes = 4;

  const progress = useMemo(() => {
    if (activeScene === 0) return 0.12;
    if (activeScene === 1) return 0.42;
    if (activeScene === 2) return 0.72;
    if (activeScene === 3) return 1;
    return 0;
  }, [activeScene]);

  const unlockAfterDelay = useCallback(() => {
    window.setTimeout(() => {
      wheelLockRef.current = false;
      setIsAnimating(false);
    }, 720);
  }, []);

  const goNext = useCallback(() => {
    if (activeScene < totalMainScenes - 1) {
      setActiveScene((prev) => prev + 1);
    }
  }, [activeScene, totalMainScenes]);

  const goPrev = useCallback(() => {
    if (activeScene > 0) {
      setActiveScene((prev) => prev - 1);
    }
  }, [activeScene]);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (wheelLockRef.current || isAnimating) return;

      const threshold = 45;
      if (Math.abs(event.deltaY) < threshold) return;

      wheelLockRef.current = true;
      setIsAnimating(true);

      if (event.deltaY > 0) {
        goNext();
      } else {
        goPrev();
      }

      unlockAfterDelay();
    };

    window.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
    };
  }, [goNext, goPrev, isAnimating, unlockAfterDelay]);

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_0%,#6d3cff_0%,#4416a8_22%,#1c103a_58%,#0a0a14_100%)] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18)_0_1px,transparent_1.5px)] bg-[length:180px_180px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:30px_30px]" />
      </div>

      <FixedHeader
        activeScene={activeScene}
        onJump={(index) => {
          if (wheelLockRef.current) return;
          setActiveScene(index);
        }}
      />

      <SceneStage
        activeScene={activeScene}
        activeWorkCard={activeWorkCard}
      />

      <ScrollProgress progress={progress} />

      <div className="pointer-events-none fixed bottom-14 left-1/2 z-40 -translate-x-1/2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/60 backdrop-blur">
        Scroll up / down
      </div>
    </main>
  );
}