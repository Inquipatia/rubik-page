// A process-wide backstop, independent of untrusted proxy/IP headers.
// Enforce per-client limits at the trusted hosting proxy as well.
let windowStart = 0;
let requests = 0;
export function consumeQuoteBudget(now = Date.now()) {
  if (now - windowStart >= 60_000) {
    windowStart = now;
    requests = 0;
  }
  if (requests >= 60) return false;
  requests++;
  return true;
}

export class QuoteBodyTooLarge extends Error {}

export async function readQuoteJson(req: Request): Promise<unknown> {
  // The largest valid quote fits even with JSON escaping and UTF-8 encoding.
  const limit = 128 * 1024;
  const declared = Number(req.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > limit) throw new QuoteBodyTooLarge();
  if (!req.body) throw new SyntaxError("Missing body");
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > limit) {
        void reader.cancel().catch(() => {});
        throw new QuoteBodyTooLarge();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const body = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(body));
}
