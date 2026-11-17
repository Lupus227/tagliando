# M4.5.1 — Contratto di evidenza tecnica revisionata (solo offline)

**Obiettivo:** realizzare la prima interfaccia riutilizzabile tra il laboratorio deterministico M3 filtro aria e un futuro livello conversazionale. **Questa fase NON attiva l'AI e NON produce risposte libere.** Il modello GPT-OSS non riceve alcun testo della KB.

## Stato delle fonti e limite di autorizzazione

- Per OP03 sono disponibili **7 passaggi** con status `VALIDATO_CONDIZIONATO` e revisioni specifiche `F15.16-R1` … `F15.22-R1` (alcune revisioni intermedie R2/R3).
- In `review-ledger.mjs` tutte queste voci hanno **`aiUseAllowed=false`**: l'approvazione tecnica **non equivale** a permesso di generazione, esposizione al modello, guida operativa o pubblicazione.
- La sorgente è il **revision ledger server-side**, non il catalogo canonico `DA_VALIDARE`, né l'input del client.
- `worker/src/m45-reviewed-evidence.mjs` NON viene importato dal router `worker/src/index.mjs`; nessun endpoint aggiunto, nessuna esposizione di testi tramite nuove API, PWA v0.12.1 invariata.

## Input ed esito

Funzione `getReviewedEvidence(input)`, invocabile **solo dai test offline**:

```json
{
  "machineFamily": "rasaerba_a_benzina",
  "operationId": 3,
  "stepId": "RASA-OP-03-P03",
  "filterType": "carta",
  "question": "Mostra passaggio"
}
```

L'input accetta **esattamente** queste 5 proprietà. I valori e le revisioni non si possono fornire dal client. Per P01 è ammesso `filterType=null`; dal P02 la tipologia va identificata (carta, spugna o misto).

In caso positivo, restituisce `REVIEWED_EVIDENCE_ONLY` con:
- `source`: `machineFamily`, `operationId`, `stepId`, `revision`, `status`, `scope`, `filterType`, `aiUseAllowed:false`;
- `content`: **titolo, istruzione e condizione di arresto** identici alla revisione registrata;
- limitazioni costanti: `aiEnabled:false`, `canGenerate:false`, `modelRequests:0`, `maySendToModel:false`, `authorizesMaintenance:false`, `allowCompletion:false`, `sessionChanged:false`, `requiresOperatorVerification:true`.

**Il testo è un'anteprima di revisione per un tecnico umano**, non una risposta sintetizzata dall'AI e non prova che i prerequisiti della lavorazione reale siano stati soddisfatti.

## Gate fail-closed

L'unico intento positivo è la **consultazione esplicita del passaggio** (per esempio «Mostra passaggio», «Leggi il passaggio»). Una domanda libera, anche se contiene parole coerenti con il filtro aria, produce `QUESTION_NOT_MAPPED`: il match lessicale non è una prova semantica di risposta. Domande fuori dominio sono `QUESTION_NOT_COVERED`.

Il controllo delega a `filterLabAnswer` M3:
- integrità del catalogo e ledger;
- tipo filtro e passaggi applicabili: **mai lavare carta nel ramo spugna**, **mai oliare prefiltro misto nella procedura standard**;
- stop e anomalie, pericolo lama, comandi, specifiche modello, fuori ambito;
- nessuna modifica di stato o completamento della procedura.

Il modulo verifica nuovamente che **revision, stepId, status e i tre campi tecnici coincidano byte-per-byte** con il ledger e che l'uso AI sia ancora vietato. Su anomalia restituisce solo `decision` e messaggio, senza `source`/ `content`, senza istruzioni aggiuntive.

## Test e criteri

`tests/m45-reviewed-evidence.test.cjs` verifica:
1. provenienza e identità esatta della revisione `RASA-OP-03-P03`;
2. tutte e 7 le revisioni, confrontate con la matrice carta/spugna/misto;
3. astensione per tipo filtro sconosciuto o passaggio non applicabile;
4. anomalie, comando, pericolo, richiesta di quantità, fuori ambito;
5. domande libere non risolte da keyword e tentativi di iniezione;
6. oggetti con autorità client, sorgenti inventate, ID non approvati;
7. i tre gate AI rimangono OFF, nessun endpoint o chiamata al modello.

**CI:** Node `node --test tests/*.test.cjs` e Wrangler `--dry-run`. Il dry-run non costituisce un deployment Cloudflare. Nessuna modifica alla KB, al ledger, alle procedure o all'interfaccia pubblica in questo PR.

## Successivo intervento M4.5.2 — da concordare

Progettare la risoluzione controllata dell'intento conversazionale, discriminando domande supportate, ambigue, model-specifiche e anomalie con test deterministici. **Non basta un prompt**: qualunque futura trasmissione di testi al LLM richiede approvazione esplicita e cambio controllato dei gate `aiUseAllowed`, oltre a sicurezza del controller, limiti di costo, Access, rollback e collaudo. Nessun modello ha permesso di completare passaggi, inventare procedure o cambiare lo stato di manutenzione.
