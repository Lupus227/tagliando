# M4.5.5 — Risposta focalizzata 07: rimontaggio del filtro aria

**Stato:** `EXPERT_APPROVED_TEXT_ONLY` — risposta breve approvata dal titolare senza modifiche («si approvo») il 2026-11-22.  
**AI/runtime:** NON autorizzati; stato procedurale, controller, PWA e Knowledge Base invariati.

## Riferimenti e perimetro

- **Domanda:** «Come rimonto correttamente il filtro aria?»
- **Intento candidato:** `air_filter_correct_reassembly`
- **Fonte:** `worker/src/review-ledger.mjs`, `RASA-OP-03-P07`, revisione `F15.22-R1`, stato `VALIDATO_CONDIZIONATO`, `aiUseAllowed=false`, `universalAuthorization=false`.
- **Applicabilità:** rasaerba a benzina, filtri carta, sola spugna e misti; solamente dopo trattamenti applicabili completati e con scatola filtro pulita e asciutta.

## Risposta 07 — testo integralmente approvato

> Dopo aver completato il trattamento previsto per il filtro, verifica che la scatola sia pulita e asciutta.
>
> Inserisci il filtro nella sua sede, rispettando l'orientamento e gli eventuali incastri. Se è un filtro misto, riposiziona correttamente sia l'elemento in carta sia il prefiltro in spugna.
>
> Controlla che il filtro non sia piegato, schiacciato o fuori sede e che le superfici di tenuta aderiscano correttamente.
>
> Rimonta il coperchio, allineando guide e fissaggi senza forzarlo. Verifica che sia stabile e che non vi siano fessure attraverso cui l'aria possa passare senza essere filtrata.
>
> Se il filtro non entra correttamente, il coperchio non si chiude, i fissaggi sono danneggiati oppure non puoi garantire la tenuta, sospendi l'operazione e segnala il problema.
>
> Non avviare il motore senza il sistema filtrante correttamente installato.

**Approvazione esperto:** «si approvo» il 2026-11-22 alla proposta sopra, senza richieste di modifica.

## Vincoli per qualsiasi utilizzo futuro

1. Nessuna conclusione automatica che il filtro sia stato correttamente trattato, orientato, inserito o che abbia tenuta adeguata: la verifica richiede il contesto reale dell'operatore e i gate del controller.
2. Non permettere progressione o avviamento in presenza di filtro fuori sede, coperchio che non chiude, fissaggi danneggiati o tenuta non garantita. Registrare il problema e sospendere il completamento.
3. Mantenere i percorsi carta/spugna/misto e la sequenza dei trattamenti: il testo focalizzato non sostituisce il passaggio P07 integrale né le verifiche precedenti.
4. L'output è **solo testo approvato per revisione tecnica**. Non è approvato per l'erogazione mediante LLM o per l'inclusione in un endpoint: `aiUseAllowed=false`.
5. Alla modifica della revisione P07, richiedere nuovamente verifica di compatibilità del testo.

## Continuità dopo sette approvazioni

- Risposte 01–03, filtro carta: `docs/M4_5_5_PROPOSTA_RISPOSTA_P03.md`.
- Risposta 04, lavaggio spugna: `docs/M4_5_5_RISPOSTA_04_LAVAGGIO_SPUGNA.md`. Nota: il testo breve elimina «e lavabile»; le condizioni attuali del ledger P04 sono **ancora invariate**.
- Risposta 05, oliatura: `docs/M4_5_5_RISPOSTA_05_OLIATURA_SPUGNA.md`.
- Risposta 06, pulizia scatola: `docs/M4_5_5_RISPOSTA_06_PULIZIA_SCATOLA.md`.
- **Risposta 07, rimontaggio:** questo documento.

Le sette risposte sono **sette formulazioni testuali approvate**, non equivalgono né a copertura dell'intera OP03 né a un sistema di risposta AI attivo. I passaggi P01/P02, le anomalie, le varianti libere e l'integrazione con lo stato non sono coperti automaticamente da questo set.

**NEXT consigliato:** definire un *catalogo offline strutturato* delle sette risposte con fonte, revisione, id dell'intento, prerequisiti, tipo filtro, STOP e flag `EXPERT_APPROVED_TEXT_ONLY`; progettare test negativi e fail-closed senza importare nel router, senza cambiare KB, PWA o abilitare AI. Approvazione distinta necessaria per l'eventuale uso runtime.
