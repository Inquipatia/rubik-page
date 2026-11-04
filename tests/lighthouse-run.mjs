import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import fs from 'node:fs';
import net from 'node:net';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/hp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const modulePath=process.env.LIGHTHOUSE_MODULE;
if(!modulePath)throw Error('Set LIGHTHOUSE_MODULE to the installed lighthouse/core/index.js; no project dependency is required.');
const {default:lighthouse}=await import(pathToFileURL(modulePath));
const server=net.createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const port=server.address().port;await new Promise(resolve=>server.close(resolve));
const browser=await chromium.launch({channel:'chrome',headless:true,args:[`--remote-debugging-port=${port}`]});
try {
 const result=await lighthouse(process.env.UX_BASE_URL || 'http://127.0.0.1:3200',{
  port,logLevel:'error',onlyCategories:['performance'],formFactor:'desktop',
  screenEmulation:{mobile:false,width:1366,height:768,deviceScaleFactor:1,disabled:false},
  throttlingMethod:'devtools',
  throttling:{cpuSlowdownMultiplier:4,rttMs:40,throughputKbps:10000,requestLatencyMs:40,downloadThroughputKbps:10000,uploadThroughputKbps:5000},
  maxWaitForLoad:90000,
 });
 fs.writeFileSync('tests/lighthouse-complete.json',JSON.stringify(result.lhr,null,2));
 console.log(JSON.stringify({score:result.lhr.categories.performance.score,warnings:result.lhr.runWarnings,metrics:Object.fromEntries(['first-contentful-paint','largest-contentful-paint','cumulative-layout-shift','total-blocking-time','speed-index','interactive'].map(k=>[k,{value:result.lhr.audits[k]?.numericValue,error:result.lhr.audits[k]?.errorMessage}]))}));
}finally{await browser.close();}
