"use client";

import { AnimatePresence, motion } from "framer-motion";
import IntroScene from "@/app/components/scenes/intro-scene";
import WorkScene from "@/app/components/scenes/work-scene";
import FaqScene from "@/app/components/scenes/faq-scene";
import ContactScene from "@/app/components/scenes/contact-scene";

type SceneStageProps = {
  activeScene: number;
  activeWorkCard: number;
};

export default function SceneStage({
  activeScene,
  activeWorkCard,
}: SceneStageProps) {
  return (
    <section className="relative z-20 mx-auto max-w-7xl px-6 pb-12 pt-10 lg:px-10 lg:pt-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={`scene-${activeScene}-${activeWorkCard}`}
          initial={{ opacity: 0, y: 40, scale: 0.985, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -24, scale: 0.99, filter: "blur(8px)" }}
          transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
        >
          {activeScene === 0 && (
            <IntroScene
              titleTop="Turn bold ideas"
              titleBottom="into visual impact."
              description="Signage, structures, branding and production with a premium digital experience centered on our animated cube."
              primary="Get started"
              secondary="See our work"
            />
          )}

          {activeScene === 1 && <WorkScene activeWorkCard={activeWorkCard} />}

          {activeScene === 2 && <FaqScene />}

          {activeScene === 3 && <ContactScene />}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}