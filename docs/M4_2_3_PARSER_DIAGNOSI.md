# M4.2.3 — Diagnostica offline del parser Workers AI / GPT-OSS 20B

**Contesto:** l'utente ha confermato il deployment della prima prova `536f19c` e la risposta `MODEL_OUTPUT_REJECTED`. La chiamata è stata fermata dal contratto M4.1; non è disponibile la risposta originale di Workers AI, quindi la causa non è dimostrabile. Il rollback successivo `c4d6fff` è stato confermato `Success` e il laboratorio ha nuovamente restituito `PROBE_DISABLED`.

## Intervento

Il parser `parseM4SelectorEnvelope` di `worker/src/m4-ai-probe.mjs` è stato sostituito con un estrattore **strict allowlist** che distingue:

| Envelope | Accettazione | Controlli |
|---|---|---|
| `{response: JSON string}` | Sì | JSON completo, massimo 512 caratteri |
| `{response: object}` | Sì | Deve essere un oggetto non array |
| `{choices:[{message:{role:'assistant', content: JSON string}, finish_reason:'stop'}]}` | Sì | Esattamente una choice, messaggio assistant, termine `stop`, nessun tool call/refusal |
| `{response:..., choices:...}` | No | Envelope ambiguo |
| Markdown, prosa, testo parziale, output non supportati | No | Nessuna estrazione euristica |
| Choice con `length`, `tool_calls`, ruolo improprio o risposte multiple | No | Output bloccato |

**Importante:** la compatibilità Chat Completions è documentata da Cloudflare per le rispettive API, ma non è provato che il precedente `env.AI.run` con `messages` abbia restituito quel formato. Questa è una correzione preventiva di compatibilità, **non** una diagnosi confermata di `MODEL_OUTPUT_REJECTED`.

Il contenuto estratto resta **non fidato**: `reviewM4Candidate` confronta esattamente azione, ID del solo passaggio, revisione e testo correntemente validato. Non accetta istruzioni AI, completamenti, permessi, campi aggiuntivi o fonti fabbricate.

## Verifiche automatiche

- Test dedicati `tests/m4-selector-envelope.test.cjs`: fixture binding `response`, Chat Completions `choices`, `ABSTAIN`, conflitti e forme sconosciute, ragionamento troncato, campo `tool_calls`, riferimenti non validi e completamenti indesiderati.
- Mock end-to-end della sola prova `paper-wash`: verifica che l'istruzione mostratra provenga dalla revisione del ledger, senza chiamare Cloudflare.
- CI: `node --test tests/*.test.cjs` + `wrangler deploy --dry-run` su PR. Nessuna inferenza nel processo.
- Entrambi i file Wrangler conservano `AI_PROBE_MODE=disabled`, la guardia di scadenza e il limiter dedicato. La PWA `0.12.1`, la KB `15.25.1`, i flag AI globali e `aiUseAllowed=false` non cambiano.

## Limiti e prossima decisione

Non sono stati acquisiti né archiviati output grezzi del modello. Se in una prova successiva il rifiuto persiste, identificare la sola **categoria strutturale** dell'envelope tramite diagnostica non sensibile, prima di ampliare ulteriormente il parser; non inoltrare testi generati, prompt completi o informazioni personali.

La prima successiva inferenza reale richiede **nuova autorizzazione esplicita** e una finestra temporanea controllata. Il commit di questa correzione, anche se distribuito automaticamente da Cloudflare, non abilita alcuna richiesta AI.

## Fonti ufficiali

- [Workers AI GPT-OSS 20B](https://developers.cloudflare.com/workers-ai/models/gpt-oss-20b/)
- [API compatibili OpenAI / Chat Completions](https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/)
- [JSON Mode Workers AI](https://developers.cloudflare.com/workers-ai/features/json-mode/)
