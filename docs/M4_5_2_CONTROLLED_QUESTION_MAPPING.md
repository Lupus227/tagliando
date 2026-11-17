# M4.5.2 — Mapping deterministico delle domande al registro OP03 (offline)

**Stato previsto:** modulo di prova per revisore umano, **non attivo nel Worker**, senza endpoint, senza AI e senza cambi PWA/Knowledge Base.

## Scopo e differenze dalla M4.5.1

La M4.5.1 consentiva esclusivamente «Mostra passaggio» con `stepId` fornito nel test, restituito dal ledger revisionato esattamente. La M4.5.2 collega **un insieme finito di 17 formulazioni di domande spontanee** a 7 passaggi OP03 tramite mapping esplicito immutabile nel codice. **Non contiene un classificatore semantico generativo** e non tenta di dare una risposta sintetizzata alla domanda: mostra la revisione originale **solo per controllo umano**.

Funzione esportata: `mapQuestionToReviewedEvidence(input)`, in `worker/src/m452-question-mapper.mjs`.

Formato ammesso:
```json
{
  "machineFamily": "rasaerba_a_benzina",
  "operationId": 3,
  "filterType": "carta",
  "question": "Posso lavare il filtro in carta?"
}
```

**Non** si accettano `stepId`, fonti, contenuti, revisioni, ruoli, stato sessione, cronologia né permessi dal chiamante. `filterType` deve essere `null`, `carta`, `spugna` o `misto`.

## Precedenza dei controlli

1. **Schema rigido:** chiavi esatte, macchina e operazione fisse, domanda entro 450 caratteri, nessun controllo ASCII indesiderato, tipo filtro ammesso; errore `INVALID_INPUT`.
2. **Controllo dell'originale:** `filterLabAnswer(P01, null, question originale)` applica in primo luogo le guardie di sicurezza M3, rileva anomalie, comandi, richieste modello-specifiche, fuori ambito e verifica la KB. Non passare direttamente il testo normalizzato o la stringa «Mostra passaggio» al preflight.
3. **Risoluzione deterministica:** normalizzazione minuscole/accenti/punteggiatura e corrispondenza **esatta** con una delle 17 formulazioni revisionabili nel codice. Tre domande intenzionalmente indeterminate sono `QUESTION_AMBIGUOUS`; le altre senza corrispondenza `QUESTION_NOT_MAPPED`.
4. **Compatibilità materiale:** domanda su carta incompatibile con macchina `spugna`, domanda su spugna incompatibile con `carta`, prefiltro misto incompatibile con macchina non mista → `FILTER_CONTEXT_MISMATCH`. Se il materiale manca quando necessario → `FILTER_TYPE_REQUIRED`. Per prefiltro misto, l'oliatura P05 è `NOT_APPLICABLE` nella procedura standard.
5. **Evidenza verificata:** solo in caso positivo il modulo invoca `getReviewedEvidence()` della M4.5.1 con `stepId` determinato esclusivamente dal catalogo e richiesta tecnica fissa `Mostra passaggio`. Resta obbligatoria l'integrità del ledger, il confronto di titolo/istruzione/stop e `aiUseAllowed=false`.

## Campi di esito

Esito positivo: `QUESTION_MAPPED_TO_REVIEWED_EVIDENCE`, con `mappingId`, `mappingMethod=exact_curated_phrase`, `source` (stepId, revisione, stato, scope, tipo filtro e aiUseAllowed false) e `content` (titolo, testo completo, condizione stop **identici** alla revisione). Questo rappresenta **una corrispondenza tra domanda e passo**, non una risposta tecnicamente verificata alla domanda, né la conferma dei prerequisiti fisici.

Esito negativo: `ok:false`, decision specifica, messaggio, `source:null`, `content:null`, `mappingId:null`. In **ogni esito**:
- `aiEnabled:false`, `canGenerate:false`, `modelRequests:0`, `maySendToModel:false`;
- `authorizesMaintenance:false`, `allowCompletion:false`, `sessionChanged:false`, `requiresOperatorVerification:true`.

## Copertura e limiti espliciti

Le 17 formulazioni coprono apertura coperchio (P01), controllo materiale (P02), carta (P03), lavaggio spugna (P04), oliatura spugna/prefiltro (P05), scatola (P06), rimontaggio (P07). **Non** rappresentano la varietà delle domande reali: variazioni di linguaggio non presenti nel catalogo rifiutano la mappatura, per scelta conservativa.

**Perché non basta:** lo step può contenere più condizioni, mentre la domanda può riferirsi a un solo dettaglio. Restituire l'intero passaggio non costituisce una risposta sintetizzata o un'autorizzazione a procedere. Per il prodotto finale serviranno gestione di stato, sicurezza, conoscenze specifiche per modello e un livello conversazionale che sappia astenersi. Non attivare il modello utilizzando direttamente i testi ora marcati `aiUseAllowed=false`.

## Test, pubblicazione e successiva decisione

`tests/m452-question-mapper.test.cjs` verifica: sette gruppi di domanda su P01–P07; integrità e revisione fonte; normalizzazione senza fuzzy matching; ambiguità; fuori ambito; incompatibilità carta/spugna/misto; blocco P05 sui prefiltro misti; quantità modello-specifiche, anomalie, sicurezza, comandi; injection nel payload; nessuna AI e nessuna route. Esecuzione nella CI Node con compilazione Wrangler `--dry-run`; **non sono test browser né inferenze Cloudflare**.

**M4.5.3 — da concordare:** validare l'utilità e la copertura delle domande realistiche in un set offline supervisionato e definire la differenza fra selezione di fonte e risposta delimitata. La promozione di contenuti all'AI richiede un processo specifico di approvazione, controllore deterministico e un test live separatamente autorizzato con rollback.
