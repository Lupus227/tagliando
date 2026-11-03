'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const origin='https://tagliando-ai-staging.maico-gua.workers.dev';
const env={SERVICE_MODE:'guarded',SELF_TEST_ORIGIN:origin};
const access=async()=>({});
const denied=async()=>{throw new Error('NO_ACCESS');};
const load=async()=>({
  serve:(await import('../worker/src/pilot.mjs')).servePilot,
  assets:(await import('../worker/src/pilot-assets.mjs')).pilotAssets,
  connector:(await import('../worker/src/pilot-client.mjs')).pilotConnector
});
const request=(route,method='GET')=>new Request(origin+route,{method});

test('pilot snapshot exactly matches dev PWA files; version cannot silently diverge',async()=>{
  const {assets}=await load();
  for(const [name,source] of Object.entries(assets)){
    assert.equal(source,fs.readFileSync(path.join(__dirname,'..',name),'utf8'),name);
  }
  assert.equal(Object.keys(assets).length,8);
});

test('pilot serves the original v0.12.1 app with explicit isolated banner',async()=>{
  const {serve}=await load();
  const r=await serve(request('/pilot/'),env,{},access);
  assert.equal(r.status,200);
  assert.match(r.headers.get('Content-Security-Policy'),/worker-src 'none'/);
  assert.match(r.headers.get('Content-Security-Policy'),/connect-src 'self'/);
  assert.equal(r.headers.get('cache-control'),'no-store, max-age=0');
  const h=await r.text();
  assert.match(h,/COLLAUDO FASE 14\.7 — COPIA ISOLATA/);
  assert.match(h,/id="voiceDialog"/);
  assert.match(h,/id="stepConfirm"/);
  assert.match(h,/\.\/pilot-connector\.js/);
  assert.doesNotMatch(h,/rel="manifest"/);
  assert.doesNotMatch(h,/rel="apple-touch-icon"/);
  assert.doesNotMatch(h,/src="https?:\/\//);
});

test('pilot static files match source, not replaced script or procedures',async()=>{
  const {serve,assets,connector}=await load();
  for(const [name,source] of Object.entries(assets)){
    if(name==='index.html')continue;
    const r=await serve(request('/pilot/'+name),env,{},access);
    assert.equal(r.status,200,name);
    assert.equal(await r.text(),source,name);
  }
  const res=await serve(request('/pilot/pilot-connector.js'),env,{},access);
  assert.equal(res.status,200);
  assert.equal(await res.text(),connector);
  assert.match(res.headers.get('content-type'),/javascript/);
});

test('pilot never serves service workers, missing icons, manifests or arbitrary paths',async()=>{
  const {serve}=await load();
  for(const uri of ['/pilot/sw.js','/pilot/manifest.webmanifest','/pilot/icons/apple-touch-icon.png',
    '/pilot/wrangler.jsonc','/pilot/../../worker/README.md','/pilot/unknown.js']){
    const res=await serve(request(uri),env,{},access);
    assert.equal(res.status,404,uri);
  }
});

test('pilot denies unauthorized identity or wrong API switch; no other origins accepted',async()=>{
  const {serve}=await load();
  const r=request('/pilot/');
  assert.equal((await serve(r,env,{},denied)).status,401);
  assert.equal((await serve(r,{...env,SERVICE_MODE:'disabled'},{},access)).status,503);
  assert.equal((await serve(r,{...env,SELF_TEST_ORIGIN:'https://evil.test'},{},access)).status,403);
  assert.equal((await serve(new Request('https://evil.test/pilot/'),env,{},access)).status,403);
  assert.equal((await serve(request('/pilot/','POST'),env,{},access)).status,405);
});

test('pilot redirect stays on protected domain',async()=>{
  const {serve}=await load();
  const r=await serve(request('/pilot'),env,{},access);
  assert.equal(r.status,302);
  assert.equal(r.headers.get('location'),'/pilot/');
});

test('pilot connector is manual, session-read-only, and uses same-origin only',async()=>{
  const {connector}=await load();
  assert.match(connector,/addEventListener\('click'/);
  assert.match(connector,/fetch\('\/api\/assist'/);
  assert.match(connector,/credentials:'same-origin'/);
  assert.match(connector,/data\.sessionChanged===false/);
  assert.match(connector,/data\.canGenerate===false/);
  assert.doesNotMatch(connector,/localStorage|sessionStorage|recordVoiceAnomaly|\.click\(\)/);
  assert.doesNotMatch(connector,/https?:\/\//);
  assert.doesNotMatch(connector,/SpeechRecognition|speechSynthesis/);
});
