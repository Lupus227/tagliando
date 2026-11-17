/*
 * M4.5.2 — offline controlled question-to-evidence mapping (human review ONLY).
 * No LLM, no API route, no PWA changes, no session mutation.
 * Matches ONLY exact, human-curated question patterns, not arbitrary text.
 * Technical revision texts remain aiUseAllowed:false and maySendToModel:false.
 */
import {filterLabAnswer} from './filter-lab.mjs';
import {getReviewedEvidence} from './m45-reviewed-evidence.mjs';

const FAMILY='rasaerba_a_benzina',OPERATION=3,PRECHECK_STEP='RASA-OP-03-P01';
const SAFE=Object.freeze({
  aiEnabled:false,canGenerate:false,modelRequests:0,
  allowCompletion:false,sessionChanged:false,maySendToModel:false,
  authorizesMaintenance:false,requiresOperatorVerification:true
});
const deny=(decision,message)=>({
  ...SAFE,ok:false,decision,message,
  mappingId:null,source:null,content:null
});
const plain=value=>value!==null&&typeof value==='object'&&!Array.isArray(value)&&
  (Object.getPrototypeOf(value)===Object.prototype||Object.getPrototypeOf(value)===null);
const normalized=s=>s.toLocaleLowerCase('it-IT').normalize('NFD')
  .replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ')
  .replace(/\s+/g,' ').trim();

// Explicitly curated phrases: a mapping means "show THIS approved step to a
// human reviewer", NOT "this question is answered" or "proceed with service".
const QUESTION_CATALOG=Object.freeze([
  {id:'P01_OPEN',stepId:'RASA-OP-03-P01',material:null,questions:[
    'Come apro il coperchio del filtro aria?',
    'Come si apre il coperchio del filtro aria?'
  ]},
  {id:'P02_ASSESS',stepId:'RASA-OP-03-P02',material:null,questions:[
    'Come controllo lo stato del filtro aria?',
    'Come valuto il filtro aria?'
  ]},
  {id:'P03_PAPER',stepId:'RASA-OP-03-P03',material:'carta',questions:[
    'Posso lavare il filtro in carta?',
    'Come pulisco il filtro in carta?',
    'Devo oliare il filtro in carta?'
  ]},
  {id:'P04_WASH_FOAM',stepId:'RASA-OP-03-P04',material:'spugna',questions:[
    'Come lavo il filtro in spugna?',
    'Come si lava il filtro in spugna?'
  ]},
  {id:'P05_OIL_FOAM',stepId:'RASA-OP-03-P05',material:'spugna',questions:[
    'Come si olia il filtro in spugna?',
    'Devo oliare il filtro in spugna?'
  ]},
  {id:'P05_MIXED_PREFILTER',stepId:'RASA-OP-03-P05',material:'misto',questions:[
    'Devo oliare il prefiltro in spugna?',
    'Devo oliare il prefiltro misto?'
  ]},
  {id:'P06_CLEAN_HOUSING',stepId:'RASA-OP-03-P06',material:null,questions:[
    'Come pulisco la scatola del filtro aria?',
    'Come si pulisce la scatola del filtro aria?'
  ]},
  {id:'P07_REASSEMBLE',stepId:'RASA-OP-03-P07',material:null,questions:[
    'Come rimonto il filtro aria?',
    'Come si rimonta il filtro aria?'
  ]}
]);
const AMBIGUOUS=new Set([
  'Come pulisco il filtro aria?',
  'Come devo trattare il filtro aria?',
  'Cosa faccio con il filtro aria?'
].map(normalized));
const LOOKUP=new Map();
for(const entry of QUESTION_CATALOG){
  for(const phrase of entry.questions){
    const key=normalized(phrase);
    if(LOOKUP.has(key)||AMBIGUOUS.has(key))
      throw new Error('DUPLICATE_OR_AMBIGUOUS_QUESTION_MAPPING');
    LOOKUP.set(key,entry);
  }
}
export const M452_QUESTION_COUNT=LOOKUP.size;
export const M452_SCOPE=Object.freeze({
  machineFamily:FAMILY,operationId:OPERATION,
  mode:'offline_exact_question_mapping',
  maySendToModel:false
});

/**
 * Human-only evidence preview. No stepId, revision, instruction or permissions
 * may be supplied by the caller. The OP03/M3 policy processes the ORIGINAL
 * user input BEFORE any sanitized source-preview request is constructed.
 */
export function mapQuestionToReviewedEvidence(input){
  if(!plain(input)||
    Object.keys(input).sort().join(',')!=='filterType,machineFamily,operationId,question'||
    input.machineFamily!==FAMILY || input.operationId!==OPERATION ||
    ![null,'carta','spugna','misto'].includes(input.filterType) ||
    typeof input.question!=='string' ||
    input.question.trim().length===0 || input.question.length>450 ||
    /[\u0000-\u001f\u007f]/u.test(input.question))
    return deny('INVALID_INPUT','Richiesta o contesto non validi.');

  // A deterministic safety and scope preflight MUST inspect the original
  // question; the preview's fixed "Mostra passaggio" must never bypass it.
  const preflight=filterLabAnswer({
    stepId:PRECHECK_STEP,filterType:null,question:input.question
  });
  if(preflight.decision!=='REVIEWED_STEP'||preflight.ok!==true)
    return deny(preflight.decision||'EVIDENCE_UNAVAILABLE',
      preflight.message||'Richiesta non verificabile.');

  const key=normalized(input.question);
  if(AMBIGUOUS.has(key))
    return deny('QUESTION_AMBIGUOUS',
      'Domanda ambigua: per questo test occorre indicare un trattamento preciso.');

  const matched=LOOKUP.get(key);
  if(!matched)
    return deny('QUESTION_NOT_MAPPED',
      'Domanda non presente nel catalogo controllato. Non è stata selezionata alcuna risposta tecnica.');

  const type=input.filterType;
  if(matched.material==='misto' && type!==null && type!=='misto')
    return deny('FILTER_CONTEXT_MISMATCH',
      'Il contesto del filtro non corrisponde alla domanda.');
  if(matched.material==='carta' && type!==null &&
    !['carta','misto'].includes(type))
    return deny('FILTER_CONTEXT_MISMATCH',
      'Il contesto del filtro non corrisponde alla domanda.');
  if(matched.material==='spugna' && type!==null &&
    !['spugna','misto'].includes(type))
    return deny('FILTER_CONTEXT_MISMATCH',
      'Il contesto del filtro non corrisponde alla domanda.');

  // The only technical payload is an exact, independently validated M4.5.1
  // review preview. The stepId here is code-defined, NOT user-supplied.
  const preview=getReviewedEvidence({
    machineFamily:FAMILY,operationId:OPERATION,
    stepId:matched.stepId,filterType:type,question:'Mostra passaggio'
  });
  if(!preview.ok||preview.decision!=='REVIEWED_EVIDENCE_ONLY')
    return deny(preview.decision||'EVIDENCE_UNAVAILABLE',
      preview.message||'La revisione non è disponibile.');
  if(preview.source?.aiUseAllowed!==false||
     preview.source?.stepId!==matched.stepId ||
     preview.maySendToModel!==false)
    return deny('EVIDENCE_INTEGRITY_FAILED','Fonte non utilizzabile.');

  return {
    ...preview,decision:'QUESTION_MAPPED_TO_REVIEWED_EVIDENCE',
    mappingId:matched.id,mappingMethod:'exact_curated_phrase',
    message:'Corrispondenza deterministica per revisione umana: il testo NON è una risposta AI né autorizza operazioni.'
  };
}
