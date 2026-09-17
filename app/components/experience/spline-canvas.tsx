"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import type { Application, SplineEvent } from "@splinetool/runtime";

type Props = {
  scene: string;
  className?: string;
  onLoad?: (application: Application) => void;
  onSplineMouseHover?: (event: SplineEvent) => void;
};

/** Same runtime and canvas; own the async lifetime so an obsolete load cannot
 * call onLoad after React's cleanup (react-spline 4.1.0 does not guard this).
 */
export default function SplineCanvas({ scene, className, onLoad, onSplineMouseHover }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
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
    const observer = new ResizeObserver(() => {
      if (application && !cancelled && element.parentElement) {
        application.setSize(element.parentElement.clientWidth, element.parentElement.clientHeight);
      }
    });

    async function load() {
      try {
        const { Application } = await import("@splinetool/runtime");
        if (cancelled) return;
        application = new Application(element!, { renderMode: "auto" });
        await application.load(scene, undefined, { signal: abort.signal });
        if (cancelled) {
          application.dispose();
          return;
        }
        application.addEventListener("mouseHover", onHover);
        observer.observe(element!.parentElement!);
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
      } catch (cause) {
        if (!cancelled) setError(cause instanceof Error ? cause : new Error(String(cause)));
      }
    }
    void load();
    return () => {
      cancelled = true;
      abort.abort();
      observer.disconnect();
      application?.removeEventListener("mouseHover", onHover);
      application?.dispose();
    };
  }, [scene]);

  if (error) throw error;
  return <div className={className} style={{ width: "100%", height: "100%", overflow: "hidden" }}>
    <canvas ref={canvas} style={{ display: "block", touchAction: "pan-y" }} />
  </div>;
}
