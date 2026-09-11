"use client";

import { useEffect, useEffectEvent, useRef, type RefObject } from "react";

// Enable only while calibrating locally. Production never renders this overlay.
const DEBUG_ORB_INTERACTION = false;
const CENTER = { x: 153 / 260, y: 139 / 260 };
const RADIUS = 50 / 260;
const HYSTERESIS = 3 / 260;
// Revealed social buttons remain reachable, but cannot activate the closed orb.
const SOCIAL = [
  { x: 153 / 260, y: 52 / 260 },
  { x: 74 / 260, y: 87 / 260 },
  { x: 52 / 260, y: 147 / 260 },
  { x: 89 / 260, y: 215 / 260 },
];

type Options = {
  wrapper: RefObject<HTMLDivElement | null>;
  enabled: boolean;
  resetKey: unknown;
  onEnter: () => void;
  onLeave: (resumeIdle: boolean) => void;
  onMove: (point: { clientX: number; clientY: number }) => void;
};

export function useOrbInteraction({ wrapper, enabled, resetKey, onEnter, onLeave, onMove }: Options) {
  const active = useRef(false);
  const enter = useEffectEvent(onEnter);
  const leave = useEffectEvent(onLeave);
  const move = useEffectEvent(onMove);

  useEffect(() => {
    const root = wrapper.current;
    if (!root || !enabled) return;
    const surface = root.querySelector<HTMLElement>(".rubik-orb-spline");
    if (!surface) return;
    let rect: DOMRect | null = null;
    let frame = 0;
    let point = { clientX: 0, clientY: 0 };
    let transitions = 0;
    let lastTransition = "—";
    let disposing = false;
    let overlay: HTMLDivElement | undefined;
    let marker: HTMLDivElement | undefined;
    let label: HTMLDivElement | undefined;

    if (process.env.NODE_ENV === "development" && DEBUG_ORB_INTERACTION) {
      overlay = document.createElement("div");
      overlay.dataset.orbDebug = "";
      overlay.style.cssText = "position:absolute;inset:0;pointer-events:none;z-index:2";
      const circle = document.createElement("div");
      circle.style.cssText = `position:absolute;left:${CENTER.x * 100}%;top:${CENTER.y * 100}%;width:${RADIUS * 200}%;height:${RADIUS * 200}%;border:1px solid lime;border-radius:50%;transform:translate(-50%,-50%);background:radial-gradient(circle,lime 0 2px,transparent 3px)`;
      marker = document.createElement("div");
      marker.style.cssText = "position:absolute;width:5px;height:5px;background:red;border-radius:50%;transform:translate(-50%,-50%)";
      label = document.createElement("div");
      label.style.cssText = "position:absolute;top:0;left:0;color:lime;background:#000b;font:11px monospace";
      overlay.append(circle, marker, label);
      for (const icon of SOCIAL) {
        const zone = document.createElement("div");
        zone.style.cssText = `position:absolute;left:${icon.x * 100}%;top:${icon.y * 100}%;width:${58 / 260 * 100}%;height:${58 / 260 * 100}%;border:1px dashed cyan;border-radius:50%;transform:translate(-50%,-50%)`;
        overlay.append(zone);
      }
      surface.append(overlay);
    }
    const state = (value: "IDLE" | "ENTER" | "ACTIVE" | "LEAVE") => {
      root.dataset.orbInteraction = value;
      if (value === "ENTER" || value === "LEAVE") lastTransition = value;
      if (label) label.textContent = `${value} · ${lastTransition} · ${transitions}`;
    };
    const reset = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      if (!active.current) return;
      active.current = false;
      transitions++;
      state("LEAVE");
      leave(!disposing);
      state("IDLE");
    };
    const invalidate = () => { rect = null; reset(); };
    const inZone = (x: number, y: number) => {
      const distance = Math.hypot(x - CENTER.x, y - CENTER.y);
      if (distance <= RADIUS + (active.current ? HYSTERESIS : 0)) return true;
      if (!active.current) return false;
      return SOCIAL.some((icon) => {
        if (Math.hypot(x - icon.x, y - icon.y) <= 29 / 260) return true;
        // Narrow bridges let the pointer reach each existing button without
        // keeping the entire transparent canvas interactive.
        const dx = icon.x - CENTER.x, dy = icon.y - CENTER.y;
        const t = Math.max(0, Math.min(1, ((x - CENTER.x) * dx + (y - CENTER.y) * dy) / (dx * dx + dy * dy)));
        return Math.hypot(x - CENTER.x - t * dx, y - CENTER.y - t * dy) <= 12 / 260;
      });
    };
    const onPointer = (event: PointerEvent) => {
      const inSurface = event.target instanceof Node && surface.contains(event.target);
      if (!inSurface || event.pointerType === "touch" || document.hidden) {
        reset();
        if (inSurface) event.stopPropagation();
        return;
      }
      rect ??= surface.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      if (marker) { marker.style.left = `${x * 100}%`; marker.style.top = `${y * 100}%`; }
      if (!inZone(x, y)) {
        reset();
        event.stopPropagation();
        return;
      }
      if (!active.current) {
        active.current = true;
        transitions++;
        state("ENTER");
        enter();
        state("ACTIVE");
      }
      point = { clientX: event.clientX, clientY: event.clientY };
      if (!frame) frame = requestAnimationFrame(() => { frame = 0; if (active.current) move(point); });
    };
    const guardMouse = (event: MouseEvent) => {
      if (event instanceof PointerEvent && event.pointerType === "touch") reset();
      if (!active.current) event.stopPropagation();
    };
    const onVisibility = () => { if (document.hidden) invalidate(); };
    const observer = new ResizeObserver(invalidate);
    observer.observe(surface);
    state("IDLE");
    document.addEventListener("pointermove", onPointer, true);
    surface.addEventListener("mousemove", guardMouse, true);
    surface.addEventListener("pointerdown", guardMouse, true);
    surface.addEventListener("click", guardMouse, true);
    root.addEventListener("pointerleave", reset);
    root.addEventListener("pointercancel", reset);
    document.documentElement.addEventListener("pointerleave", reset);
    window.addEventListener("blur", invalidate);
    window.addEventListener("resize", invalidate);
    document.addEventListener("scroll", invalidate, true);
    document.addEventListener("visibilitychange", onVisibility);
    root.addEventListener("transitionend", invalidate);
    return () => {
      disposing = true;
      reset();
      observer.disconnect();
      overlay?.remove();
      delete root.dataset.orbInteraction;
      document.removeEventListener("pointermove", onPointer, true);
      surface.removeEventListener("mousemove", guardMouse, true);
      surface.removeEventListener("pointerdown", guardMouse, true);
      surface.removeEventListener("click", guardMouse, true);
      root.removeEventListener("pointerleave", reset);
      root.removeEventListener("pointercancel", reset);
      document.documentElement.removeEventListener("pointerleave", reset);
      window.removeEventListener("blur", invalidate);
      window.removeEventListener("resize", invalidate);
      document.removeEventListener("scroll", invalidate, true);
      document.removeEventListener("visibilitychange", onVisibility);
      root.removeEventListener("transitionend", invalidate);
    };
  }, [wrapper, enabled, resetKey]);
  return active;
}
