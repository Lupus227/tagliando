/*
 * M4.1 — offline contract for an eventual conversational model.
 *
 * This file is NOT connected to a Worker route or an AI provider. It cannot
 * authorize model input, change execution state, or complete a maintenance step.
 *
 * Key security boundary: a proposed model output is an UNTRUSTED selector.
 * Only the server may assemble technical output from the current reviewed
 * ledger; generated technical prose is never forwarded to an operator.
 */
import {filterLabAnswer,filterLabReady,FILTER_LAB_STEPS} from './filter-lab.mjs';

export const M4_CONTRACT_VERSION='tagliando.m4.read-only.v1';
const MAX_QUESTION_CHARS=450;
const SOURCE_ACTION='SHOW_REVIEWED_STEP';
const FILTER_TYPES=new Set(['carta','spugna','misto']);
const BASE=Object.freeze({
  contract:M4_CONTRACT_VERSION,
  aiEnabled:false,
  canGenerate:false,
  modelInputAllowed:false,
  allowCompletion:false,
  sessionChanged:false,
  modelRequests:0
});

function deny(decision,message){
  return {...BASE,ok:false,decision,message,references:[]};
}
function record(value){
  return value!==null && typeof value==='object' && !Array.isArray(value) &&
    (Object.getPrototypeOf(value)===Object.prototype || Object.getPrototypeOf(value)===null);
}
function exactKeys(value,allowed,required){
  if(!record(value))return false;
  const keys=Object.keys(value);
  return keys.every(key=>allowed.includes(key)) && required.every(key=>keys.includes(key));
}
function modelTampering(question){
  // Defense in depth only; never rely on textual matching as an authorization.
  return /\b(?:ignora|aggira|disattiva|sovrascrivi|eludi)\b.{0,90}\b(?:istruzion\w*|regol\w*|sicurezz\w*|controll\w*|policy|vincol\w*)\b/i.test(question) ||
    /\b(?:system\s*:|developer\s*:|override\s+(?:safety|policy)|ignore\s+(?:previous|all)\s+instructions)\b/i.test(question);
}
function trustworthyLabState(state,input){
  // This argument must be assembled by server-side code, never taken from JSON.
  // READ_ONLY_LAB is NOT a certification of an actual maintenance state.
  return exactKeys(state,
    ['mode','operationId','stepId','filterType','blocked'],
    ['mode','operationId','stepId','filterType','blocked']) &&
    state.mode==='READ_ONLY_LAB' && state.blocked===false &&
    state.operationId===3 && state.operationId===input.operationId &&
    state.stepId===input.stepId && state.filterType===input.filterType;
}
function validQuestion(q){
  return typeof q==='string' && Boolean(q.trim()) &&
    q.length<=MAX_QUESTION_CHARS && !/[\u0000-\u001f\u007f]/.test(q);
}
function preflightInput(input,state){
  if(!exactKeys(input,
    ['operationId','stepId','filterType','question'],
    ['operationId','stepId','filterType','question']) ||
    input.operationId!==3 ||
    typeof input.stepId!=='string' || !FILTER_LAB_STEPS.includes(input.stepId) ||
    (input.filterType!==null && !FILTER_TYPES.has(input.filterType)) ||
    !validQuestion(input.question))
    return deny('INVALID_INPUT','Richiesta non valida per il contratto M4.');
  if(!trustworthyLabState(state,input))
    return deny('CONTROLLER_STATE_MISMATCH','Stato del laboratorio non verificabile: nessun avanzamento.');
  if(modelTampering(input.question))
    return deny('INSTRUCTION_OVERRIDE_ATTEMPT','La domanda tenta di modificare le regole del laboratorio.');
  return null;
}

/*
 * Prepare a context ONLY for local, non-generative contract tests.
 * The ledger currently has aiUseAllowed=false, so a future model must NOT
 * receive these texts until a separate explicit authorization is implemented.
 */
export function prepareM4Turn(input,serverState){
  const rejected=preflightInput(input,serverState);
  if(rejected)return rejected;
  if(!filterLabReady())
    return deny('KNOWLEDGE_INVALID','La Knowledge Base non ha superato i controlli.');
  const extracted=filterLabAnswer({
    stepId:input.stepId,filterType:input.filterType,question:input.question
  });
  if(!extracted.ok || extracted.decision!=='REVIEWED_STEP')
    return deny(extracted.decision||'NOT_COVERED',
      extracted.message||'Nessuna risposta autorizzata per questa domanda.');
  const [reference]=extracted.references||[];
  if(extracted.references?.length!==1 || !reference ||
    reference.stepId!==input.stepId ||
    reference.status!=='VALIDATO_CONDIZIONATO' ||
    extracted.mode!=='deterministic_lab' ||
    extracted.aiEnabled!==false || extracted.canGenerate!==false ||
    extracted.allowCompletion!==false ||
    extracted.requiresOperatorVerification!==true)
    return deny('KNOWLEDGE_INVALID','Fonte tecnica non verificabile.');
  return {...BASE,ok:true,decision:'DRY_RUN_CONTEXT_READY',
    operationId:3,stepId:input.stepId,filterType:input.filterType,
    question:input.question,
    source:{stepId:reference.stepId,revision:reference.revision},
    references:[{stepId:reference.stepId,revision:reference.revision}],
    message:'Contesto di sola prova pronto. Nessuna chiamata a modelli AI è autorizzata.'};
}

/*
 * Treat candidate as if it were an untrusted model proposal. Do not accept
 * candidate.text, candidate.instructions, commands, or completion flags.
 * Fetch the approved technical text AGAIN from the current server ledger.
 */
export function reviewM4Candidate(prepared,candidate,serverState){
  if(!record(prepared) || prepared.contract!==M4_CONTRACT_VERSION ||
    prepared.decision!=='DRY_RUN_CONTEXT_READY' || prepared.ok!==true ||
    prepared.modelInputAllowed!==false ||
    prepared.aiEnabled!==false || prepared.canGenerate!==false ||
    prepared.allowCompletion!==false || prepared.sessionChanged!==false)
    return deny('CONTEXT_NOT_READY','Non esiste un contesto di prova valido.');
  const fresh=prepareM4Turn({
    operationId:prepared.operationId,stepId:prepared.stepId,
    filterType:prepared.filterType,question:prepared.question
  },serverState);
  if(!fresh.ok || !record(prepared.source) ||
     prepared.source.stepId!==fresh.source.stepId ||
     prepared.source.revision!==fresh.source.revision)
    return deny('CONTEXT_CHANGED','Il contesto è cambiato: nessuna risposta autorizzata.');
  if(!record(candidate) || typeof candidate.action!=='string')
    return deny('MODEL_OUTPUT_REJECTED','Risposta non conforme al contratto.');
  if(candidate.action==='ABSTAIN' && exactKeys(candidate,['action'],['action']))
    return deny('NO_SUPPORTED_ANSWER','Non dispongo di una risposta autorizzata per questa domanda.');
  if(candidate.action!==SOURCE_ACTION ||
    !exactKeys(candidate,['action','sourceStepId','sourceRevision'],
      ['action','sourceStepId','sourceRevision']) ||
    candidate.sourceStepId!==fresh.source.stepId ||
    candidate.sourceRevision!==fresh.source.revision)
    return deny('MODEL_OUTPUT_REJECTED','Risposta non conforme alle fonti autorizzate.');
  const reviewed=filterLabAnswer({
    stepId:fresh.stepId,filterType:fresh.filterType,
    question:fresh.question
  });
  if(!reviewed.ok || reviewed.decision!=='REVIEWED_STEP' ||
    reviewed.references?.[0]?.stepId!==fresh.source.stepId ||
    reviewed.references?.[0]?.revision!==fresh.source.revision ||
    typeof reviewed.instruction!=='string' ||
    typeof reviewed.stopCondition!=='string')
    return deny('KNOWLEDGE_CHANGED','Le istruzioni approvate non sono più disponibili.');
  return {...BASE,ok:true,decision:'REVIEWED_SOURCE_DRY_RUN',
    message:'Estratto approvato per il passaggio corrente. Non certifica una lavorazione.',
    title:reviewed.title,
    instruction:reviewed.instruction,
    stopCondition:reviewed.stopCondition,
    requiresOperatorVerification:true,
    references:[{stepId:fresh.source.stepId,revision:fresh.source.revision}]};
}
