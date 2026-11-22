# M4.5.5 — Risposta focalizzata 04: lavaggio del filtro in spugna

**Stato:** `EXPERT_APPROVED_TEXT_ONLY` — risposta breve R2 approvata dall'esperto il 2026-11-22; **non** autorizzata per AI, app o Worker.  
**Ambito:** approvazione di un singolo testo di risposta; solo documentazione.

## Identificazione e provenienza

- **Domanda:** «Come posso lavare il filtro in spugna?»
- **Risposta / intento:** `foam_filter_wash_instruction` — candidata 04 della serie M4.5.5.
- **Fonte canonica:** `worker/src/review-ledger.mjs`, passaggio `RASA-OP-03-P04`, revisione `F15.19-R2`, `VALIDATO_CONDIZIONATO`.
- **Prerequisito:** valutazione precedente del filtro `RASA-OP-03-P02` (F15.17-R1); destinata a filtri interamente in spugna o prefiltro in spugna dei sistemi misti.
- **Gate invariati:** `aiUseAllowed=false`; `universalAuthorization=false`; nessun permesso di avanzamento o riavvio del motore.

## Risposta 04 — versione R2 approvata

> Se la spugna è integra, immergila in acqua tiepida con una piccola quantità di detergente specifico per filtri aria.
>
> Comprimila ripetutamente senza torcerla, poi risciacquala accuratamente con acqua pulita.
>
> Elimina l'acqua in eccesso premendola delicatamente in un panno pulito e lasciala asciugare completamente all'aria, lontano da fonti di calore diretto.
>
> Non utilizzare solventi. Se la spugna è danneggiata, interrompi il trattamento e sostituiscila con un elemento compatibile.
>
> Nei filtri misti, l'elemento in carta deve rimanere separato e protetto dall'acqua.

**Esito dell'esperto:** dopo la proposta R1, l'esperto ha richiesto espressamente di eliminare «e lavabile» dalla frase «Se la spugna è integra e lavabile…», motivando che per la guida di base la lavabilità è sottintesa se il filtro non è deteriorato e da sostituire. È stata presentata la **versione R2** qui riprodotta; l'esperto ha risposto **«perfetto, approvato»** il 2026-11-22. Non vi sono altre modifiche approvate alla risposta.

## Vincoli di utilizzo futuro e disallineamento da gestire separatamente

1. La frase approvata serve a una domanda **specifica** sul lavaggio di un elemento in spugna dopo la corretta identificazione e valutazione. Non equivale a verifica materiale, autorizzazione di riuso, chiusura dell'operazione o conferma dei prerequisiti.
2. L'output per un futuro sistema deve sottostare al preflight M3/M4.5.2 sul **testo originale**, ai controlli di integrità/stop e al filtro di applicabilità. Se il contesto è incerto, non anticipare una risposta operativa.
3. **Coerenza con la KB:** il ledger P04 F15.19-R2 contiene ancora le condizioni `foamMustBeReusableAndWashable=true` e `stopIfFoamDamagedOrWashabilityUnknown=true`, oltre alla frase «e può essere lavata». **Questi elementi NON vengono modificati dalla presente approvazione della risposta breve.** Una eventuale revisione della KB per recepire la semplificazione richiesta dall'esperto è una decisione tecnica **distinta** con test e approvazione specifica. Fino ad allora i gate esistenti restano conservati.
4. Non eliminare le condizioni di arresto per spugna danneggiata, ricambio necessario non disponibile o sistema filtrante non correttamente trattato e rimontato.
5. Se la fonte viene revisionata, invalidare l'approvazione della risposta in attesa di verifica di coerenza.
6. La risposta tecnica approvata non può essere fornita al modello AI: `aiUseAllowed=false` e nessun runtime autorizzato.

## Stato di progetto al momento della registrazione

- PWA pubblica `v0.12.1`, KB `v15.25.1`, AI non abilitata.
- Ultimo deployment Cloudflare confermato dall'esperto: commit `b6df639` **Success**; non è il deployment di questa proposta documentale.
- **Prossima risposta da sottoporre a revisione:** candidata 05 su oliatura del filtro in spugna versus prefiltro in spugna, da P05 `F15.20-R3`. Una risposta alla volta.
