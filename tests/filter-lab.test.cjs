'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const origin='https://tagliando-ai-staging.maico-gua.workers.dev';
const env={SERVICE_MODE:'guarded',SELF_TEST_ORIGIN:origin,ACCESS_AUD:'a'.repeat(64),
  API_LIMITER:{limit:async()=>({success:true})}};
const ctx={access:{aud:env.ACCESS_AUD,getIdentity:async()=>({user_uuid:'lab-test-only'})}};
const lab=()=>import('../worker/src/filter-lab.mjs');
const worker=async()=> (await import('../worker/src/index.mjs')).default;
function question(stepId='RASA-OP-03-P01',filterType=null,question='Mostra passaggio'){
 return {stepId,filterType,question};
}
function post(body,config={}){
 return new Request(origin+'/api/lab/filtro-aria',{method:'POST',headers:{
   'Content-Type':'application/json','Origin':origin,...config.headers},
   body:config.raw??JSON.stringify(body)});
}
test('filter lab uses only seven previously validated source steps, no AI',async()=>{
 const m=await lab();
 assert.equal(m.filterLabReady(),true);
 assert.equal(m.FILTER_LAB_OPERATION_ID,3);
 assert.equal(m.FILTER_LAB_STEPS.length,7);
 const r=m.filterLabAnswer(question());
 assert.equal(r.ok,true);
 assert.equal(r.decision,'REVIEWED_STEP');
 assert.equal(r.aiEnabled,false);
 assert.equal(r.canGenerate,false);
 assert.equal(r.sessionChanged,false);
 assert.equal(r.allowCompletion,false);
 assert.equal(r.references[0].stepId,'RASA-OP-03-P01');
 assert.equal(r.references[0].revision,'F15.16-R1');
 assert.match(r.instruction,/motore spento e freddo/);
 assert.match(r.stopCondition,/non forzarlo/);
});
test('the three filter material paths exclude nonapplicable operations',async()=>{
 const m=await lab();
 assert.deepEqual(m.applicableFilterSteps('carta').map(x=>x.slice(-3)),['P01','P02','P03','P06','P07']);
 assert.deepEqual(m.applicableFilterSteps('spugna').map(x=>x.slice(-3)),['P01','P02','P04','P05','P06','P07']);
 assert.deepEqual(m.applicableFilterSteps('misto').map(x=>x.slice(-3)),['P01','P02','P03','P04','P06','P07']);
 assert.deepEqual(m.applicableFilterSteps(undefined).map(x=>x.slice(-3)),['P01']);
 assert.equal(m.filterLabAnswer(question('RASA-OP-03-P02')).decision,'FILTER_TYPE_REQUIRED');
 assert.equal(m.filterLabAnswer(question('RASA-OP-03-P03','spugna')).decision,'NOT_APPLICABLE');
 assert.equal(m.filterLabAnswer(question('RASA-OP-03-P04','carta')).decision,'NOT_APPLICABLE');
 assert.equal(m.filterLabAnswer(question('RASA-OP-03-P05','misto')).decision,'NOT_APPLICABLE');
});
test('only approved text returned, no paper washing nor invented model values',async()=>{
 const m=await lab();
 const paper=m.filterLabAnswer(question('RASA-OP-03-P03','carta'));
 assert.equal(paper.ok,true);
 assert.match(paper.instruction,/Non lavare né oliare i filtri in carta/);
 assert.match(paper.instruction,/soffiaggio delicato con aria compressa/);
 assert.equal(paper.references[0].revision,'F15.18-R2');
 const foam=m.filterLabAnswer(question('RASA-OP-03-P04','spugna'));
 assert.equal(foam.ok,true);
 assert.match(foam.instruction,/acqua tiepida/);
 assert.match(foam.instruction,/detergente specifico per filtri aria/);
 assert.equal(foam.references[0].revision,'F15.19-R2');
 const oil=m.filterLabAnswer(question('RASA-OP-03-P05','spugna'));
 assert.equal(oil.ok,true);
 assert.match(oil.stopCondition,/non disponi di olio idoneo/);
 const model=m.filterLabAnswer(question('RASA-OP-03-P05','spugna','Quanto olio devo mettere?'));
 assert.equal(model.decision,'MODEL_REQUIRED');
 assert.equal(model.instruction,undefined);
});
test('fail closed on damage, scope, command, malicious payload or non-reviewed steps',async()=>{
 const m=await lab();
 const stop=m.filterLabAnswer(question('RASA-OP-03-P01',null,'Non riesco ad aprire il coperchio'));
 assert.equal(stop.decision,'OPERATOR_STOP');
 assert.equal(stop.instruction,undefined);
 assert.equal(stop.allowCompletion,false);
 assert.equal(m.filterLabAnswer(question('RASA-OP-03-P01',null,'La lama è crepata')).decision,'SAFETY_STOP');
 assert.equal(m.filterLabAnswer(question('RASA-OP-03-P01',null,'Fatto')).decision,'COMMAND');
 assert.equal(m.filterLabAnswer(question('RASA-OP-03-P01',null,'Che film esce al cinema?')).decision,'QUESTION_NOT_COVERED');
 assert.equal(m.filterLabAnswer(question('RASA-OP-03-P01',null,'Come riparare il cambio di una automobile?')).decision,'OUT_OF_SCOPE');
 assert.equal(m.filterLabAnswer(question('RASA-OP-04-P01','carta')).decision,'INVALID_INPUT');
 assert.equal(m.filterLabAnswer({...question(),role:'admin'}).decision,'INVALID_INPUT');
 assert.equal(m.filterLabAnswer(question('RASA-OP-03-P01','carta','')).decision,'INVALID_INPUT');
});
test('the staging lab GET assets require guarded mode, exact origin and Access',async()=>{
 const w=await worker();
 for(const path of ['/lab/filtro-aria','/lab/filtro-aria/client.js']){
  let request=new Request(origin+path);
  assert.equal((await w.fetch(request,env,{})).status,401);
  assert.equal((await w.fetch(request,{...env,SERVICE_MODE:'disabled'},ctx)).status,503);
  assert.equal((await w.fetch(request,{...env,SELF_TEST_ORIGIN:'https://wrong.example'},ctx)).status,403);
  const response=await w.fetch(request,env,ctx);
  assert.equal(response.status,200);
  assert.equal(response.headers.get('cache-control'),'no-store, max-age=0');
  assert.equal(response.headers.get('x-frame-options'),'DENY');
  assert.match(await response.text(),/Filtro dell'aria|filter-lab-v1/);
 }
});
test('the lab POST enforces origin, Access identity, size, limiter and input',async()=>{
 const w=await worker();
 const b=question('RASA-OP-03-P03','carta');
 assert.equal((await w.fetch(post(b),env,{})).status,401);
 assert.equal((await w.fetch(post(b),{...env,SERVICE_MODE:'disabled'},ctx)).status,503);
 assert.equal((await w.fetch(post(b,{headers:{Origin:'https://evil.example'}}),env,ctx)).status,403);
 assert.equal((await w.fetch(post(b,{headers:{Origin:''}}),env,ctx)).status,403);
 assert.equal((await w.fetch(post(b),{...env,API_LIMITER:{limit:async()=>({success:false})}},ctx)).status,429);
 assert.equal((await w.fetch(post(b,{raw:' '.repeat(2200)}),env,ctx)).status,413);
 const r=await w.fetch(post(b),env,ctx);
 assert.equal(r.status,200);
 const j=await r.json();
 assert.equal(j.decision,'REVIEWED_STEP');
 assert.equal(j.aiEnabled,false);
 assert.equal(j.canGenerate,false);
 assert.equal(j.allowCompletion,false);
 assert.equal(j.references[0].stepId,'RASA-OP-03-P03');
 const bad=await w.fetch(post({...b,operationId:4}),env,ctx);
 assert.equal(bad.status,400);
 assert.equal((await bad.json()).decision,'INVALID_INPUT');
});
test('existing assistant API remains disabled for procedural knowledge',async()=>{
 const w=await worker();
 const res=await w.fetch(new Request(origin+'/api/assist',{method:'POST',
   headers:{Origin:origin,'Content-Type':'application/json'},
   body:JSON.stringify({question:'Posso lavare un filtro di carta?',operationId:3})}),
   {...env,ALLOWED_ORIGIN:'https://lupus227.github.io'},ctx);
 const data=await res.json();
 assert.equal(data.aiEnabled,false);
 assert.equal(data.canGenerate,false);
 assert.equal(data.decision,'PENDING_VALIDATION');
 assert.equal(res.status,503);
});
