/*
 * Fasi 15.1–15.22 — Registro di revisione tecnica separato dal catalogo originale.
 *
 * Il catalogo resta una copia byte-per-byte di app.js/knowledge.js e ogni sua
 * voce conserva DA_VALIDARE. Le revisioni esplicite riguardano soltanto
 * RASA-OP-01-P01 fino a RASA-OP-01-P06, RASA-OP-02-P01 fino a P08 e RASA-OP-03-P01/P02/P03/P04/P05/P06/P07, con validazione condizionata.
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
  },
  {
    "stepId": "RASA-OP-02-P06",
    "revision": "F15.12-R1",
    "status": "VALIDATO_CONDIZIONATO",
    "scope": "equilibratura_lama_dopo_affilatura_fulcro_centrale_e_controllo_ripetuto",
    "approval": {
      "reviewerRole": "esperto_di_dominio",
      "decision": "APPROVATO_CON_CHIARIMENTO_ESPLICITO",
      "approvedOn": "2026-11-07",
      "evidence": "approvazione_esplicita_utente_spiegazione_cacciavite_fulcro_forocentrale_fase_15_12"
    },
    "content": {
      "title": "Equilibratura della lama",
      "instruction": "Dopo aver affilato la lama, controlla che sia equilibrata, cioè che il peso sia distribuito correttamente tra le due estremità.\n\nPreparazione\n\n1. Prendi un cacciavite con il gambo cilindrico e fissalo orizzontalmente in una morsa, lasciando sporgere una parte del gambo.\n2. Inserisci il gambo del cacciavite nel foro centrale della lama.\n3. Posiziona la lama in modo che sia sostenuta esattamente al centro, come un'altalena appoggiata sul proprio fulcro.\n4. Assicurati che le due estremità della lama siano libere di muoversi, senza toccare la morsa o altri oggetti.\n\nVerifica dell'equilibrio\n\n- Se la lama rimane sostanzialmente orizzontale: il peso è distribuito correttamente.\n- Se un'estremità scende ripetutamente: quella parte è più pesante e la lama deve essere riequilibrata.\n\nRipeti la prova più volte per confermare il risultato.\n\nCorrezione dello squilibrio\n\nSe lo squilibrio è lieve, rimuovi progressivamente una piccola quantità di materiale dalla parte più pesante, rispettando la geometria originale della lama.\n\nDopo ogni intervento ripeti il controllo.\n\nSe non riesci a riequilibrare la lama senza asportare troppo materiale, rivolgiti a un professionista.",
      "stopCondition": "Non rimontare una lama evidentemente sbilanciata, deformata o danneggiata."
    },
    "applicability": {
      "machineFamily": "rasaerba_a_benzina",
      "audience": "utilizzatore_tagliando_gratuito",
      "requiresApprovedBladeSharpeningStep": "RASA-OP-02-P05",
      "onlyAfterSharpening": true,
      "screwdriverIsBalanceFulcrum": true,
      "horizontallySecuredCylindricalShaft": true,
      "supportAtBladeCenterHole": true,
      "centerSupportExact": true,
      "bladeEndsMustMoveFreely": true,
      "repeatCheckMultipleTimes": true,
      "heavierEndFalls": true,
      "removeMinimalMaterialFromHeavierEndOnlyIfCorrectable": true,
      "preserveBladeOriginalGeometry": true,
      "stopIfClearlyUnbalancedDeformedOrDamaged": true,
      "professionalAlternativeAvailable": true,
      "fingerUsedAsBalanceSupport": false,
      "universalAuthorization": false
    },
    "evidence": [
      {
        "kind": "expert_review",
        "description": "L'esperto conferma la versione che spiega il gambo del cacciavite come fulcro per sostenere la lama esattamente in corrispondenza del foro centrale; controllo ripetuto e arresto su squilibrio evidente o danni.",
        "approvedOn": "2026-11-07"
      }
    ],
    "aiUseAllowed": false
  },
  {
    "stepId": "RASA-OP-02-P07",
    "revision": "F15.13-R1",
    "status": "VALIDATO_CONDIZIONATO",
    "scope": "rimontaggio_lama_serraggio_con_coppia_pertinente_e_prerequisito_prima_dello_smontaggio",
    "approval": {
      "reviewerRole": "esperto_di_dominio",
      "decision": "APPROVATO_SENZA_MODIFICHE",
      "approvedOn": "2026-11-07",
      "evidence": "conferma_esplicita_testo_montaggio_serraggio_con_verifica_prima_smontaggio_fase_15_13"
    },
    "content": {
      "title": "Montaggio e serraggio della lama",
      "instruction": "Dopo aver completato l'ispezione e l'eventuale affilatura:\n\n1. Verifica che il mozzo portalama sia correttamente posizionato e non presenti anomalie evidenti.\n2. Rimonta la lama rispettandone l'orientamento originale.\n3. Assicurati che la lama sia correttamente alloggiata nella sede di centraggio del mozzo.\n4. Riposiziona rondelle, viti e altri componenti nell'ordine e nell'orientamento originali.\n5. Avvita inizialmente i bulloni a mano, verificando che la filettatura si impegni correttamente senza forzature.\n\nSe il mozzo si era sfilato, il corretto posizionamento dell'eventuale linguetta separata deve essere già stato verificato.\n\nSerraggio\n\nContrasta la rotazione della lama mediante uno dei metodi di bloccaggio già approvati nella procedura di smontaggio.\n\nUtilizza una chiave dinamometrica idonea e applica la coppia di serraggio precedentemente dichiarata, purché sia stata verificata come pertinente al fissaggio.\n\nSe sono presenti più bulloni, ciascuno deve essere serrato secondo la specifica applicabile.\n\nLa pistola a impulsi non deve essere utilizzata per stabilire la coppia finale, poiché le sue regolazioni non garantiscono un valore misurato.",
      "prerequisite": "Questa verifica viene eseguita prima dello smontaggio della lama.\n\nPer rimontare correttamente la lama devi conoscere la coppia di serraggio prevista per i suoi bulloni e disporre di una chiave dinamometrica adatta.\n\nConfermi di conoscere la coppia corretta e di avere lo strumento necessario?\n\nSe l'utente conferma, l'app registra la dichiarazione, acquisisce la coppia in Nm e la relativa fonte, quindi prosegue dopo i controlli di sicurezza.\n\nSe non conferma, la manutenzione facoltativa della lama viene registrata come non eseguita e il tagliando prosegue con l'operazione successiva.\n\nLa dichiarazione non sostituisce la necessità di utilizzare effettivamente una coppia pertinente e uno strumento idoneo.",
      "assemblyInstruction": "Dopo aver completato l'ispezione e l'eventuale affilatura:\n\n1. Verifica che il mozzo portalama sia correttamente posizionato e non presenti anomalie evidenti.\n2. Rimonta la lama rispettandone l'orientamento originale.\n3. Assicurati che la lama sia correttamente alloggiata nella sede di centraggio del mozzo.\n4. Riposiziona rondelle, viti e altri componenti nell'ordine e nell'orientamento originali.\n5. Avvita inizialmente i bulloni a mano, verificando che la filettatura si impegni correttamente senza forzature.\n\nSe il mozzo si era sfilato, il corretto posizionamento dell'eventuale linguetta separata deve essere già stato verificato.",
      "tighteningInstruction": "Contrasta la rotazione della lama mediante uno dei metodi di bloccaggio già approvati nella procedura di smontaggio.\n\nUtilizza una chiave dinamometrica idonea e applica la coppia di serraggio precedentemente dichiarata, purché sia stata verificata come pertinente al fissaggio.\n\nSe sono presenti più bulloni, ciascuno deve essere serrato secondo la specifica applicabile.\n\nLa pistola a impulsi non deve essere utilizzata per stabilire la coppia finale, poiché le sue regolazioni non garantiscono un valore misurato.",
      "stopCondition": "Non procedere al rimontaggio o alla rimessa in servizio della macchina se:\n- La lama non si inserisce correttamente sul mozzo.\n- Mancano componenti di fissaggio o sono presenti danni.\n- L'orientamento della lama non è identificabile con sicurezza.\n- Il valore di serraggio risulta incerto o non pertinente.\n- Non è possibile applicare correttamente la coppia prevista.\n\nSe la lama è già stata smontata e non può essere rimontata in sicurezza, registra l'anomalia e richiedi una verifica tecnica."
    },
    "applicability": {
      "machineFamily": "rasaerba_a_benzina",
      "audience": "utilizzatore_tagliando_gratuito",
      "prerequisiteBeforeBladeRemovalStep": "RASA-OP-02-P02",
      "requiresDeclaredRelevantTorqueValueNm": true,
      "requiresDeclaredTorqueSource": true,
      "requiresDeclaredSuitableTorqueWrench": true,
      "declarationDoesNotReplaceActualSafetyRequirements": true,
      "skipOptionalBladeWorkIfPrerequisitesMissing": true,
      "recordSkipAsNotExecuted": true,
      "continueOtherServiceTasksOnSafeSkip": true,
      "doNotSkipIfAlreadyDismantledUnsafe": true,
      "stopIfBladeAlreadyRemovedCannotBeSafelyReinstalled": true,
      "requiresCorrectBladeOrientation": true,
      "requiresProperHubCentering": true,
      "preserveFixingComponentOrder": true,
      "startThreadByHand": true,
      "requiresApprovedRotationRestraintStep": "RASA-OP-02-P02",
      "torqueMustBeRelevantToActualFastener": true,
      "impactGunNotValidForFinalTorque": true,
      "noUniversalTorqueFallback": true,
      "noMandatoryThreadlocker": true,
      "universalAuthorization": false
    },
    "evidence": [
      {
        "kind": "expert_review",
        "description": "Esperto approva testo P07: domanda preventiva coppia di serraggio documentata e disponibilità dichiarata di dinamometrica, salto della manutenzione facoltativa in caso negativo, montaggio in sede e serraggio con valore pertinente, fermo se la lama è già smontata e non rimontabile in sicurezza.",
        "approvedOn": "2026-11-07"
      }
    ],
    "aiUseAllowed": false
  },
  {
    "stepId": "RASA-OP-02-P08",
    "revision": "F15.14-R1",
    "status": "VALIDATO_CONDIZIONATO",
    "scope": "verifica_finale_lama_rotazione_controllata_freno_motore_e_rilascio_leva",
    "approval": {
      "reviewerRole": "esperto_di_dominio",
      "decision": "APPROVATO_CON_RIMOZIONE_RIPETIZIONE_SICUREZZA",
      "approvedOn": "2026-11-08",
      "evidence": "utente_elimina_richiamo_sicurezza_gia_nel_passaggio_precedente_e_approva_resto_fase_15_14"
    },
    "content": {
      "title": "Verifica finale del montaggio della lama",
      "instruction": "Controllo della rotazione della lama\n\nMantieni il rasaerba stabile e indossa guanti protettivi adeguati.\n\nProva a far ruotare lentamente la lama a mano, senza afferrare i bordi taglienti.\n\nAttenzione al freno motore\n\nSu molti rasaerba, quando la leva di sicurezza sul manubrio viene rilasciata, si attiva un freno che rende più difficoltosa la rotazione della lama.\n\nQuesta resistenza può essere normale e non indica necessariamente un problema.\n\nSe la lama oppone molta resistenza, non forzarla.\n\nSe necessario, e soltanto dopo aver verificato che il motore non possa avviarsi, puoi chiedere a un'altra persona di mantenere temporaneamente azionata la leva di sicurezza mentre effettui il controllo.\n\nNon bloccare la leva con corde o altri dispositivi: un blocco potrebbe lasciare disattivato il sistema di sicurezza anche dopo il controllo.\n\nVerifica finale\n\nControlla che:\n- La lama non tocchi la scocca o altri componenti.\n- Non siano presenti giochi anomali nel fissaggio.\n- Non si avvertano urti, impuntamenti o sfregamenti anomali.\n\nUna volta completata la verifica, assicurati che la leva di sicurezza sia stata rilasciata.",
      "stopCondition": "Se rilevi interferenze, giochi anomali o non riesci a effettuare il controllo in condizioni di sicurezza, non considerare completata la verifica e non avviare il rasaerba finché il problema non è stato risolto."
    },
    "applicability": {
      "machineFamily": "rasaerba_a_benzina",
      "audience": "utilizzatore_tagliando_gratuito",
      "requiresActualBladeReinstallation": true,
      "doNotRequestIfOptionalBladeRemovalSkipped": true,
      "motorCannotStartPrerequisiteRemainsEffective": true,
      "avoidRepeatedGeneralSafetyParagraph": true,
      "stableMowerAndProtectiveGloves": true,
      "controlledManualRotationAwayFromCuttingEdges": true,
      "brakeMayIncreaseResistanceWithoutDefect": true,
      "doNotForceBladeAgainstBrake": true,
      "assistantMayHoldSafetyLeverOnlyAfterMotorStartDisabled": true,
      "ropeOrOtherLeverBlockingProhibited": true,
      "releaseSafetyLeverAfterCheck": true,
      "inspectDeckInterferenceAndAbnormalPlay": true,
      "stopOnAbnormalitiesOrUnsafeTest": true,
      "noEngineStartWhileUnresolved": true,
      "universalAuthorization": false
    },
    "evidence": [
      {
        "kind": "expert_review",
        "description": "Esperto conferma che il freno motore può opporre forte resistenza ma non blocca necessariamente la rotazione; accetta collaboratore per tenere la leva ma esclude cordicelle; chiede di eliminare il richiamo iniziale ripetitivo a motore spento/candela scollegata/avviamento elettrico.",
        "approvedOn": "2026-11-08"
      }
    ],
    "aiUseAllowed": false
  },
  {
    "stepId": "RASA-OP-03-P01",
    "revision": "F15.16-R1",
    "status": "VALIDATO_CONDIZIONATO",
    "scope": "filtro_aria_preparazione_apertura_e_identificazione_tipologia_con_arresto_per_fissaggi_danneggiati",
    "approval": {
      "reviewerRole": "esperto_di_dominio",
      "decision": "APPROVATO_SENZA_MODIFICHE",
      "approvedOn": "2026-11-08",
      "evidence": "utente_approva_testo_preparazione_apertura_filtro_aria_con_va_bene_fase_15_16"
    },
    "content": {
      "title": "Preparazione e apertura",
      "instruction": "Prima di intervenire sul filtro dell'aria, verifica che il rasaerba sia nella normale posizione di lavoro, stabile, con il motore spento e freddo.\n\nIndividua la scatola del filtro aria e osserva il sistema di fissaggio del coperchio.\n\nApri il coperchio senza forzarlo, utilizzando il sistema previsto: linguette, viti, pomelli o altri fissaggi.\n\nPrima di estrarre il filtro, osserva come è montato e identifica la tipologia presente:\n- Filtro in carta.\n- Filtro in spugna.\n- Filtro misto, con carta e prefiltro in spugna.\n\nDurante l'operazione evita che polvere, erba o altri residui entrino nel condotto di aspirazione del carburatore.",
      "stopCondition": "Se il coperchio non si apre normalmente o presenta fissaggi danneggiati, non forzarlo. Registra il problema prima di procedere."
    },
    "applicability": {
      "machineFamily": "rasaerba_a_benzina",
      "audience": "utilizzatore_tagliando_gratuito",
      "requiresNormalOperatingPosition": true,
      "requiresStablePosition": true,
      "requiresEngineStopped": true,
      "requiresCoolEngine": true,
      "identifyCoverFasteningSystemBeforeOpening": true,
      "noForcingCover": true,
      "identifyFilterTypeAfterOpeningBeforeExtraction": true,
      "filterTypes": [
        "carta",
        "spugna",
        "misto"
      ],
      "preserveFilterOrientationKnowledge": true,
      "protectCarburetorIntakeFromContamination": true,
      "stopOnStuckCoverOrDamagedFasteners": true,
      "doesNotAuthorizeFilterTreatment": true,
      "universalAuthorization": false
    },
    "evidence": [
      {
        "kind": "expert_review",
        "description": "L'esperto ha approvato senza modifiche ('va bene') il testo proposto per la preparazione e l'apertura della scatola filtro in Fase 15.16.",
        "approvedOn": "2026-11-08"
      }
    ],
    "aiUseAllowed": false
  },
  {
    "stepId": "RASA-OP-03-P02",
    "revision": "F15.17-R1",
    "status": "VALIDATO_CONDIZIONATO",
    "scope": "filtro_aria_valutazione_separata_carta_spugna_misto_ricambio_compatibile_e_stop_se_assente",
    "approval": {
      "reviewerRole": "esperto_di_dominio",
      "decision": "APPROVATO_SENZA_MODIFICHE",
      "approvedOn": "2026-11-08",
      "evidence": "utente_conferma_corretta_procedura_valutazione_filtro_p02_e_autorizza_procedere_fase_15_17"
    },
    "content": {
      "title": "Valutazione del materiale",
      "instruction": "Dopo aver aperto il coperchio e identificato il tipo di filtro, estrai l'elemento facendo attenzione a non far cadere residui nel condotto di aspirazione.\n\nEsamina il materiale filtrante:\n\nFiltro in carta: verifica che non presenti strappi, deformazioni, umidità o accumuli eccessivi di sporco. Normalmente viene sostituito durante il tagliando. Se è stato montato recentemente ed è ancora pulito e integro, valuta se può essere mantenuto nel rispetto delle indicazioni del costruttore.\n\nFiltro in spugna: controlla che sia morbido, elastico e integro. Se risulta indurito, friabile, lacerato o deformato, deve essere sostituito. Se è in buone condizioni, potrà essere pulito nel passaggio successivo.\n\nFiltro misto: valuta separatamente l'elemento in carta e il prefiltro in spugna, applicando a ciascuno i relativi criteri.\n\nNon effettuare ancora lavaggio, oliatura o pulizia: saranno trattati nei passaggi successivi.",
      "stopCondition": "Se un elemento deve essere sostituito e non disponi di un ricambio compatibile, registra la lavorazione come sospesa. Non avviare il motore senza il sistema filtrante correttamente installato."
    },
    "applicability": {
      "machineFamily": "rasaerba_a_benzina",
      "audience": "utilizzatore_tagliando_gratuito",
      "requiresApprovedFilterOpeningStep": "RASA-OP-03-P01",
      "requiresIdentifiedFilterType": true,
      "removeElementWithoutIntakeContamination": true,
      "requiresSeparateMixedElementAssessment": true,
      "filterTypes": [
        "carta",
        "spugna",
        "misto"
      ],
      "paperReplaceNormally": true,
      "paperReuseOnlyIfRecentlyInstalledCleanIntactAndManufacturerPermits": true,
      "paperDamageCriteria": [
        "strappi",
        "deformazioni",
        "umidità",
        "sporco_eccessivo"
      ],
      "foamReuseOnlyIfSoftElasticIntact": true,
      "foamReplaceWhenHardenedFriableTornOrDeformed": true,
      "noWashingOilingOrCleaningAtThisStep": true,
      "stopIfCompatibleReplacementMissing": true,
      "recordWorkSuspendedIfReplacementMissing": true,
      "noEngineStartWithoutCorrectlyInstalledAirFilter": true,
      "universalAuthorization": false
    },
    "evidence": [
      {
        "kind": "expert_review",
        "description": "L'esperto ha confermato 'corretta. Puoi procedere' per il testo proposto in Fase 15.17 relativo alla valutazione di carta, spugna e filtro misto, al ricambio compatibile e al blocco dell'avviamento senza sistema filtrante correttamente montato.",
        "approvedOn": "2026-11-08"
      }
    ],
    "aiUseAllowed": false
  },
  {
    "stepId": "RASA-OP-03-P03",
    "revision": "F15.18-R2",
    "status": "VALIDATO_CONDIZIONATO",
    "scope": "trattamento_filtro_carta_sostituzione_o_conservazione_e_soffiaggio_delicato_senza_lavaggio_oliatura",
    "approval": {
      "reviewerRole": "esperto_di_dominio",
      "decision": "APPROVATO_CON_RIMOZIONI_ESPLICITE",
      "approvedOn": "2026-11-08",
      "evidence": "utente_conferma_r2_rimozione_eccezione_lavaggio_oliatura_e_metodi_pulizia_diversi_da_soffiaggio"
    },
    "content": {
      "title": "Trattamento del filtro in carta",
      "instruction": "Questo passaggio si applica ai filtri in carta e ai filtri misti. Se il rasaerba monta soltanto un filtro in spugna, il passaggio viene saltato.\n\nIn base alla valutazione effettuata nel passaggio precedente:\n\nCaso A — Filtro da sostituire\n\nPrepara un filtro nuovo compatibile con il motore, verificando che abbia forma, dimensioni e superfici di tenuta adeguate. Mantienilo pulito fino al rimontaggio.\n\nCaso B — Filtro ancora utilizzabile\n\nSe il filtro è stato montato recentemente, è integro e pulito, conservalo al riparo da sporco e contaminazioni fino al rimontaggio.\n\nPrecauzioni\n\n- Non lavare né oliare i filtri in carta.\n- Se necessario, l'eventuale pulizia si limita a un soffiaggio delicato con aria compressa, evitando getti aggressivi che possano danneggiare il materiale filtrante.\n- Nei filtri misti, il prefiltro in spugna sarà trattato separatamente nei passaggi successivi.",
      "stopCondition": "Se il filtro sostitutivo non è compatibile, non montarlo. Registra l'anomalia e non avviare il motore senza un elemento filtrante idoneo correttamente installato."
    },
    "applicability": {
      "machineFamily": "rasaerba_a_benzina",
      "audience": "utilizzatore_tagliando_gratuito",
      "requiresApprovedFilterEvaluationStep": "RASA-OP-03-P02",
      "allowedFilterTypes": [
        "carta",
        "misto"
      ],
      "skipForFoamOnly": true,
      "paperReplacementMustFitMotor": true,
      "replacementRequiresSuitableFormSizeAndSeals": true,
      "reuseOnlyIfRecentlyInstalledIntactAndClean": true,
      "keepFilterProtectedFromContamination": true,
      "neverWashPaper": true,
      "neverOilPaper": true,
      "onlyPermittedPaperCleaningMethod": "soffiaggio_delicato_aria_compressa",
      "compressedAirIfNeededOnly": true,
      "noAggressiveAirJets": true,
      "foamPrefilterTreatedSeparatelyLater": true,
      "stopIfReplacementIncompatible": true,
      "recordAnomalyOnIncompatibility": true,
      "noEngineStartWithoutSuitableCorrectlyInstalledFilter": true,
      "universalAuthorization": false
    },
    "evidence": [
      {
        "kind": "expert_review",
        "description": "L'esperto chiede due eliminazioni: nessuna eccezione del costruttore per lavare/oliare la carta e nessun richiamo a metodi di pulizia diversi dal soffiaggio. Conferma integralmente la proposta R2 con 'confermo'.",
        "approvedOn": "2026-11-08"
      }
    ],
    "aiUseAllowed": false
  },
  {
    "stepId": "RASA-OP-03-P04",
    "revision": "F15.19-R2",
    "status": "VALIDATO_CONDIZIONATO",
    "scope": "lavaggio_spugna_detergente_specifico_risciacquo_asciugatura_divieto_solventi",
    "approval": {
      "reviewerRole": "esperto_di_dominio",
      "decision": "APPROVATO_CON_TRE_MODIFICHE_ESPLICITE",
      "approvedOn": "2026-11-09",
      "evidence": "utente_richiede_detergente_specifico_compressione_durante_immersione_e_precauzioni_su_idrocarburi_solventi_con_restante_testo_approvato"
    },
    "content": {
      "title": "Lavaggio del filtro in spugna",
      "instruction": "Questo passaggio riguarda i filtri interamente in spugna e il prefiltro in spugna dei filtri misti. Se il rasaerba monta soltanto un filtro in carta, salta questo passaggio.\n\nSe la spugna è stata giudicata riutilizzabile nel controllo precedente e può essere lavata, procedi nel seguente modo.\n\nLavaggio\n\nImmergi la spugna in acqua tiepida con una piccola quantità di detergente specifico per filtri aria. Durante l'immersione comprimila ripetutamente con le mani, senza torcerla, per rimuovere lo sporco e gli eventuali residui d'olio.\n\nRisciacquo\n\nRisciacqua accuratamente con acqua pulita, comprimendo delicatamente la spugna fino a eliminare il detergente e lo sporco residuo.\n\nAsciugatura\n\nElimina l'acqua in eccesso premendo delicatamente la spugna all'interno di un panno pulito, senza torcerla.\n\nLasciala asciugare completamente all'aria, evitando fonti di calore diretto.\n\nVerifica finale\n\nControlla nuovamente che la spugna sia integra, morbida ed elastica. Se presenta lacerazioni, parti friabili, irrigidimenti o deformazioni, sostituiscila con un elemento compatibile.\n\nNei filtri misti, mantieni separato e protetto dall'acqua l'elemento in carta.\n\nPrecauzioni\n\nL'utilizzo di gasolio, benzine o idrocarburi come detergente è sconsigliato. L'utilizzo di solventi (diluente/acetone/...) è assolutamente vietato.\n\nEvita getti aggressivi di aria compressa che potrebbero danneggiare il materiale.\n\nL'eventuale oliatura viene gestita nel passaggio successivo, RASA-OP-03-P05.",
      "stopCondition": "Se la spugna è danneggiata, non è possibile stabilire se sia lavabile, oppure non è disponibile un ricambio compatibile quando necessario, registra l'anomalia e sospendi il trattamento.\n\nNon avviare il motore senza il sistema filtrante idoneo, completamente trattato e correttamente rimontato."
    },
    "applicability": {
      "machineFamily": "rasaerba_a_benzina",
      "audience": "utilizzatore_tagliando_gratuito",
      "requiresApprovedFilterEvaluationStep": "RASA-OP-03-P02",
      "allowedFilterTypes": [
        "spugna",
        "misto"
      ],
      "skipForPaperOnly": true,
      "foamMustBeReusableAndWashable": true,
      "useAirFilterSpecificCleaner": true,
      "squeezeDuringImmersion": true,
      "avoidTwisting": true,
      "rinseThoroughly": true,
      "dryCompletelyBeforeOiling": true,
      "avoidDirectHeat": true,
      "paperElementMustStayDryInMixedFilter": true,
      "fuelAndHydrocarbonCleanersDiscouraged": true,
      "solventsProhibited": true,
      "noAggressiveCompressedAir": true,
      "oilingHandledByStepId": "RASA-OP-03-P05",
      "stopIfFoamDamagedOrWashabilityUnknown": true,
      "stopIfCompatibleReplacementUnavailable": true,
      "recordAnomalyOnStop": true,
      "noEngineStartWithoutSuitableCorrectlyTreatedAndInstalledFilter": true,
      "universalAuthorization": false
    },
    "evidence": [
      {
        "kind": "expert_review",
        "description": "L'esperto approva la proposta F15.19 dopo tre modifiche: detergente specifico per filtri aria, compressione durante l'immersione, idrocarburi sconsigliati e solventi assolutamente vietati; resto confermato.",
        "approvedOn": "2026-11-09"
      }
    ],
    "aiUseAllowed": false
  },
  {
    "stepId": "RASA-OP-03-P05",
    "revision": "F15.20-R3",
    "status": "VALIDATO_CONDIZIONATO",
    "scope": "filtro_sola_spugna_oliatura_prefiltro_misto_asciutto_configurazioni_modello_operatore_competente",
    "approval": {
      "reviewerRole": "esperto_di_dominio",
      "decision": "APPROVATO_DOPO_REVISIONE_R3",
      "approvedOn": "2026-11-09",
      "evidence": "utente_conferma_proposta_f15_20_r3_sola_spugna_oliare_prefiltro_non_oliare_standard_e_casi_specifici_solo_con_conoscenza_modello_operatore"
    },
    "content": {
      "title": "Oliatura filtro in spugna",
      "instruction": "Questo passaggio riguarda i filtri interamente in spugna e i prefiltro in spugna dei sistemi misti. Se è presente soltanto un filtro in carta, salta il passaggio.\n\nCampo di applicazione\n\nFiltro in sola spugna: eseguire l'oliatura.\n\nPrefiltro in spugna abbinato a filtro in carta: non oliare nella procedura standard dell'app.\n\nConfigurazioni particolari: utilizzare la conoscenza tecnica pregressa dell'operatore, purché riferita allo specifico modello. Se non si conosce il trattamento corretto, non procedere per supposizione.\n\nProcedura di oliatura\n\nPrima di procedere, assicurati che il filtro in spugna sia completamente asciutto dopo il lavaggio.\n\nMetodo A — Olio spray per filtri aria\n\nDistribuisci uniformemente sulla spugna l'olio spray specifico per filtri aria.\n\nComprimi delicatamente la spugna per distribuire l'olio nel materiale, evitando accumuli e quantità eccessive.\n\nMetodo B — Olio motore\n\nImmergi la spugna in olio motore nuovo e pulito.\n\nEstraila e comprimila ripetutamente, senza torcerla, per eliminare l'olio in eccesso. Se necessario, utilizza un panno pulito per assorbire ulteriori residui.\n\nControllo finale\n\nVerifica che l'olio sia distribuito uniformemente e che il filtro non presenti accumuli o gocciolamenti.\n\nConserva il filtro pulito e protetto fino al rimontaggio.",
      "stopCondition": "Se il filtro in sola spugna richiede l'oliatura ma non disponi di olio idoneo, sospendi il trattamento e registra l'anomalia.\n\nNon avviare il motore senza il sistema filtrante correttamente trattato e rimontato."
    },
    "applicability": {
      "machineFamily": "rasaerba_a_benzina",
      "audience": "utilizzatore_tagliando_gratuito",
      "requiresApprovedFilterAssessmentStep": "RASA-OP-03-P02",
      "requiresApprovedFoamWashingStepIfPerformed": "RASA-OP-03-P04",
      "allowedFilterTypes": [
        "spugna",
        "misto"
      ],
      "skipForPaperOnly": true,
      "oilFoamOnlyFilter": true,
      "noPrefilterOilingInStandardApp": true,
      "modelSpecificExceptionOnlyWithOperatorPriorKnowledge": true,
      "unknownConfigurationMustNotBeGuessed": true,
      "foamMustBeCompletelyDryAfterWashing": true,
      "allowAirFilterOilSpray": true,
      "allowNewCleanMotorOil": true,
      "distributeOilByGentleCompression": true,
      "avoidTwisting": true,
      "removeExcessOil": true,
      "noAccumulationOrDrips": true,
      "keepPreparedFilterProtected": true,
      "stopIfRequiredOilUnavailable": true,
      "recordAnomalyOnStop": true,
      "noEngineStartWithoutCorrectlyTreatedAndReassembledFilter": true,
      "universalAuthorization": false
    },
    "evidence": [
      {
        "kind": "expert_review",
        "description": "Dopo le revisioni R1/R2, l'esperto stabilisce che nella procedura standard i prefiltro spugna associati a carta non si oliano, mentre il filtro in sola spugna si olia; per configurazioni particolari la scelta dipende dalla conoscenza pregressa riferita al modello. Conferma espressamente R3 senza ulteriori modifiche.",
        "approvedOn": "2026-11-09"
      }
    ],
    "aiUseAllowed": false
  },
  {
    "stepId": "RASA-OP-03-P06",
    "revision": "F15.21-R1",
    "status": "VALIDATO_CONDIZIONATO",
    "scope": "pulizia_scatola_e_coperchio_filtro_aria_protezione_condotto_aspirazione_verifica_tenuta",
    "approval": {
      "reviewerRole": "esperto_di_dominio",
      "decision": "APPROVATO_SENZA_MODIFICHE",
      "approvedOn": "2026-11-09",
      "evidence": "utente_conferma_integralmente_proposta_f15_21_r1_con_va_bene"
    },
    "content": {
      "title": "Pulizia della scatola del filtro aria",
      "instruction": "Con l'elemento filtrante rimosso, controlla l'interno della scatola, il coperchio e la zona vicina al condotto di aspirazione.\n\nRimozione dello sporco\n\nUtilizza un panno pulito, asciutto o leggermente inumidito, per rimuovere polvere, residui d'erba e depositi presenti nella scatola e nel coperchio.\n\nSe sono presenti residui oleosi, utilizza un panno con una piccola quantità di detergente compatibile con plastica e guarnizioni, eliminando successivamente gli eventuali residui di detergente.\n\nPulisci anche le superfici sulle quali appoggia il filtro, così da evitare che lo sporco comprometta la tenuta.\n\nPrecauzioni\n\nEvita che polvere, residui, liquidi o altri corpi estranei entrino nel condotto di aspirazione diretto al carburatore.\n\nNon dirigere getti di aria compressa o acqua verso l'ingresso del carburatore.\n\nNon introdurre utensili o panni all'interno del condotto di aspirazione.\n\nVerifica finale\n\nControlla che l'interno della scatola e il coperchio siano puliti, senza residui o umidità.\n\nIl rimontaggio del filtro sarà effettuato nel passaggio successivo, RASA-OP-03-P07.",
      "stopCondition": "Se trovi la scatola danneggiata, guarnizioni compromesse oppure sospetti che siano entrati corpi estranei nel condotto di aspirazione, registra l'anomalia e sospendi il rimontaggio fino alla verifica del problema."
    },
    "applicability": {
      "machineFamily": "rasaerba_a_benzina",
      "audience": "utilizzatore_tagliando_gratuito",
      "requiresFilterRemoved": true,
      "allowedFilterTypes": [
        "carta",
        "spugna",
        "misto"
      ],
      "wipeWithCleanDryOrSlightlyDampCloth": true,
      "removeGrassDustAndDeposits": true,
      "compatibleCleanerForOilResidueOnly": true,
      "removeCleanerResidue": true,
      "cleanFilterSealingSurfaces": true,
      "protectCarburetorIntakeFromDebrisAndLiquids": true,
      "noCompressedAirOrWaterJetsTowardIntake": true,
      "noToolsOrClothsInsertedIntoIntake": true,
      "housingAndCoverDryAndFreeOfResidues": true,
      "reassemblyHandledByStepId": "RASA-OP-03-P07",
      "stopIfDamagedHousingOrSeals": true,
      "stopIfSuspectedIntakeContamination": true,
      "recordAnomalyAndSuspendReassembly": true,
      "universalAuthorization": false
    },
    "evidence": [
      {
        "kind": "expert_review",
        "description": "L'esperto approva senza modifiche la proposta F15.21-R1 sulla pulizia con panno di scatola e coperchio, detergente compatibile per residui oleosi, protezione condotto di aspirazione, controllo sede filtro e condizioni di arresto.",
        "approvedOn": "2026-11-09"
      }
    ],
    "aiUseAllowed": false
  },
  {
    "stepId": "RASA-OP-03-P07",
    "revision": "F15.22-R1",
    "status": "VALIDATO_CONDIZIONATO",
    "scope": "rimontaggio_filtro_aria_carta_spugna_misto_posizionamento_aderenza_chiusura_tenuta",
    "approval": {
      "reviewerRole": "esperto_di_dominio",
      "decision": "APPROVATO_SENZA_MODIFICHE",
      "approvedOn": "2026-11-09",
      "evidence": "utente_approva_integralmente_proposta_f15_22_r1_rimontaggio_filtro_aria"
    },
    "content": {
      "title": "Rimontaggio del filtro aria",
      "instruction": "Preparazione al rimontaggio\n\nDopo aver completato i trattamenti previsti nei passaggi precedenti, prepara gli elementi filtranti per il rimontaggio.\n\nControlla che la scatola filtro sia pulita e asciutta e che non siano rimasti residui sulle superfici di appoggio.\n\nInserimento del filtro\n\nInserisci il filtro nella propria sede, rispettando l'orientamento e gli eventuali incastri.\n\nFiltro in carta: posiziona correttamente l'elemento filtrante, verificando l'aderenza delle superfici di tenuta.\n\nFiltro in sola spugna: inserisci la spugna precedentemente trattata nella propria sede, senza deformarla.\n\nFiltro misto: rimonta l'elemento in carta e il prefiltro in spugna nelle rispettive posizioni, rispettando la configurazione originaria.\n\nControlla che gli elementi siano correttamente appoggiati e che nessuna parte del filtro rimanga piegata, schiacciata o fuori sede.\n\nChiusura della scatola filtro\n\nRiposiziona il coperchio facendo coincidere eventuali guide, linguette o incastri.\n\nChiudi i ganci oppure serra le viti di fissaggio, secondo il sistema presente, evitando di forzare o deformare il coperchio.\n\nVerifica finale\n\nControlla che il coperchio sia stabilmente fissato, che non presenti aperture involontarie e che il filtro sia correttamente posizionato.\n\nVerifica che non siano presenti fessure o discontinuità nelle superfici di tenuta che consentirebbero all'aria di bypassare l'elemento filtrante.",
      "stopCondition": "Se il filtro non entra correttamente nella propria sede, il coperchio non si chiude, i fissaggi sono danneggiati oppure non è possibile garantire la tenuta del sistema, registra l'anomalia e sospendi il completamento dell'operazione.\n\nNon avviare il motore senza il sistema filtrante correttamente installato."
    },
    "applicability": {
      "machineFamily": "rasaerba_a_benzina",
      "audience": "utilizzatore_tagliando_gratuito",
      "afterApplicableFilterTreatments": true,
      "requiresCleanAndDryHousing": true,
      "allowedFilterTypes": [
        "carta",
        "spugna",
        "misto"
      ],
      "respectElementOrientationAndRetainers": true,
      "paperFilterRequiresSealingSurfaceContact": true,
      "foamOnlyMustBePreviouslyTreatedAndUndeformed": true,
      "mixedFilterRequiresCorrectPaperAndPrefilterPositions": true,
      "noFoldedCrushedOrMisplacedElement": true,
      "alignHousingLatchesTabsOrGuides": true,
      "closeUsingExistingLatchesOrScrews": true,
      "avoidForceOrCoverDeformation": true,
      "verifyStableCoverClosure": true,
      "verifyNoUnfilteredAirBypass": true,
      "stopIfFilterCannotSeat": true,
      "stopIfCoverCannotClose": true,
      "stopIfFastenersDamaged": true,
      "stopIfSealingCannotBeEnsured": true,
      "recordAnomalyOnStop": true,
      "noEngineStartWithoutCorrectlyInstalledFilter": true,
      "universalAuthorization": false
    },
    "evidence": [
      {
        "kind": "expert_review",
        "description": "L'esperto approva integralmente F15.22-R1 per rimontaggio filtro carta/spugna/misto, chiusura e verifica della tenuta, con sospensione del completamento in caso di fissaggi, sede o tenuta anomali.",
        "approvedOn": "2026-11-09"
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
  if(!Array.isArray(candidate) || candidate.length!==21)
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
       (entry.approval?.approvedOn==='2026-11-04' || (['RASA-OP-01-P04','RASA-OP-01-P05','RASA-OP-01-P06'].includes(entry.stepId) && entry.approval?.approvedOn==='2026-11-05') || (['RASA-OP-02-P01','RASA-OP-02-P02','RASA-OP-02-P03'].includes(entry.stepId) && entry.approval?.approvedOn==='2026-11-06') || (['RASA-OP-02-P04','RASA-OP-02-P05','RASA-OP-02-P06','RASA-OP-02-P07'].includes(entry.stepId) && entry.approval?.approvedOn==='2026-11-07') || (['RASA-OP-02-P08','RASA-OP-03-P01','RASA-OP-03-P02','RASA-OP-03-P03'].includes(entry.stepId) && entry.approval?.approvedOn==='2026-11-08') || (['RASA-OP-03-P04','RASA-OP-03-P05','RASA-OP-03-P06','RASA-OP-03-P07'].includes(entry.stepId) && entry.approval?.approvedOn==='2026-11-09')) &&
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
    const approvedOP02P06=entry.stepId==='RASA-OP-02-P06' &&
       entry.revision==='F15.12-R1' &&
       entry.scope==='equilibratura_lama_dopo_affilatura_fulcro_centrale_e_controllo_ripetuto' &&
       entry.approval?.decision==='APPROVATO_CON_CHIARIMENTO_ESPLICITO' &&
       entry.approval?.evidence==='approvazione_esplicita_utente_spiegazione_cacciavite_fulcro_forocentrale_fase_15_12' &&
       entry.applicability?.audience==='utilizzatore_tagliando_gratuito' &&
       entry.applicability?.requiresApprovedBladeSharpeningStep==='RASA-OP-02-P05' &&
       entry.applicability?.onlyAfterSharpening===true &&
       entry.applicability?.screwdriverIsBalanceFulcrum===true &&
       entry.applicability?.horizontallySecuredCylindricalShaft===true &&
       entry.applicability?.supportAtBladeCenterHole===true &&
       entry.applicability?.centerSupportExact===true &&
       entry.applicability?.bladeEndsMustMoveFreely===true &&
       entry.applicability?.repeatCheckMultipleTimes===true &&
       entry.applicability?.heavierEndFalls===true &&
       entry.applicability?.removeMinimalMaterialFromHeavierEndOnlyIfCorrectable===true &&
       entry.applicability?.preserveBladeOriginalGeometry===true &&
       entry.applicability?.stopIfClearlyUnbalancedDeformedOrDamaged===true &&
       entry.applicability?.professionalAlternativeAvailable===true &&
       entry.applicability?.fingerUsedAsBalanceSupport===false &&
       entry.content.instruction.includes('il gambo cilindrico') &&
       entry.content.instruction.includes('fissalo orizzontalmente in una morsa') &&
       entry.content.instruction.includes('foro centrale della lama') &&
       entry.content.instruction.includes("sostenuta esattamente al centro, come un'altalena appoggiata sul proprio fulcro") &&
       entry.content.instruction.includes('le due estremità della lama siano libere di muoversi') &&
       entry.content.instruction.includes('Se un\'estremità scende ripetutamente') &&
       entry.content.instruction.includes('Ripeti la prova più volte') &&
       entry.content.instruction.includes('dalla parte più pesante') &&
       entry.content.stopCondition.includes('Non rimontare una lama evidentemente sbilanciata') &&
       entry.evidence.length===1 && entry.evidence[0].kind==='expert_review';
    const approvedOP02P07=entry.stepId==='RASA-OP-02-P07' &&
       entry.revision==='F15.13-R1' &&
       entry.scope==='rimontaggio_lama_serraggio_con_coppia_pertinente_e_prerequisito_prima_dello_smontaggio' &&
       entry.approval?.decision==='APPROVATO_SENZA_MODIFICHE' &&
       entry.approval?.evidence==='conferma_esplicita_testo_montaggio_serraggio_con_verifica_prima_smontaggio_fase_15_13' &&
       entry.applicability?.audience==='utilizzatore_tagliando_gratuito' &&
       entry.applicability?.prerequisiteBeforeBladeRemovalStep==='RASA-OP-02-P02' &&
       entry.applicability?.requiresDeclaredRelevantTorqueValueNm===true &&
       entry.applicability?.requiresDeclaredTorqueSource===true &&
       entry.applicability?.requiresDeclaredSuitableTorqueWrench===true &&
       entry.applicability?.declarationDoesNotReplaceActualSafetyRequirements===true &&
       entry.applicability?.skipOptionalBladeWorkIfPrerequisitesMissing===true &&
       entry.applicability?.recordSkipAsNotExecuted===true &&
       entry.applicability?.continueOtherServiceTasksOnSafeSkip===true &&
       entry.applicability?.doNotSkipIfAlreadyDismantledUnsafe===true &&
       entry.applicability?.stopIfBladeAlreadyRemovedCannotBeSafelyReinstalled===true &&
       entry.applicability?.requiresCorrectBladeOrientation===true &&
       entry.applicability?.requiresProperHubCentering===true &&
       entry.applicability?.preserveFixingComponentOrder===true &&
       entry.applicability?.startThreadByHand===true &&
       entry.applicability?.requiresApprovedRotationRestraintStep==='RASA-OP-02-P02' &&
       entry.applicability?.torqueMustBeRelevantToActualFastener===true &&
       entry.applicability?.impactGunNotValidForFinalTorque===true &&
       entry.applicability?.noUniversalTorqueFallback===true &&
       entry.applicability?.noMandatoryThreadlocker===true &&
       entry.content.prerequisite.includes('prima dello smontaggio della lama') &&
       entry.content.prerequisite.includes('coppia in Nm e la relativa fonte') &&
       entry.content.prerequisite.includes('non eseguita') &&
       entry.content.assemblyInstruction.includes('sede di centraggio del mozzo') &&
       entry.content.assemblyInstruction.includes('Avvita inizialmente i bulloni a mano') &&
       entry.content.tighteningInstruction.includes('chiave dinamometrica idonea') &&
       entry.content.tighteningInstruction.includes('verificata come pertinente al fissaggio') &&
       entry.content.tighteningInstruction.includes('pistola a impulsi non deve essere utilizzata per stabilire la coppia finale') &&
       entry.content.stopCondition.includes('Se la lama è già stata smontata') &&
       entry.content.stopCondition.includes('richiedi una verifica tecnica') &&
       entry.evidence.length===1 && entry.evidence[0].kind==='expert_review';
    const approvedOP02P08=entry.stepId==='RASA-OP-02-P08' &&
       entry.revision==='F15.14-R1' &&
       entry.scope==='verifica_finale_lama_rotazione_controllata_freno_motore_e_rilascio_leva' &&
       entry.approval?.decision==='APPROVATO_CON_RIMOZIONE_RIPETIZIONE_SICUREZZA' &&
       entry.approval?.evidence==='utente_elimina_richiamo_sicurezza_gia_nel_passaggio_precedente_e_approva_resto_fase_15_14' &&
       entry.applicability?.audience==='utilizzatore_tagliando_gratuito' &&
       entry.applicability?.requiresActualBladeReinstallation===true &&
       entry.applicability?.doNotRequestIfOptionalBladeRemovalSkipped===true &&
       entry.applicability?.motorCannotStartPrerequisiteRemainsEffective===true &&
       entry.applicability?.avoidRepeatedGeneralSafetyParagraph===true &&
       entry.applicability?.stableMowerAndProtectiveGloves===true &&
       entry.applicability?.controlledManualRotationAwayFromCuttingEdges===true &&
       entry.applicability?.brakeMayIncreaseResistanceWithoutDefect===true &&
       entry.applicability?.doNotForceBladeAgainstBrake===true &&
       entry.applicability?.assistantMayHoldSafetyLeverOnlyAfterMotorStartDisabled===true &&
       entry.applicability?.ropeOrOtherLeverBlockingProhibited===true &&
       entry.applicability?.releaseSafetyLeverAfterCheck===true &&
       entry.applicability?.inspectDeckInterferenceAndAbnormalPlay===true &&
       entry.applicability?.stopOnAbnormalitiesOrUnsafeTest===true &&
       entry.applicability?.noEngineStartWhileUnresolved===true &&
       entry.content.instruction.includes('Mantieni il rasaerba stabile e indossa guanti protettivi adeguati') &&
       entry.content.instruction.includes('un freno che rende più difficoltosa la rotazione') &&
       entry.content.instruction.includes('non indica necessariamente un problema') &&
       entry.content.instruction.includes('non forzarla') &&
       entry.content.instruction.includes("soltanto dopo aver verificato che il motore non possa avviarsi") &&
       entry.content.instruction.includes("un'altra persona di mantenere temporaneamente azionata la leva di sicurezza") &&
       entry.content.instruction.includes('Non bloccare la leva con corde o altri dispositivi') &&
       entry.content.instruction.includes('la leva di sicurezza sia stata rilasciata') &&
       !entry.content.instruction.includes('Prima di procedere, assicurati che il motore sia spento') &&
       !entry.content.instruction.includes('il cappuccio della candela sia scollegato e isolato') &&
       entry.content.stopCondition.includes('non avviare il rasaerba') &&
       entry.evidence.length===1 && entry.evidence[0].kind==='expert_review';
    const approvedOP03P01=entry.stepId==='RASA-OP-03-P01' &&
       entry.revision==='F15.16-R1' &&
       entry.scope==='filtro_aria_preparazione_apertura_e_identificazione_tipologia_con_arresto_per_fissaggi_danneggiati' &&
       entry.approval?.decision==='APPROVATO_SENZA_MODIFICHE' &&
       entry.approval?.evidence==='utente_approva_testo_preparazione_apertura_filtro_aria_con_va_bene_fase_15_16' &&
       entry.applicability?.audience==='utilizzatore_tagliando_gratuito' &&
       entry.applicability?.requiresNormalOperatingPosition===true &&
       entry.applicability?.requiresStablePosition===true &&
       entry.applicability?.requiresEngineStopped===true &&
       entry.applicability?.requiresCoolEngine===true &&
       entry.applicability?.identifyCoverFasteningSystemBeforeOpening===true &&
       entry.applicability?.noForcingCover===true &&
       entry.applicability?.identifyFilterTypeAfterOpeningBeforeExtraction===true &&
       Array.isArray(entry.applicability?.filterTypes) &&
       JSON.stringify(entry.applicability.filterTypes)==='["carta","spugna","misto"]' &&
       entry.applicability?.preserveFilterOrientationKnowledge===true &&
       entry.applicability?.protectCarburetorIntakeFromContamination===true &&
       entry.applicability?.stopOnStuckCoverOrDamagedFasteners===true &&
       entry.applicability?.doesNotAuthorizeFilterTreatment===true &&
       entry.content.instruction.includes('normale posizione di lavoro') &&
       entry.content.instruction.includes('motore spento e freddo') &&
       entry.content.instruction.includes('Apri il coperchio senza forzarlo') &&
       entry.content.instruction.includes('Prima di estrarre il filtro') &&
       entry.content.instruction.includes('Filtro in carta') &&
       entry.content.instruction.includes('Filtro in spugna') &&
       entry.content.instruction.includes('Filtro misto') &&
       entry.content.instruction.includes('polvere, erba o altri residui') &&
       entry.content.stopCondition.includes('fissaggi danneggiati') &&
       entry.content.stopCondition.includes('non forzarlo') &&
       entry.content.stopCondition.includes('Registra il problema') &&
       entry.evidence.length===1 && entry.evidence[0].kind==='expert_review';
    const approvedOP03P02=entry.stepId==='RASA-OP-03-P02' &&
       entry.revision==='F15.17-R1' &&
       entry.scope==='filtro_aria_valutazione_separata_carta_spugna_misto_ricambio_compatibile_e_stop_se_assente' &&
       entry.approval?.decision==='APPROVATO_SENZA_MODIFICHE' &&
       entry.approval?.evidence==='utente_conferma_corretta_procedura_valutazione_filtro_p02_e_autorizza_procedere_fase_15_17' &&
       entry.applicability?.audience==='utilizzatore_tagliando_gratuito' &&
       entry.applicability?.requiresApprovedFilterOpeningStep==='RASA-OP-03-P01' &&
       entry.applicability?.requiresIdentifiedFilterType===true &&
       entry.applicability?.removeElementWithoutIntakeContamination===true &&
       entry.applicability?.requiresSeparateMixedElementAssessment===true &&
       Array.isArray(entry.applicability?.filterTypes) &&
       JSON.stringify(entry.applicability.filterTypes)==='["carta","spugna","misto"]' &&
       entry.applicability?.paperReplaceNormally===true &&
       entry.applicability?.paperReuseOnlyIfRecentlyInstalledCleanIntactAndManufacturerPermits===true &&
       JSON.stringify(entry.applicability?.paperDamageCriteria)==='["strappi","deformazioni","umidità","sporco_eccessivo"]' &&
       entry.applicability?.foamReuseOnlyIfSoftElasticIntact===true &&
       entry.applicability?.foamReplaceWhenHardenedFriableTornOrDeformed===true &&
       entry.applicability?.noWashingOilingOrCleaningAtThisStep===true &&
       entry.applicability?.stopIfCompatibleReplacementMissing===true &&
       entry.applicability?.recordWorkSuspendedIfReplacementMissing===true &&
       entry.applicability?.noEngineStartWithoutCorrectlyInstalledAirFilter===true &&
       entry.content.instruction.includes('estrai l\'elemento facendo attenzione a non far cadere residui') &&
       entry.content.instruction.includes('Filtro in carta:') &&
       entry.content.instruction.includes('Filtro in spugna:') &&
       entry.content.instruction.includes('Filtro misto:') &&
       entry.content.instruction.includes('strappi, deformazioni, umidità') &&
       entry.content.instruction.includes('morbido, elastico e integro') &&
       entry.content.instruction.includes('Non effettuare ancora lavaggio, oliatura o pulizia') &&
       entry.content.stopCondition.includes('ricambio compatibile') &&
       entry.content.stopCondition.includes('lavorazione come sospesa') &&
       entry.content.stopCondition.includes('Non avviare il motore') &&
       entry.evidence.length===1 && entry.evidence[0].kind==='expert_review';
    const approvedOP03P03=entry.stepId==='RASA-OP-03-P03' &&
       entry.revision==='F15.18-R2' &&
       entry.scope==='trattamento_filtro_carta_sostituzione_o_conservazione_e_soffiaggio_delicato_senza_lavaggio_oliatura' &&
       entry.approval?.decision==='APPROVATO_CON_RIMOZIONI_ESPLICITE' &&
       entry.approval?.evidence==='utente_conferma_r2_rimozione_eccezione_lavaggio_oliatura_e_metodi_pulizia_diversi_da_soffiaggio' &&
       entry.applicability?.audience==='utilizzatore_tagliando_gratuito' &&
       entry.applicability?.requiresApprovedFilterEvaluationStep==='RASA-OP-03-P02' &&
       JSON.stringify(entry.applicability?.allowedFilterTypes)==='["carta","misto"]' &&
       entry.applicability?.skipForFoamOnly===true &&
       entry.applicability?.paperReplacementMustFitMotor===true &&
       entry.applicability?.replacementRequiresSuitableFormSizeAndSeals===true &&
       entry.applicability?.reuseOnlyIfRecentlyInstalledIntactAndClean===true &&
       entry.applicability?.keepFilterProtectedFromContamination===true &&
       entry.applicability?.neverWashPaper===true &&
       entry.applicability?.neverOilPaper===true &&
       entry.applicability?.onlyPermittedPaperCleaningMethod==='soffiaggio_delicato_aria_compressa' &&
       entry.applicability?.compressedAirIfNeededOnly===true &&
       entry.applicability?.noAggressiveAirJets===true &&
       entry.applicability?.foamPrefilterTreatedSeparatelyLater===true &&
       entry.applicability?.stopIfReplacementIncompatible===true &&
       entry.applicability?.recordAnomalyOnIncompatibility===true &&
       entry.applicability?.noEngineStartWithoutSuitableCorrectlyInstalledFilter===true &&
       entry.content.instruction.includes('Se il rasaerba monta soltanto un filtro in spugna, il passaggio viene saltato') &&
       entry.content.instruction.includes('Caso A — Filtro da sostituire') &&
       entry.content.instruction.includes('Caso B — Filtro ancora utilizzabile') &&
       entry.content.instruction.includes('Non lavare né oliare i filtri in carta') &&
       entry.content.instruction.includes('soffiaggio delicato con aria compressa') &&
       entry.content.instruction.includes('evitando getti aggressivi') &&
       entry.content.instruction.includes('il prefiltro in spugna sarà trattato separatamente') &&
       !entry.content.instruction.includes('salvo esplicita previsione del costruttore') &&
       !entry.content.instruction.includes('eventuali metodi di pulizia devono rispettare le istruzioni specifiche') &&
       entry.content.stopCondition.includes('Se il filtro sostitutivo non è compatibile') &&
       entry.content.stopCondition.includes('Registra l\'anomalia') &&
       entry.content.stopCondition.includes('non avviare il motore') &&
       entry.evidence.length===1 && entry.evidence[0].kind==='expert_review';

    const approvedOP03P04=entry.stepId==='RASA-OP-03-P04' &&
       entry.revision==='F15.19-R2' &&
       entry.scope==='lavaggio_spugna_detergente_specifico_risciacquo_asciugatura_divieto_solventi' &&
       entry.approval?.decision==='APPROVATO_CON_TRE_MODIFICHE_ESPLICITE' &&
       entry.approval?.evidence==='utente_richiede_detergente_specifico_compressione_durante_immersione_e_precauzioni_su_idrocarburi_solventi_con_restante_testo_approvato' &&
       entry.applicability?.audience==='utilizzatore_tagliando_gratuito' &&
       entry.applicability?.requiresApprovedFilterEvaluationStep==='RASA-OP-03-P02' &&
       JSON.stringify(entry.applicability?.allowedFilterTypes)==='["spugna","misto"]' &&
       entry.applicability?.skipForPaperOnly===true &&
       entry.applicability?.foamMustBeReusableAndWashable===true &&
       entry.applicability?.useAirFilterSpecificCleaner===true &&
       entry.applicability?.squeezeDuringImmersion===true &&
       entry.applicability?.avoidTwisting===true &&
       entry.applicability?.rinseThoroughly===true &&
       entry.applicability?.dryCompletelyBeforeOiling===true &&
       entry.applicability?.avoidDirectHeat===true &&
       entry.applicability?.paperElementMustStayDryInMixedFilter===true &&
       entry.applicability?.fuelAndHydrocarbonCleanersDiscouraged===true &&
       entry.applicability?.solventsProhibited===true &&
       entry.applicability?.noAggressiveCompressedAir===true &&
       entry.applicability?.oilingHandledByStepId==='RASA-OP-03-P05' &&
       entry.applicability?.stopIfFoamDamagedOrWashabilityUnknown===true &&
       entry.applicability?.stopIfCompatibleReplacementUnavailable===true &&
       entry.applicability?.recordAnomalyOnStop===true &&
       entry.applicability?.noEngineStartWithoutSuitableCorrectlyTreatedAndInstalledFilter===true &&
       entry.content.instruction.includes('soltanto un filtro in carta, salta questo passaggio') &&
       entry.content.instruction.includes('detergente specifico per filtri aria') &&
       entry.content.instruction.includes("Durante l'immersione comprimila ripetutamente") &&
       entry.content.instruction.includes('Risciacqua accuratamente') &&
       entry.content.instruction.includes('asciugare completamente') &&
       entry.content.instruction.includes("L'utilizzo di gasolio, benzine o idrocarburi come detergente è sconsigliato") &&
       entry.content.instruction.includes("L'utilizzo di solventi (diluente/acetone/...) è assolutamente vietato") &&
       !entry.content.instruction.includes('detergente liquido delicato') &&
       entry.content.stopCondition.includes('non è possibile stabilire se sia lavabile') &&
       entry.content.stopCondition.includes('ricambio compatibile') &&
       entry.content.stopCondition.includes("registra l'anomalia e sospendi") &&
       entry.content.stopCondition.includes('Non avviare il motore') &&
       entry.evidence.length===1 && entry.evidence[0].kind==='expert_review';

    const approvedOP03P05=entry.stepId==='RASA-OP-03-P05' &&
       entry.revision==='F15.20-R3' &&
       entry.scope==='filtro_sola_spugna_oliatura_prefiltro_misto_asciutto_configurazioni_modello_operatore_competente' &&
       entry.approval?.decision==='APPROVATO_DOPO_REVISIONE_R3' &&
       entry.approval?.evidence==='utente_conferma_proposta_f15_20_r3_sola_spugna_oliare_prefiltro_non_oliare_standard_e_casi_specifici_solo_con_conoscenza_modello_operatore' &&
       entry.applicability?.audience==='utilizzatore_tagliando_gratuito' &&
       entry.applicability?.requiresApprovedFilterAssessmentStep==='RASA-OP-03-P02' &&
       entry.applicability?.requiresApprovedFoamWashingStepIfPerformed==='RASA-OP-03-P04' &&
       JSON.stringify(entry.applicability?.allowedFilterTypes)==='["spugna","misto"]' &&
       entry.applicability?.skipForPaperOnly===true &&
       entry.applicability?.oilFoamOnlyFilter===true &&
       entry.applicability?.noPrefilterOilingInStandardApp===true &&
       entry.applicability?.modelSpecificExceptionOnlyWithOperatorPriorKnowledge===true &&
       entry.applicability?.unknownConfigurationMustNotBeGuessed===true &&
       entry.applicability?.foamMustBeCompletelyDryAfterWashing===true &&
       entry.applicability?.allowAirFilterOilSpray===true &&
       entry.applicability?.allowNewCleanMotorOil===true &&
       entry.applicability?.distributeOilByGentleCompression===true &&
       entry.applicability?.avoidTwisting===true &&
       entry.applicability?.removeExcessOil===true &&
       entry.applicability?.noAccumulationOrDrips===true &&
       entry.applicability?.keepPreparedFilterProtected===true &&
       entry.applicability?.stopIfRequiredOilUnavailable===true &&
       entry.applicability?.recordAnomalyOnStop===true &&
       entry.applicability?.noEngineStartWithoutCorrectlyTreatedAndReassembledFilter===true &&
       entry.content.instruction.includes('soltanto un filtro in carta, salta il passaggio') &&
       entry.content.instruction.includes("Filtro in sola spugna: eseguire l'oliatura") &&
       entry.content.instruction.includes("Prefiltro in spugna abbinato a filtro in carta: non oliare nella procedura standard dell'app") &&
       entry.content.instruction.includes('conoscenza tecnica pregressa dell\'operatore') &&
       entry.content.instruction.includes('non procedere per supposizione') &&
       entry.content.instruction.includes('completamente asciutto dopo il lavaggio') &&
       entry.content.instruction.includes('olio spray specifico per filtri aria') &&
       entry.content.instruction.includes('olio motore nuovo e pulito') &&
       entry.content.instruction.includes('senza torcerla') &&
       entry.content.instruction.includes('accumuli o gocciolamenti') &&
       entry.content.stopCondition.includes('non disponi di olio idoneo') &&
       entry.content.stopCondition.includes("registra l'anomalia") &&
       entry.content.stopCondition.includes('Non avviare il motore') &&
       entry.evidence.length===1 && entry.evidence[0].kind==='expert_review';

    const approvedOP03P06=entry.stepId==='RASA-OP-03-P06' &&
       entry.revision==='F15.21-R1' &&
       entry.scope==='pulizia_scatola_e_coperchio_filtro_aria_protezione_condotto_aspirazione_verifica_tenuta' &&
       entry.approval?.decision==='APPROVATO_SENZA_MODIFICHE' &&
       entry.approval?.evidence==='utente_conferma_integralmente_proposta_f15_21_r1_con_va_bene' &&
       entry.applicability?.audience==='utilizzatore_tagliando_gratuito' &&
       entry.applicability?.requiresFilterRemoved===true &&
       JSON.stringify(entry.applicability?.allowedFilterTypes)==='["carta","spugna","misto"]' &&
       entry.applicability?.wipeWithCleanDryOrSlightlyDampCloth===true &&
       entry.applicability?.removeGrassDustAndDeposits===true &&
       entry.applicability?.compatibleCleanerForOilResidueOnly===true &&
       entry.applicability?.removeCleanerResidue===true &&
       entry.applicability?.cleanFilterSealingSurfaces===true &&
       entry.applicability?.protectCarburetorIntakeFromDebrisAndLiquids===true &&
       entry.applicability?.noCompressedAirOrWaterJetsTowardIntake===true &&
       entry.applicability?.noToolsOrClothsInsertedIntoIntake===true &&
       entry.applicability?.housingAndCoverDryAndFreeOfResidues===true &&
       entry.applicability?.reassemblyHandledByStepId==='RASA-OP-03-P07' &&
       entry.applicability?.stopIfDamagedHousingOrSeals===true &&
       entry.applicability?.stopIfSuspectedIntakeContamination===true &&
       entry.applicability?.recordAnomalyAndSuspendReassembly===true &&
       entry.content.instruction.includes("Con l'elemento filtrante rimosso") &&
       entry.content.instruction.includes('un panno pulito, asciutto o leggermente inumidito') &&
       entry.content.instruction.includes('detergente compatibile con plastica e guarnizioni') &&
       entry.content.instruction.includes('eliminando successivamente gli eventuali residui di detergente') &&
       entry.content.instruction.includes('superfici sulle quali appoggia il filtro') &&
       entry.content.instruction.includes('Evita che polvere, residui, liquidi') &&
       entry.content.instruction.includes("Non dirigere getti di aria compressa o acqua verso l'ingresso del carburatore") &&
       entry.content.instruction.includes("Non introdurre utensili o panni all'interno del condotto di aspirazione") &&
       entry.content.instruction.includes('senza residui o umidità') &&
       entry.content.instruction.includes('RASA-OP-03-P07') &&
       entry.content.stopCondition.includes('scatola danneggiata, guarnizioni compromesse') &&
       entry.content.stopCondition.includes('corpi estranei nel condotto di aspirazione') &&
       entry.content.stopCondition.includes("registra l'anomalia e sospendi il rimontaggio") &&
       entry.evidence.length===1 && entry.evidence[0].kind==='expert_review';

    const approvedOP03P07=entry.stepId==='RASA-OP-03-P07' &&
       entry.revision==='F15.22-R1' &&
       entry.scope==='rimontaggio_filtro_aria_carta_spugna_misto_posizionamento_aderenza_chiusura_tenuta' &&
       entry.approval?.decision==='APPROVATO_SENZA_MODIFICHE' &&
       entry.approval?.evidence==='utente_approva_integralmente_proposta_f15_22_r1_rimontaggio_filtro_aria' &&
       entry.applicability?.audience==='utilizzatore_tagliando_gratuito' &&
       entry.applicability?.afterApplicableFilterTreatments===true &&
       entry.applicability?.requiresCleanAndDryHousing===true &&
       JSON.stringify(entry.applicability?.allowedFilterTypes)==='["carta","spugna","misto"]' &&
       entry.applicability?.respectElementOrientationAndRetainers===true &&
       entry.applicability?.paperFilterRequiresSealingSurfaceContact===true &&
       entry.applicability?.foamOnlyMustBePreviouslyTreatedAndUndeformed===true &&
       entry.applicability?.mixedFilterRequiresCorrectPaperAndPrefilterPositions===true &&
       entry.applicability?.noFoldedCrushedOrMisplacedElement===true &&
       entry.applicability?.alignHousingLatchesTabsOrGuides===true &&
       entry.applicability?.closeUsingExistingLatchesOrScrews===true &&
       entry.applicability?.avoidForceOrCoverDeformation===true &&
       entry.applicability?.verifyStableCoverClosure===true &&
       entry.applicability?.verifyNoUnfilteredAirBypass===true &&
       entry.applicability?.stopIfFilterCannotSeat===true &&
       entry.applicability?.stopIfCoverCannotClose===true &&
       entry.applicability?.stopIfFastenersDamaged===true &&
       entry.applicability?.stopIfSealingCannotBeEnsured===true &&
       entry.applicability?.recordAnomalyOnStop===true &&
       entry.applicability?.noEngineStartWithoutCorrectlyInstalledFilter===true &&
       entry.content.instruction.includes('Dopo aver completato i trattamenti previsti nei passaggi precedenti') &&
       entry.content.instruction.includes('scatola filtro sia pulita e asciutta') &&
       entry.content.instruction.includes("Filtro in carta: posiziona correttamente l'elemento filtrante") &&
       entry.content.instruction.includes('Filtro in sola spugna: inserisci la spugna precedentemente trattata') &&
       entry.content.instruction.includes("Filtro misto: rimonta l'elemento in carta e il prefiltro in spugna") &&
       entry.content.instruction.includes('piegata, schiacciata o fuori sede') &&
       entry.content.instruction.includes('guide, linguette o incastri') &&
       entry.content.instruction.includes('evitando di forzare o deformare il coperchio') &&
       entry.content.instruction.includes('non presenti aperture involontarie') &&
       entry.content.instruction.includes("all'aria di bypassare l'elemento filtrante") &&
       entry.content.stopCondition.includes('il filtro non entra correttamente nella propria sede') &&
       entry.content.stopCondition.includes('i fissaggi sono danneggiati') &&
       entry.content.stopCondition.includes("registra l'anomalia e sospendi") &&
       entry.content.stopCondition.includes('Non avviare il motore senza il sistema filtrante correttamente installato') &&
       entry.evidence.length===1 && entry.evidence[0].kind==='expert_review';
    if(!common || !(approvedP01 || approvedP02 || approvedP03 || approvedP04 || approvedP05 || approvedP06 || approvedOP02P01 || approvedOP02P02 || approvedOP02P03 || approvedOP02P04 || approvedOP02P05 || approvedOP02P06 || approvedOP02P07 || approvedOP02P08 || approvedOP03P01 || approvedOP03P02 || approvedOP03P03 || approvedOP03P04 || approvedOP03P05 || approvedOP03P06 || approvedOP03P07))
      errors.push('INVALID_REVIEW_SCOPE_OR_APPROVAL');
  }
  return Object.freeze({ok:errors.length===0,errors});
}
