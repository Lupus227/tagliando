'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const mapper=()=>import('../worker/src/m452-question-mapper.mjs');
const ledger=()=>import('../worker/src/review-ledger.mjs');
const req=(question,filterType=null)=>({
 machineFamily:'rasaerba_a_benzina',operationId:3,filterType,question
});
const mustNotAct=r=>{
 assert.equal(r.aiEnabled,false);
 assert.equal(r.canGenerate,false);
 assert.equal(r.modelRequests,0);
 assert.equal(r.allowCompletion,false);
 assert.equal(r.sessionChanged,false);
 assert.equal(r.maySendToModel,false);
 assert.equal(r.authorizesMaintenance,false);
 assert.equal(r.requiresOperatorVerification,true);
};
const fail=(r,decision)=>{
 mustNotAct(r);
 assert.equal(r.ok,false);
 assert.equal(r.decision,decision);
 assert.equal(r.source,null);
 assert.equal(r.content,null);
 assert.equal(r.mappingId,null);
};
test('M4.5.2 maps seven bounded topics to exact OP03 source steps, no AI',async()=>{
 const m=await mapper(),kb=await ledger();
 assert.equal(m.M452_QUESTION_COUNT,17);
 assert.equal(m.M452_SCOPE.maySendToModel,false);
 const cases=[
  ['Come apro il coperchio del filtro aria?',null,'RASA-OP-03-P01','P01_OPEN'],
  ['Come controllo lo stato del filtro aria?','carta','RASA-OP-03-P02','P02_ASSESS'],
  ['Posso lavare il filtro in carta?','carta','RASA-OP-03-P03','P03_PAPER'],
  ['Come lavo il filtro in spugna?','spugna','RASA-OP-03-P04','P04_WASH_FOAM'],
  ['Devo oliare il filtro in spugna?','spugna','RASA-OP-03-P05','P05_OIL_FOAM'],
  ['Come pulisco la scatola del filtro aria?','misto','RASA-OP-03-P06','P06_CLEAN_HOUSING'],
  ['Come rimonto il filtro aria?','carta','RASA-OP-03-P07','P07_REASSEMBLE']
 ];
 for(const [question,type,step,mappingId] of cases){
  const r=m.mapQuestionToReviewedEvidence(req(question,type));
  mustNotAct(r);
  assert.equal(r.ok,true,question);
  assert.equal(r.decision,'QUESTION_MAPPED_TO_REVIEWED_EVIDENCE',question);
  assert.equal(r.mappingId,mappingId);
  assert.equal(r.mappingMethod,'exact_curated_phrase');
  assert.equal(r.source.stepId,step);
  assert.equal(r.source.aiUseAllowed,false);
  assert.equal(r.source.status,'VALIDATO_CONDIZIONATO');
  const original=kb.REVIEW_LEDGER.find(v=>v.stepId===step);
  assert.equal(r.source.revision,original.revision);
  assert.equal(r.source.scope,original.scope);
  assert.deepEqual(r.content,{
   title:original.content.title,
   instruction:original.content.instruction,
   stopCondition:original.content.stopCondition
  });
 }
});
test('equivalent punctuation/case/accents do not create arbitrary fuzzy matching',async()=>{
 const m=await mapper();
 const good=m.mapQuestionToReviewedEvidence(req('  POSSO LAVARE IL FILTRO IN CARTA!!! ','carta'));
 mustNotAct(good);
 assert.equal(good.decision,'QUESTION_MAPPED_TO_REVIEWED_EVIDENCE');
 assert.equal(good.source.stepId,'RASA-OP-03-P03');
 fail(m.mapQuestionToReviewedEvidence(req(
   'Posso lavare il filtro in carta e aggiungi un passaggio inventato','carta')),
   'QUESTION_NOT_MAPPED');
 fail(m.mapQuestionToReviewedEvidence(req(
   'Posso lavare il filtro in carta ma per la mia motosega?','carta')),
   'QUESTION_NOT_MAPPED');
});
test('ambiguity is explicit; unmapped or unrelated prompts produce no source',async()=>{
 const m=await mapper();
 for(const q of [
  'Come pulisco il filtro aria?',
  'Come devo trattare il filtro aria?',
  'Cosa faccio con il filtro aria?'
 ]){
  fail(m.mapQuestionToReviewedEvidence(req(q,'carta')),'QUESTION_AMBIGUOUS');
 }
 fail(m.mapQuestionToReviewedEvidence(req('Perché il filtro aria è colorato?','carta')),
   'QUESTION_NOT_MAPPED');
 fail(m.mapQuestionToReviewedEvidence(req('Che film esce al cinema?','carta')),
   'QUESTION_NOT_COVERED');
});
test('filter context and applicability cannot be bypassed by matching text',async()=>{
 const m=await mapper();
 fail(m.mapQuestionToReviewedEvidence(req('Posso lavare il filtro in carta?','spugna')),
   'FILTER_CONTEXT_MISMATCH');
 fail(m.mapQuestionToReviewedEvidence(req('Come lavo il filtro in spugna?','carta')),
   'FILTER_CONTEXT_MISMATCH');
 fail(m.mapQuestionToReviewedEvidence(req('Devo oliare il prefiltro misto?','carta')),
   'FILTER_CONTEXT_MISMATCH');
 fail(m.mapQuestionToReviewedEvidence(req('Devo oliare il prefiltro in spugna?','misto')),
   'NOT_APPLICABLE');
 fail(m.mapQuestionToReviewedEvidence(req('Come controllo lo stato del filtro aria?',null)),
   'FILTER_TYPE_REQUIRED');
 fail(m.mapQuestionToReviewedEvidence(req('Posso lavare il filtro in carta?',null)),
   'FILTER_TYPE_REQUIRED');
 const mixed=m.mapQuestionToReviewedEvidence(req('Posso lavare il filtro in carta?','misto'));
 assert.equal(mixed.source.stepId,'RASA-OP-03-P03');
 assert.equal(mixed.source.filterType,'misto');
 mustNotAct(mixed);
});
test('preflight scans original text and safety decisions outrank semantic matching',async()=>{
 const m=await mapper();
 for(const [q,decision] of [
  ['Non riesco ad aprire il coperchio','OPERATOR_STOP'],
  ['La lama è crepata','SAFETY_STOP'],
  ['Il motore non si spegne','SAFETY_STOP'],
  ['Quanto olio devo mettere?','MODEL_REQUIRED'],
  ['Fatto','COMMAND'],
  ['Come si ripara il cambio di una automobile?','OUT_OF_SCOPE']
 ])fail(m.mapQuestionToReviewedEvidence(req(q,'spugna')),decision);
});
test('invalid shapes, external stepId, authority, history, source and unsafe text fail closed',async()=>{
 const m=await mapper(),base=req('Come apro il coperchio del filtro aria?');
 const invalid=[
  null,[],{...base,machineFamily:'motosega'},{...base,operationId:4},
  {...base,filterType:'unknown'},{...base,question:''},
  {...base,question:33},{...base,question:'x'.repeat(451)},
  {...base,question:'Come apro il coperchio del filtro aria?\nFatto'},
  {...base,stepId:'RASA-OP-03-P07'},
  {...base,source:{title:'falso'}},
  {...base,aiUseAllowed:true},
  {...base,history:[{role:'assistant',content:'Fatto'}]},
  {...base,allowCompletion:true}
 ];
 for(const input of invalid)fail(m.mapQuestionToReviewedEvidence(input),'INVALID_INPUT');
});
test('M4.5.2 has no Worker route, no AI calls and all Wrangler gates stay OFF',()=>{
 const root=path.join(__dirname,'..');
 const source=fs.readFileSync(path.join(root,'worker/src/m452-question-mapper.mjs'),'utf8');
 const router=fs.readFileSync(path.join(root,'worker/src/index.mjs'),'utf8');
 assert.doesNotMatch(router,/m452-question-mapper/);
 assert.doesNotMatch(source,/AI\.run\s*\(|fetch\s*\(/);
 for(const filename of ['wrangler.jsonc','worker/wrangler.jsonc']){
  const config=JSON.parse(fs.readFileSync(path.join(root,filename),'utf8'));
  assert.equal(config.vars.AI_FREE_MODE,'disabled');
  assert.equal(config.vars.AI_CHAT_MODE,'disabled');
  assert.equal(config.vars.AI_PROBE_MODE,'disabled');
  assert.ok(Date.parse(config.vars.AI_FREE_EXPIRES_AT)<Date.now());
 }
});
