/*
 * Fasi 15.1–15.2 — Registro di revisione tecnica separato dal catalogo originale.
 *
 * Il catalogo resta una copia byte-per-byte di app.js/knowledge.js e ogni sua
 * voce conserva DA_VALIDARE. Le revisioni esplicite riguardano soltanto
 * RASA-OP-01-P01 e RASA-OP-01-P02, entrambe con applicabilità condizionata.
 *
 * La validazione CONDIZIONATA non sblocca API di istruzioni né AI.
 * Nessuna approvazione deriva dai dati inseriti nella PWA.
 */
const RAW_REVISIONS = [
  {
    "stepId": "RASA-OP-01-P01",
    "revision": "F15.1-R1",
    "status": "VALIDATO_CONDIZIONATO",
    "scope": "sicurezza_generale_preparazione",
    "approval": {
      "reviewerRole": "esperto_di_dominio",
      "decision": "APPROVATO_SENZA_MODIFICHE",
      "approvedOn": "2026-11-04",
      "evidence": "approvazione_esplicita_nella_conversazione_fase_15_1"
    },
    "content": {
      "title": "Preparazione e messa in sicurezza",
      "instruction": "Identifica marca e modello del rasaerba e del motore. Posiziona la macchina su una superficie stabile.\n\nSpegni il motore, attendi l'arresto completo delle parti mobili e lascia raffreddare i componenti caldi.\n\nScollega la pipetta dalla candela e mantienila separata dal terminale per prevenire l'avviamento accidentale. Se presente un sistema di avviamento elettrico, disabilitalo secondo le istruzioni del costruttore.\n\nIndossa guanti protettivi adeguati e verifica che la macchina possa essere movimentata senza rischi.",
      "stopCondition": "Se non è possibile impedire l'avviamento accidentale, se la lama è ancora in movimento oppure se la macchina non può essere sostenuta in sicurezza, non accedere al sottoscocca."
    },
    "applicability": {
      "machineFamily": "rasaerba_a_benzina",
      "requiresModelManualFor": [
        "disabilitazione_avviamento_elettrico",
        "configurazione_specifica_dispositivi_sicurezza",
        "orientamento_e_sostegno_per_accesso_sottoscocca"
      ],
      "generalSafetyOnly": true,
      "universalAuthorization": false
    },
    "evidence": [
      {
        "publisher": "Toro",
        "url": "https://manuals.toro.com/147349/index.html",
        "supports": "arresto_parti_mobili_raffreddamento_avviamento_elettrico"
      },
      {
        "publisher": "Toro",
        "url": "https://www.toro.com/getpub/37624",
        "supports": "scollegamento_pipetta_e_attesa_arresto"
      },
      {
        "publisher": "Toro",
        "url": "https://manuals.toro.com/163750/index.html",
        "supports": "allontanamento_cavo_candela_e_dispositivi_protettivi"
      }
    ],
    "aiUseAllowed": false
  },
  {
    "stepId": "RASA-OP-01-P02",
    "revision": "F15.2-R1",
    "status": "VALIDATO_CONDIZIONATO",
    "scope": "accesso_sottoscocca_inclinazione_condizionata_al_modello",
    "approval": {
      "reviewerRole": "esperto_di_dominio",
      "decision": "APPROVATO_DOPO_REVISIONE_CONCORDATA",
      "approvedOn": "2026-11-04",
      "evidence": "approvazione_esplicita_nella_conversazione_fase_15_2"
    },
    "content": {
      "title": "Accesso al sottoscocca",
      "instruction": "Dopo aver completato la messa in sicurezza, individua la candela, il carburatore e il filtro dell'aria.\n\nNei rasaerba con candela anteriore, solleva progressivamente la parte anteriore della macchina, inclinandola all'indietro e mantenendo la candela rivolta verso l'alto.\n\nUtilizza un'inclinazione indicativa di circa 45° rispetto al terreno, quando compatibile con la configurazione della macchina. Aumenta l'inclinazione soltanto se necessario, con orientamento consentito e sostegno stabile.\n\nNei modelli specificamente predisposti per il posizionamento verticale, è possibile adottare la posizione di manutenzione prevista dal costruttore.\n\nSe la candela si trova in una posizione differente, verifica l'orientamento appropriato prima di inclinare la macchina, mantenendo in alto anche il lato del filtro dell'aria quando richiesto.",
      "stopCondition": "Interrompi immediatamente l'inclinazione in presenza di perdite di olio o carburante, instabilità o configurazione non compatibile. Non proseguire basandoti soltanto sull'assenza di perdite visibili."
    },
    "applicability": {
      "machineFamily": "rasaerba_a_benzina",
      "requiresModelManualFor": [
        "orientamento_consentito",
        "posizionamento_verticale_90_gradi",
        "eventuali_requisiti_carburante_olio_filtro",
        "metodi_sostegno_stabile"
      ],
      "generalSafetyOnly": false,
      "universalAuthorization": false,
      "angle45IsReferenceOnly": true,
      "angle45IsCertifiedLimit": false,
      "requiresCompatibleOrientation": true,
      "requiresStableSupport": true
    },
    "evidence": [
      {
        "kind": "expert_review",
        "description": "Metodo d'officina proposto e testo finale approvato nella Fase 15.2; non sostituisce manuale specifico",
        "approvedOn": "2026-11-04"
      }
    ],
    "aiUseAllowed": false
  }
]ed": false
  }
];

function deepFreeze(value){
  if(value && typeof value==='object' && !Object.isFrozen(value)){
    for(const v of Object.values(value))deepFreeze(v);
    Object.freeze(value);
  }
  return value;
}
export const REVIEW_LEDGER=deepFreeze(RAW_REVISIONS);
const pinnedSnapshot=JSON.stringify(REVIEW_LEDGER);

export function auditReviewLedger(catalog, candidate=REVIEW_LEDGER){
  const errors=[];
  if(!catalog || !Array.isArray(catalog.procedures) || catalog.procedures.length!==8)
    errors.push('INVALID_SOURCE_CATALOG');
  if(!Array.isArray(candidate) || candidate.length!==2)
    errors.push('UNEXPECTED_REVIEW_COUNT');
  if(JSON.stringify(candidate)!==pinnedSnapshot)
    errors.push('REVIEW_SNAPSHOT_MISMATCH');
  const seen=new Set();
  for(const entry of Array.isArray(candidate)?candidate:[]){
    if(!entry || typeof entry.stepId!=='string' || seen.has(entry.stepId)){
      errors.push('DUPLICATE_OR_INVALID_REVIEW_ID');continue;
    }
    seen.add(entry.stepId);
    const step=catalog?.procedures?.flatMap(p=>p.steps||[])
      .find(s=>s.id===entry.stepId);
    if(!step || step.review?.status!=='DA_VALIDARE')
      errors.push('SOURCE_STEP_MISSING_OR_NOT_PENDING');
    const common=entry.status==='VALIDATO_CONDIZIONATO' &&
       entry.approval?.reviewerRole==='esperto_di_dominio' &&
       entry.approval?.approvedOn==='2026-11-04' &&
       entry.applicability?.universalAuthorization===false &&
       entry.aiUseAllowed===false &&
       typeof entry.content?.instruction==='string' &&
       entry.content.instruction.trim() &&
       typeof entry.content?.stopCondition==='string' &&
       entry.content.stopCondition.trim() &&
       Array.isArray(entry.evidence) && entry.evidence.length>0;
    const approvedP01=entry.stepId==='RASA-OP-01-P01' &&
       entry.revision==='F15.1-R1' &&
       entry.scope==='sicurezza_generale_preparazione' &&
       entry.approval?.decision==='APPROVATO_SENZA_MODIFICHE' &&
       entry.approval?.evidence==='approvazione_esplicita_nella_conversazione_fase_15_1' &&
       entry.applicability?.generalSafetyOnly===true &&
       entry.evidence.length===3;
    const approvedP02=entry.stepId==='RASA-OP-01-P02' &&
       entry.revision==='F15.2-R1' &&
       entry.scope==='accesso_sottoscocca_inclinazione_condizionata_al_modello' &&
       entry.approval?.decision==='APPROVATO_DOPO_REVISIONE_CONCORDATA' &&
       entry.approval?.evidence==='approvazione_esplicita_nella_conversazione_fase_15_2' &&
       entry.applicability?.generalSafetyOnly===false &&
       entry.applicability?.angle45IsReferenceOnly===true &&
       entry.applicability?.angle45IsCertifiedLimit===false &&
       entry.applicability?.requiresCompatibleOrientation===true &&
       entry.applicability?.requiresStableSupport===true &&
       entry.content.instruction.includes('circa 45°') &&
       entry.content.stopCondition.includes('perdite di olio o carburante') &&
       entry.evidence.length===1 &&
       entry.evidence[0].kind==='expert_review';
    if(!common || !(approvedP01 || approvedP02))
      errors.push('INVALID_REVIEW_SCOPE_OR_APPROVAL');
  }
  return Object.freeze({ok:errors.length===0,errors});
}
