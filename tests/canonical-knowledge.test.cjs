'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const getServer=()=>import('../worker/src/canonical-knowledge.mjs');
function localKB(){
  const sandbox={window:{addEventListener(){}},document:{}};
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(root,'app.js'),'utf8'),sandbox,{filename:'app.js'});
  vm.runInContext(fs.readFileSync(path.join(root,'knowledge.js'),'utf8'),sandbox,{filename:'knowledge.js'});
  return JSON.parse(JSON.stringify(sandbox.window.TagliandoKnowledge.getKnowledge()));
}
test('canonical server copy matches client source field-by-field: 8 procedures, 53 steps',async()=>{
  const m=await getServer();
  assert.deepEqual(m.CANONICAL_KNOWLEDGE,localKB());
  assert.equal(m.auditCanonicalKnowledge().ok,true);
  assert.equal(m.CANONICAL_KNOWLEDGE.procedures.length,8);
  assert.equal(m.CANONICAL_KNOWLEDGE.procedures.reduce((n,o)=>n+o.steps.length,0),53);
});
test('every technical step and procedure is pending review; no approvals inferred',async()=>{
  const m=await getServer();
  const ps=m.CANONICAL_KNOWLEDGE.procedures;
  assert.ok(ps.every(op=>op.review.status==='DA_VALIDARE' && op.review.reviewer===null));
  assert.ok(ps.flatMap(op=>op.steps).every(s=>s.review.status==='DA_VALIDARE' && s.review.reviewer===null));
  const summary=m.canonicalKnowledgeStatus();
  assert.equal(summary.pendingSteps,51);
  assert.equal(summary.validatedSteps,2);
  assert.equal(summary.conditionalValidatedSteps,2);
  assert.equal(summary.latestReviewedStepId,'RASA-OP-01-P02');
  assert.equal(summary.readyForTechnicalAnswers,false);
  assert.equal(summary.canGenerate,false);
  assert.equal(summary.aiEnabled,false);
});
test('catalog cannot be mutated by another Worker module',async()=>{
  const {CANONICAL_KNOWLEDGE:kb}=await getServer();
  assert.equal(Object.isFrozen(kb),true);
  assert.equal(Object.isFrozen(kb.procedures[0].steps[0].review),true);
  assert.throws(()=>{kb.procedures[0].steps[0].instruction='changed';},TypeError);
});
test('manual alteration, missing warning, broken methods or fake review status fails closed',async()=>{
  const m=await getServer();
  const cases=[
    k=>{k.procedures[0].steps[0].instruction='altered';},
    k=>{k.procedures[0].steps[0].warning='';},
    k=>{k.procedures[0].steps[0].methods=['unlisted'];},
    k=>{k.procedures[0].steps[0].review.status='VALIDATO';},
    k=>{k.procedures[0].operationId=8;},
    k=>{k.procedures[2].steps.splice(1,1);},
    k=>{k.procedures[1].source.file='untrusted-browser-payload';}
  ];
  for(const change of cases){
    const clone=JSON.parse(JSON.stringify(m.CANONICAL_KNOWLEDGE));
    change(clone);
    assert.equal(m.auditCanonicalKnowledge(clone).ok,false);
  }
});
test('status endpoint is Access-protected, read only, and includes no technical instruction',async()=>{
  const worker=(await import('../worker/src/index.mjs')).default;
  const aud='a'.repeat(64), url='https://staging.invalid/api/knowledge-status';
  const env={SERVICE_MODE:'guarded',ACCESS_AUD:aud};
  const ctx={access:{aud}};
  let res=await worker.fetch(new Request(url),env,ctx);
  assert.equal(res.status,200);
  const json=await res.json();
  assert.equal(json.ok,true);
  assert.equal(json.procedureCount,8);
  assert.equal(json.stepCount,53);
  assert.equal(json.pendingSteps,51);
  assert.equal(json.validatedSteps,2);
  assert.equal(json.conditionalValidatedSteps,2);
  assert.equal(json.latestReviewedStepId,'RASA-OP-01-P02');
  assert.equal(json.aiEnabled,false);
  assert.equal(json.canGenerate,false);
  assert.equal(json.sessionChanged,false);
  assert.equal(json.instructions,undefined);
  assert.equal(json.procedures,undefined);
  assert.equal(json.references,undefined);
  assert.equal(res.headers.get('cache-control'),'no-store, max-age=0');
  assert.equal((await worker.fetch(new Request(url),env,{})).status,401);
  assert.equal((await worker.fetch(new Request(url),env,{access:{aud:'wrong'}})).status,401);
  assert.equal((await worker.fetch(new Request(url),{...env,SERVICE_MODE:'disabled'},ctx)).status,503);
  assert.equal((await worker.fetch(new Request(url,{method:'POST'}),env,ctx)).status,405);
});
test('the existing /api/assist still refuses a regular technical how-to until review',async()=>{
  const worker=(await import('../worker/src/index.mjs')).default;
  const origin='https://lupus227.github.io',aud='a'.repeat(64);
  const request=new Request('https://staging.invalid/api/assist',{
    method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},
    body:JSON.stringify({question:'Come pulisco il sottoscocca?',operationId:1})
  });
  const env={SERVICE_MODE:'guarded',ALLOWED_ORIGIN:origin,ACCESS_AUD:aud,
    API_LIMITER:{limit:async()=>({success:true})}};
  const response=await worker.fetch(request,env,{access:{aud,getIdentity:async()=>({user_uuid:'test-person'})}});
  assert.equal(response.status,503);
  const body=await response.json();
  assert.equal(body.decision,'PENDING_VALIDATION');
  assert.deepEqual(body.references,[]);
  assert.equal(body.canGenerate,false);
  assert.equal(body.sessionChanged,false);
});


test('15.1 review ledger contains the exact expert-approved preparation text and stop condition',async()=>{
  const [m,reviews]=await Promise.all([getServer(),import('../worker/src/review-ledger.mjs')]);
  assert.equal(reviews.REVIEW_LEDGER.length,2);
  assert.equal(reviews.auditReviewLedger(m.CANONICAL_KNOWLEDGE).ok,true);
  const r=reviews.REVIEW_LEDGER[0];
  assert.equal(r.stepId,'RASA-OP-01-P01');
  assert.equal(r.revision,'F15.1-R1');
  assert.equal(r.status,'VALIDATO_CONDIZIONATO');
  assert.equal(r.approval.decision,'APPROVATO_SENZA_MODIFICHE');
  assert.equal(r.approval.approvedOn,'2026-11-04');
  assert.equal(r.aiUseAllowed,false);
  assert.equal(r.applicability.universalAuthorization,false);
  assert.match(r.content.instruction,/Identifica marca e modello del rasaerba e del motore/);
  assert.match(r.content.instruction,/mantienila separata dal terminale/);
  assert.match(r.content.instruction,/disabilitalo secondo le istruzioni del costruttore/);
  assert.match(r.content.stopCondition,/non accedere al sottoscocca/);
  assert.equal(r.evidence.length,3);
  assert.ok(r.evidence.every(x=>x.url.startsWith('https://')));
});
test('15.1–15.2 ledger is immutable and rejects extra approvals, false universal scope, and altered content',async()=>{
  const [m,reviews]=await Promise.all([getServer(),import('../worker/src/review-ledger.mjs')]);
  assert.equal(Object.isFrozen(reviews.REVIEW_LEDGER[0].content),true);
  assert.throws(()=>{reviews.REVIEW_LEDGER[0].status='APPROVATO_UNIVERSALE';},TypeError);
  for(const mutate of [
    rs=>rs.push({...rs[0],stepId:'RASA-OP-01-P03'}),
    rs=>rs[0].stepId='RASA-OP-01-P02',
    rs=>rs[0].status='APPROVATO_UNIVERSALE',
    rs=>rs[0].content.instruction='Senza precauzioni',
    rs=>rs[0].applicability.universalAuthorization=true,
    rs=>rs[0].aiUseAllowed=true,
    rs=>rs[0].evidence[0].url='https://untrusted.example/guide'
  ]){
    const candidate=JSON.parse(JSON.stringify(reviews.REVIEW_LEDGER));
    mutate(candidate);
    assert.equal(reviews.auditReviewLedger(m.CANONICAL_KNOWLEDGE,candidate).ok,false);
  }
});
test('15.1 technical approval is never auto-exposed to client through knowledge status or assist',async()=>{
  const worker=(await import('../worker/src/index.mjs')).default;
  const aud='a'.repeat(64),env={SERVICE_MODE:'guarded',ACCESS_AUD:aud};
  const r=await worker.fetch(new Request('https://staging.invalid/api/knowledge-status'),env,{access:{aud}});
  assert.equal(r.status,200);
  const s=await r.json();
  assert.equal(s.validatedSteps,2);
  assert.equal(s.readyForTechnicalAnswers,false);
  assert.equal(s.canGenerate,false);
  const payload=JSON.stringify(s);
  assert.doesNotMatch(payload,/pipetta|candela|sottoscocca|contenitore|guanti/);
});

test('15.2 approved conditional inclination is recorded verbatim and no AI use is allowed',async()=>{
 const {REVIEW_LEDGER:ledger,auditReviewLedger:audit}=await import('../worker/src/review-ledger.mjs');
 const {CANONICAL_KNOWLEDGE:kb}=await getServer();
 assert.equal(audit(kb).ok,true);
 assert.deepEqual(ledger.map(r=>r.stepId),['RASA-OP-01-P01','RASA-OP-01-P02']);
 const r=ledger[1];
 assert.equal(r.revision,'F15.2-R1');
 assert.equal(r.approval.decision,'APPROVATO_DOPO_REVISIONE_CONCORDATA');
 assert.match(r.content.instruction,/candela anteriore/);
 assert.match(r.content.instruction,/circa 45°/);
 assert.match(r.content.instruction,/posizionamento verticale/);
 assert.match(r.content.instruction,/filtro dell'aria/);
 assert.match(r.content.stopCondition,/perdite di olio o carburante/);
 assert.equal(r.applicability.angle45IsReferenceOnly,true);
 assert.equal(r.applicability.angle45IsCertifiedLimit,false);
 assert.equal(r.applicability.universalAuthorization,false);
 assert.equal(r.aiUseAllowed,false);
 assert.equal(ledger[0].revision,'F15.1-R1');
});
test('15.2 fail-closed tamper prevention: no universal 45-degree permission or premature model use',async()=>{
 const {REVIEW_LEDGER:ledger,auditReviewLedger:audit}=await import('../worker/src/review-ledger.mjs');
 const {CANONICAL_KNOWLEDGE:kb}=await getServer();
 for(const alter of [
   rs=>{rs[1].applicability.angle45IsCertifiedLimit=true;},
   rs=>{rs[1].applicability.universalAuthorization=true;},
   rs=>{rs[1].applicability.requiresCompatibleOrientation=false;},
   rs=>{rs[1].content.stopCondition='Nessuna precauzione';},
   rs=>{rs[1].aiUseAllowed=true;},
   rs=>{rs[1].stepId='RASA-OP-03-P01';},
   rs=>{rs.push({...rs[1],stepId:'RASA-OP-01-P03'});}
 ]){
   const modified=JSON.parse(JSON.stringify(ledger));
   alter(modified);
   assert.equal(audit(kb,modified).ok,false);
 }
 const status=(await getServer()).canonicalKnowledgeStatus();
 assert.equal(status.pendingSteps,51);
 assert.equal(status.validatedSteps,2);
 assert.equal(status.readyForTechnicalAnswers,false);
 assert.equal(status.aiEnabled,false);
});
