import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const ts=require('typescript');
function load(file, overrides={}) {
 const loaded={exports:{}};
 const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
 vm.runInNewContext(code,{module:loaded,exports:loaded.exports,require:id=>id in overrides?overrides[id]:require(id),process,Buffer,AbortSignal,console});
 return loaded.exports;
}
const validation=load('app/lib/quote-validation.ts');
const valid={name:' Prueba local ',phone:'+56 9 1234 5678',email:'test@example.com',company:'Empresa',message:'Cotización de prueba',service:'Neón'};
for(const phone of ['+56 9 1234 5678','56912345678','912345678']) assert.equal(validation.validateQuote({...valid,phone}).valid,true);
let inserts=[],mails=[],dbFailure=false,mailFailure=false;
const {createClient}=require('@supabase/supabase-js');
const client=createClient('https://test.supabase.co','test-anon',{auth:{persistSession:false},global:{fetch:async(url,options)=>{
 assert.ok(String(url).endsWith('/rest/v1/cotizaciones'));assert.equal(options.method,'POST');
 assert.ok(!String(options.headers.get('prefer')).includes('representation'));
 inserts.push(JSON.parse(options.body));
 return dbFailure?new Response(JSON.stringify({code:'42501',message:'internal policy detail'}),{status:403}):new Response(null,{status:201});
}}});
const route=load('app/api/send-quote/route.ts',{'../../lib/quote-validation':validation,'../../lib/supabase':{getSupabase:()=>client},nodemailer:{createTransport:()=>({sendMail:async mail=>{mails.push(mail);if(mailFailure)throw Error('secret smtp error');}})}});
for(const key of ['SMTP_HOST','SMTP_PORT','SMTP_USER','SMTP_PASS','MAIL_TO'])process.env[key]=key==='SMTP_PORT'?'587':'test-only';
const post=body=>route.POST(new Request('http://localhost/api/send-quote',{method:'POST',body:JSON.stringify(body)}));
for(const patch of [{email:'bad'},{service:''},{service:'injected'},{message:''},{name:''},{phone:''},{phone:'letters'},{name:{}},{message:'x'.repeat(10001)}])assert.equal((await post({...valid,...patch})).status,400);
assert.equal(inserts.length,0);assert.equal(mails.length,0);
let res=await post(valid);assert.equal(res.status,200);assert.equal((await res.json()).notificationSent,true);
assert.deepEqual(inserts[0],{nombre:'Prueba local',telefono:valid.phone,correo:valid.email,empresa:'Empresa',detalle:valid.message,servicio:'Neón'});
assert.equal(mails[0].replyTo,valid.email);
dbFailure=true;res=await post(valid);assert.equal(res.status,503);assert.equal(mails.length,1);assert.ok(!(await res.text()).includes('internal policy'));
dbFailure=false;mailFailure=true;res=await post({...valid,company:''});assert.equal(res.status,200);assert.equal((await res.json()).notificationSent,false);assert.equal(inserts.at(-1).empresa,null);
assert.equal((await route.POST(new Request('http://localhost',{method:'POST',body:'{'}))).status,400);
console.log('PASS: validation, Chilean phone formats, exact INSERT payload without defaults/SELECT, mail after save, DB failure, mail failure, optional company, malformed JSON. All external services simulated.');

// Load the actual configuration module; never use real credentials in these tests.
const configSource=fs.readFileSync('app/lib/supabase.ts','utf8');
assert.ok(configSource.includes('process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'));
assert.ok(!configSource.includes('SUPABASE_ANON_KEY'));
let creations=0;
process.env.NEXT_PUBLIC_SUPABASE_URL='https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY='sb_publishable_test-only';
const config=load('app/lib/supabase.ts',{'server-only':{},'@supabase/supabase-js':{createClient:(url,key)=>{creations++;assert.equal(url,process.env.NEXT_PUBLIC_SUPABASE_URL);assert.equal(key,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);return client;}}});
assert.equal(config.getSupabase(),config.getSupabase());assert.equal(creations,1);
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY='sb_secret_test-only';
assert.throws(()=>load('app/lib/supabase.ts',{'server-only':{}}).getSupabase());
delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
assert.throws(()=>load('app/lib/supabase.ts',{'server-only':{}}).getSupabase());
console.log('PASS: exact environment names, singleton, secret key rejection, missing configuration.');
