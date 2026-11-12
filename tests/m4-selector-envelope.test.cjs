'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');

const load=()=>import('../worker/src/m4-ai-probe.mjs');
const valid=()=>({action:'SHOW_REVIEWED_STEP',
  sourceStepId:'RASA-OP-03-P03',sourceRevision:'F15.18-R2'});
const completion=(content,overrides={})=>({choices:[{
  index:0,finish_reason:'stop',
  message:{role:'assistant',content},
  ...overrides
}]});
const validEnv=()=>({
  AI_PROBE_MODE:'enabled',AI_PROBE_EXPIRES_AT:'2099-01-01T00:00:00Z'
});

test('M4.2.3 parses only the known Workers AI response envelope',async()=>{
  const {parseM4SelectorEnvelope:parse}=await load();
  const candidate=valid();
  assert.deepEqual(parse({response:JSON.stringify(candidate),usage:{total_tokens:200}}),candidate);
  assert.deepEqual(parse({response:candidate}),candidate);
  assert.deepEqual(parse({response:JSON.stringify({action:'ABSTAIN'})}),{action:'ABSTAIN'});
  for(const value of [null,[],{},'text',{response:null},{response:[]},
    {result:{response:JSON.stringify(candidate)}},
    {response:String.fromCharCode(96,96,96)+'json\n'+JSON.stringify(candidate)+'\n'+String.fromCharCode(96,96,96)},
    {response:'Spiegazione: '+JSON.stringify(candidate)},
    {response:JSON.stringify(candidate)+'\naltro testo'},
    {response:'x'.repeat(513)},{response:'not valid json'}]){
    assert.equal(parse(value),null,'unexpected Workers binding response accepted');
  }
});

test('M4.2.3 accepts a single completed assistant Chat Completions envelope',async()=>{
  const {parseM4SelectorEnvelope:parse}=await load();
  const c=valid();
  const raw=completion(JSON.stringify(c));
  assert.deepEqual(parse(raw),c);
  assert.deepEqual(parse({id:'chatcmpl-test',object:'chat.completion',
    model:'@cf/openai/gpt-oss-20b',usage:{total_tokens:50},
    ...raw}),c);
});

test('M4.2.3 rejects ambiguous, partial, multi-choice and tool-call envelopes',async()=>{
  const {parseM4SelectorEnvelope:parse}=await load();
  const content=JSON.stringify(valid());
  const cases=[
    {...completion(content),response:content},
    {response:content,choices:[]},
    completion(content,{finish_reason:'length'}),
    completion(content,{finish_reason:null}),
    completion(content,{finish_reason:'tool_calls'}),
    {choices:[...completion(content).choices,...completion(content).choices]},
    {choices:[]},
    {choices:[{}]},
    {choices:[{message:{role:'assistant',content}}]},
    {choices:[{finish_reason:'stop',message:{role:'user',content}}]},
    {choices:[{finish_reason:'stop',message:{role:'assistant',content,tool_calls:[]}}]},
    {choices:[{finish_reason:'stop',message:{role:'assistant',content,refusal:null}}]},
    {choices:[{finish_reason:'stop',message:{role:'assistant',content,function_call:null}}]},
    {choices:[{finish_reason:'stop',message:{role:'assistant',content:[{type:'text',text:content}]}}]},
    {choices:[{finish_reason:'stop',message:{role:'assistant',content:content+' Extra'}}]},
    {output:[{content:[{type:'output_text',text:content}]}]},
    {response:{foo:1},choices:undefined}
  ];
  for(const raw of cases)assert.equal(parse(raw),null,JSON.stringify(raw));
});

test('M4.2.3 Chat Completions valid selector still goes through approved M4.1 gate',async()=>{
  const {runFixedM4Probe}=await load();
  let calls=0;
  const env={...validEnv(),AI:{run:async(model,request)=>{
    calls++;
    assert.equal(model,'@cf/openai/gpt-oss-20b');
    assert.equal(request.stream,false);
    assert.equal(request.max_tokens,192);
    assert.doesNotMatch(JSON.stringify(request),/Non lavare né oliare/);
    return completion(JSON.stringify(valid()));
  }}};
  const res=await runFixedM4Probe('paper-wash',env);
  assert.equal(calls,1);
  assert.equal(res.ok,true);
  assert.equal(res.decision,'REVIEWED_SOURCE_DRY_RUN');
  assert.equal(res.modelRequests,1);
  assert.equal(res.allowCompletion,false);
  assert.equal(res.canGenerate,false);
  assert.equal(res.aiEnabled,false);
  assert.equal(res.sessionChanged,false);
  assert.deepEqual(res.references,[{stepId:'RASA-OP-03-P03',revision:'F15.18-R2'}]);
  assert.match(res.instruction,/Non lavare né oliare i filtri in carta/);
});

test('M4.2.3 a well-shaped response cannot inject technical prose, false revisions or completion',async()=>{
  const {runFixedM4Probe}=await load();
  const candidates=[
    {...valid(),instruction:'Lava il filtro di carta con acqua'},
    {...valid(),allowCompletion:true},
    {...valid(),sourceRevision:'falsa'},
    {...valid(),sourceStepId:'RASA-OP-04-P01'},
    {action:'COMPLETE_STEP'},
    {action:'SHOW_REVIEWED_STEP',sourceStepId:'RASA-OP-03-P03'},
    {action:'ABSTAIN',text:'istruzione aggiuntiva'}
  ];
  for(const item of candidates){
    const env={...validEnv(),AI:{run:async()=>completion(JSON.stringify(item))}};
    const answer=await runFixedM4Probe('paper-wash',env);
    assert.equal(answer.decision,'MODEL_OUTPUT_REJECTED');
    assert.equal(answer.instruction,undefined);
    assert.equal(answer.allowCompletion,false);
    assert.equal(answer.sessionChanged,false);
    assert.equal(answer.modelRequests,1);
  }
});

test('M4.2.3 abstention remains no instruction and no completion',async()=>{
  const {runFixedM4Probe}=await load();
  const env={...validEnv(),AI:{run:async()=>completion('{"action":"ABSTAIN"}')}};
  const answer=await runFixedM4Probe('paper-wash',env);
  assert.equal(answer.decision,'NO_SUPPORTED_ANSWER');
  assert.equal(answer.ok,false);
  assert.equal(answer.instruction,undefined);
  assert.equal(answer.modelRequests,1);
  assert.equal(answer.allowCompletion,false);
});

test('M4.2.3 no new requests from real staging config, even with an available model',async()=>{
  const fs=require('node:fs'),path=require('node:path');
  for(const filename of ['wrangler.jsonc','worker/wrangler.jsonc']){
    const cfg=JSON.parse(fs.readFileSync(path.join(__dirname,'..',filename),'utf8'));
    assert.equal(cfg.vars.AI_PROBE_MODE,'disabled');
  }
  const {runFixedM4Probe}=await load();
  let calls=0;
  const env={AI_PROBE_MODE:'disabled',AI_PROBE_EXPIRES_AT:'2099-01-01T00:00:00Z',
    AI:{run:async()=>{calls++;return completion(JSON.stringify(valid()));}}};
  const answer=await runFixedM4Probe('paper-wash',env);
  assert.equal(answer.decision,'PROBE_DISABLED');
  assert.equal(answer.modelRequests,0);
  assert.equal(calls,0);
});
