import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/hp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const output = path.join(process.env.TEMP || '/tmp', 'rubik-orb-calibration');
fs.mkdirSync(output, {recursive:true});
const browser = await chromium.launch({channel:'chrome',headless:true});
try {
 const page=await browser.newPage({viewport:{width:1366,height:768}});
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/_next/static/chunks/*.js',async route=>{
  const response=await route.fetch();
  const body=(await response.text()).replace(/this\.canvas\s*=\s*(\w+),\s*this\._htmlContentMode\s*=/g,'this.canvas=$1,(window.__splineApps??=[]).push(this),this._htmlContentMode=');
  await route.fulfill({response,body});
 });
 await page.goto(process.env.UX_BASE_URL || 'http://127.0.0.1:3100');
 await page.waitForFunction(()=>document.querySelector('.rubik-orb-wrap')?.dataset.orbInteraction==='IDLE',null,{timeout:90000});
 await page.waitForTimeout(1800);
 await page.evaluate(()=>{
  window.orb=window.__splineApps.find(a=>a.canvas.closest('.rubik-orb-spline'));
  window.opened=[];window.open=url=>{opened.push(url);return null;};
  window.calls=[];
  for(const method of ['emitEvent','emitEventReverse']) {
   const original=orb[method].bind(orb);
   orb[method]=(...args)=>{calls.push({method,args,time:performance.now()});return original(...args);};
  }
 });
 const renderers=await page.evaluate(()=>window.__splineApps.map(a=>({orb:a===orb,webgpu:!!a.controls.renderer.isWebGPUSplineRenderer,taa:a.controls.renderer.temporalAAEnabled})));
 assert.ok(renderers.some(r=>r.orb));
 for(const r of renderers.filter(r=>r.webgpu)) assert.equal(r.taa,!r.orb,'temporal AA workaround must be scoped to the orb');
 const box=await page.locator('.rubik-orb-spline canvas').boundingBox();
 const at=(x,y,steps=1)=>page.mouse.move(box.x+x*box.width/260,box.y+y*box.height/260,{steps});
 const root=page.locator('.rubik-orb-wrap');
 const state=async s=>assert.equal(await root.getAttribute('data-orb-interaction'),s);
 await at(153,139,12);
 await page.waitForTimeout(1800);
 const social=()=>page.evaluate(()=>['facebook_orb','instragram_orb','linkedin_orb','whatsapp_orb'].map(n=>({name:n,position:{...orb.findObjectByName(n).position},scale:{...orb.findObjectByName(n).scale}})));
 const expanded=await social();
 assert.ok(expanded.every(o=>o.scale.x>1),'Spline socials must visibly expand');
 for(const [x,y,host] of [[153,52,'facebook'],[74,87,'instagram'],[52,147,'linkedin'],[89,215,'wa.me']]) {
  await at(153,139);
  await at(x,y,12);
  await page.waitForTimeout(500);
  await state('ACTIVE');
  assert.deepEqual(await social(),expanded,'native hover must not reverse Spline while reaching an icon');
  await page.mouse.click(box.x+x*box.width/260,box.y+y*box.height/260);
  assert.ok((await page.evaluate(()=>opened)).some(url=>url.includes(host)),`click ${host}`);
 }
 // Empty space between neighbours; stay longer than the grace interval.
 for(const [x,y] of [[110,85],[77,146],[90,177],[25,145],[190,139]]) {
  await at(x,y);await page.waitForTimeout(430);await state('ACTIVE');
 }
 for(let i=0;i<12;i++) {
  await at(255,5);await page.waitForTimeout(80);await at(153,139);
 }
 assert.equal(await page.evaluate(()=>calls.filter(c=>c.method==='emitEvent').length),1,'reentry must not restart transitions');
 assert.equal(await page.evaluate(()=>calls.filter(c=>c.method==='emitEventReverse').length),0);
 // Capture rapid eye motion and published tilt/squash transitions for review.
 for(let i=0;i<12;i++) {
  await at(i%2?190:110,139,2);
  await root.screenshot({path:path.join(output,`eyes-${i}.png`)});
 }
 const control=await page.evaluate(()=>({...orb.findObjectByName('eyesControl').position}));
 await at(255,5);
 await page.waitForTimeout(180);await state('ACTIVE');
 await page.waitForTimeout(240);await state('IDLE');
 await page.waitForTimeout(1700);
 assert.ok((await social()).every(o=>o.scale.x<1),'Spline socials must actually close');
 assert.equal(await page.evaluate(()=>calls.filter(c=>c.method==='emitEventReverse').length),1);
 const stableControl=await page.evaluate(()=>({...orb.findObjectByName('eyesControl').position}));
 assert.deepEqual(control,stableControl,'JS follow/reset must leave Spline eye position alone');
 for(let i=0;i<20;i++) {
  await at(153,139);
  for(let j=0;j<4;j++) {
   await at(j%2?190:110,139);
   await page.waitForTimeout(180);
   await root.screenshot({path:path.join(output,`transition-${i}-${j}.png`)});
  }
  await at(255,5);await page.waitForTimeout(800);
 }
 assert.deepEqual(errors,[]);
 console.log('PASS: real Spline social expansion/closure, four clickable links, gaps/padding, rapid reentry, eye ownership, 20 hover transitions, orb-only temporal AA workaround, no JS errors. Captures:',output);
} finally {await browser.close();}
