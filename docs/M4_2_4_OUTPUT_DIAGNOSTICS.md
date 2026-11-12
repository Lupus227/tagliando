# M4.2.4 — Diagnostica strutturale degli output AI (solo offline)

**Scopo:** distinguere la causa immediata di un rifiuto di output GPT-OSS 20B senza acquisire, loggare o mostrare testo generato dal modello. La prima prova del 2026-11-12 ha restituito `MODEL_OUTPUT_REJECTED` ma **la causa originale non è accertata**: nessuna risposta raw è stata conservata.

## Implementazione

- Nuovo modulo `worker/src/m4-output-diagnostics.mjs` con un vocabolario chiuso di codici `diagnosticCode`.
- Il parser continua ad ammettere soltanto i due envelope introdotti in M4.2.3: `response` Workers AI oppure un'unica `choices[0].message.content` Chat Completions con `finish_reason=stop` e ruolo `assistant`.
- Il parser **non diventa permissivo**: i risultati sconosciuti, ambigui, parziali, non JSON o con tool call vengono rifiutati.
- `reviewM4Candidate` (M4.1) resta il **controllore finale e obbligatorio**. Solo dopo tale controllo il risultato riceve un codice diagnostico; il codice non modifica autorizzazioni né può sbloccare operazioni.
- La pagina protetta `/lab/ai-probe` mostra il codice diagnostico ricevuto dall'API. Il codice è una stringa scelta da un insieme statico, **mai il testo o l'oggetto prodotto dal modello**.
- Nessun nuovo endpoint, nessuna persistenza, nessun log del provider o dell'input, nessuna chiave API, nessun invio di testi della KB al provider.

## Categorie diagnostiche

| Codice | Interpretazione |
|---|---|
| `ENVELOPE_UNKNOWN` / `ENVELOPE_AMBIGUOUS` | Struttura non prevista o conflitto tra formati |
| `CHOICES_INVALID` | Numero o struttura delle alternative non ammessa |
| `OUTPUT_TRUNCATED` | Provider segnala `finish_reason=length` |
| `FINISH_REASON_INVALID` | Completamento non dichiarato come finale |
| `ROLE_OR_TOOL_UNSUPPORTED` | Ruolo diverso da assistant, tool call o refusal |
| `OUTPUT_TOO_LONG` / `CONTENT_UNSUPPORTED` | Contenuto fuori limiti o non supportato |
| `JSON_INVALID` / `SELECTOR_NOT_OBJECT` | JSON non valido o oggetto selettore assente |
| `SELECTOR_ACTION_INVALID` / `SELECTOR_SHAPE_INVALID` | Azione o campi non conformi al contratto |
| `SOURCE_STEP_MISMATCH` / `SOURCE_REVISION_MISMATCH` | Fonte o revisione diverse da quelle server-side |
| `MODEL_ABSTAINED` / `SOURCE_ACCEPTED` | Astensione controllata / accettazione della fonte dopo M4.1 |
| `CONTROLLER_REJECTED` / `PROVIDER_ERROR` | Rifiuto non classificabile / errore provider sanitizzato |

I codici distinguono **il punto di rifiuto** ma non identificano automaticamente la causa remota: ad esempio `JSON_INVALID` può dipendere da generazione non conforme o troncamento non segnalato.

## Collaudi obbligatori

- Test isolati `tests/m4-output-diagnostics.test.cjs` su tutti i principali codici con fixture e binding AI mock.
- Verifiche di output API: nessuna fuga di stringhe sentinella nei risultati e nessuna modifica di `allowCompletion`, `aiEnabled`, `canGenerate` o `sessionChanged`.
- Test `PROBE_DISABLED` con binding presente: **zero chiamate**.
- CI su PR per `dev/fase14-ai`: `node --test tests/*.test.cjs` e `wrangler deploy --dry-run`; il dry-run non effettua deployment e non interroga GPT-OSS.

## Limiti e gate successivi

I due file Wrangler mantengono `AI_PROBE_MODE=disabled` e la data di scadenza `2026-11-13T00:00:00Z`. PWA `0.12.1`, KB `15.25.1`, `aiUseAllowed=false` e flag globali AI rimangono invariati.

**Questa fase non autorizza un secondo test reale.** Dopo merge e CI si chiede soltanto di confermare il deployment Cloudflare e `PROBE_DISABLED`; per una futura inferenza serve nuova autorizzazione specifica e un nuovo intervallo di attivazione limitato. Il risultato di un test futuro potrebbe aiutare a spiegare il precedente `MODEL_OUTPUT_REJECTED`, ma non riscrive retroattivamente quanto accaduto.
