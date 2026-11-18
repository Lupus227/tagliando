/*
 * M4.5.4 — Bounded paraphrase grammar for OP03, offline review ONLY.
 * This is not free-form language understanding or a technical assistant.
 * Safety check on the ORIGINAL input is always performed by M4.5.2 first.
 * Every accepted target must be revalidated via the existing reviewed
 * evidence gate. No generated text, Worker route, AI call or session updates.
 */
import {mapQuestionToReviewedEvidence} from './m452-question-mapper.mjs';

const normalize=s=>s.toLocaleLowerCase('it-IT').normalize('NFD')
  .replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ')
  .replace(/\s+/g,' ').trim();

// Every expression is anchored. Never select a step from isolated keywords,
// a substring match, token similarity or a model-produced intent.
// Canonical questions come from the existing M4.5.2 reviewed mapping.
const BOUNDED_GRAMMAR=Object.freeze([
  {
    id:'P01_OPEN',
    canonical:'Come apro il coperchio del filtro aria?',
    patterns:[
      /^(da dove si|come si|come posso|come devo) (sgancia|stacca|apre|toglie|rimuove|sganciare|staccare|aprire|togliere|rimuovere) (il )?coperchio del filtro( aria)?$/,
      /^vorrei (togliere|rimuovere|aprire) il coperchio (per (vedere|controllare) il filtro )?da dove (comincio|inizio)$/,
      /^come (faccio a )?(sganciare|togliere|rimuovere|aprire) il coperchio del filtro( aria)?$/
    ]
  },
  {
    id:'P02_ASSESS',
    canonical:'Come controllo lo stato del filtro aria?',
    patterns:[
      /^come (faccio a )?(capire|capisco|controllare|controllo|verificare|verifico|valutare|valuto) (se il filtro (e|sia) (ancora )?(utilizzabile|buono|in buone condizioni)|lo stato del filtro|le condizioni del filtro)$/,
      /^il filtro (e|sembra) (sporco|impolverato) come (ne )?(verifico|controllo|valuto) (le condizioni|lo stato)$/
    ]
  },
  {
    id:'P03_PAPER',
    canonical:'Posso lavare il filtro in carta?',
    patterns:[
      /^il filtro (di|in) carta (si puo|posso|va) (sciacquare|lavare|pulire|soffiare)( con acqua)?$/,
      /^meglio (cambiare|sostituire) il filtro (di|in) carta oppure (soffiarlo|pulirlo)$/
    ]
  },
  {
    id:'P04_WASH_FOAM',
    canonical:'Come lavo il filtro in spugna?',
    patterns:[
      /^con cosa posso (detergere|lavare|pulire) (la spugna del filtro|il filtro (di|in) spugna)$/,
      /^il filtro (di|in) spugna (va|devo) (risciacquato|risciacquare|lavato|lavare)( dopo (il|un) detergente)?$/
    ]
  },
  {
    id:'P05_OIL_FOAM',
    canonical:'Devo oliare il filtro in spugna?',
    patterns:[
      /^la spugna del filtro (richiede|necessita|vuole) (dell )?olio( dopo (l |la )?asciugatura)?$/,
      /^una volta lavata devo (impregnare|oliare|ungere) la spugna (di|con) olio$/
    ]
  },
  {
    id:'P06_CLEAN_HOUSING',
    canonical:'Come pulisco la scatola del filtro aria?',
    patterns:[
      /^come (rimuovo|tolgo|elimino|pulisco) (la polvere |lo sporco )?(dalla|nella|della) scatola del filtro( aria)?$/,
      /^come (faccio a )?(pulire|ripulire) la scatola del filtro( aria)?$/
    ]
  },
  {
    id:'P07_REASSEMBLE',
    canonical:'Come rimonto il filtro aria?',
    patterns:[
      /^come (verifico|controllo|capisco) che il filtro (sia|e) (montato|rimontato|inserito) correttamente$/,
      /^come (posso )?(rimettere|rimontare|reinserire) (il filtro|la cartuccia del filtro)( aria)?( nella sua sede)?$/
    ]
  }
]);
export const M454_SCOPE=Object.freeze({
  machineFamily:'rasaerba_a_benzina',operationId:3,
  purpose:'offline_bounded_paraphrase_preview',
  maySendToModel:false
});
export const M454_GRAMMAR_INTENTS=BOUNDED_GRAMMAR.length;

/*
 * Read-only wrapper: rejects malformed input, hazards, missing model data,
 * commands, out of scope, and existing ambiguities exactly as M4.5.2 does.
 * If an input is unmapped, only a FULL anchored curated grammar can retry
 * by calling the SAME M4.5.2 evidence gate with an approved canonical key.
 */
export function mapBoundedParaphraseToReviewedEvidence(input){
  const original=mapQuestionToReviewedEvidence(input);
  if(original.decision!=='QUESTION_NOT_MAPPED'||original.ok!==false)
    return original;

  const key=normalize(input.question);
  const hits=BOUNDED_GRAMMAR.filter(entry=>
    entry.patterns.some(pattern=>pattern.test(key)));
  if(hits.length!==1){
    if(hits.length>1){
      return {
        ...original,decision:'QUESTION_AMBIGUOUS',
        message:'Possibili riferimenti multipli: nessuna fonte selezionata.'
      };
    }
    return original;
  }
  const selected=hits[0];
  const evidence=mapQuestionToReviewedEvidence({
    machineFamily:input.machineFamily,
    operationId:input.operationId,
    filterType:input.filterType,
    question:selected.canonical
  });
  // Recheck authorization and source provenance. No fallback to raw content.
  if(!evidence.ok||evidence.decision!=='QUESTION_MAPPED_TO_REVIEWED_EVIDENCE')
    return evidence;
  if(evidence.mappingId!==selected.id||evidence.source?.aiUseAllowed!==false||
    evidence.maySendToModel!==false||evidence.allowCompletion!==false||
    evidence.canGenerate!==false||evidence.modelRequests!==0||
    evidence.sessionChanged!==false){
    return {...original,decision:'EVIDENCE_INTEGRITY_FAILED',
      message:'Provenienza o vincoli della fonte non verificati.'};
  }
  return {
    ...evidence,
    mappingMethod:'bounded_anchored_grammar_v1',
    message:'Anteprima testuale integrale, per revisione umana offline. Nessuna istruzione tecnica AI o autorizzazione operativa.'
  };
}
