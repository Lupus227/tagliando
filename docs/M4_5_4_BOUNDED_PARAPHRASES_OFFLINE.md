# M4.5.4 — Grammatica controllata delle parafrasi OP03 (solo offline)

**Decisione:** continuare dopo M4.5.3.1 verso domande formulate in modo spontaneo, ma senza attivare AI né autorizzare manutenzione. Autorizzazione del titolare in chat (2026-11-18, «ok procediamo»).

## Obiettivo e perimetro

M4.5.2 riconosce soltanto 17 frasi curate; la baseline M4.5.3 aveva 0/12 parafrasi riconosciute. Per testare la parte deterministica del futuro assistente conversazionale, M4.5.4 aggiunge una grammatica **deliberatamente limitata** a sette intenti di OP03:

| Intento | Passaggio di evidenza |
|---|---|
| Aprire il coperchio | RASA-OP-03-P01 |
| Valutare lo stato filtro | RASA-OP-03-P02 |
| Trattare il filtro in carta | RASA-OP-03-P03 |
| Lavare la spugna | RASA-OP-03-P04 |
| Oliare la spugna | RASA-OP-03-P05 |
| Pulire la scatola | RASA-OP-03-P06 |
| Rimontaggio e verifica | RASA-OP-03-P07 |

Questa non è una comprensione generale del linguaggio naturale: riconosce **solo frasi intere** corrispondenti a costruzioni grammaticali definite. Frasi non riconosciute restano senza fonte. È una prova di raccordo verso il vero dialogo AI, non un sostituto definitivo del ragionamento linguistico.

## Pipeline fail-closed

1. Eseguire sempre sul testo **originale** il mapper M4.5.2, incluse le guardie M3 già validate e i vincoli di schema.
2. Se M4.5.2 ha associato la frase esatta, ha bloccato un rischio, ha richiesto specifiche, ha individuato ambiguità o ha rifiutato il contesto, **restituire esattamente quell'esito**.
3. Solo per `QUESTION_NOT_MAPPED` e input valido, confrontare il testo normalizzato con espressioni regolari **ancorate da inizio a fine**. Non usare keyword sparse, matching per similarità, fuzzy edit distance o modelli AI.
4. Solo in presenza di **una** corrispondenza, richiamare di nuovo **M4.5.2** con la domanda canonica già approvata per quell'intento, nel contesto filtro originale. La seconda chiamata riapplica vincoli di materiale e passo, e recupera il testo dal ledger attraverso M4.5.1. Un errore o una mancata applicabilità produce **rifiuto**, mai un fallback a testo nuovo.
5. Prima di presentare l'anteprima, verificare mappingId, provenienza e gate di sicurezza. La risposta positiva conserva fonte/revisione/scope e **l'intero testo identico al ledger**; non è una risposta tecnica dialogica.

La riscrittura verso domanda canonica è consentita solo dopo preflight della domanda originale e corrispondenza alla grammatica completa. Sono vietate modifiche a istruzioni, stop condition, revisione e `aiUseAllowed`.

## Test e indicatori

- Modulo: `worker/src/m454-bounded-paraphrases.mjs` **non importato** dal router `worker/src/index.mjs`.
- Regressione: `tests/m454-bounded-paraphrases.test.cjs`.
- **12 domande già presenti nel corpus M4.5.3**, usate per sviluppare le regole: verificano incremento locale da 0/12 a 12/12; **non sono test indipendenti o una stima della performance in produzione**.
- **12 varianti aggiuntive** curate per challenge funzionale: verificano modifiche di verbi, formulazioni e oggetto; non sono un campione casuale di parlato reale.
- **25 casi negativi**: ambiguità, aggiunta di istruzioni arbitrarie, tentativi di iniezione, contenuti fuori ambito, anomalie, `MODEL_REQUIRED`, comandi, filtro incompatibile, mancanza tipo filtro e `NOT_APPLICABLE`. Tutti devono astenersi senza contenuti.
- I 12 casi esatti M4.5.2 e i 16 casi non eleggibili del corpus rimangono invariati. Confrontare sempre l'intero `content` con i record revisionati nel ledger.
- Il workflow esistente lancia `node --test tests/*.test.cjs` e la compilazione Wrangler **dry-run**, non un deploy.

Le metriche CI, una volta ottenute, vanno confrontate con la baseline M4.5.3 (non sovrascriverne i risultati storici).

## Vincoli e prossimo gate

`aiEnabled=false`, `canGenerate=false`, `maySendToModel=false`, `modelRequests=0`, `allowCompletion=false`, `sessionChanged=false`, `authorizesMaintenance=false`, `requiresOperatorVerification=true`. I sette passi restano `VALIDATO_CONDIZIONATO` e `aiUseAllowed=false`.

**Esclusioni esplicite:** niente integrazione runtime, PWA/voce, endpoint, modifiche KB/ledger, aumento permessi AI, deploy Cloudflare richiesto, risposte sintetiche o estrazione di singole istruzioni.

**Passo successivo da decidere:** verificare il recupero di risposte *focalizzate*, ma selezionandole soltanto da segmenti della KB approvati esplicitamente, senza attribuire a un LLM l'autorità sulla sicurezza. Anche l'eventuale classificazione semantica con AI richiederà un gate tecnico distinto; il riconoscimento grammaticale offline non certifica l'affidabilità di un assistente conversazionale.
