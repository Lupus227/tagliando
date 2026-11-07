/*
 * Fasi 15.1–15.11 — Registro di revisione tecnica separato dal catalogo originale.
 *
 * Il catalogo resta una copia byte-per-byte di app.js/knowledge.js e ogni sua
 * voce conserva DA_VALIDARE. Le revisioni esplicite riguardano soltanto
 * RASA-OP-01-P01 fino a RASA-OP-01-P06 e RASA-OP-02-P01/P02/P03/P04/P05, con validazione condizionata.
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
  },
  {
    "stepId": "RASA-OP-01-P05",
    "revision": "F15.5-R1",
    "status": "VALIDATO_CONDIZIONATO",
    "scope": "asciugatura_sottoscocca_metodi_aria_naturale_motore_con_precauzioni",
    "approval": {
      "reviewerRole": "esperto_di_dominio",
      "decision": "APPROVATO_CON_DUE_MODIFICHE_ESPLICITE",
      "approvedOn": "2026-11-05",
      "evidence": "approvazione_esplicita_nella_conversazione_fase_15_5"
    },
    "content": {
      "title": "Asciugatura del sottoscocca",
      "introduction": "Dopo il lavaggio con acqua, completa l'asciugatura del rasaerba scegliendo uno dei seguenti metodi.",
      "methods": [
        {
          "id": "aria_compressa",
          "title": "Metodo A — Asciugatura con aria compressa",
          "instruction": "Utilizza aria compressa per eliminare l'acqua residua dalle superfici interne della scocca e dai condotti di espulsione dell'erba.\n\nPresta particolare attenzione agli angoli e alle zone dove l'acqua può ristagnare, evitando di dirigere il getto verso cuscinetti, collegamenti elettrici e componenti sensibili."
        },
        {
          "id": "naturale",
          "title": "Metodo B — Asciugatura naturale",
          "instruction": "Lascia asciugare il rasaerba in un luogo asciutto e ventilato, attendendo che l'acqua residua sia evaporata."
        },
        {
          "id": "motore",
          "title": "Metodo C — Asciugatura mediante funzionamento del motore",
          "instruction": "Riporta il rasaerba nella normale posizione di funzionamento, con tutte le ruote appoggiate su una superficie piana e stabile.\n\nScegli una superficie liscia, solida come un pavimento in cemento o piastrelle e priva di materiale che possa essere proiettato dalla lama.\n\nVerifica l'assenza di sassi, pietrisco, ghiaia, erba tagliata, detriti e altri oggetti nell'area di lavoro.\n\nEvita superfici delicate o facilmente macchiabili: durante l'asciugatura potrebbero verificarsi sgocciolamenti di acqua sporca e residui di lavorazione.\n\nRipristina completamente le condizioni necessarie per l'avviamento, verificando il corretto funzionamento dei dispositivi di sicurezza.\n\nAll'aperto, avvia il motore secondo le istruzioni del costruttore e mantienilo in funzione indicativamente per 5–10 minuti, sorvegliando costantemente la macchina.\n\nMantieni azionata la leva di presenza dell'operatore, quando prevista, senza bloccarla artificialmente.\n\nAl termine, spegni il motore e attendi l'arresto completo delle parti mobili."
        }
      ],
      "instruction": "Se hai effettuato la pulizia a secco, verifica che non siano rimasti residui di erba e terra.",
      "stopCondition": "Non avviare la macchina se è inclinata, presenta dispositivi di sicurezza non funzionanti, si trova in un'area con oggetti proiettabili o non può essere mantenuta stabilmente sotto il controllo dell'operatore.\n\nNon avviare il motore in ambienti chiusi. Non accedere al sottoscocca durante il funzionamento."
    },
    "applicability": {
      "machineFamily": "rasaerba_a_benzina",
      "methodsContext": "dopo_lavaggio_con_acqua",
      "motorMethodRequiresOutdoorArea": true,
      "motorMethodRequiresNormalOperatingPosition": true,
      "motorMethodRequiresSafeSurface": true,
      "motorMethodRequiresOperatorSupervision": true,
      "motorRunMinutesEstimate": [
        5,
        10
      ],
      "motorRunMinutesCertified": false,
      "operatorPresenceLeverMustNotBeBlocked": true,
      "universalAuthorization": false
    },
    "evidence": [
      {
        "kind": "expert_review",
        "description": "Tecnica d'officina: motore acceso come alternativa ad aria compressa e asciugatura naturale; testo integrato con superficie solida priva di corpi proiettabili, senza subordinazione generica al modello.",
        "approvedOn": "2026-11-05"
      }
    ],
    "aiUseAllowed": false
  },
  {
    "stepId": "RASA-OP-01-P06",
    "revision": "F15.6-R1",
    "status": "VALIDATO_CONDIZIONATO",
    "scope": "controllo_integrita_scocca_corrosione_passante_e_gestione_anomalie",
    "approval": {
      "reviewerRole": "esperto_di_dominio",
      "decision": "APPROVATO_DOPO_DISTINZIONE_CORROSIONE_E_ANOMALIE",
      "approvedOn": "2026-11-05",
      "evidence": "approvazione_esplicita_nella_conversazione_fase_15_6"
    },
    "content": {
      "title": "Controllo della scocca",
      "instruction": "Terminata la pulizia e, se necessario, l'asciugatura, esamina visivamente il sottoscocca.\n\nVerifica che siano stati eliminati gli accumuli di erba e terra e controlla le condizioni generali della scocca.\n\nScocca metallica\n\nControlla la presenza di fori, crepe, deformazioni e corrosione passante.\n\nLa ruggine superficiale è comune e, se non compromette l'integrità della scocca, non richiede necessariamente un intervento.\n\nPresta particolare attenzione alle zone in cui la corrosione ha eroso il metallo, provocando perforazioni o una perdita significativa di spessore.\n\nScocca in plastica\n\nVerifica la presenza di crepe, rotture o deformazioni.\n\nUlteriori controlli\n\nVerifica l'integrità dei condotti di espulsione dell'erba, delle protezioni e dei relativi punti di fissaggio.",
      "anomalyManagement": [
        {
          "id": "scocca_integra",
          "label": "Scocca integra",
          "action": "Nessun intervento necessario.",
          "requiresStop": false,
          "requiresSpecialist": false
        },
        {
          "id": "difetti_superficiali",
          "label": "Difetti superficiali",
          "action": "Registra l'osservazione, senza interrompere automaticamente la manutenzione.",
          "requiresStop": false,
          "requiresSpecialist": false
        },
        {
          "id": "danni_strutturali_o_sicurezza",
          "label": "Danni strutturali o di sicurezza",
          "action": "Registra l'anomalia, sospendi l'utilizzo della macchina e richiedi l'intervento di un meccanico specializzato.",
          "requiresStop": true,
          "requiresSpecialist": true
        }
      ],
      "repairSeparation": "Le eventuali riparazioni sono gestite separatamente dalla normale operazione di pulizia.",
      "stopCondition": "Se rilevi danni strutturali o di sicurezza, registra l'anomalia, sospendi l'utilizzo della macchina e richiedi l'intervento di un meccanico specializzato."
    },
    "applicability": {
      "machineFamily": "rasaerba_a_benzina",
      "coversMetalAndPlasticDeck": true,
      "surfaceRustAloneRequiresStop": false,
      "throughCorrosionRequiresSpecialistAssessment": true,
      "significantMaterialLossRequiresSpecialistAssessment": true,
      "compromisedSafetyGuardRequiresStop": true,
      "automaticStructuralDiagnosisAllowed": false,
      "universalAuthorization": false
    },
    "evidence": [
      {
        "kind": "expert_review",
        "description": "L'esperto distingue ruggine superficiale comune da corrosione passante, perforazione e perdita di materiale; richiede annotazione dei difetti superficiali e intervento specialistico sui danni strutturali o di sicurezza.",
        "approvedOn": "2026-11-05"
      }
    ],
    "aiUseAllowed": false
  },
  {
    "stepId": "RASA-OP-02-P01",
    "revision": "F15.7-R1",
    "status": "VALIDATO_CONDIZIONATO",
    "scope": "sicurezza_preventiva_affilatura_lama_con_accesso_condizionato",
    "approval": {
      "reviewerRole": "esperto_di_dominio",
      "decision": "APPROVATO_SENZA_MODIFICHE",
      "approvedOn": "2026-11-06",
      "evidence": "approvazione_esplicita_ok_nella_conversazione_fase_15_7"
    },
    "content": {
      "title": "Messa in sicurezza",
      "instruction": "Posiziona il rasaerba su una superficie stabile.\n\nSpegni il motore, attendi l'arresto completo della lama e lascia raffreddare i componenti caldi.\n\nScollega la pipetta dalla candela, mantenendola separata dal terminale, per impedire l'avviamento accidentale. Nei modelli con avviamento elettrico, disabilita anche il relativo sistema di alimentazione secondo le indicazioni del costruttore.\n\nIndossa guanti protettivi adeguati prima di intervenire sulla lama.\n\nPer accedere al sottoscocca, utilizza il metodo di inclinazione e sostegno già definito nella procedura di preparazione, verificandone la compatibilità con la macchina.",
      "stopCondition": "Non intervenire sulla lama se non è possibile impedire l'avviamento accidentale, se la macchina non è stabilmente sostenuta oppure se non sono completamente ferme le parti mobili."
    },
    "applicability": {
      "machineFamily": "rasaerba_a_benzina",
      "operation": "affilatura_della_lama",
      "independentEntrySafetyPrerequisites": true,
      "requiresSparkPlugIsolation": true,
      "requiresElectricStarterIsolationWhenPresent": true,
      "requiresStableSupport": true,
      "requiresStoppedMovingParts": true,
      "referencedPreparatorySteps": [
        "RASA-OP-01-P01",
        "RASA-OP-01-P02"
      ],
      "doesNotAuthorizeBladeRemovalOrSharpening": true,
      "universalAuthorization": false
    },
    "evidence": [
      {
        "kind": "expert_review",
        "description": "Testo di messa in sicurezza proposto in Fase 15.7 e approvato con 'ok'; nota dell'esperto che la ridondanza delle precauzioni è ammissibile per la sicurezza.",
        "approvedOn": "2026-11-06"
      }
    ],
    "aiUseAllowed": false
  },
  {
    "stepId": "RASA-OP-02-P02",
    "revision": "F15.8-R1",
    "status": "VALIDATO_CONDIZIONATO",
    "scope": "smontaggio_lama_pistola_impulsi_e_chiave_manuale_condizionati",
    "approval": {
      "reviewerRole": "esperto_di_dominio",
      "decision": "APPROVATO_CON_MODIFICA_ESPLICITA",
      "approvedOn": "2026-11-06",
      "evidence": "approvazione_del_resto_del_testo_e_correzione_metodo_pistola_in_conversazione_15_8"
    },
    "content": {
      "title": "Smontaggio della lama",
      "instruction": "Individua il bullone o il sistema di fissaggio della lama.",
      "methods": [
        {
          "id": "pistola_impulsi",
          "title": "Metodo A — Smontaggio con pistola a impulsi",
          "instruction": "Utilizza una pistola a impulsi con bussola di misura e tipologia appropriate al fissaggio.\n\nMantieni l'utensile correttamente allineato al bullone ed effettua lo svitamento.\n\nSe la lama tende a ruotare, interrompi lo svitamento e immobilizzala prima di proseguire: puoi trattenerla saldamente con guanti protettivi adeguati, mantenendo la presa lontana dai bordi taglienti, oppure utilizzare un blocco di legno posizionato stabilmente tra lama e scocca, quando la configurazione del rasaerba lo permette e secondo le indicazioni del costruttore."
        },
        {
          "id": "chiave_manuale",
          "title": "Metodo B — Smontaggio con chiave manuale",
          "instruction": "Utilizza una chiave adeguata al bullone di fissaggio.\n\nTrattieni saldamente la lama per impedirne la rotazione, indossando guanti protettivi adeguati e mantenendo la presa lontano dai bordi taglienti.\n\nIn alternativa, quando la configurazione del rasaerba lo permette, utilizza un blocco di legno posizionato stabilmente tra la lama e la scocca, secondo le indicazioni del costruttore.\n\nSe non riesci a contrastare la rotazione in modo sicuro, interrompi l'operazione."
        }
      ],
      "commonActions": "Verifica il corretto verso di svitamento in base alle caratteristiche del fissaggio.\n\nRimuovi il bullone e gli eventuali componenti di fissaggio, prestando attenzione alla loro posizione e sequenza di montaggio.\n\nPrima di estrarre la lama, osservane l'orientamento per poterla rimontare correttamente.\n\nRimuovi la lama prestando attenzione ai bordi taglienti.",
      "stopCondition": "Interrompi lo smontaggio se:\n- Il fissaggio è danneggiato o non si allenta con gli strumenti appropriati.\n- Non riesci a contrastare la rotazione della lama in modo sicuro.\n- La macchina perde stabilità durante l'operazione.\n- Rilevi anomalie che possono compromettere la sicurezza.\nNon utilizzare la lama come leva per forzare lo smontaggio."
    },
    "applicability": {
      "machineFamily": "rasaerba_a_benzina",
      "requiresApprovedSafetyStep": "RASA-OP-02-P01",
      "methodsAuthorized": [
        "pistola_impulsi",
        "chiave_manuale"
      ],
      "manualGripWithProtectiveGlovesAllowed": true,
      "stableWoodBlockAlternativeAllowed": true,
      "stopWhenBladeCannotBeControlled": true,
      "fastenerDirectionMustBeVerified": true,
      "assemblyOrderMustBePreserved": true,
      "bladeOrientationMustBeRecorded": true,
      "doesNotAuthorizeReassemblyOrTorque": true,
      "universalAuthorization": false
    },
    "evidence": [
      {
        "kind": "expert_review",
        "description": "Esperto approva la procedura; richiede anche durante lo svitamento con pistola a impulsi blocco lama con guanti adeguati oppure blocco di legno. Il resto del testo è confermato.",
        "approvedOn": "2026-11-06"
      }
    ],
    "aiUseAllowed": false
  },
  {
    "stepId": "RASA-OP-02-P03",
    "revision": "F15.9-R1",
    "status": "VALIDATO_CONDIZIONATO",
    "scope": "verifica_mozzo_condizionata_alla_fuoriuscita_e_linguetta_solo_se_pertinente",
    "approval": {
      "reviewerRole": "esperto_di_dominio",
      "decision": "APPROVATO_CON_MODIFICA_ESPLICITA",
      "approvedOn": "2026-11-06",
      "evidence": "approvazione_esplicita_dopo_revisione_controllo_condizionato_mozzo_fase_15_9"
    },
    "content": {
      "title": "Controllo del mozzo portalama",
      "instruction": "Dopo aver smontato la lama, osserva il mozzo portalama.",
      "cases": [
        {
          "id": "mozzo_in_sede",
          "title": "Caso A — Il mozzo è rimasto montato sull'albero motore",
          "instruction": "Se il mozzo è rimasto correttamente in posizione e non presenta danni evidenti, non è necessario rimuoverlo o effettuare ulteriori controlli."
        },
        {
          "id": "mozzo_sfilato",
          "title": "Caso B — Il mozzo si è sfilato durante lo smontaggio",
          "instruction": "Se il mozzo si è sfilato insieme alla lama o durante la sua rimozione, verifica che non siano presenti componenti caduti o fuoriusciti dalla propria sede.\n\nAlcuni mozzi utilizzano una piccola linguetta metallica, chiamata anche chiavetta, che permette il trascinamento del mozzo da parte dell'albero motore. In altri mozzi questo elemento è integrato.\n\nSe la linguetta è separata, verifica che non sia caduta, danneggiata o rimasta fuori dalla propria sede.\n\nControlla inoltre che il mozzo non presenti crepe, deformazioni o altri danni evidenti."
        }
      ],
      "stopCondition": "Se il mozzo o la linguetta risultano danneggiati, se manca un componente oppure se non sei sicuro del corretto accoppiamento, non procedere al rimontaggio della lama.\n\nRegistra l'anomalia e richiedi una verifica tecnica."
    },
    "applicability": {
      "machineFamily": "rasaerba_a_benzina",
      "requiresApprovedBladeRemovalStep": "RASA-OP-02-P02",
      "audience": "utilizzatore_tagliando_gratuito",
      "inspectKeyOnlyIfHubSlipped": true,
      "doNotRemoveHubIfSeatedAndUndamaged": true,
      "noStandaloneKeyInspection": true,
      "integralKeyRecognized": true,
      "separateKeyInspectionConditional": true,
      "stopOnDamageMissingPartsOrUncertainFit": true,
      "professionalDeepHubInspectionExcluded": true,
      "universalAuthorization": false
    },
    "evidence": [
      {
        "kind": "expert_review",
        "description": "L'esperto chiarisce che nel tagliando gratuito la linguetta non è un controllo autonomo; diventa pertinente se il mozzo si sfila, perché la linguetta separata può cadere o uscire dalla sede. Testo condizionale finale confermato.",
        "approvedOn": "2026-11-06"
      }
    ],
    "aiUseAllowed": false
  },
  {
    "stepId": "RASA-OP-02-P04",
    "revision": "F15.10-R1",
    "status": "VALIDATO_CONDIZIONATO",
    "scope": "ispezione_lama_integrita_tagliente_affilatura_opzionale_e_arresto_su_danni",
    "approval": {
      "reviewerRole": "esperto_di_dominio",
      "decision": "APPROVATO_SENZA_MODIFICHE",
      "approvedOn": "2026-11-07",
      "evidence": "conferma_esplicita_utente_testo_chiaro_e_sufficiente_fase_15_10"
    },
    "content": {
      "title": "Ispezione della lama",
      "instruction": "Dopo aver smontato la lama, controllane attentamente le condizioni.\n\nControllo dell'integrità\n\nOsserva entrambi i lati della lama e verifica che non siano presenti crepe, rotture, deformazioni o parti mancanti.\n\nControlla anche la zona centrale, in corrispondenza del foro di fissaggio, e le estremità della lama.\n\nControllo del tagliente\n\nOsserva i bordi di taglio e verifica se sono ancora in buone condizioni oppure se presentano arrotondamenti, scheggiature o usura.\n\nNon verificare l'affilatura facendo scorrere le dita sul tagliente.\n\nValutazione finale\n\nSe la lama è integra e il tagliente è in buone condizioni, non è necessario affilarla.\n\nSe la lama è integra ma il tagliente è consumato, puoi scegliere di procedere con l'affilatura, purché tu disponga degli strumenti adeguati e sia in grado di utilizzarli in sicurezza.\n\nSe non vuoi effettuare personalmente l'affilatura, puoi affidarla a un professionista.",
      "stopCondition": "Se la lama presenta crepe, deformazioni, rotture, usura eccessiva o altri danni che ne compromettono l'integrità, non procedere all'affilatura.\n\nRegistra l'anomalia e prevedi la sostituzione della lama con un ricambio compatibile.\n\nNon rimontare una lama strutturalmente compromessa."
    },
    "applicability": {
      "machineFamily": "rasaerba_a_benzina",
      "requiresBladeRemovalStep": "RASA-OP-02-P02",
      "audience": "utilizzatore_tagliando_gratuito",
      "bladeInspectionRequiredBeforeSharpening": true,
      "sharpeningOptional": true,
      "requiresAppropriateToolsAndAbility": true,
      "noFingerSlideAlongCuttingEdge": true,
      "structurallyCompromisedBladeMustNotBeSharpened": true,
      "structurallyCompromisedBladeMustNotBeReinstalled": true,
      "professionalSharpeningAlternativeAllowed": true,
      "bladeReplacementWithCompatiblePartWhenDamaged": true,
      "noAutonomousAiDiagnosis": true,
      "universalAuthorization": false
    },
    "evidence": [
      {
        "kind": "expert_review",
        "description": "Il tecnico approva integralmente il testo Fase 15.10: ispezione di integrità e tagliente, affilatura facoltativa se attrezzatura e manualità adeguate, arresto e sostituzione per danno strutturale.",
        "approvedOn": "2026-11-07"
      }
    ],
    "aiUseAllowed": false
  },
  {
    "stepId": "RASA-OP-02-P05",
    "revision": "F15.11-R1",
    "status": "VALIDATO_CONDIZIONATO",
    "scope": "affilatura_lama_opzionale_smerigliatrice_con_movimento_continuo_e_limitazioni",
    "approval": {
      "reviewerRole": "esperto_di_dominio",
      "decision": "APPROVATO_CON_INTEGRAZIONE_ESPLICITA",
      "approvedOn": "2026-11-07",
      "evidence": "conferma_testo_e_indicazione_movimento_lento_costante_mai_fermo_fase_15_11"
    },
    "content": {
      "title": "Ripristino del tagliente",
      "instruction": "L'affilatura della lama è un'operazione facoltativa.\n\nProcedi soltanto se la lama è stata precedentemente controllata e risulta integra, e se disponi degli utensili e delle capacità necessarie per eseguire il lavoro in sicurezza.\n\nPreparazione\n\nFissa saldamente la lama su un banco da lavoro, utilizzando una morsa o un sistema di bloccaggio adeguato.\n\nIndossa occhiali protettivi e gli altri dispositivi di protezione previsti per l'utensile utilizzato.\n\nAffilatura con smerigliatrice\n\nUtilizza una smerigliatrice angolare dotata di disco lamellare a grana 60 o 80, adatto all'utensile e al materiale da lavorare.\n\nIndividua l'inclinazione originale del tagliente e cerca di conservarla.\n\nSe l'angolo originale non è più riconoscibile, per le lame compatibili si può utilizzare come riferimento indicativo un'inclinazione di 30–35°. Questo valore non sostituisce eventuali specifiche del costruttore.\n\nLavora sulla faccia superiore dei due taglienti, seguendo la geometria originale della lama.\n\nEffettua passate progressive con un movimento lento, regolare e continuo della smerigliatrice lungo il tagliente, senza fermarti sullo stesso punto, rimuovendo soltanto il materiale necessario per ripristinare il filo.\n\nEvita di esercitare una pressione eccessiva e di riscaldare troppo il metallo.\n\nCerca di distribuire l'asportazione del materiale sui due taglienti, senza modificare eccessivamente la forma originale della lama.\n\nControllo finale\n\nAl termine verifica visivamente che entrambi i taglienti siano regolari e non presentino danni causati dalla lavorazione.\n\nLa verifica dell'equilibratura della lama sarà effettuata nel passaggio successivo.",
      "stopCondition": "Non procedere se non hai dimestichezza con la smerigliatrice oppure non puoi fissare stabilmente la lama.\n\nInterrompi l'affilatura se rilevi crepe, deformazioni, perdita eccessiva di materiale o condizioni che impediscono di rispettare la geometria della lama.\n\nSe non puoi effettuare l'operazione in sicurezza, affida l'affilatura a un professionista."
    },
    "applicability": {
      "machineFamily": "rasaerba_a_benzina",
      "audience": "utilizzatore_tagliando_gratuito",
      "requiresApprovedBladeInspectionStep": "RASA-OP-02-P04",
      "sharpeningOptional": true,
      "requiresSkillToolsAndBladeIntegrity": true,
      "requiresSecureWorkbenchFixation": true,
      "gritOptions": [
        60,
        80
      ],
      "referenceAngleDegrees": [
        30,
        35
      ],
      "angleIsUniversalSpecification": false,
      "originalBevelPriority": true,
      "workUpperCuttingFaces": true,
      "movementSlowSteadyContinuous": true,
      "neverHoldGrinderInOnePlace": true,
      "movementSpeedNotSpindleRPM": true,
      "protectiveEyewearRequired": true,
      "overheatingAndExcessiveRemovalProhibited": true,
      "balancingDeferredStep": "RASA-OP-02-P06",
      "professionalAlternativeAvailable": true,
      "universalAuthorization": false
    },
    "evidence": [
      {
        "kind": "expert_review",
        "description": "Esperto approva il testo e precisa l'uso della smerigliatrice con movimento lento e costante, mai fermo su un punto; non si specifica un numero di giri.",
        "approvedOn": "2026-11-07"
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
  if(!Array.isArray(candidate) || candidate.length!==11)
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
       ((entry.approval?.approvedOn==='2026-11-04' || (['RASA-OP-01-P04','RASA-OP-01-P05','RASA-OP-01-P06'].includes(entry.stepId) && entry.approval?.approvedOn==='2026-11-05' || (['RASA-OP-02-P01','RASA-OP-02-P02','RASA-OP-02-P03'].includes(entry.stepId) && entry.approval?.approvedOn==='2026-11-06') || (['RASA-OP-02-P04','RASA-OP-02-P05'].includes(entry.stepId) && entry.approval?.approvedOn==='2026-11-07')))) &&
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
    const approvedP05=entry.stepId==='RASA-OP-01-P05' &&
       entry.revision==='F15.5-R1' &&
       entry.scope==='asciugatura_sottoscocca_metodi_aria_naturale_motore_con_precauzioni' &&
       entry.approval?.decision==='APPROVATO_CON_DUE_MODIFICHE_ESPLICITE' &&
       entry.approval?.evidence==='approvazione_esplicita_nella_conversazione_fase_15_5' &&
       entry.applicability?.motorMethodRequiresOutdoorArea===true &&
       entry.applicability?.motorMethodRequiresNormalOperatingPosition===true &&
       entry.applicability?.motorMethodRequiresSafeSurface===true &&
       entry.applicability?.motorMethodRequiresOperatorSupervision===true &&
       entry.applicability?.operatorPresenceLeverMustNotBeBlocked===true &&
       entry.applicability?.motorRunMinutesCertified===false &&
       JSON.stringify(entry.applicability.motorRunMinutesEstimate)==='[5,10]' &&
       Array.isArray(entry.content.methods) &&
       entry.content.methods.length===3 &&
       entry.content.methods.map(m=>m.id).join(',')==='aria_compressa,naturale,motore' &&
       entry.content.methods[2].instruction.includes('Scegli una superficie liscia, solida come un pavimento in cemento o piastrelle e priva di materiale che possa essere proiettato dalla lama.') &&
       !entry.content.methods[2].instruction.includes('se il modello lo consente') &&
       entry.content.methods[2].instruction.includes('5–10 minuti') &&
       entry.content.methods[2].instruction.includes("senza bloccarla artificialmente") &&
       entry.content.stopCondition.includes('Non avviare il motore in ambienti chiusi') &&
       entry.evidence.length===1 && entry.evidence[0].kind==='expert_review';
    const approvedP06=entry.stepId==='RASA-OP-01-P06' &&
       entry.revision==='F15.6-R1' &&
       entry.scope==='controllo_integrita_scocca_corrosione_passante_e_gestione_anomalie' &&
       entry.approval?.decision==='APPROVATO_DOPO_DISTINZIONE_CORROSIONE_E_ANOMALIE' &&
       entry.approval?.evidence==='approvazione_esplicita_nella_conversazione_fase_15_6' &&
       entry.applicability?.coversMetalAndPlasticDeck===true &&
       entry.applicability?.surfaceRustAloneRequiresStop===false &&
       entry.applicability?.throughCorrosionRequiresSpecialistAssessment===true &&
       entry.applicability?.significantMaterialLossRequiresSpecialistAssessment===true &&
       entry.applicability?.compromisedSafetyGuardRequiresStop===true &&
       entry.applicability?.automaticStructuralDiagnosisAllowed===false &&
       entry.content.instruction.includes('La ruggine superficiale è comune') &&
       entry.content.instruction.includes('corrosione passante') &&
       entry.content.instruction.includes('perdita significativa di spessore') &&
       Array.isArray(entry.content.anomalyManagement) &&
       entry.content.anomalyManagement.length===3 &&
       entry.content.anomalyManagement.map(a=>a.id).join(',')==='scocca_integra,difetti_superficiali,danni_strutturali_o_sicurezza' &&
       entry.content.anomalyManagement[0].requiresStop===false &&
       entry.content.anomalyManagement[1].requiresStop===false &&
       entry.content.anomalyManagement[2].requiresStop===true &&
       entry.content.anomalyManagement[2].requiresSpecialist===true &&
       entry.content.anomalyManagement[2].action.includes('meccanico specializzato') &&
       entry.content.repairSeparation.includes('gestite separatamente') &&
       entry.content.stopCondition.includes("sospendi l'utilizzo") &&
       entry.evidence.length===1 && entry.evidence[0].kind==='expert_review';
    const approvedOP02P01=entry.stepId==='RASA-OP-02-P01' &&
       entry.revision==='F15.7-R1' &&
       entry.scope==='sicurezza_preventiva_affilatura_lama_con_accesso_condizionato' &&
       entry.approval?.decision==='APPROVATO_SENZA_MODIFICHE' &&
       entry.approval?.evidence==='approvazione_esplicita_ok_nella_conversazione_fase_15_7' &&
       entry.applicability?.operation==='affilatura_della_lama' &&
       entry.applicability?.independentEntrySafetyPrerequisites===true &&
       entry.applicability?.requiresSparkPlugIsolation===true &&
       entry.applicability?.requiresElectricStarterIsolationWhenPresent===true &&
       entry.applicability?.requiresStableSupport===true &&
       entry.applicability?.requiresStoppedMovingParts===true &&
       entry.applicability?.doesNotAuthorizeBladeRemovalOrSharpening===true &&
       JSON.stringify(entry.applicability.referencedPreparatorySteps)==='["RASA-OP-01-P01","RASA-OP-01-P02"]' &&
       entry.content.instruction.includes('Scollega la pipetta dalla candela') &&
       entry.content.instruction.includes("Per accedere al sottoscocca") &&
       entry.content.instruction.includes('Indossa guanti protettivi adeguati') &&
       entry.content.stopCondition.includes("non è possibile impedire l'avviamento accidentale") &&
       entry.evidence.length===1 && entry.evidence[0].kind==='expert_review';
    const approvedOP02P02=entry.stepId==='RASA-OP-02-P02' &&
       entry.revision==='F15.8-R1' &&
       entry.scope==='smontaggio_lama_pistola_impulsi_e_chiave_manuale_condizionati' &&
       entry.approval?.decision==='APPROVATO_CON_MODIFICA_ESPLICITA' &&
       entry.approval?.evidence==='approvazione_del_resto_del_testo_e_correzione_metodo_pistola_in_conversazione_15_8' &&
       entry.applicability?.requiresApprovedSafetyStep==='RASA-OP-02-P01' &&
       entry.applicability?.manualGripWithProtectiveGlovesAllowed===true &&
       entry.applicability?.stableWoodBlockAlternativeAllowed===true &&
       entry.applicability?.stopWhenBladeCannotBeControlled===true &&
       entry.applicability?.fastenerDirectionMustBeVerified===true &&
       entry.applicability?.assemblyOrderMustBePreserved===true &&
       entry.applicability?.bladeOrientationMustBeRecorded===true &&
       entry.applicability?.doesNotAuthorizeReassemblyOrTorque===true &&
       JSON.stringify(entry.applicability.methodsAuthorized)==='["pistola_impulsi","chiave_manuale"]' &&
       Array.isArray(entry.content.methods) && entry.content.methods.length===2 &&
       entry.content.methods.map(m=>m.id).join(',')==='pistola_impulsi,chiave_manuale' &&
       entry.content.methods[0].instruction.includes('pistola a impulsi') &&
       entry.content.methods[0].instruction.includes('guanti protettivi adeguati') &&
       entry.content.methods[0].instruction.includes('blocco di legno') &&
       entry.content.methods[1].instruction.includes('Trattieni saldamente la lama') &&
       entry.content.methods[1].instruction.includes('blocco di legno') &&
       entry.content.commonActions.includes('orientamento') &&
       entry.content.stopCondition.includes('Non utilizzare la lama come leva') &&
       entry.evidence.length===1 && entry.evidence[0].kind==='expert_review';
    const approvedOP02P03=entry.stepId==='RASA-OP-02-P03' &&
       entry.revision==='F15.9-R1' &&
       entry.scope==='verifica_mozzo_condizionata_alla_fuoriuscita_e_linguetta_solo_se_pertinente' &&
       entry.approval?.decision==='APPROVATO_CON_MODIFICA_ESPLICITA' &&
       entry.approval?.evidence==='approvazione_esplicita_dopo_revisione_controllo_condizionato_mozzo_fase_15_9' &&
       entry.applicability?.requiresApprovedBladeRemovalStep==='RASA-OP-02-P02' &&
       entry.applicability?.audience==='utilizzatore_tagliando_gratuito' &&
       entry.applicability?.inspectKeyOnlyIfHubSlipped===true &&
       entry.applicability?.doNotRemoveHubIfSeatedAndUndamaged===true &&
       entry.applicability?.noStandaloneKeyInspection===true &&
       entry.applicability?.integralKeyRecognized===true &&
       entry.applicability?.separateKeyInspectionConditional===true &&
       entry.applicability?.stopOnDamageMissingPartsOrUncertainFit===true &&
       entry.applicability?.professionalDeepHubInspectionExcluded===true &&
       Array.isArray(entry.content.cases) && entry.content.cases.length===2 &&
       entry.content.cases.map(c=>c.id).join(',')==='mozzo_in_sede,mozzo_sfilato' &&
       entry.content.cases[0].instruction.includes('non è necessario rimuoverlo o effettuare ulteriori controlli') &&
       !entry.content.cases[0].instruction.includes('linguetta') &&
       entry.content.cases[1].instruction.includes('il mozzo si è sfilato') &&
       entry.content.cases[1].instruction.includes('In altri mozzi questo elemento è integrato') &&
       entry.content.cases[1].instruction.includes('Se la linguetta è separata') &&
       entry.content.stopCondition.includes('non procedere al rimontaggio') &&
       entry.content.stopCondition.includes('verifica tecnica') &&
       entry.evidence.length===1 && entry.evidence[0].kind==='expert_review';
    const approvedOP02P04=entry.stepId==='RASA-OP-02-P04' &&
       entry.revision==='F15.10-R1' &&
       entry.scope==='ispezione_lama_integrita_tagliente_affilatura_opzionale_e_arresto_su_danni' &&
       entry.approval?.decision==='APPROVATO_SENZA_MODIFICHE' &&
       entry.approval?.evidence==='conferma_esplicita_utente_testo_chiaro_e_sufficiente_fase_15_10' &&
       entry.applicability?.requiresBladeRemovalStep==='RASA-OP-02-P02' &&
       entry.applicability?.audience==='utilizzatore_tagliando_gratuito' &&
       entry.applicability?.bladeInspectionRequiredBeforeSharpening===true &&
       entry.applicability?.sharpeningOptional===true &&
       entry.applicability?.requiresAppropriateToolsAndAbility===true &&
       entry.applicability?.noFingerSlideAlongCuttingEdge===true &&
       entry.applicability?.structurallyCompromisedBladeMustNotBeSharpened===true &&
       entry.applicability?.structurallyCompromisedBladeMustNotBeReinstalled===true &&
       entry.applicability?.professionalSharpeningAlternativeAllowed===true &&
       entry.applicability?.bladeReplacementWithCompatiblePartWhenDamaged===true &&
       entry.applicability?.noAutonomousAiDiagnosis===true &&
       entry.content.instruction.includes("Non verificare l'affilatura facendo scorrere le dita sul tagliente.") &&
       entry.content.instruction.includes("non è necessario affilarla") &&
       entry.content.instruction.includes("puoi scegliere di procedere con l'affilatura") &&
       entry.content.instruction.includes("puoi affidarla a un professionista") &&
       entry.content.stopCondition.includes("non procedere all'affilatura") &&
       entry.content.stopCondition.includes("Non rimontare una lama strutturalmente compromessa.") &&
       entry.evidence.length===1 && entry.evidence[0].kind==='expert_review';
    const approvedOP02P05=entry.stepId==='RASA-OP-02-P05' &&
       entry.revision==='F15.11-R1' &&
       entry.scope==='affilatura_lama_opzionale_smerigliatrice_con_movimento_continuo_e_limitazioni' &&
       entry.approval?.decision==='APPROVATO_CON_INTEGRAZIONE_ESPLICITA' &&
       entry.approval?.evidence==='conferma_testo_e_indicazione_movimento_lento_costante_mai_fermo_fase_15_11' &&
       entry.applicability?.requiresApprovedBladeInspectionStep==='RASA-OP-02-P04' &&
       entry.applicability?.sharpeningOptional===true &&
       entry.applicability?.requiresSkillToolsAndBladeIntegrity===true &&
       entry.applicability?.requiresSecureWorkbenchFixation===true &&
       JSON.stringify(entry.applicability.gritOptions)==='[60,80]' &&
       JSON.stringify(entry.applicability.referenceAngleDegrees)==='[30,35]' &&
       entry.applicability?.angleIsUniversalSpecification===false &&
       entry.applicability?.originalBevelPriority===true &&
       entry.applicability?.workUpperCuttingFaces===true &&
       entry.applicability?.movementSlowSteadyContinuous===true &&
       entry.applicability?.neverHoldGrinderInOnePlace===true &&
       entry.applicability?.movementSpeedNotSpindleRPM===true &&
       entry.applicability?.protectiveEyewearRequired===true &&
       entry.applicability?.overheatingAndExcessiveRemovalProhibited===true &&
       entry.applicability?.balancingDeferredStep==='RASA-OP-02-P06' &&
       entry.applicability?.professionalAlternativeAvailable===true &&
       entry.content.instruction.includes("L'affilatura della lama è un'operazione facoltativa") &&
       entry.content.instruction.includes('disco lamellare a grana 60 o 80') &&
       entry.content.instruction.includes('30–35°') &&
       entry.content.instruction.includes('un movimento lento, regolare e continuo') &&
       entry.content.instruction.includes('senza fermarti sullo stesso punto') &&
       entry.content.instruction.includes("La verifica dell'equilibratura") &&
       entry.content.stopCondition.includes("Non procedere se non hai dimestichezza") &&
       entry.content.stopCondition.includes("affida l'affilatura a un professionista") &&
       entry.evidence.length===1 && entry.evidence[0].kind==='expert_review';
    if(!common || !(approvedP01 || approvedP02 || approvedP03 || approvedP04 || approvedP05 || approvedP06 || approvedOP02P01 || approvedOP02P02 || approvedOP02P03 || approvedOP02P04 || approvedOP02P05))
      errors.push('INVALID_REVIEW_SCOPE_OR_APPROVAL');
  }
  return Object.freeze({ok:errors.length===0,errors});
}
