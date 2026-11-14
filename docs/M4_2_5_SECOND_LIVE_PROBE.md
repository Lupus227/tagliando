# M4.2.5 — Seconda prova reale Workers AI, diagnostica strutturale

**Autorizzazione:** il titolare ha richiesto di procedere con la seconda prova reale GPT-OSS 20B. La prova riguarda **solo il laboratorio staging OP03** e una domanda fissa predefinita.

**Stato del codice:** attivazione temporanea del solo `/api/lab/ai-probe`, non della PWA, del servizio `/api/assist` o di una AI conversazionale generale. La Knowledge Base 15.25.1, la PWA 0.12.1, i flag globali `aiEnabled=false` e `canGenerate=false`, i gate `aiUseAllowed=false` e il contratto M4.1 sono invariati.

## Attivazione e scadenza

Entrambe le configurazioni Wrangler:
- `AI_PROBE_MODE=enabled`
- `AI_PROBE_EXPIRES_AT=2026-11-14T20:00:00Z` (14 novembre 2026, **21:00 CET**, Italia)

Il controllo della scadenza è presente sia nella route sia nel modulo di inferenza. L'assenza della variabile o un valore malformato bloccano l'accesso, così come il superamento della scadenza. Scaduta la finestra, il risultato atteso è `PROBE_EXPIRED`, con zero invocazioni al modello; la scadenza **non** riporta autonomamente il file Wrangler a `disabled`.

## Test autorizzato

1. Aspettare CI GitHub Success e conferma deployment Cloudflare della PR/commit di attivazione (l'ultimo caso aveva richiesto un retrigger documentale, ma non ripetere push automaticamente).
2. Nel laboratorio Access-protetto `https://tagliando-ai-staging.maico-gua.workers.dev/lab/ai-probe`, selezionare **solo** `paper-wash`: «Posso lavare con acqua il filtro in carta?» (P03).
3. Premere **una sola volta** `Avvia prova controllata`. Inviare il risultato visibile: `decision`, `diagnosticCode`, numero `modelRequests` e l'eventuale testo revisionato. Non copiare log sensibili.
4. **Non ripetere** il tentativo senza analisi dell'esito. Non cambiare modello o parametro `max_tokens` in questa prova: si vuole diagnosticare l'interfaccia attuale.
5. Dopo il test, eseguire PR di rollback `AI_PROBE_MODE=disabled` in *entrambi* i Wrangler e aggiornarne i test; CI e deployment Cloudflare da verificare separatamente. Anche un esito `MODEL_OUTPUT_REJECTED` è informativo grazie a M4.2.4.

## Barriere mantenute

- Access obbligatorio, origine staging esatta, `SERVICE_MODE=guarded` e limiter dedicato 1/min **approssimativo**. Piano confermato dal titolare: Cloudflare Workers Free.
- Solo il caso P03 carta può raggiungere `env.AI.run`; anomalia P01 e domanda fuori ambito sono bloccate prima.
- Il modello non riceve contenuti tecnici della KB e non genera istruzioni da mostrare: propone solo `SHOW_REVIEWED_STEP` con step/revisione oppure `ABSTAIN`.
- La decisione definitiva rimane di `reviewM4Candidate` (M4.1). Nessuna mutazione di sessione, completamento o salto di procedura.
- Il server può restituire solo un `diagnosticCode` di vocabolario fisso, **non** l'output originale GPT-OSS né il prompt. La causa del primo `MODEL_OUTPUT_REJECTED` non è nota e non può essere ricostruita retroattivamente.
- CI `node --test tests/*.test.cjs` e `wrangler deploy --dry-run` non eseguono inferenze reali.

## Criterio di chiusura

- Attivazione CI Success e Cloudflare Success **separatamente confermati**.
- Una sola esecuzione reale osservata oppure stop per scadenza/blocco.
- Rollback CI Success e Cloudflare Success, con `PROBE_DISABLED` nel laboratorio.
- Registro e checkpoint aggiornati solo con stati effettivamente verificati.
