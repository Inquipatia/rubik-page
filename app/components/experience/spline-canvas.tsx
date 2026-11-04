"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import type { Application, SplineEvent } from "@splinetool/runtime";
import { initializeSpline, wakeSplineInitializations } from "./spline-initialization";
import { splitSplineRender } from "./spline-render-tasks";

type Props = {
  scene: string;
  active?: boolean;
  className?: string;
  onLoad?: (application: Application) => void;
  onSplineMouseHover?: (event: SplineEvent) => void;
};

/** Same runtime and canvas; own the async lifetime so an obsolete load cannot
 * call onLoad after React's cleanup (react-spline 4.1.0 does not guard this).
 */
export default function SplineCanvas({ scene, active = true, className, onLoad, onSplineMouseHover }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  useEffect(() => { activeRef.current = active; wakeSplineInitializations(); }, [active]);
  const loaded = useEffectEvent((application: Application) => onLoad?.(application));
  const hover = useEffectEvent((event: SplineEvent) => onSplineMouseHover?.(event));
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    let cancelled = false;
    let application: Application | undefined;
    const abort = new AbortController();
    const onHover = (event: SplineEvent) => hover(event);
    // Spline already owns a ResizeObserver and resizes its canvas. This
    // observer only wakes a queued load when its canvas becomes visible.
    const wake = () => wakeSplineInitializations();
    const observer = new IntersectionObserver(wake);
    observer.observe(element);
    document.addEventListener("visibilitychange", wake);

    const eligible = () => {
      const rect = element.getBoundingClientRect();
      return activeRef.current && !document.hidden && rect.width > 0 && rect.height > 0 &&
        rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth;
    };

    async function load() {
      try {
        // Fetch visible scenes concurrently; serialize only expensive graphics
        // initialization. Application.load() itself is fetch + start(buffer).
        // The browser shares the runtime import between both canvases.
        const [{ Application }, response] = await Promise.all([
          import("@splinetool/runtime"),
          fetch(scene, { signal: abort.signal }),
        ]);
        if (!response.ok) throw new Error(`Spline scene request failed: ${response.status}`);
        const buffer = await response.arrayBuffer();
        if (cancelled) return;
        await initializeSpline(async () => {
          if (cancelled) return;
          application = new Application(element!, { renderMode: "auto" });
          splitSplineRender(application, abort.signal);
          await application.start(buffer);
          if (cancelled) {
            application.dispose();
            return;
          }
          application.addEventListener("mouseHover", onHover);
          observer.disconnect();
          loaded(application);
          // The published scenes lock page scroll. The public eventManager
          // getter exposes these handlers in runtime 2.0.53. Keep pointer/hover
          // events, but let wheel and native vertical touch reach our scroller.
          // onLoad can call setGlobalEvents(), so configure this after it.
          const events = application.eventManager;
          events.preventScroll = false;
          events.preventTouchScroll = false;
          // Its touch handler also prevents scrolling whenever the DOCUMENT has
          // no overflow, even if a nested stage can scroll. Remove only that
          // handler, not the scene's pointer or touch interaction handlers.
          element!.removeEventListener("touchmove", events.onTouchMovePreventScroll);
          element!.style.touchAction = "pan-y";
          // Runtime 2.0.53 exposes pending asynchronous material compilation in
          // renderer.info. Do not start another graphics context in that burst.
          // A rendered event drives this check; there is no polling/timer loop.
          const live = application;
          await new Promise<void>(resolve => {
            const finish = () => {
              live.removeEventListener("rendered", rendered);
              abort.signal.removeEventListener("abort", finish);
              resolve();
            };
            const rendered = () => {
              const stats = live.controls?.renderer?.info?.asyncCompilation;
              if (!stats || (stats.queued === 0 && stats.pipelines === 0)) finish();
            };
            live.addEventListener("rendered", rendered);
            abort.signal.addEventListener("abort", finish, { once: true });
            live.requestRender();
          });
        }, abort.signal, eligible);
      } catch (cause) {
        if (!cancelled) setError(cause instanceof Error ? cause : new Error(String(cause)));
      }
    }
    void load();
    return () => {
      cancelled = true;
      abort.abort();
      observer.disconnect();
      document.removeEventListener("visibilitychange", wake);
      application?.removeEventListener("mouseHover", onHover);
      application?.dispose();
    };
  }, [scene]);

  if (error) throw error;
  return <div className={className} style={{ width: "100%", height: "100%", overflow: "hidden" }}>
    <canvas ref={canvas} style={{ display: "block", touchAction: "pan-y" }} />
  </div>;
}
