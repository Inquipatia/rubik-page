import assert from 'node:assert/strict';
import fs from 'node:fs';
const base = process.env.UX_BASE_URL || 'http://127.0.0.1:3277';
assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(new URL(base).hostname), 'Local-only verification');
const results = [];
async function check(path, status, options) {
  const response = await fetch(`${base}${path}`, options);
  assert.equal(response.status, status, path);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(response.headers.get('x-frame-options'), 'DENY');
  assert.equal(response.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
  assert.equal(response.headers.get('x-powered-by'), null);
  const csp = response.headers.get('content-security-policy');
  assert.ok(csp.includes("frame-ancestors 'none'") || (path.startsWith('/_next/image?') && csp.includes('sandbox')));
  if (path.startsWith('/api/')) assert.match(response.headers.get('cache-control'), /no-store/);
  results.push({ path, status, cacheControl: response.headers.get('cache-control') });
  await response.arrayBuffer();
}
await check('/', 200);
for (const path of ['/.env', '/admin', '/api/admin']) await check(path, 404);
await check('/api/send-quote', 405);
await check('/api/send-quote', 400, { method: 'POST', body: '{}' });
await check('/api/send-quote', 400, { method: 'POST', headers: { Origin: base }, body: '{' });
await check('/api/send-quote', 403, { method: 'POST', headers: { Origin: 'https://untrusted.invalid' }, body: '{}' });
await check('/api/send-quote', 413, { method: 'POST', body: 'x'.repeat(128 * 1024 + 1) });
await check('/_next/image?url=%2Fimg%2Flogo.png&w=64&q=75', 200);
fs.writeFileSync('docs/security-audit/http-tests.json', JSON.stringify(results, null, 2));
console.log('PASS: local production routes, private API cache, safe errors, cross-site/body limits, security headers and Next image optimizer. No valid quote submitted.');
