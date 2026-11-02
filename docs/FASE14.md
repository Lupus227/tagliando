# Fase 14.3 — Recupero contestuale (offline, sperimentale)

## Stato dei rami
- Stabile: main (PWA v0.12.1), NON modificato.
- Sperimentale: dev/fase14-ai. Nessun merge, nessuna pubblicazione GitHub Pages.
- Budget usato per codice e API esterne: 0 €. Nessuna chiave o credenziale richiesta.

## Architettura attuale
- app.js: fonte unica delle 8 procedure preventive (53 passaggi).
- knowledge.js: derivazione in memoria di procedure, ID, metodi, precauzioni,
  provenienza e review DA_VALIDARE. Non modifica la sessione.
- retrieval.js: individua la lavorazione, applica le barriere lessicali,
  filtra i passaggi per modalità, ordina per pertinenza e prepara al massimo
  3 riferimenti, entro un budget di dimensione prefissato.
- knowledge-ui.js: pannello testuale offline con domanda, risposta locale,
  anteprima dei riferimenti e esportazione JSON. NON invia dati a server.
- support.js / voice.js: dialogo e controlli della v0.12.1, NON modificati.
- index.html: carica knowledge.js -> retrieval.js -> knowledge-ui.js.
- sw.js: cache separata per il ramo sperimentale, versione tagliando-v0143-dev.

## Contratto dati di retrieval
API browser: window.TagliandoRetrieval.buildPreview(question, context).
Schema: tagliando.retrieval.v1. Campi principali:
- decision: PREVIEW_ONLY, SAFETY_STOP, MODEL_REQUIRED, OUT_OF_SCOPE,
  COMMAND, CLARIFY, NO_MATCH, REJECT, UNAVAILABLE.
- reason: spiegazione della decisione.
- references[]: id stabile, titolo operazione, passaggio, istruzione,
  avvertenza, metadati di provenienza e stato di revisione.
- aiReady: sempre false.
- externalTransmissionAllowed: sempre false.
- stateChanged: sempre false.

**AVVERTENZA**: aiReady=false e externalTransmissionAllowed=false sono
vincoli di progetto della versione attuale, non una difesa anti-manomissione:
il codice JavaScript sul client può essere modificato da chi lo esegue.
Prima di abilitare AI online, un backend affidabile deve ricostruire riferimenti
da una fonte tecnica revisionata e imporre i controlli SERVER-SIDE.

## Decisioni di safety / pertinenza
1. I testi indicativi non sono prescrizioni operative validate.
2. Riconoscimento STOP per alcune formulazioni di lama lesionata, arresto
   motore difettoso, perdita carburante e filetto candela danneggiato.
   Le espressioni regolari NON coprono tutte le possibili anomalie;
   nessuna garanzia di sicurezza si basa solo su questa classificazione.
3. Dati come coppie, capacità d'olio/carburante, riferimenti ricambio e
   altre specifiche di modello sono bloccati senza fonte costruttore verificata.
4. Comandi di avanzamento/conferma e registrazione anomalie non passano all'AI.
5. Riparazioni fuori dalle otto lavorazioni e quesiti su altri veicoli sono
   esclusi dall'attuale base tecnica.
6. Un metodo non attivo non autorizza l'inclusione dei suoi passaggi esclusivi.
7. Input vuoto o >500 caratteri viene rifiutato; nessun upload o log domande.
8. In caso di più componenti o di basso supporto documentale: chiarire o
   dichiarare che non si dispone di dati pertinenti.
9. L'anteprima è testuale e non esegue mutazioni della sessione del tagliando.

## Test automatici
Suite in tests/knowledge.test.cjs e tests/retrieval.test.cjs.
Esecuzione Node.js v22:
    node --test tests/*.test.cjs

Workflow GitHub Actions sul ramo sperimentale:
    .github/workflows/fase14-tests.yml
È limitato a lettura repository e non usa segreti, API esterne o deploy.
Verificare l'esito dei run prima di dichiarare CI superata.
Sono stati eseguiti anche controlli diretti del motore JS con le 8 procedure
reali: 23 casi, tutti superati durante lo sviluppo della Fase 14.3.
NON sono ancora stati eseguiti test reali browser e collaudi iPhone del ramo.

## Anomalia preesistente non ancora risolta
manifest.webmanifest e index.html contengono riferimenti a icone in /icons/
non presenti nel repository pubblico al momento del controllo. I riferimenti
mancanti sono stati esclusi dalla cache obbligatoria del solo ramo di sviluppo
per evitare che blocchino cache.addAll. I collegamenti del manifest e dell'HTML
vanno sistemati e verificati prima del rilascio.

## Prossima fase 14.4 — Cloudflare Worker
1. Backend con endpoint autenticato e limitato per sessione/utente.
2. Conservazione delle chiavi API SOLO in Workers Secrets.
3. Controllo server-side di input, fonte canonica, identificativi, modalità
   e stato di revisione; non fidarsi dei metadati inviati dalla PWA.
4. Budget/rate limits, timeout e controllo anti-abuso; minimizzazione dati.
5. Output rigidamente strutturato, fonti tracciate, nessuna azione operativa
   direttamente impartita da un modello generativo.
6. Non collegare servizi AI finché le precauzioni sopra non sono verificate.

## Rollback
Non fare merge in main. I moduli 14.2-14.3 sono solo nel ramo dev/fase14-ai.
Non eliminare la PWA iPhone e non cancellare storage o sessioni.
