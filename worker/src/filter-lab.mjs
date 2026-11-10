/*
 * M3 (staging only) — filter-air lab, deterministic retrieval of APPROVED texts.
 * Not an AI/LLM, not a public API, not authorization for actual maintenance.
 * Only seven specific reviewed steps from Operation 03; no state mutations.
 */
import {REVIEW_LEDGER,auditReviewLedger} from './review-ledger.mjs';
import {CANONICAL_KNOWLEDGE,auditCanonicalKnowledge} from './canonical-knowledge.mjs';
import {evaluateSafety} from './policy.mjs';

export const FILTER_LAB_OPERATION_ID=3;
export const FILTER_LAB_STEPS=Object.freeze([
  'RASA-OP-03-P01','RASA-OP-03-P02','RASA-OP-03-P03',
  'RASA-OP-03-P04','RASA-OP-03-P05','RASA-OP-03-P06','RASA-OP-03-P07'
]);
const types=new Set(['carta','spugna','misto']);
const STOP_MESSAGE='Non registrare questo passaggio come completato: sospendi la lavorazione e segnala il problema.';
const norm=value=>String(value).toLocaleLowerCase('it-IT').normalize('NFD')
  .replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
function reviewed(id){
  const r=REVIEW_LEDGER.find(x=>x.stepId===id);
  if(!r || r.status!=='VALIDATO_CONDIZIONATO' ||
     r.approval?.reviewerRole!=='esperto_di_dominio' ||
     r.aiUseAllowed!==false ||
     typeof r.content?.instruction!=='string' ||
     typeof r.content?.stopCondition!=='string')return null;
  return r;
}
export function filterLabReady(){
  return auditCanonicalKnowledge().ok &&
    auditReviewLedger(CANONICAL_KNOWLEDGE).ok &&
    FILTER_LAB_STEPS.every(id=>reviewed(id)!==null);
}
export function applicableFilterSteps(filterType){
  if(!types.has(filterType))return FILTER_LAB_STEPS.slice(0,1);
  return FILTER_LAB_STEPS.filter(id=>{
    if(id==='RASA-OP-03-P03')return filterType!=='spugna';
    if(id==='RASA-OP-03-P04')return filterType!=='carta';
    // In the validated standard workflow, only foam-only is oiled.
    if(id==='RASA-OP-03-P05')return filterType==='spugna';
    return true;
  });
}
export function filterLabAnswer(payload){
  if(!filterLabReady())return {ok:false,decision:'KNOWLEDGE_INVALID',httpStatus:503,
    message:'La base di conoscenza non ha superato i controlli di integrità.'};
  if(!payload || typeof payload!=='object' || Array.isArray(payload) ||
    Object.keys(payload).some(k=>!['stepId','filterType','question'].includes(k)) ||
    !FILTER_LAB_STEPS.includes(payload.stepId) ||
    typeof payload.question!=='string' || payload.question.length>450 ||
    /[\u0000-\u001f]/.test(payload.question) ||
    (payload.filterType!==null && payload.filterType!==undefined && !types.has(payload.filterType)))
    return {ok:false,decision:'INVALID_INPUT',httpStatus:400,
      message:'Richiesta non valida; seleziona un passaggio della procedura filtro aria.'};
  const q=norm(payload.question);
  if(!q)return {ok:false,decision:'INVALID_INPUT',httpStatus:400,message:'Scrivi una domanda o usa «Mostra passaggio».'};
  const id=payload.stepId, type=payload.filterType??null;
  const base={operationId:FILTER_LAB_OPERATION_ID,stepId:id,filterType:type,
    aiEnabled:false,canGenerate:false,sessionChanged:false,
    sourceKind:'human_reviewed_knowledge',mode:'deterministic_lab'};
  const policy=evaluateSafety(payload.question);
  if(['SAFETY_STOP','COMMAND','MODEL_REQUIRED','OUT_OF_SCOPE'].includes(policy.decision))
    return {...base,ok:false,decision:policy.decision,httpStatus:200,message:policy.message,
      allowCompletion:false,references:[]};
  // This prototype is conservative: it does not infer operator competence or
  // whether a physical condition is safe from a chat message.
  if(/\b(non riesco|non si apre|non si chiude|bloccato|incastrato|rotto|rotta|rotte|rotti|danneggiato|danneggiata|crepato|crepata|lacerato|lacerata|friabile|si sbriciola|perdita|fumo|schiacciato)\b/.test(q)){
    return {...base,ok:false,decision:'OPERATOR_STOP',httpStatus:200,
      message:STOP_MESSAGE,allowCompletion:false,references:[]};
  }
  // A keyword-only laboratory must not answer unrelated prompts by returning
  // an arbitrary technical step. "Show current step" is an explicit exception.
  const inScope=/\b(filtro|filtrante|filtri|aria|coperchio|scatola|spugna|carta|prefiltro|carburatore|puliz|lavare|lavaggio|asciug|olio|oliare|oliatura|rimont|sostitu|sporco|sporchi|polvere|sede|motore|guarnizion|passaggio|procedura|aprire|apertura|chiudere|chiusura|soffiare|compressa)\w*\b/.test(q);
  if(!inScope)return {...base,ok:false,decision:'QUESTION_NOT_COVERED',httpStatus:200,
    message:'Non trovo una risposta verificabile per questa domanda nella procedura del filtro aria. Nessuna istruzione aggiuntiva viene fornita.',
    allowCompletion:false,references:[]};
  if(id!=='RASA-OP-03-P01' && !types.has(type))
    return {...base,ok:false,decision:'FILTER_TYPE_REQUIRED',httpStatus:200,
      message:'Indica prima se il filtro è in carta, in spugna o misto. Se non riesci a identificarlo, non procedere.',
      allowCompletion:false,references:[]};
  if(types.has(type)&&!applicableFilterSteps(type).includes(id))
    return {...base,ok:false,decision:'NOT_APPLICABLE',httpStatus:200,
      message:'Passaggio non applicabile al tipo di filtro selezionato nella procedura standard.',
      allowCompletion:false,references:[]};
  const entry=reviewed(id);
  if(!entry)return {...base,ok:false,decision:'KNOWLEDGE_INVALID',httpStatus:503,
    message:'Revisione non disponibile.',allowCompletion:false,references:[]};
  // No model-specific amounts, guessed diagnosis, conditional authorization, or
  // LLM paraphrase. The exact reviewed source is returned to a human tester.
  return {...base,ok:true,decision:'REVIEWED_STEP',httpStatus:200,
    message:'Testo tecnico approvato per il passaggio selezionato. Verifica sul modello reale prima di operare.',
    title:entry.content.title,instruction:entry.content.instruction,
    stopCondition:entry.content.stopCondition,
    requiresOperatorVerification:true,allowCompletion:false,
    references:[{stepId:id,revision:entry.revision,status:entry.status}]};
}
