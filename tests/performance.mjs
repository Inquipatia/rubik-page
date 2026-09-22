import { createRequire } from 'node:module';
import fs from 'node:fs';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/hp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const label=process.env.PERF_LABEL || 'baseline';
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];
try {
 for(const width of [1366,390]) for(let run=0;run<3;run++) {
  const page=await browser.newPage({viewport:{width,height:width===390?844:768},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const cdp=await page.context().newCDPSession(page);
  await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
  await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:40,downloadThroughput:1250000,uploadThroughput:625000});
  await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
  const requests=new Map();
  cdp.on('Network.requestWillBeSent',e=>requests.set(e.requestId,{url:e.request.url,type:e.type,start:e.timestamp}));
  cdp.on('Network.loadingFinished',e=>{const r=requests.get(e.requestId);if(r)Object.assign(r,{bytes:e.encodedDataLength,durationMs:(e.timestamp-r.start)*1000});});
  await page.addInitScript(()=>{
   window.metrics={lcp:0,cls:0,longTasks:[],interactions:[],splineReady:[]};
   new PerformanceObserver(l=>{for(const e of l.getEntries())metrics.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
   new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)metrics.cls+=e.value;}).observe({type:'layout-shift',buffered:true});
   new PerformanceObserver(l=>{for(const e of l.getEntries())metrics.longTasks.push({start:e.startTime,duration:e.duration});}).observe({type:'longtask',buffered:true});
   new PerformanceObserver(l=>{for(const e of l.getEntries())if(e.interactionId)metrics.interactions.push(e.duration);}).observe({type:'event',buffered:true,durationThreshold:16});
   new MutationObserver(()=>{for(const el of document.querySelectorAll('.smooth-spline[data-ready="true"]'))if(!el.dataset.measured){el.dataset.measured='true';metrics.splineReady.push({className:el.className,ms:performance.now()});}}).observe(document,{childList:true,subtree:true,attributes:true,attributeFilter:['data-ready']});
  });
  await page.goto(process.env.UX_BASE_URL || 'http://127.0.0.1:3200',{waitUntil:'domcontentloaded',timeout:90000});
  await page.waitForTimeout(20000);
  const initial=await page.evaluate(()=>({metrics,paint:performance.getEntriesByType('paint').map(e=>({name:e.name,ms:e.startTime})),initialScripts:[...document.scripts].filter(s=>s.src).map(s=>s.src),fonts:performance.getEntriesByType('resource').filter(r=>r.name.includes('/fonts/')).map(r=>({url:r.name,bytes:r.transferSize})),heading:!!document.querySelector('h1')?.textContent,canvases:document.querySelectorAll('canvas').length}));
  const network=[...requests.values()].filter(r=>r.bytes);
  if(width>768){for(const name of ['Marcas','Servicios','Contacto','Inicio']){await page.locator('header').getByRole('button',{name,exact:true}).click();await page.waitForTimeout(500);}}
  else {await page.mouse.wheel(0,650);await page.waitForTimeout(500);}
  const interaction=await page.evaluate(()=>Math.max(0,...metrics.interactions));
  const js=network.filter(r=>r.type==='Script');
  results.push({width,run,initial,labWorstInteractionMs:interaction,jsBytes:js.reduce((s,r)=>s+r.bytes,0),totalBytes:network.reduce((s,r)=>s+r.bytes,0),network,errors});
  console.log(label,width,run,JSON.stringify({lcp:initial.metrics.lcp,cls:initial.metrics.cls,jsBytes:results.at(-1).jsBytes,totalBytes:results.at(-1).totalBytes,labWorstInteractionMs:interaction}));
  await page.screenshot({path:`tests/perf-${label}-${width}.png`});
  await page.close();
 }
 fs.writeFileSync(`tests/perf-${label}.json`,JSON.stringify(results,null,2));
}finally{await browser.close();}
