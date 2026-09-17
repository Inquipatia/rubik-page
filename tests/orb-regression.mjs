import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/hp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
 const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
 const errors=[],warnings=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='warning')warnings.push(m.text());});
 await page.route('**/_next/static/chunks/*.js',async route=>{
   const response=await route.fetch(); let body=await response.text();
   body=body.replace(/this\.canvas\s*=\s*(\w+),\s*this\._htmlContentMode\s*=/g,'this.canvas=$1,(window.__splineApps??=[]).push(this),this._htmlContentMode=');
   await route.fulfill({response,body});
 });
 await page.goto(process.env.UX_BASE_URL || 'http://127.0.0.1:3100');
 await page.waitForFunction(()=>[...document.querySelectorAll('.smooth-spline')].every(e=>e.dataset.ready==='true'),null,{timeout:90000});
 await page.waitForTimeout(1500);
 await page.evaluate(()=>{
   window.orb=window.__splineApps.find(a=>a.canvas.closest('.rubik-orb-spline'));
   window.hero=window.__splineApps.find(a=>a.canvas.closest('.rubik-intro-cube'));
   window.eye=orb.findObjectByName('eyesControl');
   window.left=orb.findObjectByName('eyeLeftBlink');
   window.right=orb.findObjectByName('eyeRightBlink');
   window.center={...eye.position};
   window.blinkCount=0;window.blinkMin=1;window.wasClosed=false;
   const sample=()=>{const closed=left.scale.y<.5&&right.scale.y<.5; if(closed&&!wasClosed)blinkCount++;wasClosed=closed;blinkMin=Math.min(blinkMin,left.scale.y,right.scale.y);window.sample=requestAnimationFrame(sample);};
   sample();
 });
 const cdp=await page.context().newCDPSession(page);
 const listeners=async()=>{
   const {result}=await cdp.send('Runtime.evaluate',{expression:'[window,document,orb.canvas,hero.canvas].map(t=>Object.fromEntries(Object.entries(getEventListeners(t)).map(([k,v])=>[k,v.length])))',includeCommandLineAPI:true,returnByValue:true});return result.value;
 };
 const before=await listeners();
 const nav=name=>page.locator('header').getByRole('button',{name,exact:true});
 const positions=[];
 for(let cycle=0;cycle<10;cycle++){
   const b=await page.locator('.rubik-orb-spline canvas').boundingBox();
   const at=async(x,y,steps=1)=>page.mouse.move(b.x+b.width*x,b.y+b.height*y,{steps});
   await at(153/260,139/260);
   await at(180/260,155/260,cycle%2?1:12);
   await page.waitForTimeout(600);
   const moved=await page.evaluate(()=>({x:eye.position.x,y:eye.position.y,cx:center.x,cy:center.y}));
   assert.ok(Math.hypot(moved.x-moved.cx,moved.y-moved.cy)>.5,'eyes must actually move, not just change the hover flag');
   assert.ok(Math.abs(moved.x-moved.cx)<=34.1&&Math.abs(moved.y-moved.cy)<=28.1,'eye travel stays bounded');
   positions.push(moved);
   await nav('Servicios').evaluate(b=>b.click());
   await page.waitForTimeout(700);
   await at(153/260,139/260);
   await page.mouse.wheel(0,180);
   await page.waitForTimeout(600);
   assert.equal(await page.locator('header .is-active').first().innerText(),'Contacto','wheel over orb must navigate');
   await nav('Inicio').evaluate(b=>b.click());
   await page.waitForTimeout(650);
   const stable=await page.evaluate(()=>({apps:window.__splineApps.length,eye:orb.findObjectByName('eyesControl')===eye,left:orb.findObjectByName('eyeLeftBlink')===left,right:orb.findObjectByName('eyeRightBlink')===right,stopped:orb.isStopped,heroStopped:hero.isStopped,connected:orb.canvas.isConnected}));
   assert.deepEqual(stable,{apps:2,eye:true,left:true,right:true,stopped:false,heroStopped:false,connected:true});
   const blinks=await page.evaluate(()=>blinkCount);
   await at(.98,.02);
   await page.waitForFunction(n=>blinkCount>n,blinks,{timeout:10000});
   console.log(`PASS orb cycle ${cycle+1}: eyes + blink + wheel + navigation`);
 }
 assert.deepEqual(await listeners(),before,'listeners must not grow after ten navigation cycles');
 assert.deepEqual(errors,[]);
 assert.equal(warnings.filter(m=>/encontr|Faltan/.test(m)).length,0);
 assert.equal(warnings.filter(m=>/updating from/.test(m)).length,1,'one schema migration per live orb load');
 const result={cycles:10,positions,warnings,errors,listeners:before,blink:await page.evaluate(()=>({count:blinkCount,min:blinkMin}))};
 fs.writeFileSync('tests/orb-regression-results.json',JSON.stringify(result,null,2));
 await page.screenshot({path:'tests/orb-after.png'});
 console.log(JSON.stringify(result));
}finally{await browser.close();}
