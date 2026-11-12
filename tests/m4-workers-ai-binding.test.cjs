'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const origin='https://tagliando-ai-staging.maico-gua.workers.dev';
const read=relative=>fs.readFileSync(path.join(__dirname,'..',relative),'utf8');
const config=relative=>JSON.parse(read(relative));

function makeEnv(){
  let invocations=0;
  const env={
    SERVICE_MODE:'guarded',
    ALLOWED_ORIGIN:'https://lupus227.github.io',
    SELF_TEST_ORIGIN:origin,
    ACCESS_AUD:'a'.repeat(64),
    API_LIMITER:{limit:async()=>({success:true})},
    AI:{run:async()=>{invocations++;throw Error('UNAUTHORIZED_AI_INFERENCE');}}
  };
  return {env,getInvocations:()=>invocations};
}
const context={access:{
  aud:'a'.repeat(64),
  getIdentity:async()=>({user_uuid:'m4-2-1-test-subject'})
}};
const worker=async()=> (await import('../worker/src/index.mjs')).default;

test('M4.2.1 both Wrangler configs agree and expose only one server-side AI binding',()=>{
  const root=config('wrangler.jsonc');
  const nested=config('worker/wrangler.jsonc');
  assert.equal(root.main,'./worker/src/index.mjs');
  assert.equal(nested.main,'./src/index.mjs');
  assert.deepEqual({...root,main:nested.main},nested);
  for(const cfg of [root,nested]){
    assert.deepEqual(cfg.ai,{binding:'AI'});
    assert.equal(cfg.vars.SERVICE_MODE,'guarded');
    assert.equal(cfg.vars.SELF_TEST_ORIGIN,origin);
    assert.equal(cfg.workers_dev,true);
    assert.equal(cfg.preview_urls,false);
    assert.equal('AI' in cfg.vars,false,'AI binding is not a public environment variable');
    assert.equal('AI_API_KEY' in cfg.vars,false,'no API key is stored in repo');
    assert.ok(Array.isArray(cfg.ratelimits));
  }
});
test('M4.2.1 provider inspector does not invoke the binding even when present',async()=>{
  const {inspectWorkersAiBinding,WORKERS_AI_MODEL_ID}=await import('../worker/src/workers-ai-binding.mjs');
  const {env,getInvocations}=makeEnv();
  const state=inspectWorkersAiBinding(env);
  assert.equal(WORKERS_AI_MODEL_ID,'@cf/openai/gpt-oss-20b');
  assert.equal(state.binding,'AI');
  assert.equal(state.bindingAvailable,true);
  assert.equal(state.decision,'INFERENCE_DISABLED');
  assert.equal(state.aiEnabled,false);
  assert.equal(state.canGenerate,false);
  assert.equal(state.modelInputAllowed,false);
  assert.equal(state.allowCompletion,false);
  assert.equal(state.sessionChanged,false);
  assert.equal(state.modelRequests,0);
  assert.equal(getInvocations(),0);
  assert.equal(Object.isFrozen(state),true);
});
test('M4.2.1 absent or invalid binding fails closed with no inference',async()=>{
  const {inspectWorkersAiBinding}=await import('../worker/src/workers-ai-binding.mjs');
  for(const bad of [undefined,null,{}, {AI:null}, {AI:{}}, {AI:{run:'not a function'}}]){
    const result=inspectWorkersAiBinding(bad);
    assert.equal(result.bindingAvailable,false);
    assert.equal(result.decision,'AI_BINDING_UNAVAILABLE');
    assert.equal(result.aiEnabled,false);
    assert.equal(result.canGenerate,false);
    assert.equal(result.modelRequests,0);
  }
});
test('M4.2.1 existing routes cannot call AI despite injected functional binding',async()=>{
  const w=await worker();
  const {env,getInvocations}=makeEnv();
  const health=await w.fetch(new Request(origin+'/health'),env,{});
  assert.equal(health.status,200);
  assert.equal((await health.json()).aiEnabled,false);
  const metadata=await w.fetch(new Request(origin+'/api/knowledge-status'),env,context);
  assert.equal(metadata.status,200);
  const meta=await metadata.json();
  assert.equal(meta.aiEnabled,false);
  assert.equal(meta.canGenerate,false);
  assert.equal(meta.readyForTechnicalAnswers,false);
  const lab=await w.fetch(new Request(origin+'/api/lab/filtro-aria',{
    method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},
    body:JSON.stringify({stepId:'RASA-OP-03-P01',filterType:null,question:'Mostra passaggio'})
  }),env,context);
  assert.equal(lab.status,200);
  const labBody=await lab.json();
  assert.equal(labBody.aiEnabled,false);
  assert.equal(labBody.canGenerate,false);
  assert.equal(labBody.allowCompletion,false);
  const assist=await w.fetch(new Request(origin+'/api/assist',{
    method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},
    body:JSON.stringify({operationId:3,question:'Posso lavare il filtro in carta?'})
  }),env,context);
  assert.equal(assist.status,503);
  const assistBody=await assist.json();
  assert.equal(assistBody.decision,'PENDING_VALIDATION');
  assert.equal(assistBody.aiEnabled,false);
  assert.equal(assistBody.canGenerate,false);
  assert.equal(assistBody.sessionChanged,false);
  assert.equal((await w.fetch(new Request(origin+'/api/m4/ai'),env,context)).status,404);
  assert.equal(getInvocations(),0);
});
test('M4.2.1 no runtime imports or inference paths and OP03 remains not authorized for AI',async()=>{
  const entry=read('worker/src/index.mjs');
  const adapter=read('worker/src/workers-ai-binding.mjs');
  const original=read('worker/src/m4-contract.mjs');
  assert.doesNotMatch(entry,/workers-ai-binding\.mjs/);
  assert.doesNotMatch(entry,/env\.AI\.run\s*\(/);
  assert.doesNotMatch(adapter,/env\.AI\.run\s*\(/);
  assert.doesNotMatch(original,/env\.AI\.run\s*\(/);
  const {REVIEW_LEDGER}=await import('../worker/src/review-ledger.mjs');
  const {FILTER_LAB_STEPS}=await import('../worker/src/filter-lab.mjs');
  for(const stepId of FILTER_LAB_STEPS){
    const item=REVIEW_LEDGER.find(x=>x.stepId===stepId);
    assert.ok(item,stepId);
    assert.equal(item.aiUseAllowed,false,stepId);
  }
});
