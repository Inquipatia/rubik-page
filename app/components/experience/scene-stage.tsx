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
  onCubeHoverChange: (hovered: boolean) => void;
  isCotizaOpen: boolean;
  onOpenCotiza: () => void;
  onGoToServicios: () => void;
  onCloseCotiza: () => void;
  selectedBrand: SelectedBrand | null;
  onOpenBrandDetails: (brand: SelectedBrand) => void;
  onCloseBrandDetails: () => void;
  servicesResetKey: number;
};

const defaultSceneVariants: Variants = {
  initial: {
    opacity: 0,
    y: 28,
    scale: 0.985,
    filter: "blur(14px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.78,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -34,
    scale: 0.975,
    filter: "blur(16px)",
    transition: {
      duration: 0.52,
      ease: [0.7, 0, 0.84, 0],
    },
  },
};

const introToBrandsVariants: Variants = {
  initial: {
    opacity: 0,
    y: 46,
    scale: 0.965,
    filter: "blur(18px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1.05,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -52,
    scale: 1.025,
    filter: "blur(22px)",
    transition: {
      duration: 0.7,
      ease: [0.7, 0, 0.84, 0],
    },
  },
};

const cotizaSceneVariants: Variants = {
  initial: {
    opacity: 0,
    y: 18,
    filter: "blur(12px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -14,
    filter: "blur(12px)",
    transition: {
      duration: 0.42,
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
    <div className="mx-auto box-border flex h-full w-full max-w-[1220px] flex-col px-3 pb-3 pt-[96px] sm:px-4 sm:pb-4 sm:pt-[102px] md:px-5 md:pt-[108px] lg:px-6 lg:pt-[114px] xl:px-8 xl:pt-[120px]">
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
  servicesResetKey,
}: SceneStageProps) {
  const currentKey = isCotizaOpen
    ? "cotiza-scene"
    : selectedBrand
      ? `brand-details-${selectedBrand.brandName}`
      : `scene-${activeScene}`;

  const isIntroStage = !isCotizaOpen && !selectedBrand && activeScene === 0;
  const isBrandsStage = !isCotizaOpen && !selectedBrand && activeScene === 1;
  const isWorkStage = !isCotizaOpen && !selectedBrand && activeScene === 2;
  const isContactStage = !isCotizaOpen && !selectedBrand && activeScene === 3;
  const isBrandDetailsStage = !isCotizaOpen && !!selectedBrand;

  const currentVariants = isCotizaOpen
    ? cotizaSceneVariants
    : isBrandsStage
      ? introToBrandsVariants
      : defaultSceneVariants;

  const shouldUseFaqStage =
    !isCotizaOpen && !selectedBrand && activeScene === 4;

  /**
   * Importante:
   * Contacto y Cotiza usan animaciones con y / scale / blur.
   * Si el wrapper queda con overflow-hidden, durante la transición se corta texto,
   * botones o cards. Por eso ahora también permitimos overflow en Contacto y Cotiza.
   */
  const allowWideInteraction =
    isIntroStage ||
    isBrandsStage ||
    isWorkStage ||
    isContactStage ||
    isBrandDetailsStage ||
    isCotizaOpen;

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
          />
        </AnimatePresence>
      </section>
    );
  }

  return (
    <section
      className={`relative z-20 h-[100svh] w-full ${
        allowWideInteraction ? "overflow-visible" : "overflow-hidden"
      }`}
    >
      <StageFrame allowOverflow={allowWideInteraction}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentKey}
            variants={currentVariants}
            initial={isIntroStage ? false : "initial"}
            animate="animate"
            exit="exit"
            className={`relative h-full w-full [transform:translateZ(0)] [transform-style:preserve-3d] will-change-transform ${
              allowWideInteraction ? "overflow-visible" : "overflow-hidden"
            }`}
          >
            {isCotizaOpen && (
              <motion.div
                aria-hidden
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-none absolute inset-0 -z-10"
              >
                <div className="absolute left-1/2 top-[16%] h-36 w-36 -translate-x-1/2 rounded-full bg-fuchsia-500/18 blur-3xl md:h-44 md:w-44" />
                <div className="absolute left-[16%] top-[28%] h-28 w-28 rounded-full bg-violet-500/14 blur-3xl md:h-32 md:w-32" />
                <div className="absolute bottom-[16%] right-[14%] h-32 w-32 rounded-full bg-blue-500/12 blur-3xl md:h-40 md:w-40" />
              </motion.div>
            )}

            <motion.div
              initial={isCotizaOpen ? { opacity: 0, y: 10 } : undefined}
              animate={isCotizaOpen ? { opacity: 1, y: 0 } : undefined}
              exit={isCotizaOpen ? { opacity: 0, y: -6 } : undefined}
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
                allowWideInteraction ? "overflow-visible" : "overflow-hidden"
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
                    <WorkScene
                      activeWorkCard={activeWorkCard}
                      servicesResetKey={servicesResetKey}
                    />
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