import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/hp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
 const page=await browser.newPage({viewport:{width:390,height:400},isMobile:true,hasTouch:true});
 const scenes=[];
 page.on('request',r=>{if(r.url().includes('.splinecode'))scenes.push(r.url());});
 await page.goto(process.env.UX_BASE_URL || 'http://127.0.0.1:3200');
 await page.waitForTimeout(2000);
 assert.ok(await page.locator('h1').isVisible());
 assert.deepEqual(scenes,[],'offscreen cube must not request its scene');
 assert.equal(await page.locator('canvas').count(),0,'offscreen cube must not initialize a context');
 await page.locator('.smooth-spline--cube').scrollIntoViewIfNeeded();
 await page.waitForFunction(()=>document.querySelector('.smooth-spline--cube')?.dataset.ready==='true',null,{timeout:90000});
 assert.equal(scenes.length,1,'entering viewport initializes the cube exactly once');
 assert.equal(await page.locator('canvas').count(),1);
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
 await page.waitForTimeout(500);
 await page.locator('.smooth-spline--cube').scrollIntoViewIfNeeded();
 await page.waitForTimeout(500);
 assert.equal(scenes.length,1,'returning to the viewport preserves the scene');
 console.log('PASS: HTML visible, no offscreen scene/context, initialize on entry, reuse on return.');
}finally{await browser.close();}
