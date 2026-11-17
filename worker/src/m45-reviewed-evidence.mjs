/*
 * M4.5.1 — Offline-only, human-reviewed evidence contract.
 *
 * This module is intentionally NOT imported by the Worker router and must NOT
 * be exposed to an AI model or public endpoint.
 * The seven OP03 steps remain VALIDATO_CONDIZIONATO with aiUseAllowed:false.
 *
 * It can present the exact approved revision to a human reviewer, NOT answer
 * arbitrary questions, authorize physical actions or update session state.
 */
import {filterLabAnswer,FILTER_LAB_STEPS} from './filter-lab.mjs';
import {REVIEW_LEDGER,auditReviewLedger} from './review-ledger.mjs';
import {CANONICAL_KNOWLEDGE,auditCanonicalKnowledge} from './canonical-knowledge.mjs';

export const M45_EVIDENCE_SCOPE=Object.freeze({
  machineFamily:'rasaerba_a_benzina',
  operationId:3,
  purpose:'offline_human_review_only',
  maySendToModel:false
});

const SAFE=Object.freeze({
  aiEnabled:false,
  canGenerate:false,
  modelRequests:0,
  allowCompletion:false,
  sessionChanged:false,
  maySendToModel:false,
  authorizesMaintenance:false,
  requiresOperatorVerification:true
});
const deny=(decision,message)=>({
  ...SAFE,ok:false,decision,message,source:null,content:null
});
const plain=value=>value!==null&&typeof value==='object'&&!Array.isArray(value)&&
  (Object.getPrototypeOf(value)===Object.prototype||Object.getPrototypeOf(value)===null);
const normalize=s=>s.toLocaleLowerCase('it-IT').normalize('NFD')
  .replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
const explicitReadIntent=q=>/^(mostra|leggi|visualizza|ripeti) (il |questo )?passaggio( attuale| corrente)?$/.test(normalize(q));

/**
 * Strict entry point for a source preview, not a conversational answer.
 * Each property must be supplied; client-provided authority or source text
 * is rejected. The M3 filter lab remains the sole owner of applicable steps,
 * safety stops and machine-specific blocking decisions.
 */
export function getReviewedEvidence(input){
  if(!plain(input) ||
     Object.keys(input).sort().join(',')!=='filterType,machineFamily,operationId,question,stepId' ||
     input.machineFamily!==M45_EVIDENCE_SCOPE.machineFamily ||
     input.operationId!==M45_EVIDENCE_SCOPE.operationId ||
     !FILTER_LAB_STEPS.includes(input.stepId) ||
     typeof input.question!=='string' ||
     !['carta','spugna','misto',null].includes(input.filterType))
    return deny('INVALID_INPUT','Richiesta di consultazione non valida.');

  // M3 enforces source audits, step/filter applicability and operator stops.
  const result=filterLabAnswer({
    stepId:input.stepId,filterType:input.filterType,question:input.question
  });
  if(result.decision!=='REVIEWED_STEP' || result.ok!==true)
    return deny(result.decision||'EVIDENCE_UNAVAILABLE',
      result.message||'Nessuna evidenza utilizzabile.');

  // Keyword matching in M3 is NOT semantic question answering.
  // Only an explicit "show the step" intent is allowed here.
  if(!explicitReadIntent(input.question))
    return deny('QUESTION_NOT_MAPPED',
      'Non posso collegare con certezza la domanda a una risposta verificata. Posso solo mostrare il passaggio revisionato.');

  if(!auditCanonicalKnowledge().ok || !auditReviewLedger(CANONICAL_KNOWLEDGE).ok)
    return deny('KNOWLEDGE_INVALID','Integrità della Knowledge Base non verificata.');

  const entry=REVIEW_LEDGER.find(r=>r.stepId===input.stepId);
  const ref=result.references?.[0];
  if(!entry || entry.status!=='VALIDATO_CONDIZIONATO' ||
     entry.aiUseAllowed!==false ||
     entry.approval?.reviewerRole!=='esperto_di_dominio' ||
     !ref || result.references.length!==1 ||
     ref.stepId!==entry.stepId || ref.revision!==entry.revision ||
     ref.status!==entry.status ||
     result.title!==entry.content?.title ||
     result.instruction!==entry.content?.instruction ||
     result.stopCondition!==entry.content?.stopCondition)
    return deny('EVIDENCE_INTEGRITY_FAILED','Fonte o autorizzazione non verificabile.');

  return {
    ...SAFE,ok:true,decision:'REVIEWED_EVIDENCE_ONLY',
    message:'Testo revisionato mostrato integralmente per verifica umana; non costituisce un’autorizzazione a procedere.',
    source:{
      machineFamily:M45_EVIDENCE_SCOPE.machineFamily,
      operationId:M45_EVIDENCE_SCOPE.operationId,
      stepId:entry.stepId,revision:entry.revision,
      status:entry.status,scope:entry.scope,
      filterType:input.filterType,
      aiUseAllowed:false
    },
    content:{
      title:entry.content.title,
      instruction:entry.content.instruction,
      stopCondition:entry.content.stopCondition
    }
  };
}
