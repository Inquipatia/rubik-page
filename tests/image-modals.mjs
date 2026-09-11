import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({channel:'chrome',headless:true});
try{for(const width of [390,1440].filter(width=>!process.env.UX_WIDTHS||process.env.UX_WIDTHS.split(",").includes(String(width)))){
 const page=await browser.newPage({viewport:{width,height:900},hasTouch:width<768});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));let navigations=0;page.on('framenavigated',f=>{if(f===page.mainFrame())navigations++;});
 await page.addInitScript(()=>{const listeners=new Set();window.modalListenerCount=()=>listeners.size;const add=document.addEventListener.bind(document),remove=document.removeEventListener.bind(document);document.addEventListener=(type,fn,options)=>{if(type==='keydown')listeners.add(fn);return add(type,fn,options);};document.removeEventListener=(type,fn,options)=>{if(type==='keydown')listeners.delete(fn);return remove(type,fn,options);};});
 await page.goto(process.env.UX_BASE_URL||'http://localhost:3001');
 const nav=async name=>{if(width<768){await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.getByRole('button',{name:'Abrir menú',exact:true}).click();await page.getByRole('dialog',{name:'Navegación'}).getByRole('button',{name:new RegExp('^'+name,'i')}).click();}else await page.locator('header').getByRole('button',{name,exact:true}).click();await page.waitForTimeout(800);};
 const cycle=async(label)=>{
  const opener=page.getByRole('button',{name:/Ampliar/}).first();await opener.scrollIntoViewIfNeeded();await page.waitForTimeout(400);
  const navigationsBefore=navigations;
  const initial=await page.evaluate(()=>({scroll:scrollY,overflow:document.body.style.overflow,listeners:window.modalListenerCount(),url:location.href}));
  for(const close of ['outside','escape','button','outside','escape','button']){
   await opener.click();const d=page.getByRole('dialog',{name:'Vista ampliada'});await d.waitFor();await page.waitForTimeout(350);
   assert.equal(await page.evaluate(()=>document.body.style.overflow),'hidden');
   await d.locator('[data-gallery-image] img').last().click();assert.equal(await d.count(),1);
   // The content box remains inside the modal, below the floating header.
   if(label==='services')await d.locator('[data-gallery-image]').last().locator('..').click({position:{x:3,y:100}});assert.equal(await d.count(),1);
   if(close==='outside')await d.click({position:{x:2,y:450}});
   if(close==='escape')await page.keyboard.press('Escape');
   if(close==='button')await d.getByRole('button',{name:'Cerrar',exact:true}).click();
   await d.waitFor({state:'detached'});
   const after=await page.evaluate(()=>({scroll:scrollY,overflow:document.body.style.overflow,listeners:window.modalListenerCount(),url:location.href}));assert.deepEqual(after,initial);assert.equal(navigations,navigationsBefore,'Opening/closing must not navigate');
   if(label==='services')assert.equal(await page.locator('.rubik-service-detail-card').count(),1,'Closing zoom must keep its parent card');
  }
 };
 await nav('Marcas');await page.getByRole('button',{name:/Ver detalles de/}).first().click();await page.waitForTimeout(800);await cycle('brands');
 await page.getByRole('button',{name:'Volver',exact:true}).click();await page.waitForTimeout(800);await nav('Servicios');
 const openService=async()=>{await page.locator('.rubik-work-overview button').filter({hasText:'Neón'}).first().click();await page.waitForTimeout(700);};
 await openService();await cycle('services');
 await page.keyboard.press('Escape');await page.locator('.rubik-service-detail-card').waitFor({state:'detached'});assert.notEqual(await page.evaluate(()=>document.body.style.overflow),'hidden');
 await openService();await page.locator('.rubik-service-detail-info').click({position:{x:10,y:10}});assert.equal(await page.locator('.rubik-service-detail-card').count(),1);
 await page.locator('.rubik-work-detail-overlay').click({position:{x:2,y:10}});await page.locator('.rubik-service-detail-card').waitFor({state:'detached'});
 assert.notEqual(await page.evaluate(()=>document.body.style.overflow),'hidden');assert.deepEqual(errors,[]);
 console.log(`PASS ${width}: both galleries, inside image/container, backdrop, Escape, existing close button; 12 zoom cycles; stable listeners/scroll/URL; nested card Escape and backdrop; no runtime errors`);await page.close();
}}finally{await browser.close();}
