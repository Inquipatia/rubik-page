"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import IntroScene from "@/app/components/scenes/intro-scene";
import BrandShowcase from "@/app/components/scenes/brand-showcase";
import BrandDetailsScene from "@/app/components/scenes/brand-details-scene";
import WorkScene from "@/app/components/scenes/work-scene";
import FaqScene from "@/app/components/scenes/faq-scene";
import ContactScene from "@/app/components/scenes/contact-scene";
import CotizaScene from "@/app/components/scenes/cotiza-scene";
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
  const isFaqScene = !isCotizaOpen && !selectedBrand && activeScene === 4;

  // FAQ va fuera del contenedor transformado para que el fondo fixed
  // realmente ocupe todo el viewport y se vea detrás del navbar.
  if (isFaqScene) {
    return (
      <section className="relative z-20 h-[100svh] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key="scene-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-full w-full"
          >
            <FaqScene />
          </motion.div>
        </AnimatePresence>
      </section>
    );
  }

  const currentKey = isCotizaOpen
    ? "cotiza-scene"
    : selectedBrand
      ? `brand-details-${selectedBrand.brandName}`
      : `scene-${activeScene}`;

  const currentVariants = isCotizaOpen
    ? cotizaSceneVariants
    : defaultSceneVariants;

  return (
    <section className="relative z-20 h-[100svh] w-full overflow-hidden">
      <div className="mx-auto box-border flex h-full w-full max-w-6xl flex-col overflow-hidden px-4 pt-[88px] pb-5 md:max-w-7xl md:px-6 md:pt-[96px] md:pb-6 lg:px-10 xl:pt-[104px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentKey}
            variants={currentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative h-full w-full overflow-hidden [transform-style:preserve-3d] [transform:translateZ(0)] will-change-transform"
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
                  {activeScene === 0 && (
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

                  {activeScene === 1 && (
                    <BrandShowcase onOpenBrandDetails={onOpenBrandDetails} />
                  )}

                  {activeScene === 2 && (
                    <WorkScene activeWorkCard={activeWorkCard} />
                  )}

                  {activeScene === 3 && <ContactScene />}
                </>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}