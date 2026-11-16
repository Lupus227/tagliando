# M4.3 — Laboratorio dialogico testuale (preparazione offline)

**Stato:** implementazione su ramo dedicato; nessuna inferenza autorizzata o eseguita.

## Obiettivo

Dimostrare end-to-end che GPT-OSS 20B genera testo libero in italiano e che un secondo turno dipende dal primo. Il laboratorio non è un assistente di manutenzione e non sostituisce M4.1.

## Percorsi

- `/lab/ai-chat` pagina protetta con Cloudflare Access;
- `/lab/ai-chat/client.js` script della pagina;
- `/api/lab/ai-chat` API POST con un solo turno per richiesta.

## Scenario senza dati personali

1. Primo turno prefissato: saluto e scelta di un colore tra rosso, blu e verde.
2. Secondo turno prefissato: domanda su quale colore sia stato scelto; invia lo storico del primo turno e la prima risposta dell'assistente (massimo 800 caratteri). Lo storico resta nella pagina, non in storage remoto.

La pagina espone come testo semplice la risposta effettiva del modello. Non sono previsti tool, knowledge base, comandi PWA o avanzamenti di sessione. Il contenuto non deve essere utilizzato per operazioni tecniche.

## Protezioni e limiti

- `AI_CHAT_MODE=disabled` in entrambi i file Wrangler;
- `AI_CHAT_EXPIRES_AT=2026-11-14T20:00:00Z` già scaduto;
- Access + origine staging esatta + rate limiter condiviso, namespace `AI_PROBE_LIMITER` (una richiesta ogni 60 secondi, globale per laboratorio);
- input limitato, nessuna domanda arbitraria, un'unica invocazione di `env.AI.run` per POST validato;
- nessun log della risposta o eccezione del provider, codice diagnostico chiuso per errori strutturali;
- `/api/assist`, PWA, KB, M4.1, e M4.2.x invariati.

Il rate limiter non garantisce da solo un tetto assoluto di spesa o di richieste: per una prova reale serve anche una finestra temporale breve e un rollback esplicito.

## Criteri di accettazione

- CI Node e compilazione Wrangler `--dry-run` superate.
- Deployment del codice **con AI_CHAT_MODE disabilitato** verificato.
- Test di arresto: risposta `CHAT_DISABLED`, `modelRequests: 0`.
- Soltanto dopo una **nuova autorizzazione esplicita**: finestra breve, prova 1 risposta testuale `CHAT_TEXT_READY`, poi prova 2 sul colore con mantenimento del contesto; verificare chiamate e ripristinare `CHAT_DISABLED`.
- In caso di output incompatibile, leggere solo `diagnosticCode` e interrompere, senza rendere pubblici dati grezzi.

**Non integrare il laboratorio nella PWA pubblica prima di questi collaudi.**

## M4.3.1 — Attivazione reale autorizzata (2026-11-16)

L'utente ha risposto «procedi» alla richiesta di autorizzazione temporanea per GPT-OSS 20B sul piano Cloudflare Workers Free.

- Solo `AI_CHAT_MODE=enabled` per il laboratorio isolato; `AI_PROBE_MODE=disabled` e AI globale della PWA disabilitata.
- Cutoff in entrambi i Wrangler: `AI_CHAT_EXPIRES_AT=2026-11-16T18:25:00Z` (**19:25 CET**). Scaduto il termine, `CHAT_EXPIRED` impedisce nuove inferenze anche se la configurazione non è ancora stata ripristinata.
- Piano d'esecuzione: CI Success; merge su `dev/fase14-ai`; deployment Cloudflare Success confermato dall'utente; **prima una sola richiesta** nel laboratorio; se `CHAT_TEXT_READY`, attendere almeno 60 secondi e soltanto allora eseguire il secondo turno di memoria.
- In presenza di errori `CHAT_OUTPUT_REJECTED`, `MODEL_UNAVAILABLE` o `CHAT_EXPIRED`: fermarsi senza ripetere richieste e riportare il codice; non copiare segreti.
- Dopo l'unica coppia di test (o dopo stop per errore/scadenza), effettuare rollback con PR di `AI_CHAT_MODE=disabled` nei due Wrangler e test offline aggiornati; confermare CI, deployment e `CHAT_DISABLED` con 0 chiamate.
- L'auto-expiry non sostituisce il rollback: non dichiarare disabilitata la configurazione prima di un nuovo deploy.
