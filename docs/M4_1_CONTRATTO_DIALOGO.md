# M4.1 — Contratto sperimentale del dialogo controllato

**Milestone:** M4 — progettazione di AI conversazionale subordinata a controller e Knowledge Base.
**Ambito:** solo operazione OP03 filtro aria, P01–P07, in un laboratorio non operativo.
**Decisione autorizzata:** realizzare contratto e test, senza chiamate a provider AI, senza toccare la PWA e senza attivare flag AI.

## 1. Che cosa è stato implementato

- Modulo puro: worker/src/m4-contract.mjs (non importato dalle route di produzione).
- Ingresso: prepareM4Turn(input, serverState).
- Uscita: reviewM4Candidate(prepared, candidate, serverState).
- Test automatici: tests/m4-contract.test.cjs.
- Nessuna route nuova, binding AI, credenziale, chiamata di rete o conferma di manutenzione.

## 2. Contratto dell'ingresso

Il JSON che un browser potrebbe inviare in futuro è limitato a quattro campi:

    {
      "operationId": 3,
      "stepId": "RASA-OP-03-P03",
      "filterType": "carta",
      "question": "Posso lavare con acqua il filtro in carta?"
    }

Qualsiasi campo aggiuntivo è respinto, inclusi stato controller, flag AI e permessi di completamento.
Lo stato passato separatamente come serverState deve essere creato esclusivamente dal backend; non è una dichiarazione affidabile dell'utente né uno stato reale certificato:

    {
      "mode": "READ_ONLY_LAB",
      "operationId": 3,
      "stepId": "RASA-OP-03-P03",
      "filterType": "carta",
      "blocked": false
    }

La preparazione richiede corrispondenza esatta tra selezione e stato server, validità del ledger e valutazione positiva delle guardie deterministiche M3. In caso contrario restituisce un rifiuto e nessuna fonte per un modello.

Esito positivo: DRY_RUN_CONTEXT_READY. Significa soltanto che esiste un riferimento di prova coerente alla fonte: **modelInputAllowed resta false**. La KB corrente ha aiUseAllowed=false, e non viene inviata a un modello.

## 3. Contratto della risposta candidata

Una futura risposta del modello viene trattata come dato NON affidabile e non viene mai mostrata direttamente. Sono riconosciute soltanto queste proposte strutturali:

    {
      "action": "SHOW_REVIEWED_STEP",
      "sourceStepId": "RASA-OP-03-P03",
      "sourceRevision": "F15.18-R2"
    }

oppure:

    { "action": "ABSTAIN" }

Qualunque testo libero, istruzione tecnica, flag di completamento, comando, riferimento non corrispondente o campo inatteso viene rifiutato. La fonte è riletta dal ledger al momento del controllo finale. Se accettata, **la risposta è composta dal backend** usando il titolo, l'istruzione e la condizione di arresto già revisionati, senza parafrasi tecniche del modello.

I flag aiEnabled, canGenerate, modelInputAllowed, allowCompletion e sessionChanged restano false, modelRequests resta 0. Nessuna modifica allo stato di lavoro.

## 4. Sicurezza: cosa garantisce e cosa NON garantisce

- Garantisce per il modulo di prova che dati testuali prodotti da un ipotetico modello non diventano istruzioni tecniche: solo la fonte del ledger può essere restituita.
- Non prova che una richiesta sia sicura in ogni formulazione: le guardie M3 basate anche su parole chiave non riconoscono tutte le anomalie possibili.
- Non è un sistema di verifica semantica generale del testo generato: il testo tecnico libero viene rifiutato, non certificato.
- Non attesta alcuno stato fisico della macchina e non sostituisce un controller di esecuzione generale.
- Non costituisce autorizzazione a esporre i contenuti del ledger a un provider AI; tale gate resta da progettare e approvare.
- Non comprende ancora le domande con un LLM: è un contratto preparatorio per la futura selezione di fonti e la gestione di rifiuti.

## 5. Verifiche

I test coprono: stato simulato e input malevoli, OP03 e materiali, guardie di anomalie, richiesta fuori ambito, injection esplicita, riferimento inesistente, tentativi di cambiare stato, dati aggiunti alla risposta, rifiuto controllato e assenza di route/provider AI. Restano indispensabili, in M4.2, prove con un vero modello su parafrasi, forme indirette di anomalia, copertura delle fonti e prompt injection avanzata.

## 6. Condizioni per M4.2 (NON soddisfatte da questo intervento)

1. Scelta provider/modello e verifica free tier, quote e limiti di costo.
2. Gate per abilitare l'uso da parte dell'AI SOLO delle revisioni OP03, senza sbloccare gli altri passi.
3. Adapter server-side, credenziali/binding e autorizzazione separata prima di qualsiasi chiamata.
4. Controller attendibile dello stato, oppure laboratorio esplicitamente isolato senza effetti operativi.
5. Prove negative end-to-end, inclusi Safari iPhone, prompt fuori ambito, stop, false conferme e fonti non verificabili.

**Stato:** M4.1 da considerare implementato soltanto dopo CI verificata; non equivale a modello attivo o prova di sicurezza del prodotto completo.
