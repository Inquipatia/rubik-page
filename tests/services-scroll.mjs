import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/hp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
 const report=[];
 for (const width of [1366, 768]) {
 const page = await browser.newPage({viewport:{width,height:768}});
 await page.goto(process.env.UX_BASE_URL || 'http://127.0.0.1:3100');
 await page.waitForFunction(()=>document.querySelector('.smooth-spline--orb')?.dataset.ready==='true',null,{timeout:90000});
 await page.waitForTimeout(1500);
 const nav = name => page.locator('header').getByRole('button',{name,exact:true});
 const results=[];
 for(let zone=0;zone<9;zone++) {
   await nav('Servicios').evaluate(b=>b.click());
   await page.waitForTimeout(1000);
   await page.locator('.scene-stage-frame').evaluate(e=>e.scrollTop=0);
   const x=width*((zone%3+.5)/3),y=768*((Math.floor(zone/3)+.5)/3);
   await page.mouse.move(x,y);
   const before=await page.evaluate(({x,y})=>{const el=document.elementFromPoint(x,y),f=document.querySelector('.scene-stage-frame');return {target:el?.tagName,classes:el?.className,scroll:f.scrollTop,height:f.clientHeight,total:f.scrollHeight,overflow:getComputedStyle(f).overflowY};},{x,y});
   await page.mouse.wheel(0,180);
   await page.waitForTimeout(700);
   const after=await page.evaluate(()=>({services:document.querySelector('header .is-active')?.textContent==='Servicios',scroll:document.querySelector('.scene-stage-frame').scrollTop}));
   results.push({zone:zone+1,before,after});
   assert.ok(!after.services || after.scroll>before.scroll,`zone ${zone+1} at ${width} must respond to wheel: ${JSON.stringify({before,after})}`);
 }
 console.log(width,JSON.stringify(results));
 report.push({width,zones:results});
 if(width===768) {
   await nav('Servicios').evaluate(b=>b.click());
   await page.waitForTimeout(700);
   await page.locator('.scene-stage-frame').evaluate(e=>e.scrollTop=0);
   const orb=page.locator('.rubik-orb-wrap');
   const box=await page.locator('.rubik-orb-spline canvas').boundingBox();
   const bounds=await orb.boundingBox();
   assert.equal(bounds.height,320,'orb must retain its original height');
   await page.mouse.move(box.x+box.width*153/260,box.y+box.height*139/260);
   assert.equal(await orb.getAttribute('data-orb-interaction'),'ACTIVE');
   await page.mouse.wheel(0,80);
   await page.waitForTimeout(300);
   assert.ok(await page.locator('.scene-stage-frame').evaluate(e=>e.scrollTop>0),'wheel over active orb scrolls Services');
   assert.equal(await orb.getAttribute('data-orb-interaction'),'ACTIVE','scroll must not cancel eye interaction');
   assert.deepEqual(await orb.boundingBox(),bounds,'orb stays fixed during native scroll');
 }
 for(const delta of [4,-4,180,-180]) {
   await nav('Servicios').evaluate(b=>b.click());
   await page.waitForTimeout(700);
   await page.locator('.scene-stage-frame').evaluate((e,down)=>e.scrollTop=down?e.scrollHeight:0,delta>0);
   await page.mouse.move(width/2,384);
   await page.mouse.wheel(0,delta);
   await page.waitForTimeout(700);
   assert.equal(await page.locator('header .is-active').first().innerText(),delta>0?'Contacto':'Marcas',`small and large deltas at ${width}`);
 }
 await page.close();
 }
 const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 await mobile.goto(process.env.UX_BASE_URL || 'http://127.0.0.1:3100');
 await mobile.locator('#servicios').waitFor();
 const cdp=await mobile.context().newCDPSession(mobile);
 const touches=[];
 for(let zone=0;zone<9;zone++) {
   await mobile.locator('#servicios').evaluate(e=>window.scrollTo({top:e.offsetTop,behavior:'instant'}));
   await mobile.waitForTimeout(500);
   const before=await mobile.evaluate(()=>scrollY);
   const x=390*((zone%3+.5)/3),y=844*((Math.floor(zone/3)+.5)/3);
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
   for(let step=1;step<=8;step++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y-step*12}]});
   await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
   await mobile.waitForTimeout(450);
   const after=await mobile.evaluate(()=>scrollY);
   assert.ok(after>before,`mobile zone ${zone+1} must scroll`);
   touches.push({zone:zone+1,before,after});
 }
 report.push({width:390,touches});
 console.log('PASS touch 9/9',JSON.stringify(touches));
 fs.writeFileSync('tests/services-scroll-results.json',JSON.stringify(report,null,2));
 await mobile.close();
}finally{await browser.close();}
