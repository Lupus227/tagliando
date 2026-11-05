/*
 * Fasi 15.1–15.4 — Registro di revisione tecnica separato dal catalogo originale.
 *
 * Il catalogo resta una copia byte-per-byte di app.js/knowledge.js e ogni sua
 * voce conserva DA_VALIDARE. Le revisioni esplicite riguardano soltanto
 * RASA-OP-01-P01, RASA-OP-01-P02, RASA-OP-01-P03 e RASA-OP-01-P04, con validazione condizionata.
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
  },
  {
    "stepId": "RASA-OP-01-P03",
    "revision": "F15.3-R1",
    "status": "VALIDATO_CONDIZIONATO",
    "scope": "rimozione_meccanica_incrostazioni_sottoscocca",
    "approval": {
      "reviewerRole": "esperto_di_dominio",
      "decision": "APPROVATO_CON_ELIMINAZIONE_PRECISATA",
      "approvedOn": "2026-11-04",
      "evidence": "approvazione_esplicita_nella_conversazione_fase_15_3"
    },
    "content": {
      "title": "Rimozione delle incrostazioni",
      "instruction": "Con il rasaerba messo in sicurezza e stabilmente sostenuto, individua gli accumuli di erba, terra e residui vegetali presenti nel sottoscocca.\n\nUtilizza una spatola in acciaio rigida, con bordo non affilato, scegliendo la larghezza più adatta alla zona da pulire.\n\nRimuovi meccanicamente le incrostazioni dalle pareti interne della scocca e dai condotti di espulsione dell'erba, esercitando la pressione necessaria a distaccare i depositi induriti.\n\nPresta attenzione a non danneggiare il rivestimento protettivo, le parti in plastica, i fissaggi e gli eventuali componenti presenti nel sottoscocca.",
      "precautions": [
        "Non utilizzare la lama come punto di leva o di appoggio per la spatola.",
        "Evita il contatto accidentale con i taglienti."
      ],
      "stopCondition": "Interrompi l'operazione se riscontri danni strutturali, componenti compromessi o instabilità della macchina."
    },
    "applicability": {
      "machineFamily": "rasaerba_a_benzina",
      "requiresCompletedSafetyPreparation": true,
      "requiresStableSupport": true,
      "requiresSafeAccess": true,
      "requiresSuitableTool": true,
      "universalAuthorization": false
    },
    "evidence": [
      {
        "kind": "expert_review",
        "description": "Metodo d'officina con spatola rigida in acciaio non affilata. Precauzione aggiuntiva rimossa secondo correzione dell'esperto.",
        "approvedOn": "2026-11-04"
      }
    ],
    "aiUseAllowed": false
  },
  {
    "stepId": "RASA-OP-01-P04",
    "revision": "F15.4-R1",
    "status": "VALIDATO_CONDIZIONATO",
    "scope": "pulizia_finale_secco_e_acqua_condizionata_al_modello",
    "approval": {
      "reviewerRole": "esperto_di_dominio",
      "decision": "APPROVATO_CON_MODIFICA_ESPLICITA",
      "approvedOn": "2026-11-05",
      "evidence": "approvazione_esplicita_nella_conversazione_fase_15_4"
    },
    "content": {
      "title": "Pulizia finale del sottoscocca",
      "instruction": "Dopo aver rimosso le incrostazioni con la spatola, completa la pulizia eliminando i residui di erba e terra.\n\nMetodo A — Pulizia a secco\n\nUtilizza aria compressa per eliminare i residui distaccati, evitando di dirigere il getto verso l'operatore o componenti sensibili.\n\nMetodo B — Lavaggio con acqua\n\nSe il costruttore consente il lavaggio, utilizza un normale tubo dell'acqua con pistola a spruzzo da giardino.\n\nDirigi l'acqua sulle superfici interne della scocca e sui condotti di espulsione, evitando di bagnare direttamente il motore, il filtro dell'aria, il carburatore, i cuscinetti e i componenti elettrici.",
      "stopCondition": "Interrompi il lavaggio se si verificano infiltrazioni indesiderate, se rilevi componenti danneggiati o se la macchina perde stabilità."
    },
    "applicability": {
      "machineFamily": "rasaerba_a_benzina",
      "requiresCompletedSafetyPreparation": true,
      "requiresStableSupport": true,
      "waterWashRequiresManufacturerPermission": true,
      "privateUserPressureWasherRecommended": false,
      "compressedAirPressureSetpointSpecified": false,
      "dryingHandledByStepId": "RASA-OP-01-P05",
      "universalAuthorization": false
    },
    "professionalPracticeNote": {
      "technique": "idropulitrice",
      "context": "incrostazioni resistenti nel sottoscocca",
      "status": "PRATICA_OFFICINA_NON_APPROVATA_COME_ISTRUZIONE_PER_PRIVATI",
      "exposedToPrivateUsers": false,
      "aiInstructionAllowed": false
    },
    "evidence": [
      {
        "kind": "expert_review",
        "description": "Approvazione con rimozione indicazione sulla pressione dell'aria; tubo da giardino per privati; asciugatura già in P05; idropulitrice solo come esperienza professionale.",
        "approvedOn": "2026-11-05"
      }
    ],
    "aiUseAllowed": false
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
  if(!Array.isArray(candidate) || candidate.length!==4)
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
    const approvedP03=entry.stepId==='RASA-OP-01-P03' &&
       entry.revision==='F15.3-R1' &&
       entry.scope==='rimozione_meccanica_incrostazioni_sottoscocca' &&
       entry.approval?.decision==='APPROVATO_CON_ELIMINAZIONE_PRECISATA' &&
       entry.approval?.evidence==='approvazione_esplicita_nella_conversazione_fase_15_3' &&
       entry.applicability?.requiresCompletedSafetyPreparation===true &&
       entry.applicability?.requiresStableSupport===true &&
       entry.applicability?.requiresSafeAccess===true &&
       entry.applicability?.requiresSuitableTool===true &&
       entry.content.instruction.includes('spatola in acciaio rigida, con bordo non affilato') &&
       entry.content.instruction.includes('pressione necessaria') &&
       Array.isArray(entry.content.precautions) &&
       entry.content.precautions.length===2 &&
       entry.content.precautions[0]==='Non utilizzare la lama come punto di leva o di appoggio per la spatola.' &&
       entry.content.precautions[1]==='Evita il contatto accidentale con i taglienti.' &&
       entry.content.stopCondition.includes('danni strutturali') &&
       !entry.content.stopCondition.includes('metodo alternativo') &&
       entry.evidence.length===1 &&
       entry.evidence[0].kind==='expert_review';
    const approvedP04=entry.stepId==='RASA-OP-01-P04' &&
       entry.revision==='F15.4-R1' &&
       entry.scope==='pulizia_finale_secco_e_acqua_condizionata_al_modello' &&
       entry.approval?.decision==='APPROVATO_CON_MODIFICA_ESPLICITA' &&
       entry.approval?.approvedOn==='2026-11-05' &&
       entry.applicability?.waterWashRequiresManufacturerPermission===true &&
       entry.applicability?.privateUserPressureWasherRecommended===false &&
       entry.applicability?.compressedAirPressureSetpointSpecified===false &&
       entry.applicability?.dryingHandledByStepId==='RASA-OP-01-P05' &&
       entry.content.instruction.includes('Utilizza aria compressa per eliminare') &&
       entry.content.instruction.includes('pistola a spruzzo da giardino') &&
       !entry.content.instruction.includes('pressione controllata') &&
       !entry.content.instruction.includes('idropulitrice') &&
       entry.content.stopCondition.includes('infiltrazioni indesiderate') &&
       entry.professionalPracticeNote?.technique==='idropulitrice' &&
       entry.professionalPracticeNote?.exposedToPrivateUsers===false &&
       entry.professionalPracticeNote?.aiInstructionAllowed===false &&
       entry.evidence.length===1 && entry.evidence[0].kind==='expert_review';
    if(!common || !(approvedP01 || approvedP02 || approvedP03 || approvedP04))
      errors.push('INVALID_REVIEW_SCOPE_OR_APPROVAL');
  }
  return Object.freeze({ok:errors.length===0,errors});
}
