import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ channel: 'chrome', headless: process.env.UX_HEADED !== '1' });
const output = path.join(process.env.TEMP || '/tmp', 'rubik-orb');
fs.mkdirSync(output, { recursive: true });
try {
  for (const [width, height, deviceScaleFactor] of [[1920,1080,1],[1440,900,1],[1366,768,1],[1280,585,1.5],[1024,768,1],[768,1024,1],[390,844,1]]) {
    if (process.env.UX_WIDTHS && !process.env.UX_WIDTHS.split(',').includes(String(width))) continue;
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor, hasTouch: width <= 1024 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => {
      const listeners = new Set();
      const add = document.addEventListener.bind(document);
      const remove = document.removeEventListener.bind(document);
      document.addEventListener = (type, listener, options) => { if (type === 'pointermove') listeners.add(listener); return add(type, listener, options); };
      document.removeEventListener = (type, listener, options) => { if (type === 'pointermove') listeners.delete(listener); return remove(type, listener, options); };
      window.orbListenerCount = () => listeners.size;
    });
    await page.goto(process.env.UX_BASE_URL || 'http://localhost:3001');
    if (width < 768) {
      await page.waitForTimeout(1500);
      assert.equal(await page.locator('.rubik-orb-wrap').count(), 0, 'Existing mobile visibility preserved');
      assert.equal(await page.locator('[data-orb-interaction], [data-orb-debug]').count(), 0);
      console.log(`PASS ${width}x${height}: mobile keeps orb/controller unmounted (other scenes may own pointer listeners)`);
      await page.close();
      continue;
    }
    const root = page.locator('.rubik-orb-wrap');
    const canvas = page.locator('.rubik-orb-spline canvas');
    await canvas.waitFor({ timeout: 60000 });
    await page.waitForFunction(() => document.querySelector('.rubik-orb-wrap')?.getAttribute('data-orb-interaction') === 'IDLE', null, { timeout: 60000 });
    await page.waitForTimeout(5000);
    if (process.env.UX_EXPECT_NO_DEBUG) assert.equal(await page.locator('[data-orb-debug]').count(), 0);
    let box = await canvas.boundingBox();
    const at = async (x, y, steps = 1) => page.mouse.move(box.x + box.width * x, box.y + box.height * y, { steps });
    const state = async expected => assert.equal(await root.getAttribute('data-orb-interaction'), expected);
    const enter = async () => { await at(153/260,139/260); await state('ACTIVE'); };
    const exit = async () => { await at(.98,.02); await state('IDLE'); };
    await state('IDLE');
    const listeners = await page.evaluate(() => window.orbListenerCount());
    for (const [x,y] of [[.01,.01],[.99,.01],[.01,.99],[.99,.99],[.15,.4],[.85,.15]]) { await at(x,y); await state('IDLE'); }
    // Every entry edge and diagonal, from neutral; preserve a tiny exit margin.
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
      await exit();
      await at(153/260 + Math.cos(angle)*54/260,139/260 + Math.sin(angle)*54/260);
      await state('IDLE');
      await at(153/260 + Math.cos(angle)*49/260,139/260 + Math.sin(angle)*49/260, 5);
      await state('ACTIVE');
      await exit();
    }
    for (let cycle = 0; cycle < 20; cycle++) { await enter(); await exit(); }
    await enter();
    await page.waitForTimeout(700);
    await root.screenshot({ path: path.join(output, `${width}-active.png`) });
    // The existing social controls remain reachable along their short paths.
    for (const [x,y] of [[153,52],[74,87],[52,147],[89,215]]) {
      await at(153/260,139/260);
      await at(x/260,y/260,10);
      await state('ACTIVE');
    }
    await exit();
    await page.waitForTimeout(700);
    await root.screenshot({ path: path.join(output, `${width}-idle.png`) });
    await enter();
    await page.evaluate(() => window.dispatchEvent(new Event('blur')));
    await state('IDLE');
    await enter();
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await state('IDLE');
    await page.evaluate(() => {
      delete document.hidden;
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.waitForTimeout(400);
    await enter();
    await root.dispatchEvent('pointercancel', { pointerType: 'mouse' });
    await state('IDLE');
    await enter();
    await page.mouse.move(-10,-10);
    await state('IDLE');
    await enter();
    await page.evaluate(() => document.dispatchEvent(new Event('scroll')));
    await state('IDLE');
    await enter();
    await page.setViewportSize({ width: width - 10, height: height - 10 });
    await page.waitForTimeout(500);
    if (width === 768) {
      assert.equal(await root.count(), 0);
      assert.ok(await page.evaluate(() => window.orbListenerCount()) < listeners);
      await page.setViewportSize({ width, height });
      await canvas.waitFor({ timeout: 60000 });
      await page.waitForFunction(() => document.querySelector('.rubik-orb-wrap')?.getAttribute('data-orb-interaction') === 'IDLE', null, { timeout: 60000 });
      await page.waitForTimeout(5000);
    }
    await state('IDLE');
    box = await canvas.boundingBox();
    await enter(); await exit();
    const start = Date.now();
    let moves = 0;
    while (Date.now() - start < 3000) {
      const angle = moves * .7;
      const radius = moves % 3 === 0 ? .1 : .3;
      await at(153/260 + Math.cos(angle)*radius,139/260 + Math.sin(angle)*radius);
      moves++;
    }
    await exit();
    assert.equal(await page.evaluate(() => window.orbListenerCount()), listeners);
    if (width <= 1024) {
      await page.touchscreen.tap(box.x + box.width*153/260,box.y + box.height*139/260);
      await state('IDLE');
    }
    assert.deepEqual(errors, []);
    console.log(`PASS ${width}x${height} DPR ${deviceScaleFactor}: edges/corners, 20 cycles, social paths, blur/cancel/scroll reset, window exit, resize, ${moves} stress moves, stable listeners, no JS errors`);
    await page.close();
  }
} finally { await browser.close(); }
