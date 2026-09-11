import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const require=createRequire(import.meta.url);const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const b=await chromium.launch({channel:'chrome',headless:true});const out=path.join(process.env.TEMP||'/tmp','rubik-brand-backdrop');fs.mkdirSync(out,{recursive:true});
try{for(const [width,height] of [[1920,1080],[1366,768],[390,844],[430,932],[820,1180]].filter(([w])=>!process.env.UX_WIDTHS||process.env.UX_WIDTHS.split(',').includes(String(w)))){
 const p=await b.newPage({viewport:{width,height},hasTouch:width<1024});const errors=[];p.on('pageerror',e=>errors.push(e.message));let navigations=0;p.on('framenavigated',f=>{if(f===p.mainFrame())navigations++;});
 await p.addInitScript(()=>{const keys=new Set();window.keyCount=()=>keys.size;const add=document.addEventListener.bind(document),remove=document.removeEventListener.bind(document);document.addEventListener=(t,l,o)=>{if(t==='keydown')keys.add(l);return add(t,l,o)};document.removeEventListener=(t,l,o)=>{if(t==='keydown')keys.delete(l);return remove(t,l,o)};});
 await p.goto(process.env.UX_BASE_URL||'http://localhost:3001');
 if(width<768){await p.getByRole('button',{name:'Abrir menú',exact:true}).click();await p.getByRole('dialog',{name:'Navegación'}).getByRole('button',{name:/^Marcas/i}).click();}else await p.locator('header').getByRole('button',{name:'Marcas',exact:true}).click();
 await p.waitForTimeout(1000);const names=await p.getByRole('button',{name:/Ver detalles de/}).evaluateAll(es=>es.slice(0,3).map(e=>e.getAttribute('aria-label')));
 for(let i=0;i<10;i++){
  const opener=p.getByRole('button',{name:names[i%names.length],exact:true});await opener.scrollIntoViewIfNeeded();await p.waitForTimeout(300);
  const initialNavigations=navigations;
  const before=await p.evaluate(()=>({y:scrollY,overflow:document.body.style.overflow,keys:window.keyCount(),url:location.href}));await opener.click();const card=p.locator('.rubik-brand-detail');await card.waitFor();await p.waitForTimeout(1700);
  const layer=await p.locator('[data-brand-backdrop]').evaluate(e=>({box:e.getBoundingClientRect().toJSON(),position:getComputedStyle(e).position,pointer:getComputedStyle(e).pointerEvents,z:getComputedStyle(e).zIndex}));assert.equal(layer.position,'fixed');assert.equal(layer.box.width,width);assert.equal(layer.box.height,height);assert.equal(layer.pointer,'auto');
  assert.equal(await p.evaluate(()=>document.body.style.overflow),'hidden');
  if(i===0){await p.screenshot({path:path.join(out,`${width}-brand.png`)});const thumbs=card.locator('button[aria-pressed]');if(await thumbs.count()>1)await thumbs.nth(1).click();const next=card.getByRole('button',{name:'Imagen siguiente',exact:true});if(await next.count())await next.click();assert.equal(await card.count(),1);
   await card.getByRole('button',{name:/Ampliar/}).click();const zoom=p.getByRole('dialog',{name:'Vista ampliada'});await zoom.waitFor();await p.waitForTimeout(400);await zoom.locator('[data-gallery-image] img').last().click();assert.equal(await zoom.count(),1);await p.mouse.click(width/2,5);await zoom.waitFor({state:'detached'});assert.equal(await card.count(),1);
   await p.keyboard.press('Tab');assert.ok(await card.evaluate(e=>e.contains(document.activeElement)));
   const scrollBefore=await p.evaluate(()=>scrollY);await p.mouse.move(2,height/2);await p.mouse.wheel(0,400);await p.waitForTimeout(200);assert.equal(await p.evaluate(()=>scrollY),scrollBefore);
  }
  if(i%5===4)await p.keyboard.press('Escape');else if(i===8)await card.getByRole('button',{name:'Volver',exact:true}).click();else {
   const points=[[2,2],[width-2,height/2],[width/2,height-2],[width/2,2]];const [x,y]=points[i%4];assert.equal(await p.evaluate(([x,y])=>document.elementFromPoint(x,y)?.hasAttribute('data-brand-backdrop'),[x,y]),true,`outside hit ${width} ${x},${y}`);if(width<1024)await p.touchscreen.tap(x,y);else await p.mouse.click(x,y);
  }
  await card.waitFor({state:'detached'});await p.waitForTimeout(850);const after=await p.evaluate(()=>({y:scrollY,overflow:document.body.style.overflow,keys:window.keyCount(),url:location.href}));assert.deepEqual(after,before);assert.equal(navigations,initialNavigations);assert.equal(await opener.evaluate(e=>e===document.activeElement),true);
 }
 assert.deepEqual(errors,[]);console.log(`PASS ${width}x${height}: 10 cycles / ${names.length} brands, viewport geometry and outer hit areas, Escape, Volver, nested zoom, thumbnails/arrows, focus/scroll/listener restoration, no runtime errors`);await p.close();
}}finally{await b.close();}
