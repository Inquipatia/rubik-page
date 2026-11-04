import {createRequire} from 'node:module';
import fs from 'node:fs';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/hp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
 const page=await browser.newPage({viewport:{width:1366,height:768}});
 await page.route('**/_next/static/chunks/*.js',async route=>{
  const response=await route.fetch();
  const body=(await response.text()).replace(/this\.canvas\s*=\s*(\w+),\s*this\._htmlContentMode\s*=/g,'this.canvas=$1,(window.__splineApps??=[]).push(this),this._htmlContentMode=');
  await route.fulfill({response,body});
 });
 await page.goto(process.env.UX_BASE_URL || 'http://127.0.0.1:3200');
 await page.waitForFunction(()=>document.querySelectorAll('.smooth-spline[data-ready="true"]').length===2,null,{timeout:120000});
 const data=await page.evaluate(()=>window.__splineApps.map(a=>{
  const textures=new Map(),materials=new Map(),geometries=new Map(),lights=[],meshes=[];
  a._scene.traverse(o=>{
   if(o.isLight) lights.push({name:o.name,type:o.type,castShadow:o.castShadow});
   if(o.geometry){geometries.set(o.geometry.uuid,{vertices:o.geometry.attributes?.position?.count,indices:o.geometry.index?.count});meshes.push({name:o.name,type:o.type,visible:o.visible,vertices:o.geometry.attributes?.position?.count});}
   for(const m of [o.material].flat().filter(Boolean)) {
    materials.set(m.uuid,{type:m.type,name:m.name});
    for(const [k,v] of Object.entries(m))if(v?.isTexture)textures.set(v.uuid,{slot:k,width:v.image?.width,height:v.image?.height,name:v.name,type:v.type});
   }
  });
  a.__frames=0;a.addEventListener('rendered',()=>a.__frames++);
  return {kind:a.canvas.closest('.rubik-orb-spline')?'orb':'cube',backend:a._rendererBackend,imageData:Object.entries(a._data.shared.images).map(([id,v])=>{const image=a._sharedAssetsManager.getImage(id).img;return {id,width:image?.naturalWidth||image?.width,height:image?.naturalHeight||image?.height,name:v.name};}),settings:a._data.scene.publish,lights,materials:[...materials.values()],geometryCount:geometries.size,vertices:[...geometries.values()].reduce((s,g)=>s+(g.vertices||0),0),largestMeshes:meshes.sort((a,b)=>b.vertices-a.vertices).slice(0,12),textures:[...textures.values()]};
 }));
 const start=await page.evaluate(()=>performance.now());
 await page.waitForTimeout(5000);
 const runtime=await page.evaluate(start=>({heap:performance.memory?.usedJSHeapSize,elapsed:performance.now()-start,scenes:window.__splineApps.map(a=>({backend:a._rendererBackend,frames:a.__frames,info:a._renderer.info}))}),start);
 const label=process.env.AUDIT_LABEL || 'webgpu';
 await page.screenshot({path:`tests/spline-${label}.png`});
 fs.writeFileSync(`tests/spline-${label}-audit.json`,JSON.stringify({data,runtime},null,2));
 console.log(JSON.stringify({data,runtime}));
}finally{await browser.close();}
