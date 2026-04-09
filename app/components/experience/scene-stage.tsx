"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import IntroScene from "@/app/components/scenes/intro-scene";
import BrandShowcase from "@/app/components/scenes/brand-showcase";
import BrandDetailsScene from "@/app/components/scenes/brand-details-scene";
import WorkScene from "@/app/components/scenes/work-scene";
import FaqScene from "@/app/components/scenes/faq-scene";
import ContactScene from "@/app/components/scenes/contact-scene";
import CotizaScene from "@/app/components/scenes/cotiza-scene";
import ContactFaqCloudTransition from "@/app/components/transitions/contact-faq-cloud-transition";
import type { SelectedBrand } from "@/app/page";

type SceneStageProps = {
  activeScene: number;
  activeWorkCard: number;
  onCubeHoverChange: (isHovered: boolean) => void;
  isCotizaOpen: boolean;
  onOpenCotiza: () => void;
  onGoToServicios: () => void;
  onCloseCotiza: () => void;
  selectedBrand: SelectedBrand | null;
  onOpenBrandDetails: (brand: SelectedBrand) => void;
  onCloseBrandDetails: () => void;
};

type TransitionPhase = "idle" | "prepare" | "covering" | "revealing";

const defaultSceneVariants: Variants = {
  initial: {
    opacity: 0,
    y: 28,
    scale: 0.985,
    filter: "blur(8px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.42,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -16,
    scale: 0.992,
    filter: "blur(6px)",
    transition: {
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const cotizaSceneVariants: Variants = {
  initial: {
    opacity: 0,
    y: 72,
    scale: 0.95,
    rotateX: 12,
    rotateY: -4,
    filter: "blur(16px)",
    transformPerspective: 1400,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    rotateY: 0,
    filter: "blur(0px)",
    transformPerspective: 1400,
    transition: {
      duration: 0.72,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -30,
    scale: 0.975,
    rotateX: -8,
    rotateY: 4,
    filter: "blur(12px)",
    transformPerspective: 1400,
    transition: {
      duration: 0.34,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function StageFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto box-border flex h-full w-full max-w-6xl flex-col overflow-hidden px-4 pb-5 pt-[88px] md:max-w-7xl md:px-6 md:pb-6 md:pt-[96px] lg:px-10 xl:pt-[104px]">
      <div className="relative h-full w-full overflow-hidden">{children}</div>
    </div>
  );
}

export default function SceneStage({
  activeScene,
  activeWorkCard,
  onCubeHoverChange,
  isCotizaOpen,
  onOpenCotiza,
  onGoToServicios,
  onCloseCotiza,
  selectedBrand,
  onOpenBrandDetails,
  onCloseBrandDetails,
}: SceneStageProps) {
  const prevSceneRef = useRef(activeScene);
  const transitionRafRef = useRef<number | null>(null);

  const [visualScene, setVisualScene] = useState(activeScene);
  const [isContactFaqTransition, setIsContactFaqTransition] = useState(false);
  const [transitionPhase, setTransitionPhase] =
    useState<TransitionPhase>("idle");

  useEffect(() => {
    return () => {
      if (transitionRafRef.current) {
        cancelAnimationFrame(transitionRafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const prevScene = prevSceneRef.current;

    const shouldStartContactToFaq =
      !isCotizaOpen &&
      !selectedBrand &&
      prevScene === 3 &&
      activeScene === 4 &&
      !isContactFaqTransition;

    if (shouldStartContactToFaq) {
      setVisualScene(3);
      setIsContactFaqTransition(true);
      setTransitionPhase("prepare");

      transitionRafRef.current = requestAnimationFrame(() => {
        setTransitionPhase("covering");
      });
    } else if (!isContactFaqTransition) {
      setVisualScene(activeScene);
    }

    prevSceneRef.current = activeScene;
  }, [activeScene, isCotizaOpen, selectedBrand, isContactFaqTransition]);

  const handleCloudsCovered = useCallback(() => {
  setTransitionPhase("revealing");
}, []);

  const handleCloudsFinished = useCallback(() => {
  setIsContactFaqTransition(false);
  setTransitionPhase("idle");
  setVisualScene(4);
}, []);

  const shouldUseFaqStage =
    !isCotizaOpen &&
    !selectedBrand &&
    (visualScene === 4 || isContactFaqTransition);

  const contactLayerHidden =
    transitionPhase === "covering" || transitionPhase === "revealing";

  const faqLayerVisible = !isContactFaqTransition && visualScene === 4;

  if (shouldUseFaqStage) {
    return (
      <section className="relative z-20 h-[100svh] w-full overflow-hidden">
        <div className="relative h-full w-full">
          {isContactFaqTransition && (
            <div
              className={`absolute inset-0 z-20 transition-[opacity,transform,filter] duration-[950ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${contactLayerHidden
                  ? "translate-y-12 scale-[0.965] opacity-0 blur-[14px]"
                  : "translate-y-0 scale-100 opacity-100 blur-0"
                }`}
            >
              <StageFrame>
                <ContactScene />
              </StageFrame>
            </div>
          )}

          <div
            className={`absolute inset-0 ${isContactFaqTransition ? "z-10" : "z-20"
              } transition-[opacity,transform,filter] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${faqLayerVisible
                ? "translate-y-0 scale-100 opacity-100 blur-0"
                : "translate-y-6 scale-[0.988] opacity-0 blur-[12px]"
              }`}
          >
            <FaqScene />
          </div>

          <ContactFaqCloudTransition
            active={isContactFaqTransition}
            onCovered={handleCloudsCovered}
            onFinished={handleCloudsFinished}
          />
        </div>
      </section>
    );
  }

  const currentKey = isCotizaOpen
    ? "cotiza-scene"
    : selectedBrand
      ? `brand-details-${selectedBrand.brandName}`
      : `scene-${visualScene}`;

  const currentVariants = isCotizaOpen
    ? cotizaSceneVariants
    : defaultSceneVariants;

  return (
    <section className="relative z-20 h-[100svh] w-full overflow-hidden">
      <StageFrame>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentKey}
            variants={currentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative h-full w-full overflow-hidden [transform:translateZ(0)] [transform-style:preserve-3d] will-change-transform"
          >
            {isCotizaOpen && (
              <motion.div
                aria-hidden
                initial={{ opacity: 0, scale: 0.76 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.06 }}
                transition={{ duration: 0.68, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-none absolute inset-0 -z-10"
              >
                <div className="absolute left-1/2 top-[16%] h-40 w-40 -translate-x-1/2 rounded-full bg-fuchsia-500/22 blur-3xl md:h-48 md:w-48" />
                <div className="absolute left-[16%] top-[28%] h-32 w-32 rounded-full bg-violet-500/18 blur-3xl md:h-36 md:w-36" />
                <div className="absolute bottom-[16%] right-[14%] h-36 w-36 rounded-full bg-blue-500/16 blur-3xl md:h-44 md:w-44" />
              </motion.div>
            )}

            <motion.div
              initial={
                isCotizaOpen
                  ? { opacity: 0, y: 24, scale: 0.99 }
                  : undefined
              }
              animate={
                isCotizaOpen
                  ? { opacity: 1, y: 0, scale: 1 }
                  : undefined
              }
              exit={
                isCotizaOpen
                  ? { opacity: 0, y: -16, scale: 0.992 }
                  : undefined
              }
              transition={
                isCotizaOpen
                  ? {
                    duration: 0.48,
                    delay: 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }
                  : undefined
              }
              className="h-full w-full overflow-hidden"
            >
              {isCotizaOpen ? (
                <CotizaScene onClose={onCloseCotiza} />
              ) : selectedBrand ? (
                <BrandDetailsScene
                  brandName={selectedBrand.brandName}
                  brandLogo={selectedBrand.brandLogo}
                  description={selectedBrand.description}
                  works={selectedBrand.works}
                  onBack={onCloseBrandDetails}
                />
              ) : (
                <>
                  {visualScene === 0 && (
                    <IntroScene
                      titleTop="EL EQUIPO QUE"
                      titleBottom="CONCRETA TUS IDEAS"
                      description="CON MÁS DE 100 TRABAJOS REALIZADOS, RUBIK CREACIONES CRECE CONTIGO, ¿QUÉ ESPERAS PARA TRABAJAR JUNTOS?"
                      primary="Cotiza con nosotros"
                      secondary="Ver nuestros trabajos"
                      onCubeHoverChange={onCubeHoverChange}
                      onOpenCotiza={onOpenCotiza}
                      onGoToServicios={onGoToServicios}
                    />
                  )}

                  {visualScene === 1 && (
                    <BrandShowcase onOpenBrandDetails={onOpenBrandDetails} />
                  )}

                  {visualScene === 2 && (
                    <WorkScene activeWorkCard={activeWorkCard} />
                  )}

                  {visualScene === 3 && <ContactScene />}
                </>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </StageFrame>
    </section>
  );
}