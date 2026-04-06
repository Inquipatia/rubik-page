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
    y: 34,
    scale: 0.985,
    filter: "blur(8px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.46,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -18,
    scale: 0.99,
    filter: "blur(6px)",
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const faqSceneVariants: Variants = {
  initial: {
    opacity: 0,
    y: 70,
    scale: 1.01,
    filter: "blur(10px)",
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
    y: -26,
    scale: 0.995,
    filter: "blur(8px)",
    transition: {
      duration: 0.38,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const cotizaSceneVariants: Variants = {
  initial: {
    opacity: 0,
    y: 90,
    scale: 0.93,
    rotateX: 14,
    rotateY: -4,
    filter: "blur(18px)",
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
      duration: 0.78,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -36,
    scale: 0.97,
    rotateX: -8,
    rotateY: 4,
    filter: "blur(12px)",
    transformPerspective: 1400,
    transition: {
      duration: 0.38,
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

  const currentKey = isCotizaOpen
    ? "cotiza-scene"
    : selectedBrand
      ? `brand-details-${selectedBrand.brandName}`
      : `scene-${activeScene}`;

  const currentVariants = isCotizaOpen
    ? cotizaSceneVariants
    : isFaqScene
      ? faqSceneVariants
      : defaultSceneVariants;

  return (
    <section
      className={
        isFaqScene
          ? "relative z-20 h-[100svh] w-full overflow-hidden"
          : "relative z-20 mx-auto max-w-[1420px] px-4 pt-6 lg:px-6 lg:pt-6"
      }
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentKey}
          variants={currentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={
            isFaqScene
              ? "relative h-[100svh] w-full will-change-transform"
              : "relative [transform-style:preserve-3d] [transform:translateZ(0)] will-change-transform"
          }
        >
          {isCotizaOpen && (
            <motion.div
              aria-hidden
              initial={{ opacity: 0, scale: 0.72 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.08 }}
              transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute inset-0 -z-10"
            >
              <div className="absolute left-1/2 top-[16%] h-48 w-48 -translate-x-1/2 rounded-full bg-fuchsia-500/22 blur-3xl" />
              <div className="absolute left-[16%] top-[28%] h-36 w-36 rounded-full bg-violet-500/18 blur-3xl" />
              <div className="absolute bottom-[16%] right-[14%] h-44 w-44 rounded-full bg-blue-500/16 blur-3xl" />
            </motion.div>
          )}

          <motion.div
            initial={
              isCotizaOpen
                ? { opacity: 0, y: 30, scale: 0.985 }
                : isFaqScene
                  ? { opacity: 0, y: 42, scale: 1.005 }
                  : undefined
            }
            animate={
              isCotizaOpen
                ? { opacity: 1, y: 0, scale: 1 }
                : isFaqScene
                  ? { opacity: 1, y: 0, scale: 1 }
                  : undefined
            }
            exit={
              isCotizaOpen
                ? { opacity: 0, y: -18, scale: 0.99 }
                : isFaqScene
                  ? { opacity: 0, y: -18, scale: 0.995 }
                  : undefined
            }
            transition={
              isCotizaOpen
                ? {
                    duration: 0.52,
                    delay: 0.14,
                    ease: [0.16, 1, 0.3, 1],
                  }
                : isFaqScene
                  ? {
                      duration: 0.7,
                      delay: 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }
                  : undefined
            }
            className={isFaqScene ? "h-[100svh]" : undefined}
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

                {activeScene === 4 && <FaqScene />}
              </>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}