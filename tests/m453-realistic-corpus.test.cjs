'use strict';
/*
 * M4.5.3 — baseline offline di 40 domande curate, solo revisione umana.
 * Il test MISURA il comportamento corrente di M4.5.2, non lo modifica.
 * Nessuna inferenza AI, endpoint o avanzamento di sessione.
 */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..');
const file=path.join(__dirname,'fixtures/m453-op03-realistic-questions.json');
const corpus=JSON.parse(fs.readFileSync(file,'utf8'));
const mapper=()=>import('../worker/src/m452-question-mapper.mjs');
const ledger=()=>import('../worker/src/review-ledger.mjs');

const safe=r=>{
  for(const [key,value] of Object.entries({
    aiEnabled:false,canGenerate:false,modelRequests:0,
    allowCompletion:false,sessionChanged:false,maySendToModel:false,
    authorizesMaintenance:false,requiresOperatorVerification:true
  }))assert.equal(r[key],value,'invariante '+key);
};
const percent=(part,total)=>total===0?null:Number((100*part/total).toFixed(1));

test('M4.5.3 corpus: schema, vincoli, 40 domande distinte e 7 fonti OP03',()=>{
  assert.equal(corpus.schema,'tagliando.m453.offline-corpus.v1');
  assert.equal(corpus.machineFamily,'rasaerba_a_benzina');
  assert.equal(corpus.operationId,3);
  assert.equal(corpus.cases.length,40);
  assert.deepEqual(corpus.expectedCounts,{
    recognized:12,paraphrase:12,ambiguous:6,
    safety:5,model_specific:3,out_of_scope:2
  });
  const unique=new Set(),steps=new Set();
  for(const c of corpus.cases){
    assert.match(c.id,/^[RPASMO][0-9]{2}$/);
    assert.equal(unique.has(c.id),false,'id duplicato: '+c.id);
    unique.add(c.id);
    assert.ok(corpus.expectedCounts[c.category]>0,'categoria sconosciuta: '+c.category);
    assert.equal(typeof c.question,'string');
    assert.ok(c.question.trim()===c.question && c.question.length>0 && c.question.length<=450);
    assert.ok([null,'carta','spugna','misto'].includes(c.filterType));
    assert.equal(typeof c.expectedDecision,'string');
    assert.equal(typeof c.focus,'string');
    if(['recognized','paraphrase'].includes(c.category)){
      assert.match(c.goldStepId,/^RASA-OP-03-P0[1-7]$/);
      steps.add(c.goldStepId);
    }else assert.equal(c.goldStepId,null);
  }
  for(const [category,count] of Object.entries(corpus.expectedCounts))
    assert.equal(corpus.cases.filter(c=>c.category===category).length,count,category);
  assert.equal(steps.size,7);
});

test('M4.5.3: matrice baseline, provenienza, rifiuti e metriche riproducibili',async()=>{
  const {mapQuestionToReviewedEvidence}=await mapper();
  const {REVIEW_LEDGER}=await ledger();
  const outcomes=[];
  for(const c of corpus.cases){
    const r=mapQuestionToReviewedEvidence({
      machineFamily:corpus.machineFamily,
      operationId:corpus.operationId,
      filterType:c.filterType,question:c.question
    });
    safe(r);
    assert.equal(r.decision,c.expectedDecision,c.id+': '+c.question);
    if(r.ok){
      assert.equal(c.category,'recognized','fonte concessa a domanda non attesa: '+c.id);
      assert.equal(r.source.stepId,c.goldStepId,c.id);
      assert.equal(r.source.aiUseAllowed,false,c.id);
      assert.equal(r.source.status,'VALIDATO_CONDIZIONATO',c.id);
      assert.equal(r.mappingMethod,'exact_curated_phrase',c.id);
      const original=REVIEW_LEDGER.find(x=>x.stepId===c.goldStepId);
      assert.ok(original,c.id);
      assert.equal(r.source.revision,original.revision,c.id);
      assert.equal(r.source.scope,original.scope,c.id);
      assert.deepEqual(r.content,{
        title:original.content.title,
        instruction:original.content.instruction,
        stopCondition:original.content.stopCondition
      },c.id);
    }else{
      assert.equal(r.source,null,c.id);
      assert.equal(r.content,null,c.id);
      assert.equal(r.mappingId,null,c.id);
    }
    outcomes.push({case:c,result:r});
  }

  const count=category=>outcomes.filter(x=>x.case.category===category).length;
  const mapped=outcomes.filter(x=>x.result.ok);
  const eligible=outcomes.filter(x=>x.case.goldStepId!==null);
  const correct=eligible.filter(x=>x.result.ok && x.result.source?.stepId===x.case.goldStepId);
  const wronglyMapped=mapped.filter(x=>x.result.source?.stepId!==x.case.goldStepId);
  const paraphrase=outcomes.filter(x=>x.case.category==='paraphrase');
  const paraphraseMapped=paraphrase.filter(x=>x.result.ok);
  const critical=outcomes.filter(x=>['safety','model_specific'].includes(x.case.category));
  const correctlyBlocked=critical.filter(x=>!x.result.ok && x.result.decision===x.case.expectedDecision);
  const nonEligible=outcomes.filter(x=>x.case.goldStepId===null);
  const refused=outcomes.filter(x=>!x.result.ok);
  const summary={
    corpus:outcomes.length,
    recognized:count('recognized'),
    paraphrases:count('paraphrase'),
    ambiguous:count('ambiguous'),
    safety:count('safety'),
    modelSpecific:count('model_specific'),
    outOfScope:count('out_of_scope'),
    mapped:mapped.length,
    rejected:refused.length,
    correctSourceMatches:correct.length,
    wrongSourceMatches:wronglyMapped.length,
    precisionPct:percent(correct.length,mapped.length),
    answerableRecallPct:percent(correct.length,eligible.length),
    paraphraseRecallPct:percent(paraphraseMapped.length,paraphrase.length),
    criticalCorrectlyBlocked:correctlyBlocked.length,
    criticalCases:critical.length,
    nonEligibleRefused:nonEligible.filter(x=>!x.result.ok).length,
    nonEligibleCases:nonEligible.length,
    fullStepPreviews:mapped.length,
    focusedAnswerExcerpts:0,
    modelRequests:0
  };
  assert.deepEqual({
    corpus:summary.corpus,mapped:summary.mapped,rejected:summary.rejected,
    correctSourceMatches:summary.correctSourceMatches,
    wrongSourceMatches:summary.wrongSourceMatches,
    precisionPct:summary.precisionPct,answerableRecallPct:summary.answerableRecallPct,
    paraphraseRecallPct:summary.paraphraseRecallPct,
    criticalCorrectlyBlocked:summary.criticalCorrectlyBlocked,
    criticalCases:summary.criticalCases,
    nonEligibleRefused:summary.nonEligibleRefused,
    nonEligibleCases:summary.nonEligibleCases
  },{
    corpus:40,mapped:12,rejected:28,
    correctSourceMatches:12,wrongSourceMatches:0,
    precisionPct:100,answerableRecallPct:50,paraphraseRecallPct:0,
    criticalCorrectlyBlocked:8,criticalCases:8,
    nonEligibleRefused:16,nonEligibleCases:16
  });
  // I 12 match restituiscono SOLO gli step integrali: non sono risposte sintetiche.
  console.log('M4.5.3 BASELINE OFFLINE '+JSON.stringify(summary));
});

test('M4.5.3: test e corpus non sono importati dal Worker; flag AI OFF',()=>{
  const router=fs.readFileSync(path.join(root,'worker/src/index.mjs'),'utf8');
  assert.doesNotMatch(router,/m453|m452-question-mapper/);
  for(const filename of ['wrangler.jsonc','worker/wrangler.jsonc']){
    const cfg=JSON.parse(fs.readFileSync(path.join(root,filename),'utf8'));
    assert.equal(cfg.vars.AI_FREE_MODE,'disabled');
    assert.equal(cfg.vars.AI_CHAT_MODE,'disabled');
    assert.equal(cfg.vars.AI_PROBE_MODE,'disabled');
  }
});
