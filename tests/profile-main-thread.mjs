import {createRequire} from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/hp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];
const label=process.env.PROFILE_LABEL || 'before';
try {
 for(const mode of (process.env.PROFILE_MODES || 'all,no-spline').split(',')) {
  const page=await browser.newPage({viewport:{width:1366,height:768}});
  if(process.env.PROFILE_SPLIT==='1') {
   await page.addInitScript(()=>{
    window.__splitSplineRender=render=>{
     let pending=false;
     return ()=>{if(pending)return;pending=true;scheduler.postTask(()=>{pending=false;render(performance.now());},{priority:'background'});};
    };
   });
   await page.route('**/_next/static/chunks/*.js',async route=>{
    const response=await route.fetch();
    const body=(await response.text()).replace(/this\.canvas\s*=\s*(\w+),\s*this\._htmlContentMode\s*=/g,'this.canvas=$1,this.render=window.__splitSplineRender(this.render),this._htmlContentMode=');
    await route.fulfill({response,body});
   });
  }
  const cdp=await page.context().newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
  await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:40,downloadThroughput:1250000,uploadThroughput:625000});
  await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
  if(mode==='no-spline') await page.route('**/*.splinecode',r=>r.abort());
  const resources=[];
  page.on('response',r=>{if(r.url().includes('.splinecode'))resources.push(r.url());});
  await page.addInitScript(()=>{
   window.audit={longTasks:[],lcp:0,cls:0,ready:[]};
   new PerformanceObserver(l=>l.getEntries().forEach(e=>audit.longTasks.push({start:e.startTime,duration:e.duration}))).observe({type:'longtask',buffered:true});
   new PerformanceObserver(l=>l.getEntries().forEach(e=>audit.lcp=e.startTime)).observe({type:'largest-contentful-paint',buffered:true});
   new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(!e.hadRecentInput)audit.cls+=e.value;})).observe({type:'layout-shift',buffered:true});
   new MutationObserver(()=>document.querySelectorAll('.smooth-spline[data-ready="true"]').forEach(e=>{if(!e.dataset.profiled){e.dataset.profiled='true';audit.ready.push({scene:e.className,time:performance.now()});}})).observe(document,{subtree:true,attributes:true,attributeFilter:['data-ready']});
  });
  await cdp.send('Profiler.enable');await cdp.send('Profiler.setSamplingInterval',{interval:1000});await cdp.send('Profiler.start');
  await page.goto(process.env.UX_BASE_URL || 'http://127.0.0.1:3200',{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(25000);
  const {profile}=await cdp.send('Profiler.stop');
  const metrics=await page.evaluate(()=>({...audit,fcp:performance.getEntriesByName('first-contentful-paint')[0]?.startTime}));
  const nodes=new Map(profile.nodes.map(n=>[n.id,n]));
  const totals=new Map();
  profile.samples.forEach((id,i)=>{const f=nodes.get(id).callFrame;const key=`${f.functionName || '(anonymous)'} @ ${f.url || '(native)'}:${f.lineNumber+1}:${f.columnNumber+1}`;totals.set(key,(totals.get(key)||0)+profile.timeDeltas[i]/1000);});
  const top=[...totals].sort((a,b)=>b[1]-a[1]).slice(0,35).map(([frame,ms])=>({frame,ms:Math.round(ms)}));
  const profilePath=path.join(os.tmpdir(),`rubik-${label}-${mode}.cpuprofile`);
  fs.writeFileSync(profilePath,JSON.stringify(profile));
  const result={mode,metrics,blockingMs:metrics.longTasks.reduce((s,e)=>s+Math.max(0,e.duration-50),0),top,resources,profilePath};
  results.push(result);console.log(JSON.stringify(result));
  await page.close();
 }
 fs.writeFileSync(`tests/main-thread-${label}.json`,JSON.stringify(results,null,2));
}finally{await browser.close();}
