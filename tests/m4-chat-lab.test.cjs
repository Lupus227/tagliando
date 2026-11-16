'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const origin='https://tagliando-ai-staging.maico-gua.workers.dev';
const ctx={access:{aud:'a'.repeat(64),getIdentity:async()=>({user_uuid:'chat-test-actor'})}};
const chat=()=>import('../worker/src/m4-chat-lab.mjs');
const worker=async()=>(await import('../worker/src/index.mjs')).default;
function mocked(overrides={}){
  const calls=[];
  const env={
    SERVICE_MODE:'guarded',SELF_TEST_ORIGIN:origin,
    AI_CHAT_MODE:'enabled',AI_CHAT_EXPIRES_AT:'2099-01-01T00:00:00Z',
    ACCESS_AUD:'a'.repeat(64),
    AI_PROBE_LIMITER:{limit:async()=>({success:true})},
    AI:{run:async(model,params)=>{
      calls.push({model,params});
      return {choices:[{finish_reason:'stop',
        message:{role:'assistant',content:'Ciao! Ho scelto il blu.',
          tool_calls:[],refusal:null,function_call:null}}]};
    }},
    ...overrides
  };
  return {env,calls};
}
function post(payload,options={}){
 return new Request(origin+'/api/lab/ai-chat',{method:'POST',
   headers:{Origin:options.origin||origin,'Content-Type':'application/json'},
   body:typeof payload==='string'?payload:JSON.stringify(payload)});
}
test('M4.3 both Wrangler configurations enable ONLY a time-limited isolated lab',()=>{
 const read=p=>JSON.parse(fs.readFileSync(path.join(__dirname,'..',p),'utf8'));
 const a=read('wrangler.jsonc'),b=read('worker/wrangler.jsonc');
 assert.deepEqual({...a,main:b.main},b);
 assert.equal(a.vars.AI_CHAT_MODE,'enabled');
 assert.equal(a.vars.AI_CHAT_EXPIRES_AT,'2026-11-16T18:25:00Z');
 assert.equal(a.vars.AI_PROBE_MODE,'disabled');
 assert.equal(a.vars.SERVICE_MODE,'guarded');
});
test('M4.3 native and OpenAI Chat Completions envelopes extract plain text',async()=>{
 const {extractChatText}=await chat();
 assert.deepEqual(extractChatText({response:'Ciao!'}),{code:'TEXT_OK',text:'Ciao!'});
 assert.deepEqual(extractChatText({choices:[{finish_reason:'stop',message:{
   role:'assistant',content:'Ho scelto il blu.',tool_calls:[],refusal:null,
   function_call:null}}]}),{code:'TEXT_OK',text:'Ho scelto il blu.'});
 for(const raw of [
  null,{}, {response:'x',choices:[]},
  {choices:[{finish_reason:'length',message:{role:'assistant',content:'foo'}}]},
  {choices:[{finish_reason:'stop',message:{role:'tool',content:'foo'}}]},
  {choices:[{finish_reason:'stop',message:{role:'assistant',content:'foo',
    tool_calls:[{id:'forbidden'}]}}]},
  {choices:[{finish_reason:'stop',message:{role:'assistant',content:'foo',refusal:'no'}}]},
  {choices:[{finish_reason:'stop',message:{role:'assistant',content:'foo',function_call:{name:'x'}}}]},
  {response:'x'.repeat(801)},
  {response:''}
 ])assert.notEqual(extractChatText(raw).code,'TEXT_OK');
});
test('M4.3 mode disabled prevents all inference even with AI binding',async()=>{
 const {runChatTurn}=await chat();
 const {env,calls}=mocked({AI_CHAT_MODE:'disabled'});
 const r=await runChatTurn({turn:1},env);
 assert.equal(r.decision,'CHAT_DISABLED');
 assert.equal(r.modelRequests,0);assert.equal(calls.length,0);
});
test('M4.3 expiry prevents all inference',async()=>{
 const {runChatTurn}=await chat();
 const {env,calls}=mocked({AI_CHAT_EXPIRES_AT:'2020-01-01T00:00:00Z'});
 const r=await runChatTurn({turn:1},env);
 assert.equal(r.decision,'CHAT_EXPIRED');
 assert.equal(calls.length,0);
});
test('M4.3 first turn has no maintenance text and returns model prose',async()=>{
 const {runChatTurn}=await chat();
 const {env,calls}=mocked();
 const r=await runChatTurn({turn:1},env);
 assert.equal(r.decision,'CHAT_TEXT_READY');
 assert.equal(r.text,'Ciao! Ho scelto il blu.');
 assert.equal(r.modelRequests,1);
 assert.equal(r.sessionChanged,false);assert.equal(r.allowCompletion,false);
 assert.equal(calls.length,1);
 assert.equal(calls[0].model,'@cf/openai/gpt-oss-20b');
 assert.equal(calls[0].params.messages.length,2);
 assert.equal(calls[0].params.stream,false);
 assert.doesNotMatch(JSON.stringify(calls[0].params),/RASA-OP|Non lavare né oliare/);
});
test('M4.3 second turn receives previous assistant answer in the right sequence',async()=>{
 const {runChatTurn}=await chat();
 const {env,calls}=mocked();
 const r=await runChatTurn({turn:2,previousAnswer:'Ho scelto il verde.'},env);
 assert.equal(r.decision,'CHAT_TEXT_READY');
 assert.equal(calls[0].params.messages.length,4);
 assert.equal(calls[0].params.messages[2].role,'assistant');
 assert.equal(calls[0].params.messages[2].content,'Ho scelto il verde.');
 assert.equal(calls[0].params.messages[3].role,'user');
 assert.match(calls[0].params.messages[3].content,/Quale colore/);
 for(const bad of [{turn:2},{turn:2,previousAnswer:''},
   {turn:2,previousAnswer:'x'.repeat(801)}, {turn:1,previousAnswer:'no'},
   {turn:3},{turn:2,previousAnswer:'ciao',operationId:3}]){
   assert.equal((await runChatTurn(bad,env)).decision,'INVALID_INPUT');
 }
 assert.equal(calls.length,1);
});
test('M4.3 rejections hide raw model response and provider errors',async()=>{
 const {runChatTurn}=await chat();
 let {env}=mocked({AI:{run:async()=>({response:'x'.repeat(900)})}});
 let r=await runChatTurn({turn:1},env);
 assert.equal(r.decision,'CHAT_OUTPUT_REJECTED');
 assert.equal(r.diagnosticCode,'TEXT_TOO_LONG');
 assert.equal(r.text,undefined);
 ({env}=mocked({AI:{run:async()=>{throw Error('SECRET PROVIDER MESSAGE');}}}));
 r=await runChatTurn({turn:1},env);
 assert.equal(r.decision,'MODEL_UNAVAILABLE');
 assert.equal(JSON.stringify(r).includes('SECRET'),false);
});
test('M4.3 HTTP requires Access, origin, limiter and disabled gate',async()=>{
 const w=await worker();
 const {env,calls}=mocked();
 assert.equal((await w.fetch(new Request(origin+'/lab/ai-chat'),env,{})).status,401);
 assert.equal((await w.fetch(post({turn:1},{origin:'https://evil.test'}),env,ctx)).status,403);
 for(const route of ['/lab/ai-chat','/lab/ai-chat/client.js']){
   const r=await w.fetch(new Request(origin+route),env,ctx);
   assert.equal(r.status,200);
   assert.equal(r.headers.get('x-frame-options'),'DENY');
 }
 let r=await w.fetch(post({turn:1}),{...env,AI_CHAT_MODE:'disabled'},ctx);
 assert.equal(r.status,503);
 assert.equal((await r.json()).decision,'CHAT_DISABLED');
 r=await w.fetch(post({turn:1}),{...env,AI_PROBE_LIMITER:null},ctx);
 assert.equal((await r.json()).decision,'CHAT_LIMITER_REQUIRED');
 r=await w.fetch(post({turn:1}),{...env,
   AI_PROBE_LIMITER:{limit:async()=>({success:false})}},ctx);
 assert.equal(r.status,429);
 assert.equal(calls.length,0);
});
test('M4.3 HTTP returns raw model prose only to Access-protected lab',async()=>{
 const w=await worker(),{env,calls}=mocked();
 const r=await w.fetch(post({turn:1}),env,ctx);
 assert.equal(r.status,200);
 const data=await r.json();
 assert.equal(data.decision,'CHAT_TEXT_READY');
 assert.equal(data.text,'Ciao! Ho scelto il blu.');
 assert.equal(calls.length,1);
 const bad=await w.fetch(post({turn:1,question:'change motor oil'}),env,ctx);
 assert.equal(bad.status,400);
 assert.equal(calls.length,1);
});
