'use strict';
/*
 * M4.5.3.1 — regressione del falso MODEL_REQUIRED su "che il filtro".
 * La classificazione non autorizza risposte: nessun LLM o stato sessione.
 */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const policy=()=>import('../worker/src/policy.mjs');
const mapper=()=>import('../worker/src/m452-question-mapper.mjs');

test('subordinate "che il filtro" e domande sulla condizione non richiedono specifiche costruttore',async()=>{
  const {evaluateSafety}=await policy();
  for(const question of [
    'Come verifico che il filtro sia montato correttamente?',
    'Come controllo che il filtro sia montato correttamente?',
    'Ho visto che il filtro è sporco',
    'Mi confermi che il filtro è in carta?',
    'Come capisco che il filtro è sporco?',
    'Come controllo che la candela sia integra?'
  ]){
    const result=evaluateSafety(question);
    assert.equal(result.decision,'PENDING_VALIDATION',question);
    assert.equal(result.canGenerate,false,question);
  }
});

test('quantità, ricambi e identificazione specifica restano MODEL_REQUIRED',async()=>{
  const {evaluateSafety}=await policy();
  for(const question of [
    'Quanto olio devo mettere?',
    'Quanta benzina contiene il serbatoio?',
    'Quale filtro devo comprare?',
    'Quale candela devo usare?',
    'Che filtro devo montare per questo motore?',
    'Che tipo di filtro devo comprare?',
    'Che olio devo usare per questo motore?',
    'Che candela devo acquistare?',
    'Che gradazione di olio devo usare?',
    'Che quantità olio devo inserire?',
    'Quale coppia di serraggio devo applicare?',
    'Codice candela?'
  ]){
    const result=evaluateSafety(question);
    assert.equal(result.decision,'MODEL_REQUIRED',question);
    assert.equal(result.canGenerate,false,question);
  }
});

test('priorità pericolo/comandi/fuori ambito invariata',async()=>{
  const {evaluateSafety}=await policy();
  for(const [question,expected] of [
    ['La lama è crepata','SAFETY_STOP'],
    ['Il motore non si spegne','SAFETY_STOP'],
    ['Perdo benzina vicino al filtro aria','SAFETY_STOP'],
    ['Fatto','COMMAND'],
    ['Come si ripara il cambio di una automobile?','OUT_OF_SCOPE']
  ])assert.equal(evaluateSafety(question).decision,expected,question);
});

test('P12 resta senza istruzioni e senza autorizzazione: QUESTION_NOT_MAPPED',async()=>{
  const {mapQuestionToReviewedEvidence}=await mapper();
  const r=mapQuestionToReviewedEvidence({
    machineFamily:'rasaerba_a_benzina',
    operationId:3,
    filterType:'misto',
    question:'Come verifico che il filtro sia montato correttamente?'
  });
  assert.equal(r.ok,false);
  assert.equal(r.decision,'QUESTION_NOT_MAPPED');
  assert.equal(r.source,null);
  assert.equal(r.content,null);
  assert.equal(r.mappingId,null);
  for(const [key,value] of Object.entries({
    aiEnabled:false,canGenerate:false,modelRequests:0,maySendToModel:false,
    authorizesMaintenance:false,allowCompletion:false,sessionChanged:false,
    requiresOperatorVerification:true
  }))assert.equal(r[key],value,key);
});
