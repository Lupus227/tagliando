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
  assert.equal(summary.pendingSteps,34);
  assert.equal(summary.validatedSteps,19);
  assert.equal(summary.conditionalValidatedSteps,19);
  assert.equal(summary.latestReviewedStepId,'RASA-OP-03-P05');
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
  assert.equal(json.pendingSteps,34);
  assert.equal(json.validatedSteps,19);
  assert.equal(json.conditionalValidatedSteps,19);
  assert.equal(json.latestReviewedStepId,'RASA-OP-03-P05');
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
  assert.equal(reviews.REVIEW_LEDGER.length,19);
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
    rs=>rs.push({...rs[0],stepId:'RASA-OP-01-P04'}),
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
  assert.equal(s.validatedSteps,19);
  assert.equal(s.readyForTechnicalAnswers,false);
  assert.equal(s.canGenerate,false);
  const payload=JSON.stringify(s);
  assert.doesNotMatch(payload,/pipetta|candela|sottoscocca|contenitore|guanti/);
});

test('15.2 approved conditional inclination is recorded verbatim and no AI use is allowed',async()=>{
 const {REVIEW_LEDGER:ledger,auditReviewLedger:audit}=await import('../worker/src/review-ledger.mjs');
 const {CANONICAL_KNOWLEDGE:kb}=await getServer();
 assert.equal(audit(kb).ok,true);
 assert.deepEqual(ledger.map(r=>r.stepId),['RASA-OP-01-P01','RASA-OP-01-P02','RASA-OP-01-P03','RASA-OP-01-P04','RASA-OP-01-P05','RASA-OP-01-P06','RASA-OP-02-P01','RASA-OP-02-P02','RASA-OP-02-P03','RASA-OP-02-P04','RASA-OP-02-P05','RASA-OP-02-P06','RASA-OP-02-P07','RASA-OP-02-P08','RASA-OP-03-P01','RASA-OP-03-P02','RASA-OP-03-P03','RASA-OP-03-P04','RASA-OP-03-P05']);
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
   rs=>{rs.push({...rs[1],stepId:'RASA-OP-01-P04'});}
 ]){
   const modified=JSON.parse(JSON.stringify(ledger));
   alter(modified);
   assert.equal(audit(kb,modified).ok,false);
 }
 const status=(await getServer()).canonicalKnowledgeStatus();
 assert.equal(status.pendingSteps,34);
 assert.equal(status.validatedSteps,19);
 assert.equal(status.readyForTechnicalAnswers,false);
 assert.equal(status.aiEnabled,false);
});

test('15.3 approved steel spatula method excludes rejected guidance',async()=>{
 const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
 assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE).ok,true);
 const r=REVIEW_LEDGER[2];assert.equal(r.stepId,'RASA-OP-01-P03');
 assert.equal(r.revision,'F15.3-R1');assert.equal(r.status,'VALIDATO_CONDIZIONATO');
 assert.match(r.content.instruction,/spatola in acciaio rigida, con bordo non affilato/);
 assert.match(r.content.instruction,/pressione necessaria/);
 assert.equal(r.content.precautions.length,2);
 assert.deepEqual(r.content.precautions,[
 'Non utilizzare la lama come punto di leva o di appoggio per la spatola.',
 'Evita il contatto accidentale con i taglienti.']);
 assert.equal(r.content.stopCondition,"Interrompi l'operazione se riscontri danni strutturali, componenti compromessi o instabilità della macchina.");
 assert.doesNotMatch(JSON.stringify(r.content),/deposito non può essere rimosso/);
 assert.equal(r.aiUseAllowed,false);
});
test('15.3 ledger rejects tampering and keeps AI disabled',async()=>{
 const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
 for(const mutate of [
 x=>x[2].content.precautions=[],
 x=>x[2].content.instruction='Solo spazzola',
 x=>x[2].applicability.requiresStableSupport=false,
 x=>x[2].aiUseAllowed=true,
 x=>x[2].stepId='RASA-OP-01-P04',
 x=>x.push({...x[2],stepId:'RASA-OP-01-P04'})
 ]){
 const candidate=JSON.parse(JSON.stringify(REVIEW_LEDGER));mutate(candidate);
 assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE,candidate).ok,false);
 }
 const state=m.canonicalKnowledgeStatus();
 assert.equal(state.version,'15.20.0');assert.equal(state.validatedSteps,19);
 assert.equal(state.pendingSteps,34);assert.equal(state.aiEnabled,false);
 assert.equal(state.readyForTechnicalAnswers,false);
});

test('15.4 final cleaning: expert-approved wording, no compressor pressure requirement, drying in P05',async()=>{
 const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
 assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE).ok,true);
 const r=REVIEW_LEDGER[3];
 assert.equal(r.stepId,'RASA-OP-01-P04');assert.equal(r.revision,'F15.4-R1');
 assert.equal(r.approval.approvedOn,'2026-11-05');
 assert.equal(r.approval.decision,'APPROVATO_CON_MODIFICA_ESPLICITA');
 assert.match(r.content.instruction,/Utilizza aria compressa per eliminare/);
 assert.match(r.content.instruction,/tubo dell'acqua con pistola a spruzzo da giardino/);
 assert.doesNotMatch(r.content.instruction,/pressione controllata|idropulitrice/);
 assert.equal(r.applicability.dryingHandledByStepId,'RASA-OP-01-P05');
 assert.equal(r.applicability.privateUserPressureWasherRecommended,false);
 assert.equal(r.professionalPracticeNote.exposedToPrivateUsers,false);
 assert.equal(r.professionalPracticeNote.aiInstructionAllowed,false);
 assert.equal(r.aiUseAllowed,false);
});
test('15.4 review cannot be changed to authorize pressure washing or AI',async()=>{
 const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
 for(const mutate of [
  rs=>rs[3].content.instruction='Usa idropulitrice',
  rs=>rs[3].applicability.privateUserPressureWasherRecommended=true,
  rs=>rs[3].applicability.dryingHandledByStepId='RASA-OP-01-P04',
  rs=>rs[3].professionalPracticeNote.aiInstructionAllowed=true,
  rs=>rs[3].aiUseAllowed=true,
  rs=>rs.push({...rs[3],stepId:'RASA-OP-01-P05'})
 ]){
 const copy=JSON.parse(JSON.stringify(REVIEW_LEDGER));mutate(copy);
 assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE,copy).ok,false);
 }
 const state=m.canonicalKnowledgeStatus();assert.equal(state.version,'15.20.0');
 assert.equal(state.pendingSteps,34);assert.equal(state.validatedSteps,19);
 assert.equal(state.readyForTechnicalAnswers,false);assert.equal(state.aiEnabled,false);
});

test('15.5 three approved drying methods preserve exact user-specified surface and omit generic model gate',async()=>{
 const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
 assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE).ok,true);
 const r=REVIEW_LEDGER[4];assert.equal(r.stepId,'RASA-OP-01-P05');
 assert.equal(r.revision,'F15.5-R1');assert.equal(r.approval.approvedOn,'2026-11-05');
 assert.deepEqual(r.content.methods.map(v=>v.id),['aria_compressa','naturale','motore']);
 const motor=r.content.methods[2].instruction;
 assert.match(motor,/Scegli una superficie liscia, solida come un pavimento in cemento o piastrelle e priva di materiale che possa essere proiettato dalla lama\./);
 assert.doesNotMatch(motor,/se il modello lo consente/i);
 assert.match(motor,/5–10 minuti/);assert.match(motor,/senza bloccarla artificialmente/);
 assert.match(motor,/All'aperto/);assert.match(motor,/Evita superfici delicate/);
 assert.match(r.content.stopCondition,/Non avviare il motore in ambienti chiusi/);
 assert.equal(r.applicability.motorRunMinutesCertified,false);assert.equal(r.aiUseAllowed,false);
});
test('15.5 ledger rejects unsafe motor drying changes and never enables AI',async()=>{
 const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
 for(const edit of [
  rs=>rs[4].content.methods[2].instruction='Accendi in garage',
  rs=>rs[4].applicability.motorMethodRequiresOutdoorArea=false,
  rs=>rs[4].applicability.operatorPresenceLeverMustNotBeBlocked=false,
  rs=>rs[4].applicability.motorRunMinutesCertified=true,
  rs=>rs[4].content.stopCondition='',
  rs=>rs[4].aiUseAllowed=true,
  rs=>rs.push({...rs[4],stepId:'RASA-OP-01-P06'})
 ]){
  const altered=JSON.parse(JSON.stringify(REVIEW_LEDGER));edit(altered);
  assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE,altered).ok,false);
 }
 const st=m.canonicalKnowledgeStatus();assert.equal(st.version,'15.20.0');
 assert.equal(st.validatedSteps,19);assert.equal(st.pendingSteps,34);
 assert.equal(st.aiEnabled,false);assert.equal(st.readyForTechnicalAnswers,false);
});

test('15.6 deck inspection discriminates surface rust from through-corrosion and serious damage',async()=>{
 const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
 assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE).ok,true);
 assert.deepEqual(REVIEW_LEDGER.slice(0,7).map(r=>r.stepId),[
  'RASA-OP-01-P01','RASA-OP-01-P02','RASA-OP-01-P03',
  'RASA-OP-01-P04','RASA-OP-01-P05','RASA-OP-01-P06','RASA-OP-02-P01']);
 const r=REVIEW_LEDGER[5];assert.equal(r.revision,'F15.6-R1');
 assert.equal(r.approval.approvedOn,'2026-11-05');
 assert.match(r.content.instruction,/La ruggine superficiale è comune/);
 assert.match(r.content.instruction,/corrosione passante/);
 assert.match(r.content.instruction,/perdita significativa di spessore/);
 assert.match(r.content.instruction,/Scocca in plastica/);
 assert.equal(r.applicability.surfaceRustAloneRequiresStop,false);
 assert.equal(r.applicability.throughCorrosionRequiresSpecialistAssessment,true);
 assert.equal(r.applicability.automaticStructuralDiagnosisAllowed,false);
 assert.deepEqual(r.content.anomalyManagement.map(a=>a.requiresStop),[false,false,true]);
 assert.equal(r.content.anomalyManagement[2].requiresSpecialist,true);
 assert.match(r.content.anomalyManagement[2].action,/meccanico specializzato/);
 assert.match(r.content.repairSeparation,/gestite separatamente/);
 assert.equal(r.aiUseAllowed,false);
});
test('15.6 unauthorized promotion of surface rust or structural damage is blocked; AI remains off',async()=>{
 const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
 for(const edit of [
  rs=>rs[5].applicability.surfaceRustAloneRequiresStop=true,
  rs=>rs[5].applicability.throughCorrosionRequiresSpecialistAssessment=false,
  rs=>rs[5].applicability.automaticStructuralDiagnosisAllowed=true,
  rs=>rs[5].content.anomalyManagement[2].requiresStop=false,
  rs=>rs[5].content.anomalyManagement[2].action='Continua senza valutazione',
  rs=>rs[5].content.instruction='Nessun controllo necessario',
  rs=>rs[5].aiUseAllowed=true,
  rs=>rs.push({...rs[5],stepId:'RASA-OP-02-P01'})
 ]){
  const clone=JSON.parse(JSON.stringify(REVIEW_LEDGER));edit(clone);
  assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE,clone).ok,false);
 }
 const state=m.canonicalKnowledgeStatus();
 assert.equal(state.version,'15.20.0');
 assert.equal(state.pendingSteps,34);assert.equal(state.validatedSteps,19);
 assert.equal(state.conditionalValidatedSteps,19);
 assert.equal(state.latestReviewedStepId,'RASA-OP-03-P05');
 assert.equal(state.readyForTechnicalAnswers,false);
 assert.equal(state.canGenerate,false);assert.equal(state.aiEnabled,false);
});

test('15.7 expert-approved blade safety prerequisites remain independent of prior underdeck cleaning',async()=>{
  const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
  assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE).ok,true);
  const entry=REVIEW_LEDGER[6];
  assert.equal(entry.stepId,'RASA-OP-02-P01');
  assert.equal(entry.revision,'F15.7-R1');
  assert.equal(entry.approval.decision,'APPROVATO_SENZA_MODIFICHE');
  assert.equal(entry.approval.approvedOn,'2026-11-06');
  assert.match(entry.content.instruction,/Scollega la pipetta dalla candela/);
  assert.match(entry.content.instruction,/disabilita anche il relativo sistema di alimentazione/);
  assert.match(entry.content.instruction,/guanti protettivi/);
  assert.match(entry.content.instruction,/metodo di inclinazione e sostegno già definito/);
  assert.deepEqual(entry.applicability.referencedPreparatorySteps,['RASA-OP-01-P01','RASA-OP-01-P02']);
  assert.equal(entry.applicability.independentEntrySafetyPrerequisites,true);
  assert.equal(entry.applicability.doesNotAuthorizeBladeRemovalOrSharpening,true);
  assert.equal(entry.aiUseAllowed,false);
});
test('15.7 fail-closed: disabling isolation, stopping conditions or model gate is rejected',async()=>{
 const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
 for(const edit of [
  rs=>rs[6].applicability.requiresSparkPlugIsolation=false,
  rs=>rs[6].applicability.requiresElectricStarterIsolationWhenPresent=false,
  rs=>rs[6].applicability.requiresStableSupport=false,
  rs=>rs[6].applicability.doesNotAuthorizeBladeRemovalOrSharpening=false,
  rs=>rs[6].content.instruction='Apri senza precauzioni',
  rs=>rs[6].content.stopCondition='',
  rs=>rs[6].applicability.referencedPreparatorySteps=[],
  rs=>rs[6].aiUseAllowed=true,
  rs=>rs.push({...rs[6],stepId:'RASA-OP-02-P02'})
 ]){
   const clone=JSON.parse(JSON.stringify(REVIEW_LEDGER));edit(clone);
   assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE,clone).ok,false);
 }
 const status=m.canonicalKnowledgeStatus();
 assert.equal(status.version,'15.20.0');
 assert.equal(status.stepCount,53);assert.equal(status.validatedSteps,19);
 assert.equal(status.pendingSteps,34);assert.equal(status.conditionalValidatedSteps,19);
 assert.equal(status.latestReviewedStepId,'RASA-OP-03-P05');
 assert.equal(status.readyForTechnicalAnswers,false);assert.equal(status.aiEnabled,false);
 assert.equal(status.canGenerate,false);
});

test('15.8 both impact wrench and manual wrench may use protective-glove grip or stable wood block',async()=>{
 const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
 assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE).ok,true);
 const r=REVIEW_LEDGER[7];
 assert.equal(r.stepId,'RASA-OP-02-P02');assert.equal(r.revision,'F15.8-R1');
 assert.equal(r.approval.decision,'APPROVATO_CON_MODIFICA_ESPLICITA');
 assert.deepEqual(r.content.methods.map(x=>x.id),['pistola_impulsi','chiave_manuale']);
 for(const m of r.content.methods){
  assert.match(m.instruction,/guanti protettivi adeguati/);
  assert.match(m.instruction,/blocco di legno/);
 }
 assert.match(r.content.methods[0].instruction,/Se la lama tende a ruotare/);
 assert.match(r.content.commonActions,/sequenza di montaggio/);
 assert.match(r.content.commonActions,/orientamento/);
 assert.match(r.content.stopCondition,/Non utilizzare la lama come leva/);
 assert.equal(r.applicability.requiresApprovedSafetyStep,'RASA-OP-02-P01');
 assert.equal(r.applicability.doesNotAuthorizeReassemblyOrTorque,true);
 assert.equal(r.aiUseAllowed,false);
});
test('15.8 audit rejects disabled blade stabilization, missing stop condition, or AI enablement',async()=>{
 const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
 for(const edit of [
  rs=>rs[7].applicability.manualGripWithProtectiveGlovesAllowed=false,
  rs=>rs[7].applicability.stableWoodBlockAlternativeAllowed=false,
  rs=>rs[7].applicability.stopWhenBladeCannotBeControlled=false,
  rs=>rs[7].applicability.requiresApprovedSafetyStep=null,
  rs=>rs[7].content.methods[0].instruction='Svita senza precauzioni',
  rs=>rs[7].content.methods[1].instruction='Non immobilizzare',
  rs=>rs[7].content.stopCondition='',
  rs=>rs[7].aiUseAllowed=true,
  rs=>rs.push({...rs[7],stepId:'RASA-OP-02-P03'})
 ]){
  const clone=JSON.parse(JSON.stringify(REVIEW_LEDGER));edit(clone);
  assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE,clone).ok,false);
 }
 const status=m.canonicalKnowledgeStatus();
 assert.equal(status.version,'15.20.0');
 assert.equal(status.pendingSteps,34);assert.equal(status.validatedSteps,19);
 assert.equal(status.conditionalValidatedSteps,19);
 assert.equal(status.latestReviewedStepId,'RASA-OP-03-P05');
 assert.equal(status.readyForTechnicalAnswers,false);
 assert.equal(status.aiEnabled,false);assert.equal(status.canGenerate,false);
});

test('15.9 no separate key check when hub is retained; conditional guidance only after hub slips',async()=>{
 const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
 assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE).ok,true);
 const r=REVIEW_LEDGER[8];
 assert.equal(r.stepId,'RASA-OP-02-P03');assert.equal(r.revision,'F15.9-R1');
 assert.equal(r.approval.decision,'APPROVATO_CON_MODIFICA_ESPLICITA');
 assert.deepEqual(r.content.cases.map(x=>x.id),['mozzo_in_sede','mozzo_sfilato']);
 assert.match(r.content.cases[0].instruction,/non è necessario rimuoverlo o effettuare ulteriori controlli/);
 assert.doesNotMatch(r.content.cases[0].instruction,/linguetta|chiavetta/i);
 assert.match(r.content.cases[1].instruction,/il mozzo si è sfilato/);
 assert.match(r.content.cases[1].instruction,/In altri mozzi questo elemento è integrato/);
 assert.match(r.content.cases[1].instruction,/Se la linguetta è separata/);
 assert.equal(r.applicability.inspectKeyOnlyIfHubSlipped,true);
 assert.equal(r.applicability.noStandaloneKeyInspection,true);
 assert.equal(r.applicability.professionalDeepHubInspectionExcluded,true);
 assert.match(r.content.stopCondition,/non procedere al rimontaggio della lama/);
 assert.equal(r.aiUseAllowed,false);
});
test('15.9 tampering with conditional inspection, risk stopping, or AI gate fails closed',async()=>{
 const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
 for(const change of [
  rs=>rs[8].applicability.inspectKeyOnlyIfHubSlipped=false,
  rs=>rs[8].applicability.noStandaloneKeyInspection=false,
  rs=>rs[8].applicability.professionalDeepHubInspectionExcluded=false,
  rs=>rs[8].content.cases[0].instruction='Smonta sempre il mozzo',
  rs=>rs[8].content.cases[1].instruction='Non controllare nulla',
  rs=>rs[8].content.stopCondition='',
  rs=>rs[8].aiUseAllowed=true,
  rs=>rs.push({...rs[8],stepId:'RASA-OP-02-P04'})
 ]){
  const copy=JSON.parse(JSON.stringify(REVIEW_LEDGER));change(copy);
  assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE,copy).ok,false);
 }
 const state=m.canonicalKnowledgeStatus();
 assert.equal(state.version,'15.20.0');
 assert.equal(state.validatedSteps,19);assert.equal(state.pendingSteps,34);
 assert.equal(state.conditionalValidatedSteps,19);
 assert.equal(state.latestReviewedStepId,'RASA-OP-03-P05');
 assert.equal(state.readyForTechnicalAnswers,false);
 assert.equal(state.aiEnabled,false);assert.equal(state.canGenerate,false);
});

test('15.10 optional blade sharpening only with intact blade and suitable skills and tools',async()=>{
 const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
 assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE).ok,true);
 const entry=REVIEW_LEDGER[9];
 assert.equal(entry.stepId,'RASA-OP-02-P04');
 assert.equal(entry.revision,'F15.10-R1');
 assert.equal(entry.approval.decision,'APPROVATO_SENZA_MODIFICHE');
 assert.equal(entry.approval.approvedOn,'2026-11-07');
 assert.match(entry.content.instruction,/foro di fissaggio/);
 assert.match(entry.content.instruction,/Non verificare l'affilatura facendo scorrere le dita/);
 assert.match(entry.content.instruction,/puoi scegliere di procedere con l'affilatura/);
 assert.match(entry.content.instruction,/puoi affidarla a un professionista/);
 assert.match(entry.content.stopCondition,/Non rimontare una lama strutturalmente compromessa/);
 assert.equal(entry.applicability.sharpeningOptional,true);
 assert.equal(entry.applicability.requiresAppropriateToolsAndAbility,true);
 assert.equal(entry.applicability.structurallyCompromisedBladeMustNotBeReinstalled,true);
 assert.equal(entry.aiUseAllowed,false);
});
test('15.10 fails closed if structural blade damage or optionality safeguards are bypassed',async()=>{
 const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
 for(const edit of [
  rs=>rs[9].applicability.sharpeningOptional=false,
  rs=>rs[9].applicability.requiresAppropriateToolsAndAbility=false,
  rs=>rs[9].applicability.noFingerSlideAlongCuttingEdge=false,
  rs=>rs[9].applicability.structurallyCompromisedBladeMustNotBeReinstalled=false,
  rs=>rs[9].applicability.noAutonomousAiDiagnosis=false,
  rs=>rs[9].content.instruction="Affila qualsiasi lama",
  rs=>rs[9].content.stopCondition="",
  rs=>rs[9].aiUseAllowed=true,
  rs=>rs.push({...rs[9],stepId:'RASA-OP-02-P05'})
 ]){
  const candidate=JSON.parse(JSON.stringify(REVIEW_LEDGER));edit(candidate);
  assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE,candidate).ok,false);
 }
 const st=m.canonicalKnowledgeStatus();
 assert.equal(st.version,'15.20.0');
 assert.equal(st.validatedSteps,19);assert.equal(st.pendingSteps,34);
 assert.equal(st.conditionalValidatedSteps,19);
 assert.equal(st.latestReviewedStepId,'RASA-OP-03-P05');
 assert.equal(st.aiEnabled,false);assert.equal(st.canGenerate,false);
 assert.equal(st.readyForTechnicalAnswers,false);
});

test('15.11 optional sharpening uses steady movement rather than any spindle RPM setting',async()=>{
 const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
 assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE).ok,true);
 const r=REVIEW_LEDGER[10];
 assert.equal(r.stepId,'RASA-OP-02-P05');assert.equal(r.revision,'F15.11-R1');
 assert.equal(r.approval.decision,'APPROVATO_CON_INTEGRAZIONE_ESPLICITA');
 assert.equal(r.approval.approvedOn,'2026-11-07');
 assert.match(r.content.instruction,/un movimento lento, regolare e continuo/);
 assert.match(r.content.instruction,/senza fermarti sullo stesso punto/);
 assert.match(r.content.instruction,/disco lamellare a grana 60 o 80/);
 assert.match(r.content.instruction,/30–35°/);
 assert.equal(r.applicability.movementSpeedNotSpindleRPM,true);
 assert.equal(r.applicability.angleIsUniversalSpecification,false);
 assert.equal(r.applicability.sharpeningOptional,true);
 assert.equal(r.applicability.balancingDeferredStep,'RASA-OP-02-P06');
 assert.match(r.content.stopCondition,/affida l'affilatura a un professionista/);
 assert.equal(r.aiUseAllowed,false);
});
test('15.11 tampering with continuous movement, optionality or safety is refused',async()=>{
 const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
 for(const edit of [
  rs=>rs[10].applicability.movementSlowSteadyContinuous=false,
  rs=>rs[10].applicability.neverHoldGrinderInOnePlace=false,
  rs=>rs[10].applicability.movementSpeedNotSpindleRPM=false,
  rs=>rs[10].applicability.sharpeningOptional=false,
  rs=>rs[10].applicability.overheatingAndExcessiveRemovalProhibited=false,
  rs=>rs[10].applicability.angleIsUniversalSpecification=true,
  rs=>rs[10].content.instruction='Mantieni la smerigliatrice ferma sul tagliente',
  rs=>rs[10].content.stopCondition='',
  rs=>rs[10].aiUseAllowed=true,
  rs=>rs.push({...rs[10],stepId:'RASA-OP-02-P06'})
 ]){
  const copy=JSON.parse(JSON.stringify(REVIEW_LEDGER));edit(copy);
  assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE,copy).ok,false);
 }
 const state=m.canonicalKnowledgeStatus();
 assert.equal(state.version,'15.20.0');
 assert.equal(state.validatedSteps,19);assert.equal(state.pendingSteps,34);
 assert.equal(state.conditionalValidatedSteps,19);
 assert.equal(state.latestReviewedStepId,'RASA-OP-03-P05');
 assert.equal(state.readyForTechnicalAnswers,false);
 assert.equal(state.aiEnabled,false);assert.equal(state.canGenerate,false);
});

test('15.12 equilibratura approved with screwdriver acting as centered balance fulcrum',async()=>{
 const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
 assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE).ok,true);
 const r=REVIEW_LEDGER[11];
 assert.equal(r.stepId,'RASA-OP-02-P06');
 assert.equal(r.revision,'F15.12-R1');
 assert.equal(r.approval.decision,'APPROVATO_CON_CHIARIMENTO_ESPLICITO');
 assert.equal(r.approval.approvedOn,'2026-11-07');
 assert.match(r.content.instruction,/fissalo orizzontalmente in una morsa/);
 assert.match(r.content.instruction,/foro centrale della lama/);
 assert.match(r.content.instruction,/sostenuta esattamente al centro/);
 assert.match(r.content.instruction,/un'altalena appoggiata sul proprio fulcro/);
 assert.match(r.content.instruction,/libere di muoversi/);
 assert.match(r.content.instruction,/Ripeti la prova più volte/);
 assert.equal(r.applicability.onlyAfterSharpening,true);
 assert.equal(r.applicability.supportAtBladeCenterHole,true);
 assert.equal(r.applicability.centerSupportExact,true);
 assert.equal(r.applicability.fingerUsedAsBalanceSupport,false);
 assert.match(r.content.stopCondition,/Non rimontare una lama evidentemente sbilanciata/);
 assert.equal(r.aiUseAllowed,false);
});
test('15.12 rejects missing centered support, freely moving ends or stopping controls',async()=>{
 const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
 for(const edit of [
  rs=>rs[11].applicability.onlyAfterSharpening=false,
  rs=>rs[11].applicability.centerSupportExact=false,
  rs=>rs[11].applicability.supportAtBladeCenterHole=false,
  rs=>rs[11].applicability.fingerUsedAsBalanceSupport=true,
  rs=>rs[11].applicability.bladeEndsMustMoveFreely=false,
  rs=>rs[11].applicability.stopIfClearlyUnbalancedDeformedOrDamaged=false,
  rs=>rs[11].content.instruction='Sposta il punto di appoggio fuori centro',
  rs=>rs[11].content.stopCondition='',
  rs=>rs[11].aiUseAllowed=true,
  rs=>rs.push({...rs[11],stepId:'RASA-OP-02-P07'})
 ]){
  const candidate=JSON.parse(JSON.stringify(REVIEW_LEDGER));edit(candidate);
  assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE,candidate).ok,false);
 }
 const state=m.canonicalKnowledgeStatus();
 assert.equal(state.version,'15.20.0');
 assert.equal(state.validatedSteps,19);assert.equal(state.pendingSteps,34);
 assert.equal(state.conditionalValidatedSteps,19);
 assert.equal(state.latestReviewedStepId,'RASA-OP-03-P05');
 assert.equal(state.readyForTechnicalAnswers,false);
 assert.equal(state.aiEnabled,false);assert.equal(state.canGenerate,false);
});

test('15.13 blade assembly requires relevant torque and declared torque wrench before removal',async()=>{
 const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
 assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE).ok,true);
 const r=REVIEW_LEDGER[12];
 assert.equal(r.stepId,'RASA-OP-02-P07');assert.equal(r.revision,'F15.13-R1');
 assert.equal(r.approval.decision,'APPROVATO_SENZA_MODIFICHE');
 assert.equal(r.applicability.prerequisiteBeforeBladeRemovalStep,'RASA-OP-02-P02');
 assert.equal(r.applicability.requiresDeclaredRelevantTorqueValueNm,true);
 assert.equal(r.applicability.requiresDeclaredTorqueSource,true);
 assert.equal(r.applicability.requiresDeclaredSuitableTorqueWrench,true);
 assert.equal(r.applicability.skipOptionalBladeWorkIfPrerequisitesMissing,true);
 assert.equal(r.applicability.recordSkipAsNotExecuted,true);
 assert.equal(r.applicability.doNotSkipIfAlreadyDismantledUnsafe,true);
 assert.equal(r.applicability.noUniversalTorqueFallback,true);
 assert.equal(r.applicability.noMandatoryThreadlocker,true);
 assert.match(r.content.prerequisite,/prima dello smontaggio della lama/);
 assert.match(r.content.assemblyInstruction,/Avvita inizialmente i bulloni a mano/);
 assert.match(r.content.tighteningInstruction,/chiave dinamometrica idonea/);
 assert.match(r.content.stopCondition,/Se la lama è già stata smontata/);
 assert.equal(r.aiUseAllowed,false);
});
test('15.13 fail-closed when prerequisites, tightening, stop conditions or AI gate altered',async()=>{
 const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
 for(const change of [
  rs=>rs[12].applicability.prerequisiteBeforeBladeRemovalStep='RASA-OP-02-P07',
  rs=>rs[12].applicability.requiresDeclaredRelevantTorqueValueNm=false,
  rs=>rs[12].applicability.requiresDeclaredSuitableTorqueWrench=false,
  rs=>rs[12].applicability.skipOptionalBladeWorkIfPrerequisitesMissing=false,
  rs=>rs[12].applicability.doNotSkipIfAlreadyDismantledUnsafe=false,
  rs=>rs[12].applicability.noUniversalTorqueFallback=false,
  rs=>rs[12].applicability.impactGunNotValidForFinalTorque=false,
  rs=>rs[12].content.prerequisite='smonta sempre',
  rs=>rs[12].content.tighteningInstruction='Serra a sensazione',
  rs=>rs[12].content.stopCondition='',
  rs=>rs[12].aiUseAllowed=true,
  rs=>rs.push({...rs[12],stepId:'RASA-OP-02-P08'})
 ]){
  const candidate=JSON.parse(JSON.stringify(REVIEW_LEDGER));change(candidate);
  assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE,candidate).ok,false);
 }
 const st=m.canonicalKnowledgeStatus();
 assert.equal(st.version,'15.20.0');
 assert.equal(st.validatedSteps,19);assert.equal(st.pendingSteps,34);
 assert.equal(st.conditionalValidatedSteps,19);
 assert.equal(st.latestReviewedStepId,'RASA-OP-03-P05');
 assert.equal(st.readyForTechnicalAnswers,false);
 assert.equal(st.aiEnabled,false);assert.equal(st.canGenerate,false);
});

test('15.14 final blade rotation checks respect brake behavior without repeating already approved safety intro',async()=>{
 const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
 assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE).ok,true);
 const entry=REVIEW_LEDGER[13];
 assert.equal(entry.stepId,'RASA-OP-02-P08');
 assert.equal(entry.revision,'F15.14-R1');
 assert.equal(entry.approval.decision,'APPROVATO_CON_RIMOZIONE_RIPETIZIONE_SICUREZZA');
 assert.equal(entry.approval.approvedOn,'2026-11-08');
 assert.doesNotMatch(entry.content.instruction,/Prima di procedere, assicurati che il motore sia spento/);
 assert.doesNotMatch(entry.content.instruction,/cappuccio della candela sia scollegato e isolato/);
 assert.match(entry.content.instruction,/un freno che rende più difficoltosa la rotazione della lama/);
 assert.match(entry.content.instruction,/non indica necessariamente un problema/);
 assert.match(entry.content.instruction,/non forzarla/);
 assert.match(entry.content.instruction,/un'altra persona di mantenere temporaneamente azionata la leva di sicurezza/);
 assert.match(entry.content.instruction,/Non bloccare la leva con corde o altri dispositivi/);
 assert.match(entry.content.instruction,/la leva di sicurezza sia stata rilasciata/);
 assert.equal(entry.applicability.doNotRequestIfOptionalBladeRemovalSkipped,true);
 assert.equal(entry.applicability.motorCannotStartPrerequisiteRemainsEffective,true);
 assert.match(entry.content.stopCondition,/non avviare il rasaerba/);
 assert.equal(entry.aiUseAllowed,false);
});
test('15.14 fail closed if brake handling or conditional safety checks are altered',async()=>{
 const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
 for(const edit of [
  rs=>rs[13].applicability.doNotRequestIfOptionalBladeRemovalSkipped=false,
  rs=>rs[13].applicability.motorCannotStartPrerequisiteRemainsEffective=false,
  rs=>rs[13].applicability.doNotForceBladeAgainstBrake=false,
  rs=>rs[13].applicability.assistantMayHoldSafetyLeverOnlyAfterMotorStartDisabled=false,
  rs=>rs[13].applicability.ropeOrOtherLeverBlockingProhibited=false,
  rs=>rs[13].applicability.releaseSafetyLeverAfterCheck=false,
  rs=>rs[13].content.instruction='Blocca la leva di sicurezza con una corda',
  rs=>rs[13].content.stopCondition='',
  rs=>rs[13].aiUseAllowed=true,
  rs=>rs.push({...rs[13],stepId:'RASA-OP-03-P01'})
 ]){
  const candidate=JSON.parse(JSON.stringify(REVIEW_LEDGER));edit(candidate);
  assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE,candidate).ok,false);
 }
 const state=m.canonicalKnowledgeStatus();
 assert.equal(state.version,'15.20.0');
 assert.equal(state.validatedSteps,19);assert.equal(state.pendingSteps,34);
 assert.equal(state.conditionalValidatedSteps,19);
 assert.equal(state.latestReviewedStepId,'RASA-OP-03-P05');
 assert.equal(state.readyForTechnicalAnswers,false);
 assert.equal(state.aiEnabled,false);assert.equal(state.canGenerate,false);
});


test('15.16 filter cover preparation and identification are conditionally reviewed, no filter treatment or AI authorization',async()=>{
 const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
 assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE).ok,true);
 const r=REVIEW_LEDGER[14];
 assert.equal(r.stepId,'RASA-OP-03-P01');
 assert.equal(r.revision,'F15.16-R1');
 assert.equal(r.status,'VALIDATO_CONDIZIONATO');
 assert.equal(r.approval.decision,'APPROVATO_SENZA_MODIFICHE');
 assert.equal(r.approval.approvedOn,'2026-11-08');
 assert.match(r.content.instruction,/normale posizione di lavoro/);
 assert.match(r.content.instruction,/motore spento e freddo/);
 assert.match(r.content.instruction,/Apri il coperchio senza forzarlo/);
 assert.match(r.content.instruction,/Prima di estrarre il filtro/);
 assert.match(r.content.instruction,/Filtro in carta/);
 assert.match(r.content.instruction,/Filtro in spugna/);
 assert.match(r.content.instruction,/Filtro misto/);
 assert.match(r.content.instruction,/polvere, erba o altri residui/);
 assert.match(r.content.stopCondition,/fissaggi danneggiati/);
 assert.match(r.content.stopCondition,/Registra il problema/);
 assert.equal(r.applicability.requiresEngineStopped,true);
 assert.equal(r.applicability.requiresCoolEngine,true);
 assert.equal(r.applicability.noForcingCover,true);
 assert.deepEqual([...r.applicability.filterTypes],['carta','spugna','misto']);
 assert.equal(r.applicability.protectCarburetorIntakeFromContamination,true);
 assert.equal(r.applicability.stopOnStuckCoverOrDamagedFasteners,true);
 assert.equal(r.applicability.doesNotAuthorizeFilterTreatment,true);
 assert.equal(r.applicability.universalAuthorization,false);
 assert.equal(r.aiUseAllowed,false);
 const state=m.canonicalKnowledgeStatus();
 assert.equal(state.version,'15.20.0');
 assert.equal(state.validatedSteps,19);
 assert.equal(state.conditionalValidatedSteps,19);
 assert.equal(state.pendingSteps,34);
 assert.equal(state.latestReviewedStepId,'RASA-OP-03-P05');
 assert.equal(state.readyForTechnicalAnswers,false);
 assert.equal(state.canGenerate,false);
 assert.equal(state.aiEnabled,false);
});
test('15.16 fail-closed on unsafe filter opening, contaminated air intake, forged approval or AI enablement',async()=>{
 const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
 const changes=[
  rs=>rs[14].applicability.requiresEngineStopped=false,
  rs=>rs[14].applicability.requiresCoolEngine=false,
  rs=>rs[14].applicability.noForcingCover=false,
  rs=>rs[14].applicability.protectCarburetorIntakeFromContamination=false,
  rs=>rs[14].applicability.stopOnStuckCoverOrDamagedFasteners=false,
  rs=>rs[14].applicability.doesNotAuthorizeFilterTreatment=false,
  rs=>rs[14].applicability.filterTypes=['carta'],
  rs=>rs[14].content.instruction='Apri con forza anche se il coperchio non si sblocca',
  rs=>rs[14].content.stopCondition='',
  rs=>rs[14].approval.decision='AUTOAPPROVATO',
  rs=>rs[14].aiUseAllowed=true,
  rs=>rs.push({...rs[14],stepId:'RASA-OP-03-P02'})
 ];
 for(const change of changes){
  const candidate=JSON.parse(JSON.stringify(REVIEW_LEDGER));
  change(candidate);
  assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE,candidate).ok,false);
 }
 const state=m.canonicalKnowledgeStatus();
 assert.equal(state.version,'15.20.0');
 assert.equal(state.aiEnabled,false);
 assert.equal(state.canGenerate,false);
});


test('15.17 assessment of paper foam and mixed air filters is conditionally reviewed, with no treatment or AI use',async()=>{
 const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
 assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE).ok,true);
 const r=REVIEW_LEDGER[15];
 assert.equal(r.stepId,'RASA-OP-03-P02');
 assert.equal(r.revision,'F15.17-R1');
 assert.equal(r.status,'VALIDATO_CONDIZIONATO');
 assert.equal(r.approval.decision,'APPROVATO_SENZA_MODIFICHE');
 assert.equal(r.approval.approvedOn,'2026-11-08');
 assert.equal(r.applicability.requiresApprovedFilterOpeningStep,'RASA-OP-03-P01');
 assert.equal(r.applicability.requiresIdentifiedFilterType,true);
 assert.equal(r.applicability.removeElementWithoutIntakeContamination,true);
 assert.equal(r.applicability.requiresSeparateMixedElementAssessment,true);
 assert.deepEqual([...r.applicability.filterTypes],['carta','spugna','misto']);
 assert.equal(r.applicability.paperReplaceNormally,true);
 assert.equal(r.applicability.paperReuseOnlyIfRecentlyInstalledCleanIntactAndManufacturerPermits,true);
 assert.equal(r.applicability.foamReuseOnlyIfSoftElasticIntact,true);
 assert.equal(r.applicability.foamReplaceWhenHardenedFriableTornOrDeformed,true);
 assert.equal(r.applicability.noWashingOilingOrCleaningAtThisStep,true);
 assert.equal(r.applicability.stopIfCompatibleReplacementMissing,true);
 assert.equal(r.applicability.recordWorkSuspendedIfReplacementMissing,true);
 assert.equal(r.applicability.noEngineStartWithoutCorrectlyInstalledAirFilter,true);
 assert.equal(r.applicability.universalAuthorization,false);
 assert.match(r.content.instruction,/Filtro in carta:/);
 assert.match(r.content.instruction,/Filtro in spugna:/);
 assert.match(r.content.instruction,/Filtro misto:/);
 assert.match(r.content.instruction,/strappi, deformazioni, umidità/);
 assert.match(r.content.instruction,/morbido, elastico e integro/);
 assert.match(r.content.instruction,/Non effettuare ancora lavaggio, oliatura o pulizia/);
 assert.match(r.content.stopCondition,/ricambio compatibile/);
 assert.match(r.content.stopCondition,/lavorazione come sospesa/);
 assert.match(r.content.stopCondition,/Non avviare il motore/);
 assert.equal(r.aiUseAllowed,false);
 const st=m.canonicalKnowledgeStatus();
 assert.equal(st.version,'15.20.0');
 assert.equal(st.validatedSteps,19);
 assert.equal(st.conditionalValidatedSteps,19);
 assert.equal(st.pendingSteps,34);
 assert.equal(st.latestReviewedStepId,'RASA-OP-03-P05');
 assert.equal(st.readyForTechnicalAnswers,false);
 assert.equal(st.canGenerate,false);
 assert.equal(st.aiEnabled,false);
});
test('15.17 fails closed for false safety prerequisites, absent replacement, unauthorized treatment and forged AI approval',async()=>{
 const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
 const edits=[
  rs=>rs[15].applicability.requiresApprovedFilterOpeningStep='RASA-OP-03-P02',
  rs=>rs[15].applicability.removeElementWithoutIntakeContamination=false,
  rs=>rs[15].applicability.requiresSeparateMixedElementAssessment=false,
  rs=>rs[15].applicability.paperReplaceNormally=false,
  rs=>rs[15].applicability.paperReuseOnlyIfRecentlyInstalledCleanIntactAndManufacturerPermits=false,
  rs=>rs[15].applicability.foamReplaceWhenHardenedFriableTornOrDeformed=false,
  rs=>rs[15].applicability.noWashingOilingOrCleaningAtThisStep=false,
  rs=>rs[15].applicability.stopIfCompatibleReplacementMissing=false,
  rs=>rs[15].applicability.recordWorkSuspendedIfReplacementMissing=false,
  rs=>rs[15].applicability.noEngineStartWithoutCorrectlyInstalledAirFilter=false,
  rs=>rs[15].applicability.filterTypes=['carta'],
  rs=>rs[15].content.instruction='Riutilizza sempre tutti i filtri',
  rs=>rs[15].content.stopCondition='',
  rs=>rs[15].approval.decision='AUTOAPPROVATO',
  rs=>rs[15].aiUseAllowed=true,
  rs=>rs.push({...rs[15],stepId:'RASA-OP-03-P03'})
 ];
 for(const edit of edits){
  const candidate=JSON.parse(JSON.stringify(REVIEW_LEDGER));edit(candidate);
  assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE,candidate).ok,false);
 }
});


test('15.18 approved paper-filter step R2 limits cleaning to gentle air and forbids washing or oiling',async()=>{
 const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
 assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE).ok,true);
 const r=REVIEW_LEDGER[16];
 assert.equal(r.stepId,'RASA-OP-03-P03');
 assert.equal(r.revision,'F15.18-R2');
 assert.equal(r.status,'VALIDATO_CONDIZIONATO');
 assert.equal(r.approval.decision,'APPROVATO_CON_RIMOZIONI_ESPLICITE');
 assert.equal(r.approval.approvedOn,'2026-11-08');
 assert.equal(r.applicability.requiresApprovedFilterEvaluationStep,'RASA-OP-03-P02');
 assert.deepEqual([...r.applicability.allowedFilterTypes],['carta','misto']);
 assert.equal(r.applicability.skipForFoamOnly,true);
 assert.equal(r.applicability.paperReplacementMustFitMotor,true);
 assert.equal(r.applicability.reuseOnlyIfRecentlyInstalledIntactAndClean,true);
 assert.equal(r.applicability.neverWashPaper,true);
 assert.equal(r.applicability.neverOilPaper,true);
 assert.equal(r.applicability.onlyPermittedPaperCleaningMethod,'soffiaggio_delicato_aria_compressa');
 assert.equal(r.applicability.compressedAirIfNeededOnly,true);
 assert.equal(r.applicability.noAggressiveAirJets,true);
 assert.equal(r.applicability.foamPrefilterTreatedSeparatelyLater,true);
 assert.equal(r.applicability.noEngineStartWithoutSuitableCorrectlyInstalledFilter,true);
 assert.equal(r.applicability.universalAuthorization,false);
 assert.match(r.content.instruction,/Non lavare né oliare i filtri in carta/);
 assert.match(r.content.instruction,/soffiaggio delicato con aria compressa/);
 assert.doesNotMatch(r.content.instruction,/salvo esplicita previsione del costruttore/);
 assert.doesNotMatch(r.content.instruction,/eventuali metodi di pulizia devono rispettare le istruzioni specifiche/);
 assert.match(r.content.stopCondition,/non avviare il motore/);
 assert.equal(r.aiUseAllowed,false);
 const st=m.canonicalKnowledgeStatus();
 assert.equal(st.version,'15.20.0');
 assert.equal(st.validatedSteps,19);
 assert.equal(st.conditionalValidatedSteps,19);
 assert.equal(st.pendingSteps,34);
 assert.equal(st.latestReviewedStepId,'RASA-OP-03-P05');
 assert.equal(st.readyForTechnicalAnswers,false);
 assert.equal(st.aiEnabled,false);
 assert.equal(st.canGenerate,false);
});
test('15.18 fail-closed for attempts to wash/oil paper, aggressive air or bypass incompatible replacement stop',async()=>{
 const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
 for(const edit of [
  rs=>rs[16].applicability.requiresApprovedFilterEvaluationStep='RASA-OP-03-P03',
  rs=>rs[16].applicability.allowedFilterTypes=['spugna'],
  rs=>rs[16].applicability.skipForFoamOnly=false,
  rs=>rs[16].applicability.neverWashPaper=false,
  rs=>rs[16].applicability.neverOilPaper=false,
  rs=>rs[16].applicability.onlyPermittedPaperCleaningMethod='lavaggio_acqua',
  rs=>rs[16].applicability.compressedAirIfNeededOnly=false,
  rs=>rs[16].applicability.noAggressiveAirJets=false,
  rs=>rs[16].applicability.stopIfReplacementIncompatible=false,
  rs=>rs[16].applicability.noEngineStartWithoutSuitableCorrectlyInstalledFilter=false,
  rs=>rs[16].content.instruction='Lava il filtro di carta se il costruttore lo permette',
  rs=>rs[16].content.stopCondition='',
  rs=>rs[16].aiUseAllowed=true,
  rs=>rs.push({...rs[16],stepId:'RASA-OP-03-P04'})
 ]){
  const candidate=JSON.parse(JSON.stringify(REVIEW_LEDGER));
  edit(candidate);
  assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE,candidate).ok,false);
 }
});


test('15.19 foam-only and mixed-filter washing uses dedicated cleaner, immersion compression and solvent prohibition',async()=>{
 const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
 assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE).ok,true);
 const r=REVIEW_LEDGER[17];
 assert.equal(r.stepId,'RASA-OP-03-P04');
 assert.equal(r.revision,'F15.19-R2');
 assert.equal(r.status,'VALIDATO_CONDIZIONATO');
 assert.equal(r.approval.decision,'APPROVATO_CON_TRE_MODIFICHE_ESPLICITE');
 assert.equal(r.approval.approvedOn,'2026-11-09');
 assert.deepEqual([...r.applicability.allowedFilterTypes],['spugna','misto']);
 assert.equal(r.applicability.skipForPaperOnly,true);
 assert.equal(r.applicability.requiresApprovedFilterEvaluationStep,'RASA-OP-03-P02');
 assert.equal(r.applicability.foamMustBeReusableAndWashable,true);
 assert.equal(r.applicability.useAirFilterSpecificCleaner,true);
 assert.equal(r.applicability.squeezeDuringImmersion,true);
 assert.equal(r.applicability.avoidTwisting,true);
 assert.equal(r.applicability.rinseThoroughly,true);
 assert.equal(r.applicability.dryCompletelyBeforeOiling,true);
 assert.equal(r.applicability.paperElementMustStayDryInMixedFilter,true);
 assert.equal(r.applicability.solventsProhibited,true);
 assert.equal(r.applicability.oilingHandledByStepId,'RASA-OP-03-P05');
 assert.match(r.content.instruction,/detergente specifico per filtri aria/);
 assert.match(r.content.instruction,/Durante l'immersione comprimila ripetutamente/);
 assert.match(r.content.instruction,/gasolio, benzine o idrocarburi come detergente è sconsigliato/);
 assert.ok(r.content.instruction.includes("L'utilizzo di solventi (diluente/acetone/...) è assolutamente vietato"));
 assert.doesNotMatch(r.content.instruction,/detergente liquido delicato/);
 assert.match(r.content.instruction,/L'eventuale oliatura viene gestita nel passaggio successivo/);
 assert.match(r.content.stopCondition,/registra l'anomalia e sospendi il trattamento/);
 assert.match(r.content.stopCondition,/Non avviare il motore/);
 assert.equal(r.applicability.universalAuthorization,false);
 assert.equal(r.aiUseAllowed,false);
 const state=m.canonicalKnowledgeStatus();
 assert.equal(state.version,'15.20.0');
 assert.equal(state.validatedSteps,19);
 assert.equal(state.conditionalValidatedSteps,19);
 assert.equal(state.pendingSteps,34);
 assert.equal(state.latestReviewedStepId,'RASA-OP-03-P05');
 assert.equal(state.aiEnabled,false);
 assert.equal(state.canGenerate,false);
 assert.equal(state.readyForTechnicalAnswers,false);
});

test('15.19 fails closed on filter type, cleaner, solvent, washability, dry-before-oiling and stop guard tampering',async()=>{
 const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
 for(const edit of [
  rs=>rs[17].applicability.allowedFilterTypes=['carta','misto'],
  rs=>rs[17].applicability.skipForPaperOnly=false,
  rs=>rs[17].applicability.foamMustBeReusableAndWashable=false,
  rs=>rs[17].applicability.useAirFilterSpecificCleaner=false,
  rs=>rs[17].applicability.squeezeDuringImmersion=false,
  rs=>rs[17].applicability.avoidTwisting=false,
  rs=>rs[17].applicability.dryCompletelyBeforeOiling=false,
  rs=>rs[17].applicability.paperElementMustStayDryInMixedFilter=false,
  rs=>rs[17].applicability.solventsProhibited=false,
  rs=>rs[17].applicability.noEngineStartWithoutSuitableCorrectlyTreatedAndInstalledFilter=false,
  rs=>rs[17].content.instruction='Usa solvente per la spugna',
  rs=>rs[17].content.stopCondition='',
  rs=>rs[17].aiUseAllowed=true,
  rs=>rs.push({...rs[17],stepId:'RASA-OP-03-P05'})
 ]){
  const candidate=JSON.parse(JSON.stringify(REVIEW_LEDGER));
  edit(candidate);
  assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE,candidate).ok,false);
 }
});


test('15.20 expert-approved R3 oils foam-only and skips oiling the standard paper-plus-foam prefilter',async()=>{
 const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
 assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE).ok,true);
 const r=REVIEW_LEDGER[18];
 assert.equal(r.stepId,'RASA-OP-03-P05');
 assert.equal(r.revision,'F15.20-R3');
 assert.equal(r.status,'VALIDATO_CONDIZIONATO');
 assert.equal(r.approval.decision,'APPROVATO_DOPO_REVISIONE_R3');
 assert.equal(r.approval.approvedOn,'2026-11-09');
 assert.equal(r.applicability.requiresApprovedFilterAssessmentStep,'RASA-OP-03-P02');
 assert.equal(r.applicability.requiresApprovedFoamWashingStepIfPerformed,'RASA-OP-03-P04');
 assert.deepEqual([...r.applicability.allowedFilterTypes],['spugna','misto']);
 assert.equal(r.applicability.skipForPaperOnly,true);
 assert.equal(r.applicability.oilFoamOnlyFilter,true);
 assert.equal(r.applicability.noPrefilterOilingInStandardApp,true);
 assert.equal(r.applicability.modelSpecificExceptionOnlyWithOperatorPriorKnowledge,true);
 assert.equal(r.applicability.unknownConfigurationMustNotBeGuessed,true);
 assert.equal(r.applicability.foamMustBeCompletelyDryAfterWashing,true);
 assert.equal(r.applicability.allowAirFilterOilSpray,true);
 assert.equal(r.applicability.allowNewCleanMotorOil,true);
 assert.equal(r.applicability.distributeOilByGentleCompression,true);
 assert.equal(r.applicability.avoidTwisting,true);
 assert.equal(r.applicability.removeExcessOil,true);
 assert.equal(r.applicability.noAccumulationOrDrips,true);
 assert.equal(r.applicability.keepPreparedFilterProtected,true);
 assert.equal(r.applicability.stopIfRequiredOilUnavailable,true);
 assert.equal(r.applicability.noEngineStartWithoutCorrectlyTreatedAndReassembledFilter,true);
 assert.ok(r.content.instruction.includes("Filtro in sola spugna: eseguire l'oliatura"));
 assert.ok(r.content.instruction.includes("Prefiltro in spugna abbinato a filtro in carta: non oliare nella procedura standard dell'app"));
 assert.ok(r.content.instruction.includes("conoscenza tecnica pregressa dell'operatore"));
 assert.ok(r.content.instruction.includes('olio spray specifico per filtri aria'));
 assert.ok(r.content.instruction.includes('olio motore nuovo e pulito'));
 assert.ok(r.content.instruction.includes('senza torcerla'));
 assert.ok(r.content.instruction.includes('accumuli o gocciolamenti'));
 assert.ok(r.content.stopCondition.includes("registra l'anomalia"));
 assert.ok(r.content.stopCondition.includes('Non avviare il motore'));
 assert.equal(r.applicability.universalAuthorization,false);
 assert.equal(r.aiUseAllowed,false);
 const state=m.canonicalKnowledgeStatus();
 assert.equal(state.version,'15.20.0');
 assert.equal(state.stepCount,53);
 assert.equal(state.validatedSteps,19);
 assert.equal(state.conditionalValidatedSteps,19);
 assert.equal(state.pendingSteps,34);
 assert.equal(state.latestReviewedStepId,'RASA-OP-03-P05');
 assert.equal(state.readyForTechnicalAnswers,false);
 assert.equal(state.aiEnabled,false);
 assert.equal(state.canGenerate,false);
});

test('15.20 fail-closed on prefilter oiling, guessed models, dirty oil or unauthorized AI use',async()=>{
 const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
 for(const edit of [
  rs=>rs[18].applicability.skipForPaperOnly=false,
  rs=>rs[18].applicability.oilFoamOnlyFilter=false,
  rs=>rs[18].applicability.noPrefilterOilingInStandardApp=false,
  rs=>rs[18].applicability.modelSpecificExceptionOnlyWithOperatorPriorKnowledge=false,
  rs=>rs[18].applicability.unknownConfigurationMustNotBeGuessed=false,
  rs=>rs[18].applicability.foamMustBeCompletelyDryAfterWashing=false,
  rs=>rs[18].applicability.allowAirFilterOilSpray=false,
  rs=>rs[18].applicability.allowNewCleanMotorOil=false,
  rs=>rs[18].applicability.removeExcessOil=false,
  rs=>rs[18].applicability.stopIfRequiredOilUnavailable=false,
  rs=>rs[18].applicability.noEngineStartWithoutCorrectlyTreatedAndReassembledFilter=false,
  rs=>rs[18].content.instruction='Olia il prefiltro misto con olio usato',
  rs=>rs[18].content.stopCondition='',
  rs=>rs[18].aiUseAllowed=true,
  rs=>rs.push({...rs[18],stepId:'RASA-OP-03-P06'})
 ]){
  const candidate=JSON.parse(JSON.stringify(REVIEW_LEDGER));
  edit(candidate);
  assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE,candidate).ok,false);
 }
});
