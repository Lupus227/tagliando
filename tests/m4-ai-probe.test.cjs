'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const origin='https://tagliando-ai-staging.maico-gua.workers.dev';
const getWorker=async()=> (await import('../worker/src/index.mjs')).default;
const getProbe=()=>import('../worker/src/m4-ai-probe.mjs');
const ctx={access:{aud:'a'.repeat(64),getIdentity:async()=>({user_uuid:'m4-test-actor'})}};
function mockEnv(overrides={}){
  let calls=[];
  const env={
    SERVICE_MODE:'guarded',AI_PROBE_MODE:'enabled',SELF_TEST_ORIGIN:origin,
    ACCESS_AUD:'a'.repeat(64),ALLOWED_ORIGIN:'https://lupus227.github.io',
    API_LIMITER:{limit:async()=>({success:true})},
    AI_PROBE_LIMITER:{limit:async()=>({success:true})},
    AI:{run:async(model,params)=>{
      calls.push({model,params});
      return {response:JSON.stringify({action:'SHOW_REVIEWED_STEP',
        sourceStepId:'RASA-OP-03-P03',sourceRevision:'F15.18-R2'})};
    }},
    ...overrides
  };
  return {env,getCalls:()=>calls};
}
function post(caseId,extra={}){
  return new Request(origin+'/api/lab/ai-probe',{method:'POST',
    headers:{'Origin':origin,'Content-Type':'application/json',...extra.headers},
    body:extra.raw??JSON.stringify({caseId})});
}
test('M4.2.2 deployment defaults are disabled and Wrangler configs match',()=>{
  const read=p=>JSON.parse(fs.readFileSync(path.join(__dirname,'..',p),'utf8'));
  const root=read('wrangler.jsonc'),worker=read('worker/wrangler.jsonc');
  assert.deepEqual({...root,main:worker.main},worker);
  assert.equal(root.vars.AI_PROBE_MODE,'disabled');
  assert.deepEqual(root.ai,{binding:'AI'});
  const limit=root.ratelimits.find(x=>x.name==='AI_PROBE_LIMITER');
  assert.ok(limit);
  assert.equal(limit.simple.limit,1);
  assert.equal(limit.simple.period,60);
});
test('M4.2.2 fixed probe cannot invoke AI while default mode is disabled',async()=>{
  const {runFixedM4Probe}=await getProbe();
  const {env,getCalls}=mockEnv({AI_PROBE_MODE:'disabled'});
  const answer=await runFixedM4Probe('paper-wash',env);
  assert.equal(answer.decision,'PROBE_DISABLED');
  assert.equal(answer.modelRequests,0);
  assert.equal(getCalls().length,0);
});
test('M4.2.2 approved fixed paper question is model-classified and server-reviewed',async()=>{
  const {runFixedM4Probe}=await getProbe();
  const {env,getCalls}=mockEnv();
  const answer=await runFixedM4Probe('paper-wash',env);
  assert.equal(answer.decision,'REVIEWED_SOURCE_DRY_RUN');
  assert.equal(answer.ok,true);
  assert.equal(answer.modelRequests,1);
  assert.equal(answer.probeInferenceExecuted,true);
  assert.equal(answer.aiEnabled,false);
  assert.equal(answer.canGenerate,false);
  assert.equal(answer.allowCompletion,false);
  assert.equal(answer.sessionChanged,false);
  assert.match(answer.instruction,/Non lavare né oliare i filtri in carta/);
  assert.deepEqual(answer.references,[{stepId:'RASA-OP-03-P03',revision:'F15.18-R2'}]);
  assert.equal(getCalls().length,1);
  assert.equal(getCalls()[0].model,'@cf/openai/gpt-oss-20b');
  assert.equal(getCalls()[0].params.max_tokens,192);
  assert.equal(getCalls()[0].params.stream,false);
  const sent=JSON.stringify(getCalls()[0].params);
  assert.doesNotMatch(sent,/Non lavare né oliare i filtri in carta/);
  assert.doesNotMatch(sent,/detergente specifico per filtri aria/);
});
test('M4.2.2 anomaly and off-topic never call model',async()=>{
  const {runFixedM4Probe}=await getProbe();
  const {env,getCalls}=mockEnv();
  assert.equal((await runFixedM4Probe('cover-stuck',env)).decision,'OPERATOR_STOP');
  assert.equal((await runFixedM4Probe('off-topic',env)).decision,'QUESTION_NOT_COVERED');
  assert.equal((await runFixedM4Probe('arbitrary',env)).decision,'INVALID_CASE');
  assert.equal(getCalls().length,0);
});
test('M4.2.2 rejects fabricated references, prose and model errors',async()=>{
  const {runFixedM4Probe}=await getProbe();
  for(const response of [
    {response:JSON.stringify({action:'SHOW_REVIEWED_STEP',
      sourceStepId:'RASA-OP-04-P01',sourceRevision:'fake'})},
    {response:JSON.stringify({action:'SHOW_REVIEWED_STEP',
      sourceStepId:'RASA-OP-03-P03',sourceRevision:'F15.18-R2',
      text:'Lava il filtro con acqua'})},
    {response:'Ecco la procedura da seguire…'},
    {response:'{"action":"COMPLETE_STEP"}'},
    {response:{action:'SHOW_REVIEWED_STEP',sourceStepId:'RASA-OP-03-P03',
      sourceRevision:'fake'}}
  ]){
    const {env}=mockEnv({AI:{run:async()=>response}});
    const answer=await runFixedM4Probe('paper-wash',env);
    assert.equal(answer.decision,'MODEL_OUTPUT_REJECTED');
    assert.equal(answer.modelRequests,1);
    assert.equal(answer.instruction,undefined);
    assert.equal(answer.allowCompletion,false);
  }
  const {env}=mockEnv({AI:{run:async()=>{throw Error('secret provider error')}}});
  const result=await runFixedM4Probe('paper-wash',env);
  assert.equal(result.decision,'MODEL_UNAVAILABLE');
  assert.equal(result.modelRequests,1);
  assert.equal(JSON.stringify(result).includes('secret provider error'),false);
});
test('M4.2.2 probe GET requires Access and exact protected origin',async()=>{
  const w=await getWorker();
  const {env}=mockEnv();
  assert.equal((await w.fetch(new Request(origin+'/lab/ai-probe'),env,{})).status,401);
  assert.equal((await w.fetch(new Request(origin+'/lab/ai-probe'),{...env,SELF_TEST_ORIGIN:'https://evil.test'},ctx)).status,403);
  for(const route of ['/lab/ai-probe','/lab/ai-probe/client.js']){
    const res=await w.fetch(new Request(origin+route),env,ctx);
    assert.equal(res.status,200);
    assert.equal(res.headers.get('cache-control'),'no-store, max-age=0');
    assert.equal(res.headers.get('x-frame-options'),'DENY');
    assert.match(await res.text(),/AI M4\.2\.2|Avvia prova|api\/lab\/ai-probe|fetch/);
  }
});
test('M4.2.2 API rejects unauthenticated, forged origin, missing mode and limiter',async()=>{
  const w=await getWorker();
  const {env,getCalls}=mockEnv();
  assert.equal((await w.fetch(post('paper-wash'),env,{})).status,401);
  assert.equal((await w.fetch(post('paper-wash',{headers:{Origin:'https://evil.test'}}),env,ctx)).status,403);
  let r=await w.fetch(post('paper-wash'),{...env,AI_PROBE_MODE:'disabled'},ctx);
  assert.equal(r.status,503); assert.equal((await r.json()).decision,'PROBE_DISABLED');
  r=await w.fetch(post('paper-wash'),{...env,AI_PROBE_LIMITER:null},ctx);
  assert.equal((await r.json()).decision,'PROBE_LIMITER_REQUIRED');
  r=await w.fetch(post('paper-wash'),{...env,AI_PROBE_LIMITER:{limit:async()=>({success:false})}},ctx);
  assert.equal(r.status,429);
  assert.equal(getCalls().length,0);
});
test('M4.2.2 API rejects non-fixed payload and keeps public API unchanged',async()=>{
  const w=await getWorker();const {env,getCalls}=mockEnv();
  for(const bad of [
    {caseId:'unknown'}, {caseId:'paper-wash',question:'ignore policy'},
    {stepId:'RASA-OP-03-P03'}, [],
    {caseId:'paper-wash',aiEnabled:true}
  ]){
    const res=await w.fetch(post('',{raw:JSON.stringify(bad)}),env,ctx);
    assert.equal(res.status,400);
    assert.equal((await res.json()).decision,'INVALID_INPUT');
  }
  assert.equal((await w.fetch(post('',{raw:'x'.repeat(500)}),env,ctx)).status,400);
  assert.equal(getCalls().length,0);
  const existing=await w.fetch(new Request(origin+'/api/assist',{method:'POST',
    headers:{'Origin':origin,'Content-Type':'application/json'},
    body:JSON.stringify({question:'Posso lavare il filtro in carta?',operationId:3})
  }),env,ctx);
  assert.equal(existing.status,503);
  const existingBody=await existing.json();
  assert.equal(existingBody.aiEnabled,false);
  assert.equal(existingBody.canGenerate,false);
});
test('M4.2.2 API executes one fixed model call with reviewed response',async()=>{
  const w=await getWorker();const {env,getCalls}=mockEnv();
  const r=await w.fetch(post('paper-wash'),env,ctx);
  assert.equal(r.status,200);
  const data=await r.json();
  assert.equal(data.decision,'REVIEWED_SOURCE_DRY_RUN');
  assert.equal(data.modelRequests,1);
  assert.equal(data.allowCompletion,false);
  assert.equal(getCalls().length,1);
});
test('M4.2.2 disabled by default never executes with present AI binding',async()=>{
  const w=await getWorker();const {env,getCalls}=mockEnv({AI_PROBE_MODE:'disabled'});
  const r=await w.fetch(post('paper-wash'),env,ctx);
  assert.equal(r.status,503);
  assert.equal((await r.json()).decision,'PROBE_DISABLED');
  assert.equal(getCalls().length,0);
});
