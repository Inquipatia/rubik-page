import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const output = process.env.UX_OUTPUT || path.join(process.env.TEMP || '/tmp', 'rubik-continuity');
fs.mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];
try {
  for (const [width, height, reducedMotion] of [[1366, 768, 'no-preference'], [1920, 1080, 'no-preference'], [768, 1024, 'no-preference'], [1366, 768, 'reduce']]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    // Test-only instrumentation of the installed bundle. Nothing is exposed by
    // the application itself. Private fields are READ only to diagnose lifecycle.
    await page.route('**/_next/static/chunks/*.js', async route => {
      const response = await route.fetch();
      let body = await response.text();
      if (body.includes('get isStopped(){return this._isPaused}')) {
        body = body.replace(/this\.canvas=(\w+),this\.renderMode=/,
          'this.canvas=$1,(window.__splineApps??=[]).push(this),this.renderMode=');
      }
      await route.fulfill({ response, body });
    });
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Performance.enable');
    const metrics = async () => {
      await cdp.send('HeapProfiler.collectGarbage');
      const { metrics } = await cdp.send('Performance.getMetrics');
      return Object.fromEntries(metrics.filter(m => ['JSHeapUsedSize', 'Nodes', 'JSEventListeners', 'TaskDuration'].includes(m.name)).map(m => [m.name, m.value]));
    };
    const listeners = async () => {
      const { result } = await cdp.send('Runtime.evaluate', {
        expression: 'Object.fromEntries([window, document, window.__hero.canvas].map((target, index) => [index, Object.fromEntries(Object.entries(getEventListeners(target)).map(([type, listeners]) => [type, listeners.length]))]))',
        includeCommandLineAPI: true, returnByValue: true,
      });
      return result.value;
    };
    await page.goto(process.env.UX_BASE_URL || 'http://localhost:3000');
    await page.waitForFunction(() => [...document.querySelectorAll('.smooth-spline')].every(e => e.dataset.ready === 'true'));
    await page.waitForTimeout(1300);
    await page.evaluate(() => {
      window.__hero = window.__splineApps.find(a => a.canvas.closest('.rubik-intro-cube'));
      if (!window.__hero) throw new Error('Runtime instrumentation did not match the installed bundle');
      window.__startHandler = window.__hero.eventManager.handlers.Start;
      window.__canvas = window.__hero.canvas;
    });
    const snapshot = () => page.evaluate(() => {
      const a = window.__hero;
      return {
        heroInstances: window.__splineApps.filter(a => a.canvas.closest('.rubik-intro-cube')).length,
        canvases: document.querySelectorAll('canvas').length,
        sameCanvas: a.canvas === window.__canvas && a.canvas.isConnected,
        activationCount: a.eventManager.activateCount,
        sameStartHandler: a.eventManager.handlers.Start === window.__startHandler,
        paused: a.isStopped,
        size: [a.canvas.width, a.canvas.height],
        rendererMemory: a._renderer?.info?.memory ?? a._renderer?.renderer?.info?.memory ?? null,
      };
    });
    const initial = await snapshot();
    // Warm each secondary scene once before comparing retained resources.
    for (const section of ['Marcas', 'Servicios', 'Contacto', 'Inicio']) {
      await page.locator('header').getByRole('button', { name: section, exact: true }).evaluate(button => button.click());
      await page.waitForTimeout(1200);
    }
    const before = await metrics();
    const listenersBefore = await listeners();
    await page.evaluate(() => {
      window.__frameDeltas = [];
      const sample = () => {
        window.__frameDeltas.push(window.__hero.dt);
        window.__sampleFrame = requestAnimationFrame(sample);
      };
      window.__sampleFrame = requestAnimationFrame(sample);
    });
    const hero = page.locator('.rubik-intro-cube');
    const box = await hero.boundingBox();
    for (let cycle = 0; cycle < 10; cycle++) {
      // First half: no mouse movement. Second half: manipulate the cube first.
      if (cycle >= 5) {
        await page.mouse.move(box.x + box.width * 0.35, box.y + box.height * 0.35);
        await page.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.7, { steps: 8 });
      }
      const section = ['Marcas', 'Servicios', 'Contacto'][cycle % 3];
      await page.locator('header').getByRole('button', { name: section, exact: true }).evaluate(button => button.click());
      await page.waitForTimeout(cycle === 0 ? 1800 : 350);
      if (cycle >= 5) await page.mouse.move(20, 150);
      const away = await snapshot();
      assert.equal(away.paused, false, 'The hero clock must continue while another section is visible');
      await page.locator('header').getByRole('button', { name: 'Inicio', exact: true }).evaluate(button => button.click());
      await page.waitForTimeout(100);
      const returned = await snapshot();
      assert.deepEqual(returned.size, initial.size);
      assert.equal(returned.activationCount, initial.activationCount, 'Start handlers must not be rebuilt');
      assert.ok(returned.sameCanvas && returned.sameStartHandler);
      assert.equal(returned.heroInstances, 1);
      assert.equal(returned.canvases, initial.canvases);
      if (reducedMotion === 'no-preference') {
        const opacity = await hero.locator('.smooth-spline-canvas').evaluate(e => Number(getComputedStyle(e).opacity));
        assert.ok(opacity > 0 && opacity < 1, 'Returning scene should be crossfading');
      }
      await page.waitForTimeout(350);
    }
    const frameDeltas = await page.evaluate(() => { cancelAnimationFrame(window.__sampleFrame); return window.__frameDeltas; });
    await page.waitForTimeout(2000);
    const after = await metrics();
    const listenersAfter = await listeners();
    const final = await snapshot();
    const result = { width, reducedMotion, cycles: 10, initial, final, before, after, listenersBefore, listenersAfter, maxFrameDelta: Math.max(...frameDeltas), errors };
    results.push(result);
    console.log(JSON.stringify(result));
    assert.equal(final.activationCount, 1);
    assert.deepEqual(listenersAfter, listenersBefore);
    assert.ok(after.JSHeapUsedSize < before.JSHeapUsedSize * 1.2, 'Retained heap must not grow substantially across 10 cycles');
    assert.deepEqual(errors, []);
    await page.screenshot({ path: path.join(output, `${width}-${reducedMotion}.png`) });
    await page.close();
  }
} finally {
  fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(results, null, 2));
  await browser.close();
}
