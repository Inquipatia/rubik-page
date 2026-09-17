import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');

const phase = process.env.UX_PHASE || 'after';
const output = path.join(os.tmpdir(), 'rubik-contact-performance');
fs.mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];
try {
  for (const width of (process.env.UX_WIDTHS || '390,1366').split(',').map(Number)) {
    const page = await browser.newPage({ viewport: { width, height: 844 }, isMobile: width < 768 });
    const errors = [];
    const consoleErrors = [];
    const failedRequests = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    page.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
    await page.addInitScript(() => {
      window.perf = { lcp: 0, cls: 0, longTaskExcess: 0 };
      new PerformanceObserver(list => list.getEntries().forEach(e => window.perf.lcp = e.startTime)).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver(list => list.getEntries().forEach(e => { if (!e.hadRecentInput) window.perf.cls += e.value; })).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver(list => list.getEntries().forEach(e => window.perf.longTaskExcess += Math.max(0, e.duration - 50))).observe({ type: 'longtask', buffered: true });
    });
    await page.goto(process.env.UX_BASE_URL || 'http://localhost:3100', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(12000);
    const metrics = await page.evaluate(() => ({ ...window.perf, jsBytes: performance.getEntriesByType('resource').filter(e => e.name.includes('.js')).reduce((s, e) => s + e.encodedBodySize, 0) }));
    const hero = page.locator('.rubik-intro-cube canvas');
    const canvas = await hero.count() ? await hero.elementHandle() : null;
    metrics.splineReady = await page.locator('.rubik-intro-cube .smooth-spline').getAttribute('data-ready');
    if (width >= 768) await page.locator('header').getByRole('button', { name: 'Contacto', exact: true }).click();
    else await page.locator('#contacto').scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    const contact = page.locator('.rubik-contact-scene');
    await contact.screenshot({ path: path.join(output, `${phase}-${width}.png`) });
    assert.equal(await contact.locator('a[href^="mailto:"]').count(), 2);
    assert.equal(await contact.locator('a[href^="tel:"]').count(), 2);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    if (phase === 'after') {
      await contact.getByText('Contacto directo', { exact: true }).waitFor();
      const signature = contact.getByText('- by Ht', { exact: true });
      assert.ok(await signature.isVisible());
      assert.ok(await signature.evaluate(e => {
        const parent = e.parentElement.getBoundingClientRect();
        const box = e.getBoundingClientRect();
        return box.right <= parent.right && box.bottom <= parent.bottom;
      }), 'Signature stays on the title line within its card');
      const icon = page.locator('link[rel="icon"][href^="/icon.png"]');
      assert.equal(await icon.count(), 1);
      assert.equal((await page.request.get(new URL(await icon.getAttribute('href'), page.url()).href)).status(), 200);
    }
    if (width >= 768) {
      for (const name of ['Inicio', 'Marcas', 'Servicios', 'Contacto', 'Inicio']) {
        await page.locator('header').getByRole('button', { name, exact: true }).click();
        await page.waitForTimeout(450);
      }
      if (canvas) assert.ok(await canvas.evaluate(e => e === document.querySelector('.rubik-intro-cube canvas')));
    }
    assert.deepEqual(errors, []);
    if (!process.env.UX_ALLOW_NETWORK_FAILURES) {
      assert.deepEqual(consoleErrors, []);
      assert.deepEqual(failedRequests, []);
      assert.equal(metrics.splineReady, 'true');
    }
    results.push({ width, ...metrics, errors, consoleErrors, failedRequests });
    await page.close();
  }
} finally { await browser.close(); }
fs.writeFileSync(path.join(output, `${phase}.json`), JSON.stringify(results, null, 2));
console.log(JSON.stringify({ output, results }, null, 2));
