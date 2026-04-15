"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import IntroScene from "@/app/components/scenes/intro-scene";
import BrandShowcase from "@/app/components/scenes/brand-showcase";
import BrandDetailsScene from "@/app/components/scenes/brand-details-scene";
import WorkScene from "@/app/components/scenes/work-scene";
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
    y: 14,
    scale: 0.995,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.997,
    transition: {
      duration: 0.18,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const cotizaSceneVariants: Variants = {
  initial: {
    opacity: 0,
    y: 28,
    scale: 0.985,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.38,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.992,
    transition: {
      duration: 0.22,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function StageFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto box-border flex h-full w-full max-w-[1220px] flex-col overflow-hidden px-3 pb-3 pt-[86px] sm:px-4 sm:pb-4 sm:pt-[92px] md:px-5 md:pt-[98px] lg:px-6 lg:pt-[106px] xl:px-8 xl:pt-[118px] 2xl:pt-[124px]">
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
                initial={{ opacity: 0, scale: 0.86 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04 }}
                transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-none absolute inset-0 -z-10"
              >
                <div className="absolute left-1/2 top-[16%] h-36 w-36 -translate-x-1/2 rounded-full bg-fuchsia-500/18 blur-3xl md:h-44 md:w-44" />
                <div className="absolute left-[16%] top-[28%] h-28 w-28 rounded-full bg-violet-500/14 blur-3xl md:h-32 md:w-32" />
                <div className="absolute bottom-[16%] right-[14%] h-32 w-32 rounded-full bg-blue-500/12 blur-3xl md:h-40 md:w-40" />
              </motion.div>
            )}

            <motion.div
              initial={
                isCotizaOpen
                  ? { opacity: 0, y: 16, scale: 0.992 }
                  : undefined
              }
              animate={
                isCotizaOpen
                  ? { opacity: 1, y: 0, scale: 1 }
                  : undefined
              }
              exit={
                isCotizaOpen
                  ? { opacity: 0, y: -10, scale: 0.995 }
                  : undefined
              }
              transition={
                isCotizaOpen
                  ? {
                      duration: 0.34,
                      delay: 0.08,
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
      </StageFrame>
    </section>
  );
}