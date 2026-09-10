import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({channel:'chrome',headless:true});
const output=path.join(process.env.TEMP||'/tmp','rubik-quote-tests');fs.mkdirSync(output,{recursive:true});
try{for(const width of [390,1440]){
 const page=await browser.newPage({viewport:{width,height:900}});let count=0,fail=true,notificationSent=true,release;
 const runtimeErrors=[];page.on('pageerror',error=>runtimeErrors.push(error.message));
 await page.route('**/api/send-quote',async route=>{count++;await new Promise(r=>release=r);await route.fulfill({status:fail?503:200,contentType:'application/json',body:JSON.stringify({ok:!fail,saved:!fail,notificationSent})});});
 await page.goto(process.env.UX_BASE_URL||'http://localhost:3001');
 if(width<768){await page.getByRole('button',{name:'Abrir menú',exact:true}).click();await page.getByRole('dialog',{name:'Navegación'}).getByRole('button',{name:/COTIZA/i}).click();}
 else await page.locator('header').getByRole('button',{name:'COTIZA',exact:true}).click();
 const form=page.locator('.rubik-cotiza-scene form');const submit=form.getByRole('button',{name:'Enviar solicitud',exact:true});
 await submit.click();await form.getByRole('alert').waitFor();assert.equal(count,0);
 const values={Nombre:'Prueba UX',Teléfono:'+56 9 1234 5678',Correo:'test@example.com','Empresa (opcional)':'Empresa prueba','Detalle cotización':'Detalle de prueba local'};
 for(const [name,value] of Object.entries(values))await form.getByRole('textbox',{name,exact:true}).fill(value);
 await submit.click();assert.equal(count,0);assert.ok((await form.getByRole('alert').textContent()).includes('Selecciona'));
 await page.locator('.rubik-cotiza-service-card').getByRole('button').filter({hasText:'Neón'}).click();
 for(const [name,value] of [['Correo','invalid'],['Teléfono','abc'],['Nombre',''],['Detalle cotización','']]){await form.getByRole('textbox',{name,exact:true}).fill(value);await submit.click();assert.equal(count,0);assert.equal(await form.getByRole('textbox',{name,exact:true}).getAttribute('aria-invalid'),'true');await form.getByRole('textbox',{name,exact:true}).fill(values[name]);}
 await form.evaluate(f=>{f.requestSubmit();f.requestSubmit();});
 await page.waitForFunction(()=>document.querySelector('form[aria-busy="true"]'));
 await page.waitForTimeout(300);assert.equal(count,1);assert.equal(await form.getByRole('button',{name:'Enviando...',exact:true}).isDisabled(),true);
 await page.screenshot({path:path.join(output,`${width}-sending.png`)});release();
 await form.getByRole('alert').waitFor();assert.equal(await form.getByRole('textbox',{name:'Nombre',exact:true}).inputValue(),'Prueba UX');assert.equal(await submit.isEnabled(),true);
 fail=false;await submit.click();await page.waitForTimeout(300);assert.equal(count,2);release();await page.getByRole('status').waitFor();
 for(const name of Object.keys(values))assert.equal(await form.getByRole('textbox',{name,exact:true}).inputValue(),'');
 await page.screenshot({path:path.join(output,`${width}-success.png`)});
 await page.getByRole('status').waitFor({state:'detached'});
 for(const [name,value] of Object.entries(values))await form.getByRole('textbox',{name,exact:true}).fill(name==='Empresa (opcional)'?'':value);
 await page.locator('.rubik-cotiza-service-card').getByRole('button').filter({hasText:'Stands'}).click();
 notificationSent=false;await submit.click();await page.waitForTimeout(300);assert.equal(count,3);release();
 await form.getByRole('alert').waitFor();assert.ok((await form.getByRole('alert').textContent()).includes('quedó guardada'));
 assert.equal(await form.getByRole('textbox',{name:'Nombre',exact:true}).inputValue(),'Prueba UX');
 assert.equal(await form.getByRole('button',{name:'Solicitud guardada',exact:true}).isDisabled(),true);
 await form.evaluate(f=>{f.requestSubmit();f.requestSubmit();});assert.equal(count,3);
 await page.screenshot({path:path.join(output,`${width}-partial.png`)});
 assert.equal(runtimeErrors.length,0,runtimeErrors.join('\n'));
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));console.log(`PASS ${width}: required fields, invalid email/phone, missing service, sending state, duplicate submit guard, error preserves fields, retry, success clears fields, no horizontal overflow`);await page.close();
}}finally{await browser.close();}
