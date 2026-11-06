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
  assert.equal(summary.pendingSteps,45);
  assert.equal(summary.validatedSteps,8);
  assert.equal(summary.conditionalValidatedSteps,8);
  assert.equal(summary.latestReviewedStepId,'RASA-OP-02-P02');
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
  assert.equal(json.pendingSteps,45);
  assert.equal(json.validatedSteps,8);
  assert.equal(json.conditionalValidatedSteps,8);
  assert.equal(json.latestReviewedStepId,'RASA-OP-02-P02');
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
  assert.equal(reviews.REVIEW_LEDGER.length,8);
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
  assert.equal(s.validatedSteps,8);
  assert.equal(s.readyForTechnicalAnswers,false);
  assert.equal(s.canGenerate,false);
  const payload=JSON.stringify(s);
  assert.doesNotMatch(payload,/pipetta|candela|sottoscocca|contenitore|guanti/);
});

test('15.2 approved conditional inclination is recorded verbatim and no AI use is allowed',async()=>{
 const {REVIEW_LEDGER:ledger,auditReviewLedger:audit}=await import('../worker/src/review-ledger.mjs');
 const {CANONICAL_KNOWLEDGE:kb}=await getServer();
 assert.equal(audit(kb).ok,true);
 assert.deepEqual(ledger.map(r=>r.stepId),['RASA-OP-01-P01','RASA-OP-01-P02','RASA-OP-01-P03','RASA-OP-01-P04','RASA-OP-01-P05','RASA-OP-01-P06','RASA-OP-02-P01','RASA-OP-02-P02']);
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
 assert.equal(status.pendingSteps,45);
 assert.equal(status.validatedSteps,8);
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
 assert.equal(state.version,'15.8.0');assert.equal(state.validatedSteps,8);
 assert.equal(state.pendingSteps,45);assert.equal(state.aiEnabled,false);
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
 const state=m.canonicalKnowledgeStatus();assert.equal(state.version,'15.8.0');
 assert.equal(state.pendingSteps,45);assert.equal(state.validatedSteps,8);
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
 const st=m.canonicalKnowledgeStatus();assert.equal(st.version,'15.8.0');
 assert.equal(st.validatedSteps,8);assert.equal(st.pendingSteps,45);
 assert.equal(st.aiEnabled,false);assert.equal(st.readyForTechnicalAnswers,false);
});

test('15.6 deck inspection discriminates surface rust from through-corrosion and serious damage',async()=>{
 const m=await getServer(),{REVIEW_LEDGER,auditReviewLedger}=await import('../worker/src/review-ledger.mjs');
 assert.equal(auditReviewLedger(m.CANONICAL_KNOWLEDGE).ok,true);
 assert.deepEqual(REVIEW_LEDGER.map(r=>r.stepId),[
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
 assert.equal(state.version,'15.8.0');
 assert.equal(state.pendingSteps,45);assert.equal(state.validatedSteps,8);
 assert.equal(state.conditionalValidatedSteps,8);
 assert.equal(state.latestReviewedStepId,'RASA-OP-02-P02');
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
 assert.equal(status.version,'15.7.0');
 assert.equal(status.stepCount,53);assert.equal(status.validatedSteps,8);
 assert.equal(status.pendingSteps,45);assert.equal(status.conditionalValidatedSteps,8);
 assert.equal(status.latestReviewedStepId,'RASA-OP-02-P02');
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
 assert.equal(status.version,'15.8.0');
 assert.equal(status.pendingSteps,45);assert.equal(status.validatedSteps,8);
 assert.equal(status.conditionalValidatedSteps,8);
 assert.equal(status.latestReviewedStepId,'RASA-OP-02-P02');
 assert.equal(status.readyForTechnicalAnswers,false);
 assert.equal(status.aiEnabled,false);assert.equal(status.canGenerate,false);
});
