# M4.2.6 — Compatibilità conservativa Chat Completions e codici diagnostici

**Contesto verificato:** dopo una sola seconda inferenza GPT-OSS 20B sul laboratorio OP03, il Worker ha restituito `MODEL_OUTPUT_REJECTED`, `ROLE_OR_TOOL_UNSUPPORTED`, `modelRequests=1`. Il titolare ha successivamente confermato Cloudflare deployment rollback `02c8708` **Success** e `PROBE_DISABLED`: l'inferenza è stata nuovamente disabilitata.

**Limite epistemico:** non disponiamo della risposta grezza di GPT-OSS. Non è possibile dimostrare che il rifiuto fosse causato da `refusal:null`, `tool_calls:[]`, dal ruolo o da una diversa struttura. La correzione è una compatibilità controllata con formati noti, verificata **solo offline**.

## Modifica del parser

`worker/src/m4-output-diagnostics.mjs` mantiene le due sole forme ammesse:
- `{response: oggetto_o_stringa_JSON}`;
- `{choices: [{finish_reason:"stop", message:{role:"assistant",content: stringa_JSON}}]}`.

Nel secondo caso, i campi opzionali `tool_calls`, `refusal` e `function_call` sono valutati **in base al valore**, non soltanto alla loro presenza:

| Campo opzionale | Accettazione neutra | Rifiuto |
|---|---|---|
| `tool_calls` | assente, `null` o `[]` | array non vuoto, valore malformato, testo |
| `refusal` | assente o `null` | ogni valore non nullo, incluso `""` |
| `function_call` | assente o `null` | ogni valore non nullo |
| `message.role` | solo `assistant` | qualsiasi altro ruolo o ruolo mancante |
| `finish_reason` | solo `stop` | `tool_calls`, `length`, `content_filter`, `null` e altri |

I codici del classificatore passano a `tagliando.m4.output-diagnostic.v2` e discriminano `MESSAGE_INVALID`, `ROLE_UNSUPPORTED`, `TOOL_CALL_UNSUPPORTED`, `REFUSAL_PRESENT`, `FUNCTION_CALL_UNSUPPORTED`, senza memorizzare né restituire testo del modello. `OUTPUT_TRUNCATED` e i precedenti codici envelope/JSON rimangono operativi.

**Barriera immutata:** anche se l'envelope viene accettato, `reviewM4Candidate` (contratto M4.1) deve approvare il contenuto in forma di semplice selettore `SHOW_REVIEWED_STEP` e ID/revisione esatti. Qualsiasi istruzione tecnica aggiuntiva, completamento o passaggio non autorizzato resta rifiutato. `allowCompletion=false`, `sessionChanged=false`.

## Verifica e distribuzione

- Aggiornate le fixture che precedentemente rifiutavano i campi neutri, preservando i test di rifiuto per tool call reali, risposte ambigue, JSON malformato e campo `finish_reason` improprio.
- Nuovi test di codici differenziati, mancato `message`, payload attivi, conservazione del testo del ledger e assenza di fuga delle stringhe simulate.
- CI obbligatoria: Node regression e Wrangler deploy `--dry-run`.
- **Nessun cambiamento** nei due Wrangler: `AI_PROBE_MODE=disabled`, scadenza del 14 novembre 2026 conservata. PWA 0.12.1, KB 15.25.1 e ledger AI off non modificati.
- Cloudflare deployment del nuovo merge e blocco `PROBE_DISABLED` da confermare separatamente dopo CI/merge.
- **Nessuna inferenza reale autorizzata** da questa PR. Non attivare Workers AI durante la verifica.

Documentazione ufficiale Cloudflare:
- https://developers.cloudflare.com/workers-ai/changelog/ (17 febbraio 2026: supporto Chat Completions per GPT-OSS)
- https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/
- https://developers.cloudflare.com/workers-ai/models/gpt-oss-20b/
