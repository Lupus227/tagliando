# Fase 14.2 — Base di conoscenza locale (sperimentale)

## Obiettivo e stato
Ramo di lavoro: dev/fase14-ai. Ramo pubblico di produzione: main, non modificato.
La PWA stabile di riferimento è la v0.12.1. Questo ramo NON viene automaticamente
pubblicato su GitHub Pages. La fase 14.2 non collega ancora alcun modello AI esterno.

## Architettura
- app.js: unica fonte delle 8 procedure OP (NON modificata).
- knowledge.js: proietta OP nello schema tagliando.knowledge.v1 e cerca riferimenti testuali.
- knowledge-ui.js: pannello testuale read-only, utilizzabile dopo caricamento di app.js.
- support.js: controlli contestuali già in uso per la voce (NON modificato).
- voice.js: flusso vocale v0.12.1 (NON modificato).
- sw.js: precache sperimentale dei moduli presenti nel repository.

Non sono previste chiamate di rete, chiavi API, login, database remoti né scritture
di dati di sessione da parte dei nuovi moduli. Non viene registrato il testo delle
domande nella sessione. Non esiste ancora una AI generativa nel prodotto.

## Formato della conoscenza
Schema: tagliando.knowledge.v1.
Ogni procedura ha ID RASA-OP-NN, obiettivo, descrizione, metodi,
passaggi, riferimenti alla posizione originale nel sorgente e metadati review.
Ogni passaggio ha ID RASA-OP-NN-PNN, istruzioni, precauzioni,
metodi validi e revisione DA_VALIDARE.
L'esportazione JSON è una BOZZA per revisione tecnica; non certifica i contenuti.
I dati sono generati al caricamento da OP e non sono una copia da mantenere a mano.

## Regole di sicurezza
1. Il modulo è esclusivamente consultivo: non conferma, non sospende e non avanza.
2. Le segnalazioni vocali e il loro salvataggio rimangono gestiti da voice.js e app.js.
3. Lama lesionata, arresto motore non funzionante, perdita carburante e danno
   alla filettatura candela causano risposta STOP quando riconosciuti.
4. Coppie, capacità, codici ricambio e specifiche di modello non vengono dedotti.
5. Se non esiste un passaggio pertinente, il modulo risponde che non sa.
6. La ricerca non può utilizzare un passaggio esclusivo per un metodo non selezionato.
7. Tutte le istruzioni restano DA_VALIDARE fino alla revisione manuale dell'esperto.
8. Le regole del modulo sono aggiuntive, non sostitutive dei sistemi di sicurezza già presenti.
   Il riconoscimento basato su espressioni regolari NON è una garanzia di copertura completa.

## Test
Per eseguire la suite da una copia locale del repository, occorre Node.js:
    node --test tests/knowledge.test.cjs
La suite utilizza le OTTO procedure REALI di app.js, non dati simulati.
Prima dell'inserimento sono stati svolti controlli logici in un ambiente JS
sul modulo, poi verificati gli 8 record e i 53 passaggi dal codice GitHub.

## Anomalia preesistente da correggere prima della distribuzione
Il manifest fa riferimento a icons/icon-192.png e icons/icon-512.png,
e index.html a icons/apple-touch-icon.png. Questi file NON risultano presenti
nel repository attuale (verifica alla data del 1 novembre 2026).
Nella cache del ramo di sviluppo i percorsi mancanti sono stati rimossi
dall'elenco obbligatorio, perché cache.addAll fallirebbe con risposte 404.
I riferimenti del manifest e dell'HTML restano ancora da sistemare e
l'installabilità come PWA deve essere collaudata nuovamente.

## Criteri per la fase successiva
- Eseguire test Node in ambiente locale/CI e controllare la console browser.
- Verificare che la sessione v0.12.1 non subisca regressioni.
- Aggiungere una strategia di indicizzazione e selezione dei riferimenti
  da trasmettere all'AI, mantenendo esclusi i contenuti non pertinenti.
- Predisporre Cloudflare Worker con chiavi solo server-side,
  autenticazione/controllo accessi, rate limiting, allowlist CORS,
  validazione input/output e timeout. Mai inserire chiavi nella PWA pubblica.
- Nessuna pubblicazione su main senza collaudo e autorizzazione dell'utente.

## Rollback
Il ramo main non è stato toccato. Il rollback consiste nel non effettuare
il merge del ramo sperimentale. Non cancellare lo storage dell'iPhone
né le sessioni conservate localmente.
