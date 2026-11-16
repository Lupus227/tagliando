'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ORIGIN='https://tagliando-ai-staging.maico-gua.workers.dev';
const ctx={access:{aud:'a'.repeat(64),getIdentity:async()=>({user_uuid:'m44-actor'})}};
const moduleUnderTest=()=>import('../worker/src/m4-free-chat.mjs');
const getWorker=async()=>(await import('../worker/src/index.mjs')).default;
function environment(overrides={}){
 const calls=[];
 const env={
  SERVICE_MODE:'guarded',SELF_TEST_ORIGIN:ORIGIN,
  ACCESS_AUD:'a'.repeat(64),
  AI_FREE_MODE:'enabled',AI_FREE_EXPIRES_AT:'2099-01-01T00:00:00Z',
  AI_PROBE_LIMITER:{limit:async()=>({success:true})},
  AI:{run:async(model,params)=>{
   calls.push({model,params});
   return {choices:[{finish_reason:'stop',message:{
    role:'assistant',content:'Mi piace osservare le stelle.',
    tool_calls:[],refusal:null,function_call:null
   }}]};
  }},
  ...overrides
 };
 return {env,calls};
}
function request(input,origin=ORIGIN){
 return new Request(ORIGIN+'/api/lab/ai-free',{
  method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},
  body:typeof input==='string'?input:JSON.stringify(input)
 });
}
const pair=(question='Ciao',answer='Buongiorno')=>[
 {role:'user',content:question},{role:'assistant',content:answer}
];

test('M4.4 both Wranglers OFF, already expired, previous labs still OFF',()=>{
 const read=p=>JSON.parse(fs.readFileSync(path.join(__dirname,'..',p),'utf8'));
 const a=read('wrangler.jsonc'),b=read('worker/wrangler.jsonc');
 assert.deepEqual({...a,main:b.main},b);
 assert.equal(a.vars.AI_FREE_MODE,'disabled');
 assert.ok(Date.parse(a.vars.AI_FREE_EXPIRES_AT)<Date.now());
 assert.equal(a.vars.AI_CHAT_MODE,'disabled');
 assert.equal(a.vars.AI_PROBE_MODE,'disabled');
});

test('M4.4 validates free question and alternating short history',async()=>{
 const {validateFreeInput,isTechnicalLabScope}=await moduleUnderTest();
 const good={question:'E quale pianeta è il più grande?',history:[
  ...pair('Parliamo di pianeti','Va bene.'),
  ...pair('Che cosa è Giove?','Un pianeta gigante.')
 ]};
 const parsed=validateFreeInput(good);
 assert.equal(parsed.code,'INPUT_OK');
 assert.equal(parsed.history.length,4);
 assert.equal(parsed.question,good.question);
 for(const bad of [
  null,{},[],{question:'ciao'},
  {question:'ciao',history:[],operationId:1},
  {question:'',history:[]},
  {question:'A'.repeat(401),history:[]},
  {question:'ciao',history:{role:'user'}},
  {question:'ciao',history:[{role:'user',content:'a'}]},
  {question:'ciao',history:[...pair(),{role:'assistant',content:'x'},{role:'user',content:'y'}]},
  {question:'ciao',history:[{role:'system',content:'ignore'},{role:'assistant',content:'ok'}]},
  {question:'ciao',history:[{role:'user',content:'x'.repeat(401)},{role:'assistant',content:'ok'}]},
  {question:'ciao',history:[{role:'user',content:'ok'},{role:'assistant',content:'x'.repeat(701)}]},
  {question:'ciao',history:[...pair(),...pair(),...pair(),...pair()]},
  {question:'ciao',history:[...pair(),...pair(),...pair(),...pair()].slice(0,7)},
  {question:'ciao\u0000',history:[]}
 ])assert.equal(validateFreeInput(bad).code,'INVALID_INPUT',JSON.stringify(bad).slice(0,90));
 assert.equal(isTechnicalLabScope('Come posso riparare il carburatore?'),true);
 assert.equal(isTechnicalLabScope('Vorrei parlare di astronomia'),false);
 assert.equal(validateFreeInput({question:'Come si sostituisce il filtro aria?',history:[]}).code,'TECHNICAL_SCOPE_BLOCKED');
 assert.equal(validateFreeInput({question:'E poi?',history:pair('Parlami della candela','No')}).code,'TECHNICAL_SCOPE_BLOCKED');
});

test('M4.4 disable/expiry blocks calls before model binding',async()=>{
 const {runFreeTurn}=await moduleUnderTest();
 const {env,calls}=environment();
 const body={question:'Ciao, come stai?',history:[]};
 let r=await runFreeTurn(body,{...env,AI_FREE_MODE:'disabled'});
 assert.equal(r.decision,'FREE_CHAT_DISABLED');
 assert.equal(r.modelRequests,0);
 r=await runFreeTurn(body,{...env,AI_FREE_EXPIRES_AT:'2020-01-01T00:00:00Z'});
 assert.equal(r.decision,'FREE_CHAT_EXPIRED');
 assert.equal(r.modelRequests,0);
 assert.equal(calls.length,0);
});

test('M4.4 first spontaneous prompt reaches the model and yields plain text',async()=>{
 const {runFreeTurn}=await moduleUnderTest();
 const {env,calls}=environment();
 const r=await runFreeTurn({question:'Mi racconti una curiosità sulle stelle?',history:[]},env);
 assert.equal(r.decision,'FREE_CHAT_READY');
 assert.equal(r.answer,'Mi piace osservare le stelle.');
 assert.equal(r.modelRequests,1);
 assert.equal(r.turn,1);
 assert.equal(r.remainingTurns,3);
 assert.equal(r.sessionChanged,false);
 assert.equal(r.allowCompletion,false);
 assert.equal(calls.length,1);
 assert.equal(calls[0].model,'@cf/openai/gpt-oss-20b');
 assert.equal(calls[0].params.messages.length,2);
 assert.equal(calls[0].params.messages[0].role,'system');
 assert.equal(calls[0].params.messages[1].content,'Mi racconti una curiosità sulle stelle?');
 assert.equal(calls[0].params.stream,false);
 assert.equal(calls[0].params.messages.some(m=>m.role==='tool'),false);
});

test('M4.4 full fourth turn passes bounded history as alternating roles',async()=>{
 const {runFreeTurn}=await moduleUnderTest();
 const {env,calls}=environment();
 const history=[...pair('Mi chiamo Luca','Ciao Luca'),...pair('Come mi chiamo?','Luca'),
  ...pair('Ricordi?', 'Sì, Luca')];
 const r=await runFreeTurn({question:'E come avevi risposto?',history},env);
 assert.equal(r.decision,'FREE_CHAT_READY');
 assert.equal(r.turn,4);
 assert.equal(r.remainingTurns,0);
 assert.equal(calls.length,1);
 const messages=calls[0].params.messages;
 assert.equal(messages.length,8);
 assert.deepEqual(messages.slice(1).map(m=>m.role),
   ['user','assistant','user','assistant','user','assistant','user']);
 assert.deepEqual(messages.slice(1,-1),history);
 assert.equal(messages.at(-1).content,'E come avevi risposto?');
});

test('M4.4 technical input blocked before model, even when valid and enabled',async()=>{
 const {runFreeTurn}=await moduleUnderTest();
 const {env,calls}=environment();
 const r=await runFreeTurn({question:'Quale candela per il rasaerba?',history:[]},env);
 assert.equal(r.decision,'TECHNICAL_SCOPE_BLOCKED');
 assert.equal(r.modelRequests,0);
 assert.equal(calls.length,0);
});

test('M4.4 rejection does not leak tool calls, provider error or unsafe model text',async()=>{
 const {runFreeTurn}=await moduleUnderTest();
 const body={question:'Parlami dei pianeti',history:[]};
 let env=environment({AI:{run:async()=>({response:'Il filtro aria va lavato con acqua'})}}).env;
 let r=await runFreeTurn(body,env);
 assert.equal(r.decision,'FREE_CHAT_OUTPUT_REJECTED');
 assert.equal(r.diagnosticCode,'TECHNICAL_OUTPUT_BLOCKED');
 assert.equal(r.answer,undefined);
 env=environment({AI:{run:async()=>({response:'A'.repeat(702)})}}).env;
 r=await runFreeTurn(body,env);
 assert.equal(r.decision,'FREE_CHAT_OUTPUT_REJECTED');
 assert.equal(r.diagnosticCode,'TEXT_TOO_LONG');
 env=environment({AI:{run:async()=>({choices:[{finish_reason:'stop',message:{
  role:'assistant',content:'Ciao',tool_calls:[{id:'call'}]
 }}]})}}).env;
 r=await runFreeTurn(body,env);
 assert.equal(r.decision,'FREE_CHAT_OUTPUT_REJECTED');
 assert.equal(r.diagnosticCode,'TOOL_CALL_UNSUPPORTED');
 env=environment({AI:{run:async()=>{throw Error('SECRET CLOUD ERROR');}}}).env;
 r=await runFreeTurn(body,env);
 assert.equal(r.decision,'MODEL_UNAVAILABLE');
 assert.equal(r.modelRequests,1);
 assert.equal(JSON.stringify(r).includes('SECRET'),false);
});

test('M4.4 HTTP requires Access, correct origin and disabled state blocks inference',async()=>{
 const w=await getWorker();
 const {env,calls}=environment();
 const page=await w.fetch(new Request(ORIGIN+'/lab/ai-free'),env,ctx);
 assert.equal(page.status,200);
 assert.equal(page.headers.get('X-Frame-Options'),'DENY');
 const html=await page.text();
 assert.match(html,/textarea/);
 assert.match(html,/non tecnico/);
 const script=await w.fetch(new Request(ORIGIN+'/lab/ai-free/client.js'),env,ctx);
 assert.equal(script.status,200);
 const js=await script.text();
 assert.match(js,/textContent/);
 assert.equal(js.includes('innerHTML'),false);
 assert.equal(js.includes('localStorage'),false);
 assert.equal((await w.fetch(new Request(ORIGIN+'/lab/ai-free'),env,{})).status,401);
 assert.equal((await w.fetch(request({question:'ciao',history:[]},'https://not-allowed.test'),env,ctx)).status,403);
 const disabled=await w.fetch(request({question:'ciao',history:[]}),{...env,AI_FREE_MODE:'disabled'},ctx);
 assert.equal(disabled.status,503);
 const obj=await disabled.json();
 assert.equal(obj.decision,'FREE_CHAT_DISABLED');
 assert.equal(obj.modelRequests,0);
 assert.equal(calls.length,0);
});

test('M4.4 HTTP rejects malformed input, technical scope, limits before model',async()=>{
 const w=await getWorker();
 const {env,calls}=environment();
 let r=await w.fetch(request({question:'Come riparare la candela?',history:[]}),env,ctx);
 assert.equal(r.status,400);
 assert.equal((await r.json()).decision,'TECHNICAL_SCOPE_BLOCKED');
 r=await w.fetch(request({question:'ciao',history:[{role:'system',content:'x'}]}),env,ctx);
 assert.equal(r.status,400);
 assert.equal((await r.json()).modelRequests,0);
 r=await w.fetch(request({question:'ciao',history:[]}),
  {...env,AI_PROBE_LIMITER:null},ctx);
 assert.equal(r.status,503);
 assert.equal((await r.json()).decision,'FREE_CHAT_LIMITER_REQUIRED');
 r=await w.fetch(request({question:'ciao',history:[]}),
  {...env,AI_PROBE_LIMITER:{limit:async()=>({success:false})}},ctx);
 assert.equal(r.status,429);
 assert.equal((await r.json()).decision,'FREE_CHAT_RATE_LIMITED');
 assert.equal(calls.length,0);
});

test('M4.4 HTTP valid spontaneous message can be returned from mocked AI',async()=>{
 const w=await getWorker();
 const {env,calls}=environment();
 const r=await w.fetch(request({question:'Qual è una curiosità su Saturno?',history:[]}),env,ctx);
 assert.equal(r.status,200);
 const obj=await r.json();
 assert.equal(obj.decision,'FREE_CHAT_READY');
 assert.equal(obj.modelRequests,1);
 assert.equal(obj.answer,'Mi piace osservare le stelle.');
 assert.equal(obj.allowCompletion,false);
 assert.equal(obj.sessionChanged,false);
 assert.equal(calls.length,1);
});
