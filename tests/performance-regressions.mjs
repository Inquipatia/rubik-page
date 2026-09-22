import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/hp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
 const page=await browser.newPage({viewport:{width:1366,height:768}});
 const errors=[],soundRequests=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(r.url().includes('/sounds/'))soundRequests.push(r.url());});
 await page.route('**/_next/static/chunks/*.js',async route=>{
  const response=await route.fetch();
  const body=(await response.text()).replace(/this\.canvas\s*=\s*(\w+),\s*this\._htmlContentMode\s*=/g,'this.canvas=$1,(window.__splineApps??=[]).push(this),this._htmlContentMode=');
  await route.fulfill({response,body});
 });
 await page.route('**/*.splinecode',async route=>{await new Promise(r=>setTimeout(r,2000));await route.continue();});
 await page.goto(process.env.UX_BASE_URL || 'http://127.0.0.1:3200',{waitUntil:'domcontentloaded'});
 const nav=name=>page.locator('header').getByRole('button',{name,exact:true});
 assert.ok(await page.locator('h1').isVisible(),'HTML must be visible while Spline loads');
 await nav('Servicios').click();
 await page.waitForTimeout(700);
 assert.equal(await page.locator('header .is-active').first().innerText(),'Servicios','navigation works during a delayed scene download');
 await nav('Inicio').click();
 await page.waitForFunction(()=>[...document.querySelectorAll('.smooth-spline')].every(e=>e.dataset.ready==='true'),null,{timeout:90000});
 await page.waitForTimeout(1300);
 assert.deepEqual(soundRequests,[],'disabled sounds must not be fetched');
 await page.evaluate(()=>{
  window.hero=window.__splineApps.find(a=>a.canvas.closest('.rubik-intro-cube'));
  window.orb=window.__splineApps.find(a=>a.canvas.closest('.rubik-orb-spline'));
  window.heroFrames=0;hero.addEventListener('rendered',()=>heroFrames++);
  window.startHandler=hero.eventManager.handlers.Start;
  window.startCount=hero.eventManager.activateCount;
 });
 for(const section of ['Marcas','Servicios','Contacto']) {
  await nav(section).click();await page.waitForTimeout(700);
  const before=await page.evaluate(()=>heroFrames);
  await page.waitForTimeout(500);
  assert.equal(await page.evaluate(()=>heroFrames),before,'hidden hero must stop rendering');
  assert.equal(await page.evaluate(()=>hero.renderMode),'manual');
  await nav('Inicio').click();await page.waitForTimeout(800);
  assert.ok(await page.evaluate(n=>heroFrames>n,before),'hero must resume rendering');
  assert.ok(await page.evaluate(()=>hero.eventManager.handlers.Start===startHandler && hero.eventManager.activateCount===startCount),'do not restart authored events');
  assert.ok(await page.evaluate(()=>!orb.isStopped && orb.canvas.isConnected && window.__splineApps.length===2));
 }
 await page.getByRole('button',{name:'Activar sonido',exact:true}).click();
 await page.getByRole('button',{name:'Desactivar sonido',exact:true}).waitFor();
 assert.ok(soundRequests.length>=2,'explicitly enabling audio still loads both sounds');
 await page.getByRole('button',{name:'Desactivar sonido',exact:true}).click();
 assert.deepEqual(errors,[]);
 console.log('PASS: HTML and navigation during Spline load, lazy audio, hidden hero renders zero frames, persistent Start handlers, Home resume, intact orb.');
}finally{await browser.close();}
