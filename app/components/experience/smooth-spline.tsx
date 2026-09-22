"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";
import type SplineComponent from "./spline-canvas";
import type { Application } from "@splinetool/runtime";

const Spline = dynamic(() => import("./spline-canvas"), { ssr: false, loading: () => null });

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

type Props = ComponentProps<typeof SplineComponent> & {
  priority?: boolean;
  active?: boolean;
  preloadMargin?: string;
  appearance?: "cube" | "orb";
  idle?: boolean;
  /** Some scenes restart Start/hover handlers on Application.play(). */
  pauseWhenHidden?: boolean;
  /** Suspend rendering without stop/play, which can restart authored events. */
  suspendWhenInactive?: boolean;
};

// The parent owns the final dimensions. Neither loading nor failure changes them.
export default function SmoothSpline({ priority = false, active = true, preloadMargin = "400px 0px", appearance = "cube", idle = false, pauseWhenHidden = true, suspendWhenInactive = false, onLoad, ...props }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const app = useRef<Application | null>(null);
  const callback = useRef(onLoad);
  useEffect(() => { callback.current = onLoad; }, [onLoad]);
  const frames = useRef<number[]>([]);
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (mount || !active || !host.current) return;
    let idleId: number | undefined;
    let frameId: number | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (!priority && idle && "requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(() => setMount(true), { timeout: 1500 });
      } else {
        frameId = requestAnimationFrame(() => setMount(true));
      }
    }, { rootMargin: preloadMargin });
    observer.observe(host.current);
    return () => {
      observer.disconnect();
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (frameId !== undefined) cancelAnimationFrame(frameId);
    };
  }, [priority, preloadMargin, idle, active, mount]);

  useEffect(() => {
    // Keep the hero's clock and event handlers alive. stop()/play() in runtime
    // 1.12.98 rebuilds handlers and leaves a large first-frame time delta.
    if ((!pauseWhenHidden && !suspendWhenInactive) || !ready || !host.current) return;
    let inView = false;
    const sync = () => {
      const visible = active && inView && !document.hidden;
      if (suspendWhenInactive) {
        // Public manual mode keeps Application, objects and event handlers.
        // Runtime 2.0.53 updates its clock even on skipped frames, avoiding a
        // large delta or a replay of Start events when the hero comes back.
        const application = app.current as (Application & { renderMode: "auto" | "manual" }) | null;
        if (!application) return;
        application.renderMode = visible ? "auto" : "manual";
        if (visible) application.requestRender();
      } else if (visible) app.current?.play();
      else app.current?.stop();
    };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); });
    observer.observe(host.current);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, [active, ready, pauseWhenHidden, suspendWhenInactive]);

  useEffect(() => () => { frames.current.forEach(cancelAnimationFrame); app.current = null; }, []);

  return (
    <div ref={host} className={`smooth-spline smooth-spline--${appearance}`} data-active={active} data-ready={ready && !failed} data-failed={failed}>
      <div className="smooth-spline-poster" aria-hidden="true"><div className="smooth-spline-silhouette" /></div>
      <div className="smooth-spline-canvas">
        {mount && <SceneBoundary onFailure={() => setFailed(true)}>
          <Spline {...props} onLoad={(application) => {
            app.current = application;
            callback.current?.(application);
            // onLoad follows Application.load(). Let React expose the canvas and
            // allow a painted frame before starting the crossfade, without a timer.
            frames.current.push(requestAnimationFrame(() => {
              frames.current.push(requestAnimationFrame(() => setReady(true)));
            }));
          }} />
        </SceneBoundary>}
      </div>
    </div>
  );
}
