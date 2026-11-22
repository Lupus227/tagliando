# M4.5.5 — Risposta focalizzata 05: oliatura filtro in spugna

**Stato:** `EXPERT_APPROVED_TEXT_ONLY` — risposta breve approvata senza modifiche dal titolare («si ok») il 2026-11-22. **AI/runtime non autorizzati.**  
**Ambito:** documentazione tecnica della risposta focalizzata; nessun cambiamento a runtime, KB, PWA o Cloudflare.

## Identificazione

- **Domanda:** «Devo oliare il filtro in spugna dopo averlo lavato?»
- **Intento candidato:** `foam_filter_oil_by_filter_configuration`.
- **Fonte:** `worker/src/review-ledger.mjs`, `RASA-OP-03-P05`, revisione `F15.20-R3`, stato `VALIDATO_CONDIZIONATO`.
- **Contesto:** filtro interamente in spugna oppure prefiltro in spugna abbinato a filtro in carta; identificazione e valutazione preliminare necessarie, procedura di lavaggio P04 quando effettuata.
- **Permessi:** `aiUseAllowed=false`, `universalAuthorization=false`; l'approvazione del testo non autorizza la sua erogazione automatica.

## Risposta 05 — testo approvato

> Dipende dal tipo di filtro.
>
> Se è un filtro interamente in spugna, sì. Dopo averlo lasciato asciugare completamente, devi oliarlo, distribuendo uniformemente l'olio ed eliminando quello in eccesso.
>
> Se invece è un prefiltro in spugna abbinato a un filtro in carta, nella procedura standard non deve essere oliato.
>
> Per configurazioni particolari, il trattamento deve essere conosciuto per lo specifico modello. Non procedere per supposizione.

**Approvazione:** proposta della candidata 05 in chat; risposta esplicita del titolare «si ok» il 2026-11-22, senza richieste di modifica. Stato `EXPERT_APPROVED_TEXT_ONLY`.

## Limiti e sicurezza

1. La distinzione tra filtro in **sola spugna** (oliatura prevista) e **prefiltro misto** (nessuna oliatura nella procedura standard) dipende dalla configurazione identificata. Non inferirla dalla sola parola «spugna» nella domanda.
2. Nei casi modello-specifici non interpretare la frase come autorizzazione generale: senza dati e conoscenza pertinente al modello, non scegliere un trattamento per supposizione.
3. Il filtro deve essere **completamente asciutto** prima dell'oliatura; non deve rimanere olio in eccesso o gocciolamenti. Se l'olio idoneo manca quando necessario, sospendere il trattamento e registrare il problema.
4. Non avviare il motore senza il sistema filtrante correttamente trattato e rimontato. La risposta non autorizza avanzamento/completamento di passaggi né controlli saltati.
5. Un eventuale selettore futuro dovrebbe applicare prima il preflight della domanda originale, verificare revisione, tipo filtro, applicabilità, controlli di stop e tracciabilità. Non usare questa risposta come prompt per un modello: la KB resta `aiUseAllowed=false`.
6. Se la fonte P05 F15.20-R3 cambia, invalidare il testo breve fino a nuova revisione.

## Stato di sviluppo

- Risposte 01–03: filtro carta, approvate in `docs/M4_5_5_PROPOSTA_RISPOSTA_P03.md`.
- Risposta 04: lavaggio spugna R2, approvata in `docs/M4_5_5_RISPOSTA_04_LAVAGGIO_SPUGNA.md`.
- **Risposta 05:** oliatura differenziata, approvata in questo documento.
- Ultimo deployment Cloudflare confermato dal titolare: `b6df639` Success, relativo allo sviluppo precedente; nessun deploy della presente approvazione documentale.
- **NEXT:** sottoporre separatamente una risposta breve sulla pulizia della scatola del filtro aria, fonte `RASA-OP-03-P06` / `F15.21-R1`. 
