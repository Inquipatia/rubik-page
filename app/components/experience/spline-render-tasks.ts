import type { Application } from "@splinetool/runtime";

/** Runtime 2.0.53 calls Application.render from each renderer's RAF. The
 * browser batches both callbacks into one main-thread task. Preserve those
 * clocks/loops, but give each canvas its own task so input can run between
 * them. One pending task per canvas avoids a backlog; no FPS cap or timer. */
export function splitSplineRender(application: Application, signal: AbortSignal) {
  const live = application as Application & { render: (time: number) => void };
  const scheduler = (globalThis as typeof globalThis & {
    scheduler?: { postTask: (run: () => void, options: { priority: string }) => Promise<void> };
  }).scheduler;
  const original = live.render;
  let pending = false;
  const channel = scheduler ? null : new MessageChannel();
  const run = () => {
    pending = false;
    if (!signal.aborted) original.call(live, performance.now());
  };
  if (channel) channel.port1.onmessage = run;
  live.render = () => {
    if (pending || signal.aborted) return;
    pending = true;
    // Same priority as initialization: user-visible tasks would starve the
    // second scene's background job on slow CPUs. Input retains priority.
    if (scheduler) void scheduler.postTask(run, { priority: "background" });
    else channel!.port2.postMessage(null);
  };
  signal.addEventListener("abort", () => {
    live.render = original;
    channel?.port1.close();
    channel?.port2.close();
  }, { once: true });
}
