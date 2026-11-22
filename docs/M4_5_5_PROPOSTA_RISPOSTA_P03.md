# M4.5.5 — Proposta di risposta focalizzata: filtro in carta (P03)

**Stato:** CANDIDATE 01 E 02 APPROVATE TECNICAMENTE DALL'ESPERTO; utilizzo AI/runtime NON autorizzato.  
**Proposta iniziale:** 2026-11-18. **Approvazioni tecniche candidate 01 e 02:** 2026-11-22.  
**Ambito:** progettazione documentale, nessun codice operativo, endpoint, PWA, configurazione AI o modifica Knowledge Base.

## Fonte revisionata

- Famiglia: `rasaerba_a_benzina`
- Operazione: `OP03` (filtro aria)
- Passaggio: `RASA-OP-03-P03`
- Revisione: `F15.18-R2`
- Stato del ledger: `VALIDATO_CONDIZIONATO`
- `aiUseAllowed=false`, `universalAuthorization=false`
- Applicabilità: filtro in **carta** o **misto** per l'elemento in carta, dopo valutazione P02 e controllo del contesto.
- Fonte canonica: `worker/src/review-ledger.mjs`, proprietà `content.instruction` e `content.stopCondition`. **Non duplicare le autorizzazioni tecniche in questo documento.**

## Candidata 01 — domanda specifica, risposta negativa

**Domanda:** «Posso lavare il filtro in carta?»

**Risposta breve approvata tecnicamente:**

> No. Il filtro in carta non deve essere lavato né oliato.

**Provenienza della prescrizione:** nel testo revisionato F15.18-R2 compare la frase esatta «Non lavare né oliare i filtri in carta.» Nessuna nuova istruzione positiva, valore tecnico o metodo alternativo è introdotto.

**Intento:** `paper_filter_wash_prohibited`.  
**Tipo di contenuto:** divieto isolabile, *non* procedura di pulizia né permesso di continuare.  
**ReviewStatus:** `EXPERT_APPROVED_TEXT_ONLY` (conferma esplicita del titolare: «si approvo, è corretta», 2026-11-22).  
**AI / runtime use:** **NON AUTORIZZATI**.

## Candidata 02 — pulizia filtro in carta con aria compressa

**Domanda:** «Posso pulire il filtro in carta con aria compressa?»

**Risposta breve approvata tecnicamente:**

> Sì, se necessario puoi effettuare un soffiaggio delicato con aria compressa, evitando getti aggressivi che potrebbero danneggiare il materiale filtrante. Il filtro in carta non deve essere lavato né oliato.

**Provenienza:** RASA-OP-03-P03, revisione F15.18-R2. La fonte consente, se necessario, esclusivamente soffiaggio delicato con aria compressa; vieta lavaggio e oliatura e i getti aggressivi.

**Intento proposto:** `paper_filter_gentle_compressed_air`.  
**ReviewStatus:** `EXPERT_APPROVED_TEXT_ONLY` (conferma esplicita del titolare «risposta corretta», 2026-11-22).  
**Applicabilità:** elemento in carta nei sistemi carta o misti, dopo controllo del tipo e valutazione P02; **non implica che un filtro danneggiato, deformato, umido o eccessivamente sporco sia recuperabile tramite soffiaggio**.  
**AI / runtime use:** **NON AUTORIZZATI**. Nessun permesso di avanzamento della procedura.

### Vincoli di un futuro selettore

1. Applicare prima il preflight M3/M4.5.2 sul **testo originale**, comprese anomalie, stop, comandi e richieste modello-specifiche.
2. Usare il riferimento di passo e revisione verificati M4.5.1; se cambia F15.18-R2, invalidare la risposta candidata fino a nuova verifica.
3. L'eventuale risposta breve non può essere usata come dimostrazione che siano stati controllati stato del filtro, compatibilità del ricambio, sede, fissaggi e condizioni di arresto. Restano obbligatori i gate del controller.
4. Nessuna scelta autonoma di lavare, soffiare, sostituire, oliare, rimontare o avviare il motore sulla sola base della risposta.
5. Se la domanda è generica sul trattamento («Come pulisco il filtro aria?»), contiene un'anomalia o il contesto è incerto, applicare il rifiuto/disambiguazione previsto. Non indovinare il tipo di filtro.
6. Questa proposta non può essere caricata in un modello AI perché i record OP03 sono tuttora `aiUseAllowed=false`; l'approvazione della frase non cambia tale flag.

## Esito della revisione esperto

**Candidata 01: APPROVATA TECNICAMENTE senza modifiche il 2026-11-22**. Testo: «No. Il filtro in carta non deve essere lavato né oliato.» La conferma dell'esperto riguarda **solo questa formulazione come risposta breve alla domanda specifica**, non tutti gli estratti di P03 e non la risposta automatica in produzione. Non conferisce alcuna nuova autorizzazione a un modello, alla PWA, alla Knowledge Base o al controllore. **Candidata 02: APPROVATA TECNICAMENTE senza modifiche il 2026-11-22.** L'esperto ha confermato «risposta corretta» alla proposta di soffiaggio delicato, con divieto di getti aggressivi, lavaggio e oliatura. Le due approvazioni restano limitate ai testi sopra riportati e non costituiscono autorizzazione a usare l'AI. Ulteriori candidati seguiranno una risposta alla volta.

## Stato ambiente

Il titolare conferma **Cloudflare deployment commit `b6df639` Success** in data 2026-11-18. Ciò attesta il deployment, non un test live della capacità M4.5.4 (modulo offline, non collegato al router) né la riattivazione dell'AI. Il controllo browser `FREE_CHAT_DISABLED` con 0 chiamate verificato in chat resta riferito al precedente commit `f9b1e32`. GitHub Wrangler prevede modalità AI disabilitate.

**NEXT:** sottoporre candidata 03 sulla valutazione di sostituzione/conservazione del filtro in carta, facendo riferimento anche a RASA-OP-03-P02 (F15.17-R1); nessuna modifica di comportamento fino ad approvazione separata.
