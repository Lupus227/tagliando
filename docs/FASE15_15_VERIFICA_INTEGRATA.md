# Fase 15.15 — Audit integrato dell'Operazione 2 (lama)

**Data:** 2026-11-08  
**Tipo:** analisi statica cross-step dei dati approvati, **NON** test end-to-end della navigazione.  
**Ramo tecnico analizzato:** `dev/fase14-ai`, commit `23642ef6f26207fc7d46632cb0f90013781c3e1a`.  
**Fonti:** `worker/src/review-ledger.mjs`, `worker/src/canonical-knowledge.mjs`, `worker/src/index.mjs`; Issue GitHub [#1](https://github.com/Lupus227/tagliando/issues/1), [#2](https://github.com/Lupus227/tagliando/issues/2), [#3](https://github.com/Lupus227/tagliando/issues/3); registro v1.1.

## Risultato sintetico

Sono stati eseguiti **20 controlli programmatici statici**, via lettura e parsing dei dati JSON del catalogo canonico e del registro delle revisioni, confrontando valori dei campi strutturati e alcuni vincoli testuali. **20/20 superati**; **0** anomalie rilevate nelle proprietà esaminate.

Questo risultato **non** certifica che la PWA o il Worker siano già in grado di applicare le diramazioni, di conservare lo stato di sessione, di impedire avanzamenti o di guidare correttamente l'utente. Non è stato eseguito in questa fase un nuovo test del backend staging Access-protetto, né una prova sul dispositivo. Non si incrementa il numero di passaggi validati, non si cambia la versione della KB e non si abilita l'AI.

**Nota tecnica:** la versione del *catalogo di origine* in `canonical-knowledge.mjs` è `14.3.0`; lo stato della *revisione cumulativa pubblicata* è `15.14.0`. Sono due identificatori diversi, non un rollback.

## Controlli statici svolti

1. Presenza e ordine dei passaggi `RASA-OP-02-P01`–`P08` nel catalogo.
2. Presenza di 8 revisioni condizionate con `aiUseAllowed=false`.
3. P01: isolamento candela/avviamento elettrico e sostegno stabile dichiarati.
4. P07: prerequisito esplicito che punta allo smontaggio P02.
5. P07: necessità di dichiarare coppia in Nm, fonte e dinamometrica **prima** di rimuovere la lama.
6. P07: salto facoltativo dell'affilatura prima dello smontaggio, registrato come non eseguito; possibilità di continuare il tagliando quando il salto è sicuro.
7. P07: divieto di considerare "saltata" una lama già smontata e non rimontabile in sicurezza; stop e verifica tecnica.
8. P03: se il mozzo resta in sede e integro non richiede smontaggio né verifica autonoma della linguetta.
9. P03: se il mozzo si sfila, controllo condizionato; arresto per danni, parti mancanti o accoppiamento incerto.
10. P04: lama strutturalmente compromessa non affilabile né rimontabile.
11. P04: affilatura facoltativa e alternativa del professionista.
12. P05: prerequisiti di integrità, strumenti e capacità, subordinati all'ispezione P04.
13. P06: equilibratura prevista solo in seguito all'affilatura P05.
14. P06: arresto per squilibrio evidente/deformazione/danno.
15. P07: coppia pertinente e dinamometrica; nessuna coppia universale né pistola a impulsi come misura della coppia finale.
16. P08: verifica finale solo dopo effettivo rimontaggio; non proporla se la rimozione facoltativa è stata saltata.
17. P08: maggiore resistenza del freno non equivalente a blocco; non forzare.
18. P08: possibile aiuto di un collaboratore soltanto con avviamento impossibile; vietato blocco della leva con corde; rilascio finale della leva.
19. P08: assenza della frase di sicurezza ridondante rimossa, mantenendo efficace il prerequisito di mancato avviamento.
20. Worker: `/api/assist` usa `evaluateSafety`, mantiene `aiEnabled=false`, `canGenerate=false`, `sessionChanged=false` e non esegue una procedura tecnica guidata.

## Riscontro e vincoli da non perdere

**Preflight fuori ordine apparente:** il testo del prerequisito di P07 deve essere verificato **prima** di P02. La posizione fisica P07 nel catalogo non basta: nel futuro *motore di esecuzione* occorrerà una guardia preventiva esplicita e collaudata che impedisca lo smontaggio senza strumenti e specifiche appropriate. Il catalogo registra tale intenzione, ma il motore che la applicherà non è ancora implementato.

**Diramazioni da collaudare quando esisterà il motore di esecuzione:**
- T1 — coppia/fonte/dinamometrica assenti: lavorazione lama non eseguita, nessuno smontaggio, proseguimento delle altre operazioni solo in sicurezza.
- T2 — prerequisiti presenti, lama integra: sequenza pertinente; se tagliente già idoneo, salto della sola affilatura/equilibratura senza saltare il rimontaggio se già smontata.
- T3 — lama crepata/danneggiata: arresto, nessuna affilatura o rimontaggio della lama compromessa.
- T4 — mozzo/linguetta/sede con anomalia: arresto e segnalazione; nessuna autorizzazione al rimontaggio non sicuro.
- T5 — freno motore oppone resistenza: differenziare effetto normale da interferenza; non forzare e non aggirare la sicurezza.
- T6 — annullamento, pausa e ripresa: nessuna conferma o avanzamento implicito; non ripetere inutilmente controlli validi, ma rivalutare i prerequisiti critici quando lo stato può essere cambiato.
- T7 — anomalie manuali/vocali: mantenere la sospensione senza avanzare (difetto PWA `OPEN-01` già noto, intervento rinviato).
- T8 — completamento/report: distinguere `completato`, `non eseguito`, `sospeso`; non dichiarare il tagliando integralmente effettuato in caso di omissioni.

## Decisione operativa

- F15.15 **audit statico completato**; test runtime **aperti** e rinviati alla progettazione del motore di esecuzione AI/PWA.
- Nessuna richiesta di modifica ai testi tecnici già approvati P01–P08.
- Stato KB come da deployment `23642ef`: `15.14.0`, 14/53 passaggi validati condizionatamente, 39 in attesa.
- Prossima revisione tecnica: **F15.16 — Operazione 3 (filtro aria), P01**, un passaggio alla volta, sempre con AI disabilitata.

## Criterio di chiusura completa dell'integrazione

Non contrassegnare come "collaudo funzionale superato" la F15.15 finché i T1–T8 non siano eseguiti su un controllore di procedura realmente implementato, in particolare la guardia P07→P02 e la gestione di stati `non eseguito`/`sospeso`.
