# M4.4 — Laboratorio dialogo libero controllato (offline)

**Scopo:** verificare, in un successivo esperimento autorizzato, GPT-OSS 20B con domande testuali formulate liberamente e una cronologia di quattro turni. Il laboratorio è **non tecnico**: NON è l'assistente di manutenzione utilizzabile e NON prende decisioni sul tagliando.

## Differenza da M4.3

M4.3 ha dimostrato con due prompt fissi che il modello risponde in italiano e riconosce il contesto esplicitamente passato. M4.4 aggiunge input libero e un breve storico inviato dal browser. **La cronologia è volatile e modificabile dal client**, quindi non è una fonte affidabile per completamenti, registrazioni, procedure o attribuzione di responsabilità.

## Percorsi Access

- `/lab/ai-free` — pagina con area messaggi, campo libero e reset.
- `/lab/ai-free/client.js` — gestione locale di cronologia (solo RAM della pagina), messaggi renderizzati con `textContent`.
- `/api/lab/ai-free` — POST Access + Origin staging esatta, payload esatto `{question, history}`.

`history`: zero o fino a sei voci, in coppie alternate `user`/`assistant`; massimo 400 caratteri per domanda e 700 per risposta. Quattro domande totali per una conversazione visiva. Limite HTTP 5600 byte e limite logico cumulativo 3400 caratteri. Nessun salvataggio dei messaggi nel Worker, su disco, su storage o in cookie applicativi. Il test non usa dati personali.

## Sicurezza operativa

- `AI_FREE_MODE=disabled` e `AI_FREE_EXPIRES_AT=2026-11-16T18:25:00Z` (già scaduta) in **entrambi** i Wrangler.
- `AI_CHAT_MODE=disabled` e `AI_PROBE_MODE=disabled` invariati.
- Non modifica `/api/assist`, PWA v0.12.1, Knowledge Base v15.25.1, controllore M4.1, né le autorizzazioni di manutenzione.
- Verifiche Access, Origin, metodo POST, input UTF-8 dimensionato, cronologia e ruoli, scadenza, binding AI e `AI_PROBE_LIMITER` (1 richiesta ogni 60 secondi per chiave globale del laboratorio).
- Nessun tool, nessuna modifica di stato, `allowCompletion=false`, `sessionChanged=false`. Nessuna istruzione tecnica integrata nella risposta del laboratorio.
- **Blocco di primo livello per parole tecniche riconoscibili** su domanda, storico e risposta; se attivo restituisce `TECHNICAL_SCOPE_BLOCKED` o `TECHNICAL_OUTPUT_BLOCKED` (senza istruzioni). È un filtro euristico NON esaustivo: non protegge da parafrasi, lingue diverse o prompt injection. **Mai usarlo come barriera sufficiente per dare istruzioni operative.**
- Prompt di sistema chiede conversazione innocua in italiano e rifiuto di quesiti tecnici: un prompt NON garantisce sicurezza. Durante la prova usare soltanto domande innocue (saluti, astronomia, preferenze e contesto).
- L'API restituisce soltanto il testo validato e codici diagnostici statici; non logga raw output e non espone eccezioni provider.
- Il rate limiter non costituisce un budget rigido globale; prima di abilitare l'AI servono nuova autorizzazione esplicita, cutoff breve, piano di rollback e monitoraggio consumo.

## Test e criteri di collaudo

1. Test Node CI: config AI OFF e expiry scaduta, parsing input libero, limite di turni, ruolo e storico, prompt, errore provider, risposta malformata e tool call; Access, Origin, rate limit e isolamento `/api/assist`.
2. Compilazione Wrangler `--dry-run` Success.
3. Merge staging, deployment Cloudflare confermato **separatamente**, apertura della pagina e una prova in OFF che restituisca `FREE_CHAT_DISABLED` con `modelRequests=0`.
4. **Solo su nuova autorizzazione**: attivazione temporanea, almeno due domande spontanee innocue e follow-up contestuale con attesa 60s fra chiamate, verifica di testo reale e uso contesto; al termine rollback `AI_FREE_MODE=disabled` e nuova conferma Cloudflare.
5. Fase seguente **distinta**: progettare risposte tecniche solo su fonti validate, con controllore deterministico e arresti, senza riutilizzare il semplice filtro parole come autorizzazione.

**Non considerare M4.4 pronto alla produzione dopo un unico test conversazionale.**

## M4.4.1 — Prova GPT-OSS 20B di conversazione libera, autorizzazione del 2026-11-16

Il titolare del progetto ha risposto **«procedi»** alla proposta di attivazione temporanea sul piano Cloudflare Workers Free per 2–4 domande libere innocue.

- **Solo laboratorio non tecnico** `/lab/ai-free`, già protetto da Cloudflare Access.
- Finestra UTC in entrambi Wrangler: `AI_FREE_MODE=enabled` fino a `AI_FREE_EXPIRES_AT=2026-11-16T20:20:00Z` (**21:20 CET**). Il cutoff blocca nuove chiamate anche se il rollback non è stato ancora distribuito.
- Gli altri laboratori rimangono `AI_CHAT_MODE=disabled` e `AI_PROBE_MODE=disabled`. `/api/assist` e PWA pubblica invariati.
- **Piano:** CI Success + merge di questa attivazione; conferma distinta di Cloudflare deploy Success; una sola domanda innocua alla volta e attesa di almeno 60 s tra invii; massimo quattro turni, poi stop.
- In caso di `FREE_CHAT_OUTPUT_REJECTED`, `MODEL_UNAVAILABLE` o `FREE_CHAT_EXPIRED` non ripetere la richiesta: riportare il codice e iniziare il rollback.
- **Rollback predisposto anticipatamente:** PR separata in staging per riportare `AI_FREE_MODE=disabled` nei due Wrangler e aggiornare la fixture CI. Non unirla prima del test o della scadenza; dopo il merge del rollback confermare Cloudflare Success e `FREE_CHAT_DISABLED`, `modelRequests:0`.
- Il rate limiter 1/60s è un limite **approssimativo** e non sostituisce una soglia globale di spesa; utilizzare solo le richieste concordate, nel piano gratuito.
- Le risposte del laboratorio non autorizzano alcuna azione di manutenzione, riparazione o diagnosi su macchine. Il controllo lessicale non è sufficiente per un assistente operativo.

**CI automatica usa esclusivamente AI simulata. Nessuna chiamata reale verrà eseguita da GitHub o dall'assistente in questa preparazione.**
