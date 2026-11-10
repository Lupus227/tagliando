# App tagliando — assistente tecnico AI per macchine da giardinaggio

**Missione:** costruire un assistente AI **conversazionale, prevalentemente vocale e tecnicamente controllato** che accompagni manutenzione, diagnosi e riparazioni delle macchine da giardinaggio. Il tagliando gratuito dei rasaerba a benzina è il **primo caso d'uso**, non il prodotto finale.

## START HERE — continuare il progetto senza perdere la direzione

**Prima di scrivere codice, analizzare una nuova fase o discutere le priorità, leggere nell'ordine:**

1. **[ROADMAP_MASTER.md](ROADMAP_MASTER.md)** — visione condivisa, architettura ibrida, milestone, sicurezza e obiettivo finale.
2. **[CHECKPOINT_RIPRESA.md](CHECKPOINT_RIPRESA.md)** — stato verificato, commit/deployment/issue, punto di ripresa e protocollo di apertura nuova chat.
3. **[REGISTRO_PROGETTO.md](REGISTRO_PROGETTO.md)** — decisioni approvate, regole, revisioni, anomalie note, storico.
4. **[Issue GitHub aperte](https://github.com/Lupus227/tagliando/issues?q=is%3Aissue+is%3Aopen)** — problemi e criteri di chiusura. Controllare anche le PR aperte e lo stato dei rami.

**Non iniziare automaticamente un intervento leggendo soltanto un'issue.** Prima confrontarlo con la roadmap e l'obiettivo chiesto dal titolare.

### Istruzione breve da utilizzare all'inizio di una nuova chat ChatGPT

> Continua il progetto **App tagliando**. Apri prima **ROADMAP_MASTER.md**, poi **CHECKPOINT_RIPRESA.md**, **REGISTRO_PROGETTO.md** sul ramo `main` di `Lupus227/tagliando`; consulta anche le issue e PR aperte e lo stato di `dev/fase14-ai`. Riassumi obiettivo AI, architettura ibrida, stato reale, vincoli e punto di decisione. Non riprendere automaticamente il prossimo step finché non lo decidiamo insieme. Non inferire Cloudflare dal solo codice GitHub.

**Per renderlo ricorrente:** il titolare può copiare questa istruzione nelle istruzioni del Progetto ChatGPT. Il solo repository non impone automaticamente il caricamento dei file in ogni nuova chat.

## Stato al checkpoint iniziale del 2026-11-10

| Livello | Stato |
|---|---|
| Prototipo PWA | v0.12.1, GitHub Pages, voce/registrazione sessione; **non ancora l'assistente AI target** |
| Backend e KB | `dev/fase14-ai`, `tagliando.knowledge.v1` |
| KB su Cloudflare | **15.25.1**, deployment `90283d4` confermato dal titolare |
| Revisione KB | 8 operazioni, 53 passi; **24 validati con condizioni**, **29 pendenti** |
| AI tecnica | **disabilitata** (`aiEnabled=false`, `canGenerate=false`) |
| Gate aperto | [Issue #37 / OPEN-07](https://github.com/Lupus227/tagliando/issues/37), domanda iniziale candela presente nel ledger ma non nel runtime PWA |
| Prossima decisione | **da concordare** in funzione della Roadmap Master |

## Primo laboratorio M3 — filtro aria (2026-11-10)

Su decisione del titolare si procede con lo stack GitHub / Cloudflare / PWA; **Emergent è in standby**. [PR #45](https://github.com/Lupus227/tagliando/pull/45), commit `5687f30` su `dev/fase14-ai`, [GitHub Actions Success](https://github.com/Lupus227/tagliando/actions/runs/42898433457). È stata aggiunta la pagina protetta `/lab/filtro-aria` che consulta i sette passaggi revisionati dell'Operazione 03 dal backend.

**La console non usa un LLM e non è idonea per manutenzione reale**. Il deploy Cloudflare del nuovo commit e i test browser/iPhone sono ancora da confermare. Il Worker mantiene `aiEnabled=false`, la KB `15.25.1` e la PWA pubblica `v0.12.1`. Per il protocollo di collaudo vedi [CHECKPOINT_RIPRESA.md](CHECKPOINT_RIPRESA.md).

## Architettura e sorgenti tecniche

- **PWA:** `app.js`, `voice.js`, `index.html`, `knowledge.js`, `support.js`, `retrieval.js` — codice del prototipo. **Non confondere i testi locali con la KB revisionata**.
- **Knowledge Base e revisioni:** `worker/src/canonical-knowledge.mjs`, `worker/src/review-ledger.mjs`, `tests/canonical-knowledge.test.cjs`.
- **Backend staging:** Cloudflare Workers/Pages con Access; i metadati del Worker sono verificabili nell'endpoint `/api/knowledge-status` con le credenziali autorizzate.
- **Modello d'uso previsto:** AI gestisce il linguaggio; motore deterministico autorizza sicurezza e avanzamento; KB validata fornisce contenuto tecnico. Nessuna di queste tre parti può sostituire le altre.

**Gli stati di progetto sono tracciati dai tre documenti sopra indicati.** Prima di una nuova chat, assicurarsi che il checkpoint sia stato aggiornato con risultati e prossima decisione.
