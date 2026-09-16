import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const output = process.env.UX_OUTPUT || path.join(process.env.TEMP || '/tmp', 'rubik-spline');
fs.mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome', headless: true });
const results = [];
try {
  for (const [width, height] of [[1920, 1080], [1366, 768], [768, 1024], [390, 844]]) {
    for (const slow of [false, true]) {
      const context = await browser.newContext({ viewport: { width, height }, isMobile: width < 768, hasTouch: width < 1024 });
      const page = await context.newPage();
      page.setDefaultTimeout(60000);
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const cdp = await context.newCDPSession(page);
      if (slow) {
        await cdp.send('Network.enable');
        await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 93750 });
        await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      }
      await page.goto(process.env.UX_BASE_URL || 'http://localhost:3000', { waitUntil: 'domcontentloaded' });
      if (width < 768) await page.locator('#inicio').waitFor();
      const hero = page.locator('.rubik-intro-cube .smooth-spline');
      await hero.waitFor();
      const geometry = await hero.boundingBox();
      assert.ok(geometry.width > 0 && geometry.height > 0);
      const canvas = await hero.locator('canvas').elementHandle();
      if (width >= 768) {
        await page.locator('header').getByRole('button', { name: 'Marcas', exact: true }).click();
        await page.waitForTimeout(350);
        assert.equal(await hero.evaluate(e => !!e.closest('[inert]')), true);
        await page.locator('header').getByRole('button', { name: 'Inicio', exact: true }).click();
        await page.waitForTimeout(350);
        if (canvas) assert.equal(await canvas.evaluate(e => e.isConnected), true, 'Navigation must retain the WebGL canvas');
      } else {
        await page.mouse.wheel(0, 900);
        await page.waitForTimeout(300);
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      }
      await page.waitForFunction(() => [...document.querySelectorAll('.smooth-spline')].every(e => e.dataset.ready === 'true'), undefined, { timeout: 60000 });
      await page.waitForFunction(() => [...document.querySelectorAll('.smooth-spline-poster')].every(e => getComputedStyle(e).opacity === '0'));
      const after = await hero.boundingBox();
      assert.equal(after.width, geometry.width);
      assert.equal(after.height, geometry.height);
      assert.equal(await hero.locator('.smooth-spline-poster').evaluate(e => getComputedStyle(e).opacity), '0');
      await page.mouse.move(geometry.x + 40, geometry.y + 40);
      await page.mouse.move(geometry.x + geometry.width - 40, geometry.y + geometry.height - 40, { steps: 10 });
      await page.screenshot({ path: path.join(output, `${width}-${slow ? 'slow' : 'fast'}.png`) });
      if (!slow) {
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.waitForFunction(() => document.querySelector('.rubik-intro-cube .smooth-spline')?.dataset.ready === 'true', undefined, { timeout: 60000 });
        for (const delta of [120, 120, 1000, -1000, -120]) {
          await page.mouse.move(30, height / 2);
          await page.mouse.wheel(0, delta);
          await page.waitForTimeout(350);
        }
      }
      assert.deepEqual(errors, []);
      results.push({ width, slow, passed: true });
      await context.close();
    }
  }

  // A failed scene must leave an intentional visual and working navigation.
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 }, reducedMotion: 'reduce' });
  await page.route('**/*.splinecode', route => route.abort());
  await page.goto(process.env.UX_BASE_URL || 'http://localhost:3000');
  await page.waitForFunction(() => document.querySelector('.smooth-spline')?.dataset.failed === 'true');
  assert.equal(await page.locator('.smooth-spline-poster').first().evaluate(e => getComputedStyle(e).opacity), '1');
  await page.locator('header').getByRole('button', { name: 'Servicios', exact: true }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(output, 'failure-navigation.png') });
  results.push({ failureFallback: true, reducedMotion: true });
} finally {
  fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(results, null, 2));
  await browser.close();
}
console.log(JSON.stringify(results));
