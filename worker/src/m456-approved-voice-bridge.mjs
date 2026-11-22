/*
 * M4.5.6 — FIRST STAGING VERTICAL SLICE: PWA voice -> guarded Worker ->
 * expert-approved short answer. Absolutely no LLM, state mutation or public API.
 * The existing M4.5.2 evidence mapper verifies the original question and KB.
 * This is a narrow end-to-end transport test, NOT general language understanding.
 */
import {mapBoundedParaphraseToReviewedEvidence} from './m454-bounded-paraphrases.mjs';
import {filterLabAnswer} from './filter-lab.mjs';

const STAGING='https://tagliando-ai-staging.maico-gua.workers.dev';
const APPROVED='No. Il filtro in carta non deve essere lavato né oliato.';
const REF={stepId:'RASA-OP-03-P03',revision:'F15.18-R2'};
const SAFE=Object.freeze({
  aiEnabled:false,canGenerate:false,modelRequests:0,sessionChanged:false,
  allowCompletion:false,maySendToModel:false,authorizesMaintenance:false,
  requiresOperatorVerification:true
});
const HEADERS={
  'Content-Type':'application/json; charset=utf-8',
  'Cache-Control':'no-store, max-age=0',
  'X-Content-Type-Options':'nosniff',
  'Referrer-Policy':'no-referrer',
  'X-Robots-Tag':'noindex, nofollow',
  'Vary':'Origin'
};
const normalize=s=>s.toLocaleLowerCase('it-IT').normalize('NFD')
  .replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ')
  .replace(/\s+/g,' ').trim();
const allowed=new Set([
  normalize('Posso lavare il filtro in carta?'),
  normalize('Il filtro in carta si può lavare?'),
  normalize('Posso lavare filtro in carta?') // Speech transcription often drops articles.
]);
const plain=v=>v!==null && typeof v==='object' && !Array.isArray(v) &&
 (Object.getPrototypeOf(v)===Object.prototype || Object.getPrototypeOf(v)===null);
const deny=(decision,message)=>({
  ...SAFE,ok:false,decision,message,answer:null,source:null
});

/* Contract accepts only the current visible PWA state, never a client-supplied
 * revision, technical source, safety permission, or AI setting. Browser state
 * is informational, NOT authoritative evidence of physical maintenance.
 */
export function previewApprovedVoiceReply(input) {
  if(!plain(input) ||
    Object.keys(input).sort().join(',')!=='currentStep,filterType,operationId,question' ||
    input.operationId!==3 || input.currentStep!=='Trattamento carta' ||
    input.filterType!=='carta' || typeof input.question!=='string' ||
    input.question.length===0 || input.question.length>450 ||
    /[\u0000-\u001f\u007f]/u.test(input.question))
    return deny('INVALID_CONTEXT','Questa prova è disponibile soltanto su Operazione 3, passaggio Trattamento carta, filtro in carta.');

  // Mandatory safety preflight on the ORIGINAL unsanitized voice transcript.
  // The alias below is an EXACT single-intent exception, not fuzzy matching;
  // it must never hide a hazard, command or additional request.
  const originalCheck=filterLabAnswer({
    stepId:'RASA-OP-03-P01',filterType:null,question:input.question
  });
  if(!originalCheck.ok || originalCheck.decision!=='REVIEWED_STEP')
    return deny(originalCheck.decision||'EVIDENCE_UNAVAILABLE',
      originalCheck.message||'Domanda non verificabile.');
  const key=normalize(input.question);
  // The approved wording is unchanged. Only a missing-article ASR variant
  // is forwarded to the existing exact, provenance-checked mapper.
  const mappedQuestion=key===normalize('Posso lavare filtro in carta?')
    ? 'Posso lavare il filtro in carta?' : input.question;
  const evidence=mapBoundedParaphraseToReviewedEvidence({
    machineFamily:'rasaerba_a_benzina',operationId:3,
    filterType:input.filterType,question:mappedQuestion
  });
  if(!evidence.ok || evidence.decision!=='QUESTION_MAPPED_TO_REVIEWED_EVIDENCE')
    return deny(evidence.decision||'EVIDENCE_UNAVAILABLE',
      evidence.message||'Non ho una risposta verificata per questa domanda.');

  // Crucial: mapping P03_PAPER is wider than the ONE approved answer intent.
  // Never answer "Come pulisco il filtro in carta?" with the wash prohibition.
  if(!allowed.has(key))
    return deny('ANSWER_INTENT_NOT_REVIEWED','Non ho una risposta breve approvata per questa formulazione.');

  if(evidence.mappingId!=='P03_PAPER' ||
    evidence.source?.stepId!==REF.stepId ||
    evidence.source?.revision!==REF.revision ||
    evidence.source?.aiUseAllowed!==false ||
    evidence.maySendToModel!==false ||
    evidence.canGenerate!==false ||
    evidence.allowCompletion!==false ||
    evidence.sessionChanged!==false ||
    evidence.content?.instruction?.includes('Non lavare né oliare i filtri in carta.')!==true ||
    typeof evidence.content.stopCondition!=='string' ||
    !evidence.content.stopCondition.includes('non avviare il motore'))
    return deny('EVIDENCE_INTEGRITY_FAILED','La fonte revisionata non corrisponde al testo approvato.');

  return {
    ...SAFE,ok:true,decision:'STAGING_APPROVED_REPLY',answer:APPROVED,
    source:{...REF,status:'EXPERT_APPROVED_TEXT_ONLY'},
    message:'Anteprima vocale di collaudo: non autorizza manutenzione o avanzamento.'
  };
}
const json=(status,v)=>new Response(JSON.stringify(v),{status,headers:HEADERS});
const error=(status,decision,message)=>json(status,deny(decision,message));

async function boundedBody(request) {
  if(!/^application\/json(?:\s*;.*)?$/i.test(request.headers.get('content-type')||''))
    return {error:'UNSUPPORTED_CONTENT_TYPE',httpStatus:415};
  const len=Number(request.headers.get('content-length'));
  if(Number.isFinite(len)&&len>1400)return {error:'BODY_TOO_LARGE',httpStatus:413};
  const reader=request.body?.getReader();
  if(!reader)return {error:'BAD_BODY',httpStatus:400};
  const chunks=[];let total=0;
  try{
    while(true){
      const {done,value}=await reader.read();
      if(done)break;
      total+=value.byteLength;
      if(total>1400){await reader.cancel();return {error:'BODY_TOO_LARGE',httpStatus:413};}
      chunks.push(value);
    }
    const b=new Uint8Array(total);let n=0;
    for(const c of chunks){b.set(c,n);n+=c.length;}
    return {input:JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(b))};
  }catch(_){return {error:'BAD_BODY',httpStatus:400};}
  finally{try{reader.releaseLock();}catch(_){}}
}

/* Staging route is NEVER available outside Access guarded environment.
 * Only one reviewed, previously expert-approved text can be spoken.
 */
export async function serveApprovedVoiceBridge(request,env,ctx,verifyAccess) {
  if(request.method!=='POST')return error(405,'METHOD_NOT_ALLOWED','Metodo non consentito.');
  if(env?.SERVICE_MODE!=='guarded')return error(503,'SERVICE_DISABLED','Laboratorio disabilitato.');
  const url=new URL(request.url);
  if(url.origin!==STAGING || env.SELF_TEST_ORIGIN!==STAGING ||
    request.headers.get('origin')!==STAGING)
    return error(403,'ORIGIN_DENIED','Origine non autorizzata.');
  let actor;
  try{actor=await verifyAccess(request,env,ctx,true);}
  catch(_){return error(401,'UNAUTHORIZED','Access non verificato.');}
  if(typeof actor?.sub!=='string'||actor.sub.length===0)
    return error(401,'UNAUTHORIZED','Identità Access non disponibile.');
  if(!env.API_LIMITER||typeof env.API_LIMITER.limit!=='function')
    return error(503,'RATE_LIMITER_REQUIRED','Limite richieste non configurato.');
  let limited;
  try{limited=await env.API_LIMITER.limit({key:'voicebridge:'+actor.sub});}
  catch(_){return error(503,'RATE_LIMITER_UNAVAILABLE','Limite richieste non disponibile.');}
  if(limited?.success!==true)return error(429,'RATE_LIMITED','Troppe richieste.');
  const body=await boundedBody(request);
  if(body.error)return error(body.httpStatus,body.error,'Corpo della richiesta non valido.');
  const result=previewApprovedVoiceReply(body.input);
  return json(result.decision==='INVALID_CONTEXT'?400:200,result);
}
