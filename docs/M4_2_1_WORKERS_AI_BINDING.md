# M4.2.1 — Workers AI: binding configurato, inferenza disabilitata

**Milestone:** M4.2.1 — predisposizione del provider Cloudflare per il futuro laboratorio conversazionale OP03.  
**Stato richiesto:** fase di integrazione infrastrutturale, **non** abilitazione del modello.  
**Branch di lavoro:** `feat/m4-2-1-workers-ai-binding` su `dev/fase14-ai`.

## Perimetro della modifica

1. Nei due file `wrangler.jsonc` e `worker/wrangler.jsonc` è aggiunto **lo stesso binding**:
   ```json
   "ai": { "binding": "AI" }
   ```
   Cloudflare rende il servizio disponibile sul server come `env.AI`.
2. Il modulo `worker/src/workers-ai-binding.mjs` dichiara il modello candidato `@cf/openai/gpt-oss-20b` e verifica in forma non operativa la presenza del binding. Ritorna sempre `aiEnabled=false`, `canGenerate=false`, `modelInputAllowed=false`, `modelRequests=0`, `allowCompletion=false`, `sessionChanged=false`.
3. Il modulo **non è importato** da `worker/src/index.mjs`: nessuna nuova route né chiamata `env.AI.run()`. Non sono introdotti API token, segreti, logging di domande o connessioni a AI Gateway.
4. I test verificano: equivalenza delle due configurazioni, comportamento fail-closed del modulo, modello mock con conteggio delle chiamate pari a **zero**, conservazione dei gate su `/api/assist`, `/api/lab/filtro-aria`, `/api/knowledge-status` e `/health`. I sette step OP03 restano `aiUseAllowed=false`.
5. La PWA pubblica `v0.12.1` e la KB `15.25.1` non sono modificate.

## Distinzioni di sicurezza

Il **binding** consente tecnicamente al Worker di accedere al servizio; **non costituisce un'autorizzazione a inviare richieste**. La barriera effettiva in M4.2.1 è l'assenza di chiamate al provider in qualunque percorso runtime. Il precedente contratto M4.1 rimane un laboratorio non generativo.

Questa consegna **non** certifica la qualità conversazionale, la sicurezza semantica di domande libere o un controller generale, e non comporta utilizzo reale dell'AI. Aggiungere il binding alla configurazione non basta per produrre risposte.

## Costi

La configurazione del binding e i test offline non effettuano inferenze; non hanno consumo previsto di neurons Workers AI. Quando in futuro `env.AI.run()` sarà abilitato, l'utilizzo del modello consumerà la quota dell'account Cloudflare. Secondo la documentazione Workers AI esistono **10.000 neurons gratuiti per giorno**, ma **gli account Workers Paid possono fatturare l'eccedenza**. Pertanto il prossimo gate deve accertare il piano effettivo e introdurre un controllo di spesa indipendente prima della prima richiesta reale. `API_LIMITER` regola la frequenza ma non è un budget rigoroso.

Riferimenti Cloudflare:
- https://developers.cloudflare.com/workers-ai/configuration/bindings/
- https://developers.cloudflare.com/workers-ai/models/gpt-oss-20b/
- https://developers.cloudflare.com/workers-ai/platform/pricing/

## Criteri di accettazione e rollback

- PR indirizzata solo a `dev/fase14-ai`; **CI Node e Wrangler dry-run Success** prima del merge.
- Se il merge avvia un deployment automatico Cloudflare, verificare separatamente `Success` e l'endpoint Access-protetto `/api/knowledge-status` per confermare `version=15.25.1` e flag AI spenti.
- Nessuna nuova interazione utente o test vocale richiesti in questa tranche: il runtime delle route è invariato.
- Rollback: ripristinare entrambe le configurazioni Wrangler rimuovendo `ai` e ripristinare il commit precedente del branch staging.

## Gate per il passo successivo M4.2.2 — non autorizzato automaticamente

Prima di una singola chiamata reale: autorizzazione specifica dell'accesso AI ai contenuti del solo scope OP03, controller attendibile con guardie fail-closed, piano e quote Cloudflare verificati, limite di spesa, input e output non fidati, test negativi su domande e anomalie, logging minimizzato e decisione esplicita del titolare. AI Gateway è una valutazione successiva, non una dipendenza di M4.2.1.
