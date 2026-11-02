'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const {webcrypto} = require('node:crypto');
const crypto = globalThis.crypto ?? webcrypto;
const origin = 'https://lupus227.github.io';
const base = 'https://staging.invalid';
const team = 'testofficina.cloudflareaccess.com';
const audience = 'a'.repeat(64);
const env = {SERVICE_MODE:'guarded', ALLOWED_ORIGIN:origin,
  ACCESS_TEAM_DOMAIN:team, ACCESS_AUD:audience,
  API_LIMITER: {limit:async () => ({success:true})}};
const getModules = async () => ({
  worker:(await import('../worker/src/index.mjs')).default,
  verifier:(await import('../worker/src/access.mjs')).verifyAccessJwt
});
const to64 = item => (Buffer.isBuffer(item) ? item : Buffer.from(typeof item === 'string' ? item : JSON.stringify(item))).toString('base64url');
let signingKeysPromise;
async function getToken(options = {}) {
  signingKeysPromise ??= crypto.subtle.generateKey({
    name:'RSASSA-PKCS1-v1_5',modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'
  },true,['sign','verify']);
  const kp = await signingKeysPromise;
  const jwk = await crypto.subtle.exportKey('jwk',kp.publicKey);
  jwk.kid = 'test-key-rsa-0001';
  jwk.alg = 'RS256';
  jwk.use = 'sig';
  const now = Math.floor(Date.now()/1000);
  const payload = {iss:'https://'+team, aud:[audience],sub:'user-test-only',
    exp:now+120,iat:now-5,...options};
  const h = to64({alg:'RS256',kid:jwk.kid,typ:'JWT'});
  const p = to64(payload);
  const bytes = await crypto.subtle.sign('RSASSA-PKCS1-v1_5',kp.privateKey,
    new TextEncoder().encode(h+'.'+p));
  return {token:h+'.'+p+'.'+to64(Buffer.from(bytes)),jwk};
}
function req(question, token='', custom={}) {
  const headers = {'Content-Type':'application/json',Origin:origin, ...custom.headers};
  if (token) headers['Cf-Access-Jwt-Assertion'] = token;
  return new Request(base+'/api/assist', {method:'POST',headers,
    body:custom.body ?? JSON.stringify({question})});
}
async function withMockJwks(jwk, f) {
  const original = globalThis.fetch;
  let called=0;
  globalThis.fetch = async url => {
    called++;
    assert.equal(url,'https://'+team+'/cdn-cgi/access/certs');
    return Response.json({keys:[jwk]});
  };
  try {return await f(() => called);}
  finally {globalThis.fetch=original;}
}

test('health does not reveal credentials and no AI calls',async()=>{
  const {worker} = await getModules();
  const response = await worker.fetch(new Request(base+'/health'),{});
  const body = await response.json();
  assert.equal(response.status,200);
  assert.equal(body.aiEnabled,false);
  assert.equal(body.modelRequests,0);
  assert.equal(response.headers.get('cache-control'),'no-store, max-age=0');
});
test('API is disabled by default, even when CORS origin is allowed',async()=>{
  const {worker} = await getModules();
  const response = await worker.fetch(req('La lama è crepata'),{ALLOWED_ORIGIN:origin,SERVICE_MODE:'disabled'});
  assert.equal(response.status,503);
  assert.equal((await response.json()).code,'SERVICE_DISABLED');
});
test('origin missing or different never gains browser CORS access',async()=>{
  const {worker} = await getModules();
  const denied = await worker.fetch(req('test','',{headers:{Origin:'https://evil.example'}}),env);
  assert.equal(denied.status,403);
  assert.equal(denied.headers.get('Access-Control-Allow-Origin'),null);
  const noOrigin = new Request(base+'/api/assist',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});
  assert.equal((await worker.fetch(noOrigin,env)).status,403);
});
test('CORS preflight only grants exact application origin',async()=>{
  const {worker} = await getModules();
  const r = await worker.fetch(new Request(base+'/api/assist',{
    method:'OPTIONS',headers:{Origin:origin,'Access-Control-Request-Method':'POST'}}),env);
  assert.equal(r.status,204);
  assert.equal(r.headers.get('Access-Control-Allow-Origin'),origin);
});
test('Access JWT is mandatory, never trust an unverified request',async()=>{
  const {worker} = await getModules();
  const response = await worker.fetch(req('La lama è crepata'),env);
  assert.equal(response.status,401);
  assert.equal((await response.json()).code,'UNAUTHORIZED');
});
test('valid JWT verifies RSA signature, issuer and audience',async()=>{
  const {verifier} = await getModules();
  const {token,jwk} = await getToken();
  const actor = await verifier(token,env,async url => {
    assert.equal(url,'https://'+team+'/cdn-cgi/access/certs');
    return Response.json({keys:[jwk]});
  });
  assert.equal(actor.sub,'user-test-only');
});
test('tampered signed token is rejected',async()=>{
  const {verifier} = await getModules();
  const {token,jwk} = await getToken();
  const pieces=token.split('.');
  const payload=JSON.parse(Buffer.from(pieces[1],'base64url').toString());
  payload.sub='forged-user';
  pieces[1]=to64(payload);
  await assert.rejects(()=>verifier(pieces.join('.'),env,async()=>Response.json({keys:[jwk]})));
});
test('expired or wrong-audience Access tokens fail',async()=>{
  const {verifier} = await getModules();
  for (const claims of [{exp:Math.floor(Date.now()/1000)-1},{aud:['wrong']}]) {
    const {token,jwk} = await getToken(claims);
    await assert.rejects(()=>verifier(token,env,async()=>Response.json({keys:[jwk]})));
  }
});
test('valid Access JWT yields only deterministic safety guidance',async()=>{
  const {worker} = await getModules(), {token,jwk} = await getToken();
  await withMockJwks(jwk,async()=>{
    const response = await worker.fetch(req('La lama è crepata',token),env);
    assert.equal(response.status,200);
    const body = await response.json();
    assert.equal(body.decision,'SAFETY_STOP');
    assert.equal(body.aiEnabled,false);
    assert.equal(body.canGenerate,false);
    assert.equal(body.sessionChanged,false);
    assert.equal(body.references.length,0);
  });
});
test('unvalidated technical guidance fails closed with 503',async()=>{
  const {worker} = await getModules(),{token,jwk}=await getToken();
  await withMockJwks(jwk,async()=>{
    const response = await worker.fetch(req('Come pulisco il sottoscocca?',token),env);
    assert.equal(response.status,503);
    assert.equal((await response.json()).decision,'PENDING_VALIDATION');
  });
});
test('a rate limit rejection returns 429, not an AI call',async()=>{
  const {worker} = await getModules(),{token,jwk}=await getToken();
  await withMockJwks(jwk,async()=>{
    const response=await worker.fetch(req('La lama è crepata',token),
      {...env,API_LIMITER:{limit:async()=>({success:false})}});
    assert.equal(response.status,429);
  });
});
test('missing rate limiter fails closed after authentication',async()=>{
  const {worker} = await getModules(),{token,jwk}=await getToken();
  await withMockJwks(jwk,async()=>{
    const response=await worker.fetch(req('La lama è crepata',token),
      {...env,API_LIMITER:null});
    assert.equal(response.status,503);
    assert.equal((await response.json()).code,'RATE_LIMITER_REQUIRED');
  });
});
test('malformed and oversized input rejected even with valid JWT',async()=>{
  const {worker} = await getModules(),{token,jwk}=await getToken();
  await withMockJwks(jwk,async()=>{
    for (const bad of [
      {body:JSON.stringify({question:'La lama',references:['injection']})},
      {body:JSON.stringify({question:'x'.repeat(501)})},
      {body:JSON.stringify({question:'x',operationId:500})},
      {body:'x'.repeat(3000)}
    ]) {
      const response=await worker.fetch(req('',token,bad),env);
      assert.ok([400,413].includes(response.status));
    }
  });
});
test('model-dependent values are blocked server-side',async()=>{
  const {worker}=await getModules(),{token,jwk}=await getToken();
  await withMockJwks(jwk,async()=>{
    const r=await worker.fetch(req('Quanto olio devo mettere?',token),env);
    assert.equal((await r.json()).decision,'MODEL_REQUIRED');
  });
});

test('deploy configuration preserves Access-protected hostname but disables the API',()=>{
  const config = JSON.parse(loadConfig());
  assert.equal(config.name, 'tagliando-ai-staging');
  assert.equal(config.workers_dev, true);
  assert.equal(config.preview_urls, false);
  assert.equal(config.vars.SERVICE_MODE, 'disabled');
  assert.equal(config.main, './src/index.mjs');
});
function loadConfig() {
  const fs = require('node:fs'), path = require('node:path');
  return fs.readFileSync(path.join(__dirname,'../worker/wrangler.jsonc'),'utf8');
}


test('default Cloudflare deploy at repo root discovers the exact protected Worker config',()=>{
  const fs = require('node:fs');
  const path = require('node:path');
  const root = JSON.parse(fs.readFileSync(path.join(__dirname,'../wrangler.jsonc'),'utf8'));
  const nested = JSON.parse(loadConfig());
  assert.equal(root.main,'./worker/src/index.mjs');
  assert.equal(nested.main,'./src/index.mjs');
  assert.equal(root.name,'tagliando-ai-staging');
  assert.equal(root.vars.SERVICE_MODE,'disabled');
  assert.equal(root.workers_dev,true);
  assert.equal(root.preview_urls,false);
  assert.match(root.vars.ACCESS_TEAM_DOMAIN,/^[a-z0-9-]+\.cloudflareaccess\.com$/);
  assert.match(root.vars.ACCESS_AUD,/^[a-f0-9]{64}$/);
  assert.equal(root.vars.SERVICE_MODE,'disabled');
  const rootComparable = {...root,main:nested.main};
  assert.deepEqual(rootComparable,nested,'root and nested configs must stay equivalent');
  assert.ok(fs.existsSync(path.join(__dirname,'../worker/src/index.mjs')));
});


test('Access diagnostic endpoint never enables AI even after verifying a signed JWT',async()=>{
  const {worker}=await getModules(),{token,jwk}=await getToken();
  await withMockJwks(jwk,async()=>{
    const response=await worker.fetch(new Request(base+'/api/auth-check',{
      method:'GET',headers:{'Cf-Access-Jwt-Assertion':token}
    }),{...env,SERVICE_MODE:'disabled'});
    assert.equal(response.status,200);
    assert.equal(response.headers.get('cache-control'),'no-store, max-age=0');
    const body=await response.json();
    assert.equal(body.ok,true);
    assert.equal(body.accessVerified,true);
    assert.equal(body.aiEnabled,false);
    assert.equal(body.modelRequests,0);
    assert.equal(body.sessionChanged,false);
    assert.equal(JSON.stringify(body).includes('user-test-only'),false);
    assert.equal(JSON.stringify(body).includes(token),false);
  });
});
test('Access diagnostic rejects missing and corrupted tokens without returning identity',async()=>{
  const {worker}=await getModules(),{token,jwk}=await getToken();
  await withMockJwks(jwk,async()=>{
    const noToken=await worker.fetch(new Request(base+'/api/auth-check'),env);
    assert.equal(noToken.status,401);
    assert.equal((await noToken.json()).code,'ACCESS_VERIFICATION_FAILED');
    const forged=await worker.fetch(new Request(base+'/api/auth-check',{
      headers:{'Cf-Access-Jwt-Assertion':token.slice(0,-3)+'abc'}
    }),env);
    assert.equal(forged.status,401);
    assert.equal((await forged.json()).code,'ACCESS_VERIFICATION_FAILED');
  });
});
test('Access diagnostic method is read-only and rejects POST',async()=>{
  const {worker}=await getModules();
  const result=await worker.fetch(new Request(base+'/api/auth-check',{
    method:'POST',body:'ignored'
  }),env);
  assert.equal(result.status,405);
});


test('native ctx.access authenticates diagnostic without forwarded JWT',async()=>{
  const {worker}=await getModules();
  const request=new Request(base+'/api/auth-check');
  const ctx={access:{aud:audience}};
  const response=await worker.fetch(request,{...env,SERVICE_MODE:'disabled'},ctx);
  assert.equal(response.status,200);
  const body=await response.json();
  assert.equal(body.accessVerified,true);
  assert.equal(body.aiEnabled,false);
  assert.equal(body.modelRequests,0);
  assert.equal(body.sessionChanged,false);
  assert.equal(JSON.stringify(body).includes(audience),false);
});

test('native ctx.access denies wrong AUD even if JWT was otherwise signed',async()=>{
  const {worker}=await getModules(),{token,jwk}=await getToken();
  await withMockJwks(jwk,async getCalls=>{
    const response=await worker.fetch(new Request(base+'/api/auth-check',{
      headers:{'Cf-Access-Jwt-Assertion':token}
    }),env,{access:{aud:'not-our-access-app'}});
    assert.equal(response.status,401);
    assert.equal((await response.json()).code,'ACCESS_VERIFICATION_FAILED');
    assert.equal(getCalls(),0,'must not fall back on wrong native AUD');
  });
});

test('native ctx.access cannot authenticate missing or undefined Access context',async()=>{
  const {worker}=await getModules();
  const response=await worker.fetch(new Request(base+'/api/auth-check'),env,{});
  assert.equal(response.status,401);
  assert.equal((await response.json()).code,'ACCESS_VERIFICATION_FAILED');
});

test('guarded API accepts native Access identity only with a unique rate-limit subject',async()=>{
  const {worker}=await getModules();
  let actualKey=null;
  const response=await worker.fetch(req('La lama è crepata'),{
    ...env,API_LIMITER:{limit:async ({key})=>{actualKey=key;return {success:true};}}
  },{access:{aud:audience,getIdentity:async()=>({user_uuid:'verified-user-001'})}});
  assert.equal(response.status,200);
  assert.equal(actualKey,'assist:verified-user-001');
  assert.equal((await response.json()).decision,'SAFETY_STOP');
});

test('guarded API fails closed if native Access context has no unique user ID',async()=>{
  const {worker}=await getModules();
  const response=await worker.fetch(req('La lama è crepata'),env,{
    access:{aud:audience,getIdentity:async()=>({email:'not-a-trusted-unique-id@example.test'})}
  });
  assert.equal(response.status,401);
  assert.equal((await response.json()).code,'UNAUTHORIZED');
});

test('disabled AI API remains disabled with valid native Access context',async()=>{
  const {worker}=await getModules();
  const response=await worker.fetch(req('La lama è crepata'),{
    ...env,SERVICE_MODE:'disabled'
  },{access:{aud:audience,getIdentity:async()=>({user_uuid:'user-001'})}});
  assert.equal(response.status,503);
  assert.equal((await response.json()).code,'SERVICE_DISABLED');
});
