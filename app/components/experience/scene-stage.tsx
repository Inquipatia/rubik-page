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
    y: 18,
    scale: 0.992,
    filter: "blur(6px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.34,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.996,
    filter: "blur(4px)",
    transition: {
      duration: 0.22,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const cotizaSceneVariants: Variants = {
  initial: {
    opacity: 0,
    y: 46,
    scale: 0.97,
    rotateX: 8,
    rotateY: -3,
    filter: "blur(12px)",
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
      duration: 0.56,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -18,
    scale: 0.985,
    rotateX: -5,
    rotateY: 2,
    filter: "blur(8px)",
    transformPerspective: 1400,
    transition: {
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function StageFrame({
  children,
  allowOverflow = false,
}: {
  children: React.ReactNode;
  allowOverflow?: boolean;
}) {
  return (
    <div
      className={`mx-auto box-border flex h-full w-full flex-col pb-3 pt-[96px] sm:pb-4 sm:pt-[102px] md:pt-[108px] lg:pt-[114px] xl:pt-[120px] ${
        allowOverflow
          ? "max-w-[1380px] overflow-visible pl-3 pr-0 sm:pl-4 sm:pr-0 md:pl-5 md:pr-0 lg:pl-6 lg:pr-0 xl:pl-8 xl:pr-0 2xl:max-w-[1460px] 2xl:pl-8 2xl:pr-0"
          : "max-w-[1220px] overflow-hidden px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8"
      }`}
    >
      <div
        className={`relative h-full w-full ${
          allowOverflow ? "overflow-visible" : "overflow-hidden"
        }`}
      >
        {children}
      </div>
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

  const shouldUseFaqStage =
    !isCotizaOpen && !selectedBrand && activeScene === 4;

  const isWorkStage = !isCotizaOpen && !selectedBrand && activeScene === 2;

  if (shouldUseFaqStage) {
    return (
      <section className="relative z-20 h-[100svh] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key="scene-4"
            variants={defaultSceneVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative h-full w-full overflow-hidden"
          >
          </motion.div>
        </AnimatePresence>
      </section>
    );
  }

  return (
    <section
      className={`relative z-20 h-[100svh] w-full ${
        isWorkStage ? "overflow-visible" : "overflow-hidden"
      }`}
    >
      <StageFrame allowOverflow={isWorkStage}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentKey}
            variants={currentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`relative h-full w-full [transform:translateZ(0)] [transform-style:preserve-3d] will-change-transform ${
              isWorkStage ? "overflow-visible" : "overflow-hidden"
            }`}
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
              className={`h-full w-full ${
                isWorkStage ? "overflow-visible" : "overflow-hidden"
              }`}
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