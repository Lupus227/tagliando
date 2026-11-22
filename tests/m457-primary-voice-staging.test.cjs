'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const ORIGIN='https://tagliando-ai-staging.maico-gua.workers.dev';
const env={SERVICE_MODE:'guarded',SELF_TEST_ORIGIN:ORIGIN,ACCESS_AUD:'a'.repeat(64)};
const ctx={access:{aud:env.ACCESS_AUD}};
const load=async()=>({
  transform:(await import('../worker/src/pilot-voice-runtime.mjs')).pilotVoiceWithReadOnlyWorkerBridge,
  serve:(await import('../worker/src/pilot.mjs')).servePilot,
  assets:(await import('../worker/src/pilot-assets.mjs')).pilotAssets
});

test('M4.5.7 adds only one pilot-scoped question path after original command and anomaly checks',async()=>{
  const {transform,assets}=await load();
  const original=assets['voice.js'];
  const enhanced=transform(original);
  assert.ok(enhanced.length>original.length);
  assert.equal(enhanced.split('M4.5.7: SINGLE approved question').length,2);
  assert.ok(enhanced.indexOf('const c=commandFor(transcript);') <
    enhanced.indexOf('M4.5.7: SINGLE approved question'));
  assert.ok(enhanced.indexOf('const contextual=riskFor(transcript);') <
    enhanced.indexOf('M4.5.7: SINGLE approved question'));
  assert.ok(enhanced.indexOf("if(contextual){") <
    enhanced.indexOf('M4.5.7: SINGLE approved question'));
  assert.ok(enhanced.indexOf('M4.5.7: SINGLE approved question') <
    enhanced.indexOf("setStatus('Frase riconosciuta ma non prevista: nessuna azione eseguita.')"));
  for(const command of ["if(c==='done')","if(c==='stop')","if(c==='anomaly')",
    "if(c==='pause')","startAnomalyFlow(transcript","'stepConfirm').click()"]){
    assert.ok(enhanced.includes(command),command);
    assert.equal(enhanced.split(command).length,original.split(command).length,
      'original safety, commands and progress unchanged: '+command);
  }
  new vm.Script(enhanced,{filename:'pilot/voice.js'});
  assert.equal(fs.readFileSync(path.join(__dirname,'../voice.js'),'utf8'),original);
});

test('M4.5.7 fail-closed transform when pilot source marker or security ordering changes',async()=>{
  const {transform,assets}=await load();
  const original=assets['voice.js'];
  for(const bad of [
    original.replace("setStatus('Frase riconosciuta ma non prevista: nessuna azione eseguita.')",
      "setStatus('unknown')"),
    original.replace("const c=commandFor(transcript);","const c=other(transcript);"),
    original.replace("const contextual=riskFor(transcript);","const contextual=null;"),
    original.replace("function listen(automatic)","function ignore(automatic)"),
    original.replace("/* v0.12.1","/* v0.99.1"),
    transform(original)
  ])assert.throws(()=>transform(bad),/PILOT_VOICE_SOURCE_CHANGED/);
});

test('M4.5.7 original PWA voice receives no change; staging route serves only enhanced voice under Access',async()=>{
  const {serve,transform,assets}=await load();
  const request=new Request(ORIGIN+'/pilot/voice.js');
  assert.equal((await serve(request,env,{},async()=>{throw Error('unauthorized')})).status,401);
  assert.equal((await serve(request,{...env,SERVICE_MODE:'disabled'},ctx,async()=>({}))).status,503);
  const r=await serve(request,env,ctx,async()=>({}));
  assert.equal(r.status,200);
  const content=await r.text();
  assert.equal(content,transform(assets['voice.js']));
  assert.match(content,/fetch\('\/api\/lab\/voice-bridge'/);
  assert.match(content,/credentials:'same-origin'/);
  assert.match(content,/sessionChanged===false/);
  assert.match(content,/source\?\.revision==='F15\.18-R2'/);
  assert.match(content,/if\(automatic && same\(\)\)listen\(true\)/);
  assert.match(content,/turn===scopedTurn/);
  assert.match(content,/currentOperation\(\)===before\.operationId/);
  assert.match(content,/answer==='No\. Il filtro in carta non deve essere lavato né oliato\.'/);
  assert.doesNotMatch(content.slice(content.indexOf('M4.5.7: SINGLE approved question'),content.indexOf("setStatus('Frase riconosciuta ma non prevista: nessuna azione eseguita.')")),/AI\.run|openai|stepConfirm'\)\.click\(\)/);
  const page=await serve(new Request(ORIGIN+'/pilot/'),env,ctx,async()=>({}));
  assert.equal(page.status,200);
  assert.match(await page.text(),/I comandi vocali principali rimangono invariati salvo una domanda specifica/);
});
