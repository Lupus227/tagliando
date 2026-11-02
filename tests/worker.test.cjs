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
async function getToken(options = {}) {
  const kp = await crypto.subtle.generateKey({
    name:'RSASSA-PKCS1-v1_5',modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'
  },true,['sign','verify']);
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
