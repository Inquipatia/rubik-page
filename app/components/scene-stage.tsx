"use client";

import { AnimatePresence, motion } from "framer-motion";
import IntroScene from "@/app/components/scenes/intro-scene";
import BrandShowcase from "@/app/components/scenes/brand-showcase";
import WorkScene from "@/app/components/scenes/work-scene";
import FaqScene from "@/app/components/scenes/faq-scene";
import ContactScene from "@/app/components/scenes/contact-scene";

type SceneStageProps = {
  activeScene: number;
  activeWorkCard: number;
  onCubeHoverChange: (isHovered: boolean) => void;
};

export default function SceneStage({
  activeScene,
  activeWorkCard,
  onCubeHoverChange,
}: SceneStageProps) {
  return (
    <section className="relative z-20 mx-auto max-w-[1420px] px-4 pt-3 lg:px-6 lg:pt-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={`scene-${activeScene}`}
          initial={{ opacity: 0, y: 20, scale: 0.995 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.995 }}
          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          className="[transform:translateZ(0)] will-change-transform"
        >
          {activeScene === 0 && (
            <IntroScene
              titleTop="Turn bold ideas"
              titleBottom="into visual impact."
              description="Signage, structures, branding and production with a premium digital experience centered on our animated cube."
              primary="Get started"
              secondary="See our work"
              onCubeHoverChange={onCubeHoverChange}
            />
          )}

          {activeScene === 1 && <BrandShowcase />}

          {activeScene === 2 && <WorkScene activeWorkCard={activeWorkCard} />}

          {activeScene === 3 && <FaqScene />}

          {activeScene === 4 && <ContactScene />}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}