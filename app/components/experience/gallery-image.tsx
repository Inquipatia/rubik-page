"use client";

import { useEffect, useState, type ComponentProps, type MouseEvent } from "react";
import Image, { getImageProps } from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Props = Omit<ComponentProps<typeof Image>, "src" | "fill"> & { src: string; fallbackSrc?: string; adjacentSources?: string[] };

// With object-contain, letterboxing belongs to the backdrop, not the image.
export function keepImageClickInside(event: MouseEvent<HTMLImageElement>) {
  const image = event.currentTarget;
  const rect = image.getBoundingClientRect();
  const scale = Math.min(rect.width / image.naturalWidth, rect.height / image.naturalHeight);
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  if (Math.abs(event.clientX - rect.left - rect.width / 2) <= width / 2 &&
      Math.abs(event.clientY - rect.top - rect.height / 2) <= height / 2) event.stopPropagation();
}

/** Keep the last decoded image visible while its replacement loads. */
export default function GalleryImage({ fallbackSrc, adjacentSources, ...props }: Props) {
  const reduceMotion = useReducedMotion();
  const [displayed, setDisplayed] = useState(props);
  const pending = displayed.src !== props.src;
  const adjacentKey = [...new Set(adjacentSources ?? [])].filter(src => src !== props.src).slice(0, 2).join("\n");
  const sizes = props.sizes;
  useEffect(() => {
    if (!adjacentKey) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;
    for (const src of adjacentKey.split("\n")) {
      const optimized = getImageProps({ src, alt: "", fill: true, sizes }).props;
      const image = new window.Image();
      image.decoding = "async";
      image.sizes = optimized.sizes ?? "100vw";
      image.srcset = optimized.srcSet ?? "";
      image.src = optimized.src;
    }
  }, [adjacentKey, sizes]);

  return (
    <>
      <AnimatePresence initial={false}>
        <motion.div
          key={displayed.src}
          data-gallery-image={displayed.src}
          initial={{ opacity: 0, x: reduceMotion ? 0 : 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.1 : 0.28, ease: [0.22, 1, 0.36, 1] }}
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
