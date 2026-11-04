type Job = {
  run: () => Promise<void>;
  eligible: () => boolean;
  signal: AbortSignal;
  resolve: () => void;
  reject: (reason: unknown) => void;
};

const pending: Job[] = [];
let scheduled = false;
let running = false;

// Yield a task boundary, rather than moving the same work into a timer.
function backgroundTask(run: () => void) {
  const scheduler = (globalThis as typeof globalThis & {
    scheduler?: { postTask: (run: () => void, options: { priority: string }) => Promise<void> };
  }).scheduler;
  if (scheduler) void scheduler.postTask(run, { priority: "background" });
  else {
    const channel = new MessageChannel();
    channel.port1.onmessage = () => {
      channel.port1.close();
      channel.port2.close();
      run();
    };
    channel.port2.postMessage(null);
  }
}

export function wakeSplineInitializations() {
  if (scheduled || running || !pending.length) return;
  scheduled = true;
  backgroundTask(() => {
    scheduled = false;
    const index = pending.findIndex(job => !job.signal.aborted && job.eligible());
    if (index < 0) return;
    const [job] = pending.splice(index, 1);
    running = true;
    void job.run().then(job.resolve, job.reject).finally(() => {
      running = false;
      wakeSplineInitializations();
    });
  });
}

export function initializeSpline(run: Job["run"], signal: AbortSignal, eligible: Job["eligible"]) {
  return new Promise<void>((resolve, reject) => {
    const abort = () => {
      const index = pending.indexOf(job);
      if (index >= 0) pending.splice(index, 1);
      reject(signal.reason);
    };
    const finish = (callback: () => void) => {
      signal.removeEventListener("abort", abort);
      callback();
    };
    const job: Job = {
      run, signal, eligible,
      resolve: () => finish(resolve),
      reject: reason => finish(() => reject(reason)),
    };
    if (signal.aborted) { reject(signal.reason); return; }
    signal.addEventListener("abort", abort, { once: true });
    pending.push(job);
    wakeSplineInitializations();
  });
}
