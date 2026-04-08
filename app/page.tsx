"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FixedHeader from "@/app/components/fixed-header";
import SceneStage from "@/app/components/scene-stage";
import ScrollProgress from "@/app/components/scroll-progress";
import FloatingSocialOrb from "@/app/components/scenes/floating-social-orb";

export type BrandWorkItem = {
  image: string;
  title?: string;
  description?: string;
};

export type SelectedBrand = {
  brandName: string;
  brandLogo?: string;
  description: string;
  works: BrandWorkItem[];
};

export default function Home() {
  const [activeScene, setActiveScene] = useState(0);
  const [sceneDirection, setSceneDirection] = useState<1 | -1>(1);
  const [activeWorkCard] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCubeHovered, setIsCubeHovered] = useState(false);
  const [isCotizaOpen, setIsCotizaOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<SelectedBrand | null>(null);

  const wheelLockRef = useRef(false);
  const totalMainScenes = 5;

  const progress = useMemo(() => {
    if (activeScene === 0) return 0.08;
    if (activeScene === 1) return 0.28;
    if (activeScene === 2) return 0.52;
    if (activeScene === 3) return 0.76;
    if (activeScene === 4) return 1;
    return 0;
  }, [activeScene]);

  const unlockAfterDelay = useCallback(() => {
    window.setTimeout(() => {
      wheelLockRef.current = false;
      setIsAnimating(false);
    }, 820);
  }, []);

  const goNext = useCallback(() => {
    if (isCotizaOpen || selectedBrand) return;

    if (activeScene < totalMainScenes - 1) {
      setSceneDirection(1);
      setActiveScene((prev) => prev + 1);
    }
  }, [activeScene, totalMainScenes, isCotizaOpen, selectedBrand]);

  const goPrev = useCallback(() => {
    if (isCotizaOpen || selectedBrand) return;

    if (activeScene > 0) {
      setSceneDirection(-1);
      setActiveScene((prev) => prev - 1);
    }
  }, [activeScene, isCotizaOpen, selectedBrand]);

  const handleJump = useCallback(
    (index: number) => {
      if (wheelLockRef.current) return;

      wheelLockRef.current = true;
      setIsAnimating(true);

      if (index !== activeScene) {
        setSceneDirection(index > activeScene ? 1 : -1);
      }

      setIsCotizaOpen(false);
      setSelectedBrand(null);
      setActiveScene(index);

      unlockAfterDelay();
    },
    [activeScene, unlockAfterDelay]
  );

  const handleOpenCotiza = useCallback(() => {
    setSelectedBrand(null);
    setIsCotizaOpen(true);
    wheelLockRef.current = true;
    setIsAnimating(true);
    unlockAfterDelay();
  }, [unlockAfterDelay]);

  const handleCloseCotiza = useCallback(() => {
    wheelLockRef.current = true;
    setIsAnimating(true);

    setIsCotizaOpen(false);

    unlockAfterDelay();
  }, [unlockAfterDelay]);

  const handleOpenBrandDetails = useCallback(
    (brand: SelectedBrand) => {
      wheelLockRef.current = true;
      setIsAnimating(true);

      setIsCotizaOpen(false);
      setSelectedBrand(brand);

      unlockAfterDelay();
    },
    [unlockAfterDelay]
  );

  const handleCloseBrandDetails = useCallback(() => {
    wheelLockRef.current = true;
    setIsAnimating(true);

    setSelectedBrand(null);

    unlockAfterDelay();
  }, [unlockAfterDelay]);

  const handleGoToServicios = useCallback(() => {
    wheelLockRef.current = true;
    setIsAnimating(true);

    setSceneDirection(1);
    setIsCotizaOpen(false);
    setSelectedBrand(null);
    setActiveScene(2);

    unlockAfterDelay();
  }, [unlockAfterDelay]);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (isCotizaOpen) return;
      if (selectedBrand) return;
      if (isCubeHovered) return;
      if (wheelLockRef.current || isAnimating) return;

      const threshold = 52;
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
  }, [
    goNext,
    goPrev,
    isAnimating,
    unlockAfterDelay,
    isCubeHovered,
    isCotizaOpen,
    selectedBrand,
  ]);

  return (
    <main className="relative h-[100svh] w-full overflow-hidden text-white">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,#7a4dff_0%,#4e1cbb_18%,#23114a_54%,#090912_100%)]" />
        <div className="absolute inset-0 opacity-80">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.16)_0_1px,transparent_1.5px)] bg-[length:180px_180px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.045)_0,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:30px_30px]" />
          <div className="absolute left-[8%] top-[10%] h-52 w-52 rounded-full bg-fuchsia-500/12 blur-3xl" />
          <div className="absolute right-[10%] top-[12%] h-56 w-56 rounded-full bg-violet-500/12 blur-3xl" />
          <div className="absolute bottom-[8%] left-[30%] h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
        </div>
      </div>

      <div className="relative z-10 h-full w-full">
        <FixedHeader
          activeScene={activeScene}
          onJump={handleJump}
          onOpenCotiza={handleOpenCotiza}
          isCotizaOpen={isCotizaOpen}
        />

        <SceneStage
          activeScene={activeScene}
          activeWorkCard={activeWorkCard}
          onCubeHoverChange={setIsCubeHovered}
          isCotizaOpen={isCotizaOpen}
          onOpenCotiza={handleOpenCotiza}
          onGoToServicios={handleGoToServicios}
          onCloseCotiza={handleCloseCotiza}
          selectedBrand={selectedBrand}
          onOpenBrandDetails={handleOpenBrandDetails}
          onCloseBrandDetails={handleCloseBrandDetails}
        />

        {!isCotizaOpen && !selectedBrand && <ScrollProgress progress={progress} />}

        {!isCotizaOpen && !selectedBrand && (
          <div className="pointer-events-none fixed bottom-10 left-1/2 z-40 -translate-x-1/2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/60 backdrop-blur">
            Gira arriba / abajo
          </div>
        )}

        {!isCotizaOpen && !selectedBrand && <FloatingSocialOrb />}
      </div>
    </main>
  );
}