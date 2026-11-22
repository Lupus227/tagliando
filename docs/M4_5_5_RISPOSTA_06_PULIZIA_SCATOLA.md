# M4.5.5 — Risposta focalizzata 06: pulizia della scatola del filtro aria

**Stato:** `EXPERT_APPROVED_TEXT_ONLY` — il titolare conferma «si, è corretto» il 2026-11-22.  
**AI/runtime:** NON autorizzati. L'approvazione riguarda soltanto la formulazione tecnica della risposta breve.

## Riferimento

- **Domanda:** «Come pulisco la scatola del filtro aria?»
- **Intento candidato:** `air_filter_housing_cleaning`.
- **Fonte canonica:** `worker/src/review-ledger.mjs`, `RASA-OP-03-P06`, revisione `F15.21-R1`.
- **Stato fonte:** `VALIDATO_CONDIZIONATO`, `aiUseAllowed=false`, `universalAuthorization=false`.
- **Applicabilità:** rasaerba a benzina; filtro rimosso, tipi carta/spugna/misto; interruzione per scatola danneggiata, guarnizioni compromesse o sospetta contaminazione del condotto di aspirazione.

## Risposta 06 — testo approvato, senza modifiche

> Dopo aver rimosso il filtro, utilizza un panno pulito, asciutto o leggermente inumidito, per eliminare polvere, erba e altri residui dalla scatola e dal coperchio.
>
> Se trovi residui oleosi, puoi utilizzare una piccola quantità di detergente compatibile con plastica e guarnizioni, eliminandone successivamente i residui.
>
> Pulisci anche le superfici di appoggio del filtro, facendo attenzione a non introdurre sporco o liquidi nel condotto di aspirazione del carburatore.
>
> Non dirigere getti di acqua o aria compressa verso il condotto e non introdurvi utensili o panni.
>
> Se trovi parti danneggiate, guarnizioni compromesse oppure sospetti che siano entrati corpi estranei nell'aspirazione, sospendi il rimontaggio e segnala il problema.

**Conferma esperto:** «si, è corretto» (2026-11-22); nessuna correzione testuale richiesta.

## Condizioni per un eventuale impiego futuro

1. La risposta non sostituisce il gate sul contesto: filtro effettivamente rimosso, tipo e procedura verificati e nessuna anomalia bloccante preesistente.
2. La pulizia non autorizza automaticamente rimontaggio né avviamento. Verifica di assenza di residui e umidità, integrità e tenuta rimangono separate.
3. In caso di elementi danneggiati, guarnizioni compromesse o possibile ingresso di corpi estranei nel condotto, sospendere il rimontaggio e registrare l'anomalia; mai saltare lo STOP mediante parafrasi.
4. Il testo è approvato **solo come risposta breve**. Il ledger `F15.21-R1` resta l'unica fonte operativa, con `aiUseAllowed=false`. Nessuna abilitazione di modelli, variazione a router, KB, PWA, Worker o stato sessione.
5. Se cambia la revisione P06, la risposta deve essere verificata nuovamente prima di qualsiasi futuro impiego.

## Continuità

- Risposte 01–03 filtro carta: `docs/M4_5_5_PROPOSTA_RISPOSTA_P03.md`.
- Risposta 04 lavaggio spugna: `docs/M4_5_5_RISPOSTA_04_LAVAGGIO_SPUGNA.md`.
- Risposta 05 oliatura spugna: `docs/M4_5_5_RISPOSTA_05_OLIATURA_SPUGNA.md`.
- **Risposta 06:** approvata nel presente documento.
- **NEXT:** presentare la candidata 07 per rimontaggio filtro aria, fonte `RASA-OP-03-P07`, revisione `F15.22-R1`, senza presumere il completamento dei passaggi precedenti.
