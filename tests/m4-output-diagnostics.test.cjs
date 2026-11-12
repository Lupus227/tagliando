'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const origin='https://tagliando-ai-staging.maico-gua.workers.dev';
const getProbe=()=>import('../worker/src/m4-ai-probe.mjs');
const getDiagnostics=()=>import('../worker/src/m4-output-diagnostics.mjs');
const getWorker=async()=>(await import('../worker/src/index.mjs')).default;
const selector=()=>({action:'SHOW_REVIEWED_STEP',sourceStepId:'RASA-OP-03-P03',
  sourceRevision:'F15.18-R2'});
const completion=(content,finish_reason='stop')=>({
  choices:[{index:0,finish_reason,message:{role:'assistant',content}}]
});
function makeEnv(output,overrides={}){
  let calls=0;
  return {env:{
    SERVICE_MODE:'guarded',SELF_TEST_ORIGIN:origin,ACCESS_AUD:'a'.repeat(64),
    ALLOWED_ORIGIN:'https://lupus227.github.io',
    API_LIMITER:{limit:async()=>({success:true})},
    AI_PROBE_MODE:'enabled',AI_PROBE_EXPIRES_AT:'2099-01-01T00:00:00Z',
    AI_PROBE_LIMITER:{limit:async()=>({success:true})},
    AI:{run:async()=>{calls++;return output;}},
    ...overrides
  },getCalls:()=>calls};
}
const nativeCtx={access:{aud:'a'.repeat(64),
  getIdentity:async()=>({user_uuid:'diagnostic-test-actor'})}};
const post=()=>new Request(origin+'/api/lab/ai-probe',{
  method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},
  body:JSON.stringify({caseId:'paper-wash'})
});
const probe=async output=>{
  const {runFixedM4Probe}=await getProbe();
  const {env,getCalls}=makeEnv(output);
  return {answer:await runFixedM4Probe('paper-wash',env),calls:getCalls()};
};

test('M4.2.4 codes are closed vocabulary, not dynamic model strings',async()=>{
  const {inspectM4SelectorEnvelope, classifyM4CandidateReview,
    M4_DIAGNOSTIC_VERSION}=await getDiagnostics();
  assert.equal(M4_DIAGNOSTIC_VERSION,'tagliando.m4.output-diagnostic.v1');
  assert.equal(typeof inspectM4SelectorEnvelope,'function');
  assert.equal(typeof classifyM4CandidateReview,'function');
  const src=fs.readFileSync(path.join(__dirname,'../worker/src/m4-output-diagnostics.mjs'),'utf8');
  assert.doesNotMatch(src,/console\.(?:log|error|warn)|JSON\.stringify\s*\(\s*raw\s*\)/);
});

test('M4.2.4 distinguishes unknown and ambiguous envelopes without passing content',async()=>{
  const {inspectM4SelectorEnvelope:inspect}=await getDiagnostics();
  const s=JSON.stringify(selector());
  const cases=[
    [{text:s},'ENVELOPE_UNKNOWN'],[null,'ENVELOPE_UNKNOWN'],
    [{response:s,choices:[]},'ENVELOPE_AMBIGUOUS'],
    [{choices:[]},'CHOICES_INVALID'],
    [{choices:[{},{}]},'CHOICES_INVALID'],
    [{choices:[null]},'CHOICES_INVALID']
  ];
  for(const [value,code] of cases){
    const examined=inspect(value);
    assert.equal(examined.diagnosticCode,code);
    assert.equal(examined.candidate,null);
    assert.equal(JSON.stringify(examined).includes(s),false);
  }
});

test('M4.2.4 distinguishes truncated and non-final Chat Completions',async()=>{
  const {inspectM4SelectorEnvelope:inspect}=await getDiagnostics();
  const s=JSON.stringify(selector());
  for(const [reason,code] of [
    ['length','OUTPUT_TRUNCATED'],['tool_calls','FINISH_REASON_INVALID'],
    [null,'FINISH_REASON_INVALID'],['content_filter','FINISH_REASON_INVALID']
  ]){
    assert.equal(inspect(completion(s,reason)).diagnosticCode,code);
    assert.equal(inspect(completion(s,reason)).candidate,null);
  }
});

test('M4.2.4 classifies unsupported assistant role, tools, malformed and long content',async()=>{
  const {inspectM4SelectorEnvelope:inspect}=await getDiagnostics();
  const s=JSON.stringify(selector());
  assert.equal(inspect({choices:[{finish_reason:'stop',
    message:{role:'system',content:s}}]}).diagnosticCode,'ROLE_OR_TOOL_UNSUPPORTED');
  assert.equal(inspect({choices:[{finish_reason:'stop',
    message:{role:'assistant',content:s,tool_calls:[]}}]}).diagnosticCode,'ROLE_OR_TOOL_UNSUPPORTED');
  assert.equal(inspect({response:'{invalid'}).diagnosticCode,'JSON_INVALID');
  assert.equal(inspect({response:'x'.repeat(513)}).diagnosticCode,'OUTPUT_TOO_LONG');
  assert.equal(inspect({response:''}).diagnosticCode,'CONTENT_UNSUPPORTED');
  assert.equal(inspect({response:'"literal string"'}).diagnosticCode,'SELECTOR_NOT_OBJECT');
  assert.equal(inspect({response:[]}).diagnosticCode,'SELECTOR_NOT_OBJECT');
  assert.equal(inspect({response:s}).diagnosticCode,'SELECTOR_PARSED');
});

test('M4.2.4 preserves M4.2.3 parser compatibility, both supported envelopes',async()=>{
  const {parseM4SelectorEnvelope}=await getProbe();
  const s=JSON.stringify(selector());
  assert.deepEqual(parseM4SelectorEnvelope({response:s}),selector());
  assert.deepEqual(parseM4SelectorEnvelope(completion(s)),selector());
  assert.equal(parseM4SelectorEnvelope({response:'bad JSON'}),null);
  assert.equal(parseM4SelectorEnvelope(completion(s,'length')),null);
});

test('M4.2.4 reports correct category after mandatory M4.1 review',async()=>{
  const s=JSON.stringify(selector());
  const cases=[
    [{response:s},'REVIEWED_SOURCE_DRY_RUN','SOURCE_ACCEPTED',true],
    [completion(s),'REVIEWED_SOURCE_DRY_RUN','SOURCE_ACCEPTED',true],
    [{response:'{"action":"ABSTAIN"}'},'NO_SUPPORTED_ANSWER','MODEL_ABSTAINED',false],
    [{text:s},'MODEL_OUTPUT_REJECTED','ENVELOPE_UNKNOWN',false],
    [{response:'{bad'},'MODEL_OUTPUT_REJECTED','JSON_INVALID',false],
    [completion(s,'length'),'MODEL_OUTPUT_REJECTED','OUTPUT_TRUNCATED',false],
    [{response:JSON.stringify({...selector(),instruction:'INJECTION_PRIVATE_PAYLOAD'})},
      'MODEL_OUTPUT_REJECTED','SELECTOR_SHAPE_INVALID',false],
    [{response:JSON.stringify({...selector(),sourceStepId:'RASA-OP-04-P01'})},
      'MODEL_OUTPUT_REJECTED','SOURCE_STEP_MISMATCH',false],
    [{response:JSON.stringify({...selector(),sourceRevision:'REVISION_PRIVATE_PAYLOAD'})},
      'MODEL_OUTPUT_REJECTED','SOURCE_REVISION_MISMATCH',false],
    [{response:'{"action":"COMPLETE_STEP"}'},
      'MODEL_OUTPUT_REJECTED','SELECTOR_ACTION_INVALID',false],
    [{response:'{"action":"SHOW_REVIEWED_STEP"}'},
      'MODEL_OUTPUT_REJECTED','SELECTOR_SHAPE_INVALID',false]
  ];
  for(const [raw,decision,diagnosticCode,ok] of cases){
    const {answer,calls}=await probe(raw);
    assert.equal(calls,1);
    assert.equal(answer.decision,decision,diagnosticCode);
    assert.equal(answer.diagnosticCode,diagnosticCode);
    assert.equal(answer.ok,ok);
    assert.equal(answer.modelRequests,1);
    assert.equal(answer.aiEnabled,false);
    assert.equal(answer.canGenerate,false);
    assert.equal(answer.allowCompletion,false);
    assert.equal(answer.sessionChanged,false);
    if(!ok)assert.equal(answer.instruction,undefined);
    const wire=JSON.stringify(answer);
    assert.equal(wire.includes('INJECTION_PRIVATE_PAYLOAD'),false);
    assert.equal(wire.includes('REVISION_PRIVATE_PAYLOAD'),false);
  }
});

test('M4.2.4 provider exception is fixed code without leaking exception content',async()=>{
  const {runFixedM4Probe}=await getProbe();
  const {env,getCalls}=makeEnv(null,{AI:{run:async()=>{throw Error('PROVIDER_SECRET_PRIVATE_PAYLOAD');}}});
  const answer=await runFixedM4Probe('paper-wash',env);
  assert.equal(getCalls(),0);
  assert.equal(answer.decision,'MODEL_UNAVAILABLE');
  assert.equal(answer.diagnosticCode,'PROVIDER_ERROR');
  assert.equal(answer.modelRequests,1);
  assert.equal(answer.allowCompletion,false);
  assert.doesNotMatch(JSON.stringify(answer),/PROVIDER_SECRET_PRIVATE_PAYLOAD/);
});

test('M4.2.4 protected API shows fixed code but never raw model response',async()=>{
  const worker=await getWorker();
  const raw={response:JSON.stringify({...selector(),text:'NEVER_RETURN_PRIVATE_PAYLOAD'})};
  const {env,getCalls}=makeEnv(raw);
  const response=await worker.fetch(post(),env,nativeCtx);
  assert.equal(response.status,422);
  const body=await response.json();
  assert.equal(body.decision,'MODEL_OUTPUT_REJECTED');
  assert.equal(body.diagnosticCode,'SELECTOR_SHAPE_INVALID');
  assert.equal(body.modelRequests,1);
  assert.equal(body.allowCompletion,false);
  assert.equal(getCalls(),1);
  assert.doesNotMatch(JSON.stringify(body),/NEVER_RETURN_PRIVATE_PAYLOAD/);
  const client=await worker.fetch(new Request(origin+'/lab/ai-probe/client.js'),env,nativeCtx);
  assert.equal(client.status,200);
  assert.match(await client.text(),/Diagnostica strutturale:/);
});

test('M4.2.4 off-topic, anomaly and disabled mode still make zero model calls',async()=>{
  const {runFixedM4Probe}=await getProbe();
  const {env,getCalls}=makeEnv({response:JSON.stringify(selector())});
  assert.equal((await runFixedM4Probe('cover-stuck',env)).decision,'OPERATOR_STOP');
  assert.equal((await runFixedM4Probe('off-topic',env)).decision,'QUESTION_NOT_COVERED');
  const disabled=await runFixedM4Probe('paper-wash',{...env,AI_PROBE_MODE:'disabled'});
  assert.equal(disabled.decision,'PROBE_DISABLED');
  assert.equal(disabled.modelRequests,0);
  assert.equal(getCalls(),0);
  const root=JSON.parse(fs.readFileSync(path.join(__dirname,'../wrangler.jsonc'),'utf8'));
  const nested=JSON.parse(fs.readFileSync(path.join(__dirname,'../worker/wrangler.jsonc'),'utf8'));
  assert.equal(root.vars.AI_PROBE_MODE,'disabled');
  assert.equal(nested.vars.AI_PROBE_MODE,'disabled');
  assert.equal(root.vars.AI_PROBE_EXPIRES_AT,nested.vars.AI_PROBE_EXPIRES_AT);
  const response=await (await getWorker()).fetch(post(),{
    ...env,AI_PROBE_MODE:'disabled'
  },nativeCtx);
  assert.equal(response.status,503);
  assert.equal((await response.json()).decision,'PROBE_DISABLED');
  assert.equal(getCalls(),0);
});
