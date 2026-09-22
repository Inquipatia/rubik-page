import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/hp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const output=path.join(process.env.TEMP || '/tmp','rubik-orb-diagnostic');
fs.mkdirSync(output,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
 for(const renderer of (process.env.ORB_MODES || 'baseline,fixed').split(',')) {
  const page=await browser.newPage({viewport:{width:1366,height:768},deviceScaleFactor:2});
  page.on('pageerror',e=>console.log('ERROR',e.message));
  await page.route('**/_next/static/chunks/*.js',async route=>{
   const response=await route.fetch();
   const body=(await response.text()).replace(/this\.canvas\s*=\s*(\w+),\s*this\._htmlContentMode\s*=/g,'this.canvas=$1,(window.__splineApps??=[]).push(this),this._htmlContentMode=');
   await route.fulfill({response,body});
  });
  const query={baseline:'renderer=webgpu',fixed:'renderer=webgpu','taa-off':'renderer=webgpu&taa=off', 'bundles-off':'renderer=webgpu&bundles=off', 'no-jitter':'renderer=webgpu&nojit=1' }[renderer] || `renderer=${renderer}`;
  await page.goto(`${process.env.UX_BASE_URL || 'http://127.0.0.1:3100'}?${query}`,{waitUntil:'domcontentloaded',timeout:90000});
  await page.waitForFunction(()=>document.querySelector('.rubik-orb-wrap')?.dataset.orbInteraction==='IDLE',null,{timeout:90000});
  await page.waitForTimeout(1800);
  const audit=await page.evaluate(mode=>{
   window.orb=window.__splineApps.find(a=>a.canvas.closest('.rubik-orb-spline'));
   // Diagnostic only: reproduce the original renderer without editing the
   // scene or production code. Other modes leave the scoped fix enabled.
   if(['baseline','bundles-off','no-jitter'].includes(mode)) orb.controls.renderer.temporalAAEnabled=true;
   window.trace=[];window.started=performance.now();
   const log=(event,extra={})=>trace.push({time:performance.now()-started,event,...extra});
   const handler=orb.eventManager.handlers.MouseHover;
   for(const e of Object.values(handler.eventsPerObjects).flat()) for(const name of ['dispatchEnter','dispatchLeave','dispatchUserEvent']) {
    const original=e[name].bind(e);e[name]=(...args)=>{log(name,{object:e.object.name,args});return original(...args);};
   }
   for(const name of ['emitEvent','emitEventReverse']) {
    const original=orb[name].bind(orb);orb[name]=(...args)=>{log(name,{args});return original(...args);};
   }
   orb.canvas.addEventListener('mouseHover',e=>log('Spline callback',{name:e.target?.name}));
   const entities=[];
   orb.eventManager.eventContext.page.traverseEntity(e=>entities.push({name:e.name,id:e.uuid,parent:e.parent?.name,visible:e.visible,type:e.type,data:e.data}));
   let el=orb.canvas;const css=[];
   while(el && !el.matches('body')){const s=getComputedStyle(el);css.push({tag:el.tagName,cls:el.className,transform:s.transform,opacity:s.opacity,filter:s.filter});el=el.parentElement;}
   return {entities,css,renderers:window.__splineApps.map(a=>({orb:a===orb,webgpu:a.controls.renderer.isWebGPUSplineRenderer,taa:a.controls.renderer.temporalAAEnabled})),appKeys:Object.keys(orb),rendererKeys:Object.keys(orb._renderer||{}),controls:Object.keys(orb.controls),events:Object.keys(orb.eventManager.handlers)};
  },renderer);
  fs.writeFileSync(path.join(output,`${renderer}-audit.json`),JSON.stringify(audit,null,2));
  const canvas=page.locator('.rubik-orb-spline canvas');const box=await canvas.boundingBox();
  await canvas.screenshot({path:path.join(output,`${renderer}-idle.png`)});
  await page.evaluate(()=>{
   window.started=performance.now();window.samples=[];
   const sample=()=>{
    const time=performance.now()-started;
    samples.push({time,objects:['eyes','eyesControl','eyeLeftBlink','eyeRightBlink','instragram_orb'].map(name=>{
     const o=orb.findObjectByName(name);return {name,position:{...o.position},scale:{...o.scale},visible:o.visible};
    })});
    if(time<550) requestAnimationFrame(sample);
   };requestAnimationFrame(sample);
  });
  await page.mouse.move(box.x+153,box.y+139);
  for(let i=0;i<12;i++) {
   await page.waitForTimeout(45);
   await canvas.screenshot({path:path.join(output,`${renderer}-hover-${i}.png`)});
  }
  const trace=await page.evaluate(()=>({events:window.trace,samples:window.samples}));
  assert.equal(trace.events.filter(e=>e.event==='emitEvent').length,1);
  assert.equal(trace.events.filter(e=>e.event==='dispatchUserEvent').length,1);
  assert.equal(trace.events.filter(e=>e.event==='dispatchEnter'||e.event==='dispatchLeave').length,0);
  fs.writeFileSync(path.join(output,`${renderer}-trace.json`),JSON.stringify(trace,null,2));
  console.log(renderer,'diagnostic saved',output);
  await page.close();
 }
} finally {await browser.close();}
