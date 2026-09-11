"use client";

import { useEffect, useRef, type RefObject } from "react";
import { createPortal } from "react-dom";

/** Keep the existing card in its styled scene; cover every point outside it. */
export function BrandDismissBackdrop({ contentRef, onClose }: {
  contentRef: RefObject<HTMLElement | null>;
  onClose: () => void;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const pointerStart = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const content = contentRef.current;
    const backdrop = backdropRef.current;
    if (!content || !backdrop) return;
    let frame = 0;
    const settleUntil = performance.now() + 1500;
    let lastBounds = "";
    const update = () => {
      cancelAnimationFrame(frame);
      const box = content.getBoundingClientRect();
      const parent = content.parentElement!.getBoundingClientRect();
      const left = Math.max(0, box.left), right = Math.min(innerWidth, box.right);
      const top = Math.max(0, box.top, parent.top), bottom = Math.min(innerHeight, box.bottom, parent.bottom);
      const bounds = `${left},${right},${top},${bottom},${innerWidth},${innerHeight}`;
      if (bounds !== lastBounds) {
        // An even-odd hole lets native pointer/scroll/text-selection events reach
        // the actual card, without moving it out of its responsive ancestors.
        backdrop.style.clipPath = `polygon(evenodd, 0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${left}px ${top}px, ${right}px ${top}px, ${right}px ${bottom}px, ${left}px ${bottom}px, ${left}px ${top}px)`;
        lastBounds = bounds;
      }
      if (performance.now() < settleUntil) frame = requestAnimationFrame(update);
    };
    update();
    const observer = new ResizeObserver(update);
    const preventScroll = (event: Event) => event.preventDefault();
    backdrop.addEventListener("wheel", preventScroll, { passive: false });
    backdrop.addEventListener("touchmove", preventScroll, { passive: false });
    observer.observe(content);
    observer.observe(content.parentElement!);
    window.addEventListener("resize", update);
    document.addEventListener("scroll", update, true);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      backdrop.removeEventListener("wheel", preventScroll);
      backdrop.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("resize", update);
      document.removeEventListener("scroll", update, true);
    };
  }, [contentRef]);

  return typeof document !== "undefined" ? createPortal(
    <div ref={backdropRef} data-brand-backdrop aria-hidden="true"
      className="fixed inset-0 z-[200] bg-transparent"
      onPointerDown={event => { pointerStart.current = { x: event.clientX, y: event.clientY }; }}
      onClick={event => {
        if (Math.hypot(event.clientX - pointerStart.current.x, event.clientY - pointerStart.current.y) < 8) onClose();
      }}
    />, document.body,
  ) : null;
}
