> **Aggiornamento 2026-11-12 — attivazione reale limitata:** il titolare ha autorizzato la prima inferenza GPT-OSS 20B con i vincoli OP03 già concordati. Le due configurazioni Wrangler sono aggiornate a `AI_PROBE_MODE=enabled` e `AI_PROBE_EXPIRES_AT=2026-11-13T00:00:00Z` (01:00 CET). Il server controlla la scadenza **sia nella route sia nell'adattatore**; richieste successive risultano `PROBE_EXPIRED` e non invocano Workers AI. La prima esecuzione reale non è dimostrata da CI/deployment: sarà confermata soltanto dal risultato browser con `modelRequests=1`. Dopo il test, riportare `AI_PROBE_MODE=disabled` con PR/deploy separato; la scadenza non cambia automaticamente la configurazione Cloudflare.
>
> **Contesto storico:** le sezioni seguenti descrivono la prima tranche di predisposizione, quando `AI_PROBE_MODE` era `disabled`. La versione corrente del branch di attivazione è descritta nell'aggiornamento sopra.

# M4.2.2 — Primo test GPT-OSS 20B in laboratorio isolato

**Stato previsto:** codice di prova integrabile sul Worker staging **con inferenza OFF per impostazione predefinita**. Primo modello: `@cf/openai/gpt-oss-20b` (Workers AI). PWA pubblica e operazioni della manutenzione non modificate.

## Ambito rigorosamente limitato

La nuova pagina Access-protetta `/lab/ai-probe` usa l'API `POST /api/lab/ai-probe`. Non accetta domande libere: la richiesta ammette **esclusivamente** un ID di scenario. I tre scenari server-side sono:
- `paper-wash`: P03, filtro carta, domanda «Posso lavare con acqua il filtro in carta?»;
- `cover-stuck`: P01, impossibilità di aprire il coperchio → arresto prima del modello;
- `off-topic`: P03, domanda sul cinema → rifiuto prima del modello.

Solo il primo scenario può raggiungere il modello, quando il gate operativo è attivo. Il modello riceve domanda e `stepId` **predeterminati**, **non** il testo della Knowledge Base; tutte le revisioni OP03 rimangono `aiUseAllowed=false`.

Il modello può produrre solo un selettore di fonte `SHOW_REVIEWED_STEP` con step/revisione precisi o `ABSTAIN`. Il contratto M4.1 rilegge server-side la fonte validata e rifiuta qualunque testo libero, campo aggiuntivo, revisione inesistente, completamento o cambio step. Il testo tecnico presentato all'operatore proviene **solo dal ledger**, non dal modello. Non è ancora una conversazione naturale.

## Gate operativi prima di qualsiasi chiamata

1. `SERVICE_MODE=guarded`, hostname staging esatto, Cloudflare Access firmato con identità univoca.
2. `AI_PROBE_MODE=enabled` richiesto per POST. Le due configurazioni Wrangler committate contengono `"AI_PROBE_MODE": "disabled"`: **nessuna inferenza possibile dopo il solo merge o il deployment**.
3. `AI_PROBE_LIMITER` dedicato: 1 richiesta ogni 60 secondi per chiave condivisa nel punto Cloudflare. **Non è una quota globale rigorosa**: il Rate Limiting API è approssimato e distribuito.
4. JSON al massimo 128 byte e con l'unico campo `caseId`, fra gli ID prestabiliti; nessun input arbitrario inoltrato al provider.
5. `env.AI.run` con `max_tokens=192`, `temperature=0`, `stream=false`, senza credenziali API, senza AI Gateway né persistenza di domande.
6. Indipendentemente dalla risposta, `allowCompletion=false` e `sessionChanged=false`. Gli errori del provider sono bloccanti e privi di dati riservati.

## Costi e limitazioni

L'utente ha confermato il **piano Cloudflare Workers Free**. Secondo la documentazione Workers AI aggiornata a ottobre 2026, la quota è **10.000 neurons al giorno**; superata tale quota, il piano Free rifiuta le richieste invece di addebitare l'eccedenza. È la protezione economica di account, non il limiter M4.2.2. Il modello è elencato tra quelli disponibili sul piano Free alla data della verifica; ricontrollare la dashboard prima dell'attivazione.

La distribuzione del codice con `AI_PROBE_MODE=disabled` non effettua inferenze. Prima di attivare la variabile a `enabled` serve nuovo passaggio separato, approvazione, conferma del piano Free e disponibilità residua: **non modificare manualmente il dashboard per attivare la variabile durante questa tranche**.

## Verifiche previste

- CI: `node --test tests/*.test.cjs` e `wrangler deploy --dry-run`.
- Negativi: Access assente, Origin errata, limite non disponibile, input libero/malevolo, risposta AI inventata, fonte o revisione falsificata, anomalia, domanda estranea, provider irraggiungibile.
- Positivi con mock: una sola chiamata fittizia al modello, risposta compatibile con ledger P03, nessuna scrittura della sessione.
- Dopo eventuale deployment: Cloudflare commit `Success`; `/api/knowledge-status` deve confermare KB `15.25.1`, `aiEnabled=false`, `canGenerate=false`, `readyForTechnicalAnswers=false`. La nuova pagina deve aprirsi ma il POST deve restituire `PROBE_DISABLED`.

**Non confondere il buon esito di questi test automatici con una prima inferenza reale:** questa richiederà successiva abilitazione esplicita della prova e un collaudo browser con esito registrato.

Fonti:
- https://developers.cloudflare.com/workers-ai/models/gpt-oss-20b/
- https://developers.cloudflare.com/workers-ai/platform/pricing/
- https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
