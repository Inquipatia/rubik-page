"use client";

import { useState, type ComponentProps } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Props = Omit<ComponentProps<typeof Image>, "src" | "fill"> & { src: string; fallbackSrc?: string };

/** Keep the last decoded image visible while its replacement loads. */
export default function GalleryImage({ fallbackSrc, ...props }: Props) {
  const reduceMotion = useReducedMotion();
  const [displayed, setDisplayed] = useState(props);
  const pending = displayed.src !== props.src;

  return (
    <>
      <AnimatePresence initial={false}>
        <motion.div
          key={displayed.src}
          initial={{ opacity: 0, x: reduceMotion ? 0 : 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.1 : 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image {...displayed} alt={displayed.alt} fill loading="eager" onError={() => {
            if (fallbackSrc && displayed.src !== fallbackSrc) setDisplayed({ ...props, src: fallbackSrc });
          }} />
        </motion.div>
      </AnimatePresence>
      {pending && (
        <Image
          {...props}
          key={props.src}
          fill
          alt=""
          aria-hidden="true"
          loading="eager"
          className="pointer-events-none invisible object-cover"
          onLoad={() => setDisplayed(props)}
          onError={() => {
            if (fallbackSrc) setDisplayed({ ...props, src: fallbackSrc });
          }}
        />
      )}
    </>
  );
}
