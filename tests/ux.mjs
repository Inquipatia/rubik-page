/* Run against `npm run build && npm run start`, using an installed Playwright
   or PLAYWRIGHT_MODULE pointing to an existing runtime. No real emails are sent. */
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const loadRuntime = createRequire(import.meta.url);
const { chromium } = loadRuntime(process.env.PLAYWRIGHT_MODULE || 'playwright');
const output = process.env.UX_OUTPUT || path.join(process.env.TEMP || '/tmp', 'rubik-ux');
const viewports = [[320,568],[390,844],[768,1024],[1366,768],[1440,900],[1536,864],[1920,1080],[2560,1440]]
  .filter(([width]) => !process.env.UX_WIDTHS || process.env.UX_WIDTHS.split(',').includes(String(width)));

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome', headless: true });
  const results = [];
  for (const [width, height] of viewports) {
    const context = await browser.newContext({ viewport: { width, height }, hasTouch: width < 1024, isMobile: width < 1024, reducedMotion: process.env.UX_REDUCED_MOTION ? 'reduce' : 'no-preference' });
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    const result = { width, height, checks: [], errors: [] };
    page.on('pageerror', error => result.errors.push(error.message));
    page.on('response', response => {
      if (response.status() >= 400) result.errors.push(`${response.status()} ${response.url()}`);
    });
    await page.route('**/api/send-quote', route => route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }));
    const screenshot = name => page.screenshot({ path: path.join(output, `${width}-${name}.png`) });
    const navigate = async name => {
      if (width < 768) {
        await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'}));
        await page.getByRole('button', { name: 'Abrir menú', exact: true }).click();
        await page.getByRole('dialog', { name: 'Navegación' }).getByRole('button', { name: new RegExp('^' + name, 'i') }).click();
      } else await page.locator('header').getByRole('button', { name, exact: true }).click();
      await page.waitForTimeout(800);
    };
    const verifyLightbox = async label => {
      const open = page.getByRole('button', { name: /Ampliar/ }).first();
      await open.scrollIntoViewIfNeeded();
      await page.waitForTimeout(350);
      const beforeScroll = await page.evaluate(() => window.scrollY);
      await open.click();
      const dialog = page.getByRole('dialog', { name: 'Vista ampliada' });
      await dialog.waitFor();
      assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
      const current = () => dialog.locator('[data-gallery-image]').last().getAttribute('data-gallery-image');
      const first = await current();
      await page.keyboard.press('ArrowRight');
      await page.waitForFunction(first => [...document.querySelectorAll('[role="dialog"] [data-gallery-image]')].at(-1)?.getAttribute('data-gallery-image') !== first, first);
      await page.keyboard.press('ArrowLeft');
      await page.waitForFunction(first => [...document.querySelectorAll('[role="dialog"] [data-gallery-image]')].at(-1)?.getAttribute('data-gallery-image') === first, first);
      await dialog.getByRole('button', { name: 'Imagen siguiente', exact: true }).click();
      await dialog.getByRole('button', { name: 'Imagen anterior', exact: true }).click();
      await page.waitForTimeout(450);
      const image = dialog.locator('[data-gallery-image] img').last();
      await image.evaluate(image => image.decode());
      await image.click();
      assert.equal(await dialog.count(), 1, 'Clicking the image must leave the lightbox open');
      for (let i = 0; i < 6; i++) await page.keyboard.press('Tab');
      assert.ok(await dialog.evaluate(d => d.contains(document.activeElement)));
      await screenshot(`${label}-zoom`);
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'detached' });
      assert.ok(Math.abs(await page.evaluate(() => window.scrollY) - beforeScroll) <= 1);
      await open.click(); await dialog.waitFor();
      await dialog.click({ position: { x: 4, y: height / 2 } });
      await dialog.waitFor({ state: 'detached' });
      await open.click(); await dialog.waitFor();
      await dialog.getByRole('button', { name: 'Cerrar', exact: true }).click();
      await dialog.waitFor({ state: 'detached' });
      assert.ok(Math.abs(await page.evaluate(() => window.scrollY) - beforeScroll) <= 1);
      result.checks.push(`${label}: open, image click, backdrop, Escape, close button, arrows, keyboard, focus, scroll position`);
    };
    try {
      await page.goto(process.env.UX_BASE_URL || 'http://localhost:3000');
      await page.waitForTimeout(6000);
      assert.equal(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), 'rgb(10, 10, 20)', 'Stylesheet must load');
      result.splineCanvases = await page.locator('canvas').count();
      await navigate('Marcas');
      await page.getByRole('button', { name: /Ver detalles de/ }).first().click();
      await page.waitForTimeout(900);
      await screenshot('brands');
      await verifyLightbox('brands');
      await page.getByRole('button', { name: 'Volver', exact: true }).click();
      await page.waitForTimeout(800);
      await navigate('Servicios');
      await page.getByRole('button').filter({ hasText: /Neón/i }).first().click();
      await page.waitForTimeout(900);
      const card = page.locator('.rubik-service-detail-card');
      const box = await card.boundingBox();
      if (width >= 1024) {
        assert.ok(box.y >= 100, `Card collides with header: ${JSON.stringify(box)}`);
        assert.ok(box.y + box.height <= height - 15, `Card clipped: ${JSON.stringify(box)}`);
        assert.ok(Math.abs(box.width - 1040) <= 2, 'Services must retain the Brands desktop width');
        if (height >= 864) assert.ok(Math.abs(box.height - 700) <= 2, 'Services should be about 94% of the Brands height');
      }
      result.card = box;
      await screenshot('services');
      await verifyLightbox('services');
      await page.getByRole('button', { name: 'Volver', exact: true }).click();
      await page.waitForTimeout(800);
      assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden');
      if (width === 1366) {
        for (const title of ['Stands', 'Volumétricas', 'Impresión', 'Otros']) {
          await page.locator('.rubik-work-overview button').filter({hasText:title}).first().click();
          await page.waitForTimeout(550);
          const otherBox = await page.locator('.rubik-service-detail-card').boundingBox();
          assert.ok(otherBox.y >= 100 && otherBox.y + otherBox.height <= height - 15, `${title} must fit`);
          const thumbnails = page.locator('.rubik-service-detail-info button[aria-pressed]');
          if (await thumbnails.count() > 1) {
            await thumbnails.nth(1).click();
            assert.equal(await thumbnails.nth(1).getAttribute('aria-pressed'), 'true');
          }
          await screenshot(`service-${title}`);
          await page.getByRole('button',{name:'Volver',exact:true}).click();
          await page.waitForTimeout(500);
        }
        result.checks.push('All five services fit; thumbnail selection preserved');
      }
      if (width >= 768) {
        await page.locator('.rubik-work-overview button').filter({hasText:'Neón'}).first().click();
        await page.waitForTimeout(500);
      }
      await navigate('Contacto');
      await page.locator('.rubik-service-detail-card').waitFor({state:'detached'});
      await screenshot('contact');
      await navigate('COTIZA');
      await page.getByRole('button', { name: 'Enviar solicitud', exact: true }).click();
      await page.locator('.rubik-cotiza-scene').getByRole('alert').waitFor();
      for (const [name, value] of [['Nombre','Prueba local'],['Teléfono','912345678'],['Correo','test@example.com'],['Detalle cotización','Prueba local con envío simulado.']]) await page.getByRole('textbox', {name,exact:true}).fill(value);
      await page.locator('.rubik-cotiza-service-card').getByRole('button').filter({hasText:'Neón'}).click();
      await page.getByRole('button', {name:'Enviar solicitud',exact:true}).click();
      await page.getByRole('status').waitFor(); await screenshot('form-success');
      result.checks.push('Form: validation, fields, selection, mocked success; contact navigation');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      if (width < 768) {
        await navigate('Inicio');
        await page.getByRole('button',{name:'Abrir menú',exact:true}).click();
        await page.setViewportSize({width:844,height:390}); await page.waitForTimeout(700);
        assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden');
        const title = await page.locator('h1').boundingBox();
        assert.ok(title.y >= 100, 'Landscape title must remain below the header');
        await screenshot('landscape');
        result.checks.push('Menu resize releases scroll');
      }
      assert.equal(result.errors.length, 0, result.errors.join('\n'));
      result.ok = true;
    } catch (error) {
      result.ok = false; result.failure = error.message; await screenshot('failure');
    }
    console.log(JSON.stringify(result)); results.push(result); await context.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(results,null,2));
  if (results.some(result => !result.ok)) process.exitCode = 1;
})();
