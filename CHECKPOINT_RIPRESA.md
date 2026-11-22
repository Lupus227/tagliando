# APP TAGLIANDO — CHECKPOINT DI RIPRESA FRA CHAT

**Checkpoint:** 2026-11-22; **M4.5.7 CONFERMATO IN STAGING, M4.5.8 CLASSIFICATORE SEMANTICO AI IMPLEMENTATO MA DISABILITATO.** L'utente conferma Cloudflare deployment `5bb2644` Success, e sequenza PWA «Avvia dialogo» → Worker → risposta prevista «No. Il filtro in carta non deve essere lavato né oliato». Non sono stati dettagliati i sottotest di STOP/Fatto/Ferma dialogo, output tardivi e dispositivo; non considerarli superati individualmente. [PR #115](https://github.com/Lupus227/tagliando/pull/115) CI 251/251 Success. **Nuova PR #117** https://github.com/Lupus227/tagliando/pull/117 merged su `dev/fase14-ai` commit `a872c543758b617b665eabdf8b6d9faf580a0e06`, [CI #45053935498](https://github.com/Lupus227/tagliando/actions/runs/45053935498) **257/257 test Node + Wrangler dry-run Success**. Sviluppato solo nel Worker l'endpoint staging `/api/lab/semantic-paper`: il modello (binding esistente @cf/openai/gpt-oss-20b) **interpreta la sola frase**, non riceve KB o risposte tecniche e produce solo l'etichetta `WASH_PAPER`/`UNKNOWN`. Controllore M3/M4.5.6 verifica la domanda ORIGINALE, tipo filtro, passaggio, anomalie, fonte P03 F15.18-R2 e seleziona la risposta approvata già nota; modello non decide procedure o avanzamento. **Il nuovo modello AI è completamente OFF**: `AI_SEMANTIC_MODE=disabled` in entrambi Wrangler, expiry obbligatoria e Access + limite globale richiesti; CI con finto modello, **zero chiamate reali**, nessun deploy M4.5.8 confermato, nessuna modifica PWA vocale pubblica, KB v15.25.1 `aiUseAllowed=false` o `/api/assist`. **NEXT:** definire finestra e limite di costo chiamate AI, autorizzare un test controllato del classificatore reale, deploy su Cloudflare solo staging; poi collegare il riconoscimento semantico al dialogo normale e collaudare STOP/comandi prima di ampliarne il dominio. Registro v1.71.
**Uso:** aprire per primo all'inizio **di ogni chat** sul progetto e aggiornare a fine sessione; non sostituisce i file tecnici dettagliati.  
**Riferimenti obbligatori:** [ROADMAP_MASTER.md](ROADMAP_MASTER.md) · [REGISTRO_PROGETTO.md](REGISTRO_PROGETTO.md) · [GitHub Issues aperte](https://github.com/Lupus227/tagliando/issues?q=is%3Aissue+is%3Aopen).

## A. LA ROTTA IN UNA RIGA

> **Stiamo costruendo un assistente AI tecnico, conversazionale e prevalentemente vocale, che guida in modo sicuro manutenzione/diagnosi/riparazioni di macchine da giardinaggio, fondato su conoscenze validate e controllore deterministico. Il tagliando gratuito del rasaerba è il primo scenario pilota, non il prodotto finale.**

**Non** trasformarlo in checklist rigida, non ridurre l'AI a un lettore TTS e non confondere la validazione del singolo passaggio con il completamento dell'assistente.

## B. DECISIONI PERMANENTI — NON RIDISCUTERLE SENZA MOTIVO

- Architettura **ibrida**: AI linguaggio naturale/conversazione; KB procedure tecniche validate; motore deterministico per condizioni, sicurezza e progressione.
- Esperto di dominio/titolare: approva contenuti tecnici, modifiche sostanziali e scelte di prodotto; l'assistente può eseguire PR già autorizzate nel solo ambito approvato.
- Guida vocale bidirezionale a mani libere come obiettivo primario; lo schermo è supporto/alternativa. Richieste libere e chiarimenti pertinenti, non soltanto pulsanti o comandi predefiniti.
- Tagliandi preventivi per privati (anche poca manualità) **gratuiti**; diagnostica/riparazioni specialistiche separati, **potenzialmente a pagamento**; il target include anche meccanici/utenti esperti.
- Primo ambito rasaerba benzina; espansione futura ad altre attrezzature; budget iniziale 50–100 € / preferenza per servizi gratuiti finché non validata la fattibilità.
- La lama è affilabile **facoltativamente**; la mancanza di utensili/manualità permette il salto documentato senza bloccare il tagliando.
- Non inventare dati modello-specifici, non avanzare con sicurezza incerta; registra i problemi, non confermarli implicitamente. Evitare precauzioni duplicate inutili.
- Problema noto: il blocco del microfono Safari / voce in background non è garantito; non affermare il contrario.
- **Niente AI abilitata senza validazione completa per lo scope autorizzato, controllore e test**.

## C. STATO REALE VERIFICATO (NON INFERIRE DA CI)

| Campo | Ultimo dato confermato |
|---|---|
| Repository | [Lupus227/tagliando](https://github.com/Lupus227/tagliando) |
| Branch PWA pubblica/governance | `main` |
| Branch Worker staging / KB | `dev/fase14-ai` |
| PWA originale pubblica | **v0.12.1**, GitHub Pages; guida a step, voce TTS/ASR, anomalie vocali, recupero sessione |
| Schema KB | `tagliando.knowledge.v1` |
| Versione KB distribuita su Cloudflare | **15.25.1** |
| Commit deployment Cloudflare confermato dall'utente | **`b6df639` · Success**, confermato esplicitamente dal titolare il 2026-11-18. Il modulo M4.5.4 è offline, non collegato al router: deployment non significa funzione attiva. Ultimo test browser esplicito `FREE_CHAT_DISABLED`, 0 chiamate: `f9b1e32` (2026-11-16); nessuna nuova prova OFF dopo `b6df639` dichiarata |
| Operazioni/passaggi | **8 / 53** |
| Passaggi validati con condizioni | **24** |
| Passaggi ancora pendenti | **29** |
| Ultimo step *revisionato* | **`RASA-OP-04-P01`** (ri-revisione P01; non un 25º passaggio) |
| Gate AI | `readyForTechnicalAnswers=false`, `aiEnabled=false`, `canGenerate=false` |
| Ultima CI verificata per KB | [GitHub Actions #42711458895 — Success](https://github.com/Lupus227/tagliando/actions/runs/42711458895) |
| Nuovo laboratorio M3 solo staging | [PR #45](https://github.com/Lupus227/tagliando/pull/45), commit **`5687f30`** su `dev/fase14-ai` |
| CI nuova prova M3 | [GitHub Actions #42898433457 — Success](https://github.com/Lupus227/tagliando/actions/runs/42898433457) (test + Wrangler dry-run) |
| Deployment Cloudflare nuovo codice M3 | **CONFERMATO** dall'utente: commit diagnostico `232e473`, build Success e console accessibile |
| Console protetta da provare | `https://tagliando-ai-staging.maico-gua.workers.dev/lab/filtro-aria` |
| Comprensione libera con AI | **M4.4.1 due turni testuali con input libero riusciti e contesto coerente; accuratezza fattuale NON SUPERATA**: supernova erroneamente descritta come capace di far esplodere l'universo. Solo laboratorio non tecnico Access, mai integrato alla PWA o alle fonti validate |
| Ultima PR tecnica KB | [#41](https://github.com/Lupus227/tagliando/pull/41), merge nel branch di staging |
| Stato di issue OP04 | [#37 — APERTA, BLOCCANTE](https://github.com/Lupus227/tagliando/issues/37) |
| Compito immediato di questa conversazione | **M4.5.7 deployment `5bb2644` Success e risposta vocale PWA→Worker corretta**, confermati dall'utente; **M4.5.8 classificatore vero via AI sviluppato, PR #117 merged e CI 257/257 Success, flag AI OFF**. **NEXT:** autorizzare/preparare prova AI semantic intent con una piccola finestra e limite spesa; endpoint protetto `/api/lab/semantic-paper`, ancora non connesso al ciclo vocale |

L'ultimo JSON Cloudflare fornito dall'utente:

```json
{
  "ok": true,
  "schema": "tagliando.knowledge.v1",
  "version": "15.25.1",
  "sourceAppVersion": "0.12.1",
  "procedureCount": 8,
  "stepCount": 53,
  "pendingSteps": 29,
  "validatedSteps": 24,
  "conditionalValidatedSteps": 24,
  "reviewScope": "pulizia_completa_e_sicurezza_smontaggio_mozzo_ispezione_affilatura_equilibratura_rimontaggio_verifica_condizionati_e_filtro_aria_preparazione_apertura_valutazione_trattamento_carta_lavaggio_spugna_oliatura_spugna_pulizia_scatola_filtro_rimontaggio_filtro_e_candela_verifica_ricambio_rimozione_controllo_sede_riutilizzo_e_domanda_iniziale_condizionati",
  "latestReviewedStepId": "RASA-OP-04-P01",
  "readyForTechnicalAnswers": false,
  "aiEnabled": false,
  "canGenerate": false,
  "sessionChanged": false
}
```

**Precisazioni di stato:**
- `reviewScope` è cumulativo: include la pulizia e il filtro aria anche dopo le revisioni candela. **Non indica l'ultima procedura**; usare `latestReviewedStepId`.
- La KB validata vive nel Worker: `worker/src/review-ledger.mjs`, con catalogo di origine in `worker/src/canonical-knowledge.mjs` e test in `tests/canonical-knowledge.test.cjs`.
- L'overlay contiene i testi approvati. Il catalogo sorgente dell'app (PWA `app.js`/`knowledge.js`) resta un prototipo storico; **non assumere che mostri le revisioni KB**.
- **Il prossimo step non è stato ancora scelto per questa roadmap.** Le guardie già concordate e le issue rimangono vincolanti finché non vengono cambiate esplicitamente.

### M3 — Vertical slice filtro aria: stato e limiti della consegna

**Decisione di prodotto 2026-11-10:** il titolare concorda che il percorso più utile è rendere effettivamente sfruttabile una procedura già validata, senza completare subito i restanti 29 passaggi e senza cambiare stack. **Emergent messo da parte**, da non riproporre durante questa fase.

- [PR #45](https://github.com/Lupus227/tagliando/pull/45), commit `5687f30` su `dev/fase14-ai`; [CI Success](https://github.com/Lupus227/tagliando/actions/runs/42898433457).
- Laboratorio su Worker: `worker/src/filter-lab.mjs`, `worker/src/filter-lab-ui.mjs`; route Access-protetta `/lab/filtro-aria`, API `POST /api/lab/filtro-aria`.
- Dati tecnici: **solo** i sette step P01–P07 di OP03 già revisionati nel ledger, con selezione materiale (carta/spugna/misto), controllo delle condizioni non applicabili, arresto per anomalie o richieste non verificate.
- L'API restituisce la fonte approvata del passo corrente; **non è un modello AI** e non permette dialogo libero intelligente. Non certifica lavorazioni. `/api/assist` e flags AI rimangono disabilitati, KB 15.25.1, PWA pubblica v0.12.1 immutata.
- **Stato effettivo:** PR #45 / `5687f30` integrata e CI Success; la build automatica iniziale non compariva su Cloudflare. Un nuovo commit diagnostico esclusivamente documentale `232e473` su `dev/fase14-ai` ha attivato il deployment, confermato Success. Browser: **OK** accesso console, **OK** istruzioni filtro carta, **OK** arresto P01 per «Non riesco ad aprire il coperchio», **OK** percorso spugna, **OK** percorso misto, **OK** «Fatto» senza conferma automatica, **OK** ripresa di tipo filtro/passaggio dopo ricarica. **Non collaudati in questa tranche:** richiesta totalmente fuori ambito e prova Safari iPhone.
- **Prossimo intervento verificabile**: contratto minimo del dialogo AI controllato con il filtro aria (fonte tecnica, condizioni, stato, risposte, no autorizzazioni AI); quindi test fuori ambito e Safari iPhone e selezione provider/costi. Attivazione LLM solo dopo approvazione specifica.


**Conferma specifica M4.1 2026-11-12:** l'utente ha verificato su Cloudflare deployment commit `8e746d0` `Success` e riportato JSON con `ok=true`, `schema=tagliando.knowledge.v1`, `version=15.25.1`, `procedureCount=8`, `stepCount=53`, `validatedSteps=24`, `conditionalValidatedSteps=24`, `pendingSteps=29`, `latestReviewedStepId=RASA-OP-04-P01`, `readyForTechnicalAnswers=false`, `aiEnabled=false`, `canGenerate=false`, `sessionChanged=false`. Stato M4.1 concluso nel perimetro codice/CI/deployment/metadati, non conversazione AI. Per M4.2 (prima inferenza reale) serve nuova decisione esplicita su binding, provider, quote e autorizzazione circoscritta dei sette step OP03; no pubblicazione PWA.

### M4.1 — Contratto di sicurezza per il futuro dialogo: integrazione 2026-11-12

- [PR #49](https://github.com/Lupus227/tagliando/pull/49) **MERGED** in `dev/fase14-ai`; commit di merge `8e746d00f9f0640a84b6c5097c60a8673ecdb899`.
- [GitHub Actions #43185510940](https://github.com/Lupus227/tagliando/actions/runs/43185510940): **Success** su commit PR `c4b1b17`, regressioni Node + Wrangler dry-run.
- Moduli aggiunti: `worker/src/m4-contract.mjs`, `tests/m4-contract.test.cjs`, `docs/M4_1_CONTRATTO_DIALOGO.md`. Workflow `.github/workflows/fase14-tests.yml` ora verifica anche PR verso `dev/fase14-ai`.
- `prepareM4Turn` / `reviewM4Candidate`: contratto di prova **non collegato ad alcuna route**; ritorna soltanto testo tecnico preapprovato dal ledger se la fonte/revisione è coerente. Nessuna parafrasi generativa verificata, nessun controller universale.
- Tutti i flag AI restano spenti; `modelInputAllowed=false`; `aiUseAllowed=false` nel ledger. Nessuna chiamata/provider AI, nessun cambio a PWA v0.12.1.
- **Cloudflare M4.1: deployment `8e746d0` dichiarato `Success` dall'utente il 2026-11-12**; il successivo `/api/knowledge-status` Access-protetto è coerente con KB `15.25.1` e flag AI OFF. Il risultato prova lo stato metadata del Worker, non una sessione AI né il funzionamento di un LLM.
- Il workflow #43095963218 è rimasto in `queued` senza job e senza poter essere cancellato; il commit successivo `c4b1b17` ha avviato nuova CI conclusa con successo. Non trattare il vecchio run come fallimento del codice.
- **M4.2 da approvare separatamente:** Workers AI / AI Gateway, modello e quote, limiti economici fail-closed, gating per soli step OP03, protezione dell'input/output, prove negative. Vietata attivazione prima delle guardie e approvazione esplicita.

### M4.2.1 — Binding Workers AI configurato, inferenza OFF (2026-11-12)

- [PR #52](https://github.com/Lupus227/tagliando/pull/52) **MERGED** su `dev/fase14-ai`, commit `8af75ee4ccbfc4d0a6d3df453fed99a21eaa926c`.
- [GitHub Actions #43192954169](https://github.com/Lupus227/tagliando/actions/runs/43192954169) **Success**, test Node e Wrangler dry-run. Modello candidato: `@cf/openai/gpt-oss-20b`.
- Configurazioni allineate: `wrangler.jsonc` e `worker/wrangler.jsonc` ora includono `ai.binding=AI`. Modulo `worker/src/workers-ai-binding.mjs` soltanto di ispezione, non importato da `index.mjs`; test mock confermano zero chiamate. Contratto M4.1 e ledger restano non generativi, `aiUseAllowed=false` per OP03.
- Nessuna nuova route, nessuna chiave API, nessun AI Gateway, nessun avanzamento della PWA. La presenza del binding non equivale ad autorizzare il modello.
- **Deployment Cloudflare del merge `8af75ee` verificato dall'utente come Success il 2026-11-12**. `/api/knowledge-status` riporta KB `15.25.1`, contatori 24/53 validati e 29 pendenti, `aiEnabled=false`, `canGenerate=false`, `readyForTechnicalAnswers=false`, `sessionChanged=false`. Il test conferma la risposta metadata; non prova inferenza AI o una sicurezza semantica generativa.
- **NEXT:** conferma build Cloudflare `8af75ee` e `/api/knowledge-status`; M4.2.2 richiede decisione dedicata sul gate scope OP03 e limite dei costi prima di qualunque inferenza.

### M4.2.2 — Primo esperimento GPT-OSS 20B predisposto (2026-11-12)

- [PR #55](https://github.com/Lupus227/tagliando/pull/55) **MERGED** su `dev/fase14-ai` commit `53a64a41dfd95927fa22c47b4410a7e5d08feb61`.
- [CI #43195514912](https://github.com/Lupus227/tagliando/actions/runs/43195514912) **Success** (test Node, Wrangler dry-run, mock LLM).
- Nuova pagina staging `/lab/ai-probe` con API `/api/lab/ai-probe`, Cloudflare Access + origin esatta + limiter dedicato. Tre scenari immutabili: P03 carta (selettore modello), P01 coperchio bloccato (arresto prima del modello), domanda fuori ambito (rifiuto prima del modello). Nessun input libero.
- Il modello non riceve il contenuto tecnico della Knowledge Base (OP03 resta `aiUseAllowed=false`): propone solo riferimento P03/revisione oppure astensione. Il contratto M4.1 rilegge il testo revisionato e rifiuta testo tecnico libero, permessi e riferimenti inesistenti.
- In due config Wrangler `AI_PROBE_MODE=disabled` e `AI_PROBE_LIMITER` 1/60 (approssimativo). **Nessuna inferenza reale effettuata e nessuna attivazione automatica.** Su Workers Free l'account dispone della quota giornaliera gratuita, non è un hard budget fornito dal limiter.
- **Cloudflare deployment `53a64a4` confermato dall'utente come Success il 2026-11-12.** Endpoint `/api/knowledge-status`: KB 15.25.1, 24/53 validati con condizioni, 29 pendenti; flag AI OFF. Laboratorio `/lab/ai-probe`: `PROBE_DISABLED` dopo click, prova positiva del gate disabilitato, non di inferenza. PWA pubblica immutata.
- **NEXT:** confermare build Cloudflare `53a64a4`, JSON API KB, apertura pagina protetta e blocco `PROBE_DISABLED`. Richiedere decisione separata prima di attivare il gate e consumare neurons.

### M4.2.2 — Prima inferenza live temporaneamente abilitata nel codice (2026-11-12)

- Il titolare ha approvato esplicitamente l'attivazione della **prima** prova GPT-OSS 20B sul piano Workers Free e solo in staging OP03.
- [PR #58](https://github.com/Lupus227/tagliando/pull/58) **MERGED** su `dev/fase14-ai`, commit `536f19cf9e360e908fa76b00c29b6b200cc2a6c3`; [CI #43200939648](https://github.com/Lupus227/tagliando/actions/runs/43200939648) Success (regressioni e Wrangler dry-run).
- Due Wrangler: `AI_PROBE_MODE=enabled` + `AI_PROBE_EXPIRES_AT=2026-11-13T00:00:00Z`. Verifica expiry sia in route sia in modello; oltre il termine nessuna inferenza. 01:00 CET del 13 novembre.
- Scope e sicurezza invariati: Access, origin esatta, limiter ~1/min approssimato, solo casi server-side; P03 carta può interrogare modello; anomalia P01 e domande non pertinenti bloccate prima. Il modello non riceve istruzioni tecniche KB; propone fonte o si astiene, verifica server-side M4.1. PWA pubblica invariata; `aiUseAllowed=false` nel ledger; flag globali OFF.
- **Non ancora verificato** deployment Cloudflare del commit `536f19c`; ultimo deploy certificato dall'utente è `53a64a4`, con `PROBE_DISABLED`. **Nessuna inferenza reale ancora attestata.**
- **NEXT operativo:** conferma Cloudflare `536f19c` Success; prova browser una sola volta con P03, rileva decision e `modelRequests`; subito dopo ripristino su entrambi Wrangler `AI_PROBE_MODE=disabled` con nuovo commit/CI/deploy. Il tempo di scadenza blocca le chiamate ma non effettua rollback del config automaticamente.

### M4.2.2 — Primo test live e rollback dopo rifiuto output (2026-11-12)

- Cloudflare deploy `536f19c` **Success** secondo l'utente. Nel laboratorio Access-protetto, prova scenario OP03 P03 `paper-wash` → **`MODEL_OUTPUT_REJECTED`**. È il risultato del controllo di validazione, non una risposta tecnica accettata. `modelRequests` e payload provider non disponibili; non ricostruirli come fatti.
- [PR #60](https://github.com/Lupus227/tagliando/pull/60) **MERGED** su `dev/fase14-ai`, commit `c4d6fff7e0bf023fafa8d4aaf966da9738a7ce1c`. I due Wrangler sono tornati a `AI_PROBE_MODE=disabled`; scadenza UTC aggiuntiva invariata. [CI #43202354800](https://github.com/Lupus227/tagliando/actions/runs/43202354800) Success (test Node e Wrangler dry-run). Un run CI precedente fallito per aspettativa `enabled` nei test è stato corretto senza modificare le guardie.
- **Cloudflare deploy `c4d6fff` non ancora verificato**. Non eseguire altre prove finché la disattivazione non è confermata e il gate restituisce `PROBE_DISABLED`.
- Possibile causa diagnostica: il parser legge solo `raw.response`, ma Cloudflare documenta formati Chat Completions per GPT-OSS quando si invia `messages`; la shape esatta non è osservata. Nessuna correzione del parser e nessun nuovo test live ancora effettuati.
- PWA pubblica v0.12.1, KB v15.25.1, `aiUseAllowed=false` e flag AI globali invariati.

### M4.2.3 — Rollback verificato; parser aggiornato offline (2026-11-12)

- Utente: Cloudflare `c4d6fff` **Success**, `/lab/ai-probe` → **`PROBE_DISABLED`**. Il rollback del primo test GPT-OSS è confermato anche nello staging.
- [PR #62](https://github.com/Lupus227/tagliando/pull/62) **merged** su `dev/fase14-ai` commit `e2721381efbd4d60c4cfaab19888722457b9fb3d`. [CI #43203972887](https://github.com/Lupus227/tagliando/actions/runs/43203972887) **Success**, regressioni Node e Wrangler dry-run.
- Il nuovo `parseM4SelectorEnvelope` supporta SOLO `response` stringa JSON/oggetto del binding oppure un'unica `choices[0].message.content` Chat Completions finale (role assistant, finish_reason stop). Rifiuta prosa, fence, output parziali, tool call, choices multiple, forme ambigue; ogni proposta è ancora riletta e verificata dal contratto M4.1.
- Sette test offline dedicati con mock; nessuna chiamata reale effettuata in questa fase, PWA e KB invariate. Nei due Wrangler `AI_PROBE_MODE=disabled` (la scadenza aggiuntiva rimane).
- **Non è confermata la causa originaria** del primo `MODEL_OUTPUT_REJECTED`; la risposta grezza GPT-OSS non era stata registrata. Compatibilità `choices` documentata ma non provata per la risposta concreta del binding.
- **Cloudflare deploy `e272138` Success confermato dall'utente** e `/lab/ai-probe` → `PROBE_DISABLED`; gate AI ancora disabilitato. Il test non determina la causa della prima risposta rifiutata.

### M4.2.4 — Diagnostica strutturale dei rifiuti (2026-11-12)

- [PR #65](https://github.com/Lupus227/tagliando/pull/65) **MERGED** in `dev/fase14-ai`, commit `56c024355588841a87f98883dfb0f7b5668178d2`; [CI #43223021866](https://github.com/Lupus227/tagliando/actions/runs/43223021866) **Success**: Node regression, test mock e Wrangler dry-run.
- Aggiunto `worker/src/m4-output-diagnostics.mjs`: codici statici per envelope sconosciuto/ambiguo, scelta non finale o troncata, JSON non valido, azione non ammessa, riferimento/revisione errati. Il modulo **non registra né restituisce testo grezzo**, prompt o dati personali. Parser di M4.2.3 rimane strict allowlist; M4.1 continua a autorizzare la sola fonte revisionata.
- La console protetta può visualizzare `diagnosticCode` accanto alla decisione solo nelle future richieste; test verificano assenza di fuga di stringhe simulate e nessun avanzamento automatico. **Nessuna inferenza reale eseguita in questa tranche.**
- Wrangler root/worker invariati con `AI_PROBE_MODE=disabled` e vecchia scadenza UTC. PWA 0.12.1, KB 15.25.1, `aiUseAllowed=false`, flag globali invariati.
- **Cloudflare deploy PR #67 commit `f374fdd` confermato Success dall'utente**; contiene M4.2.4 e prova browser `/lab/ai-probe` → **`PROBE_DISABLED` superata**. Causa del mancato trigger precedente non verificata.
- **NEXT:** verificare `56c0243` Success e `PROBE_DISABLED`; successiva chiamata al modello richiederà nuova autorizzazione. La causa reale della prima chiamata rifiutata non è stata accertata.

### M4.2.5 — Seconda prova live time-boxed GPT-OSS 20B (2026-11-14)

- L'utente ha dato autorizzazione esplicita: «allora procediamo», riferita alla seconda inferenza reale preannunciata dopo il collaudo M4.2.4.
- [PR #69](https://github.com/Lupus227/tagliando/pull/69) **merged** su dev commit `055d55ce1993a92f08fcb62d9b13b9895c959e88`; [CI #43620342411](https://github.com/Lupus227/tagliando/actions/runs/43620342411) **Success**, regressioni e Wrangler dry-run.
- I due Wrangler sono ora `AI_PROBE_MODE=enabled` con `AI_PROBE_EXPIRES_AT=2026-11-14T20:00:00Z` (21:00 ora italiana CET). Expiry fail-closed già verificato in route e adattatore; scadenza NON modifica automaticamente il valore `enabled` nei file.
- Unico caso consentito P03 carta `paper-wash`; modello `@cf/openai/gpt-oss-20b`; diagnostica M4.2.4 restituisce solo codici statici. No testo tecnico della KB al modello, no istruzioni generate, no completamenti o avanzamenti. Workers Free confermato, limiter approssimativo 1/60.
- Nessun codice di inferenza, controllore M4.1, KB, PWA o ledger aggiornato, soltanto Wrangler e asserzioni test.
- **Cloudflare deployment di `055d55c` da confermare**; ultimo deployment `f374fdd` Success con laboratorio `PROBE_DISABLED` secondo l'utente.
- **NEXT:** verifica Cloudflare; una sola prova utente (o STOP per scadenza); poi rollback a disabled in entrambi i file e conferma Cloudflare.

### M4.2.5 — Esito seconda inferenza e rollback GitHub (2026-11-14)

- **Osservazione utente:** Cloudflare deployment PR #69 commit `055d55c` Success; laboratorio OP03 P03 carta → decision `MODEL_OUTPUT_REJECTED`, messaggio «Risposta non conforme al contratto», diagnostica `ROLE_OR_TOOL_UNSUPPORTED`, `modelRequests=1`. Output grezzo non conservato, nessuna istruzione tecnica generativa mostrata, nessun cambiamento del progresso.
- **Rollback:** [PR #71](https://github.com/Lupus227/tagliando/pull/71) merged su `dev/fase14-ai` commit `02c870830d6b6285149d517bdcba3e1ade880270`; [CI #43620861155](https://github.com/Lupus227/tagliando/actions/runs/43620861155) Success. I due Wrangler hanno `AI_PROBE_MODE=disabled` e conservano il precedente cutoff alle 20:00 UTC del 14 novembre. **Cloudflare deploy del rollback non ancora attestato; chiedere `Success` + `PROBE_DISABLED`.**
- **Diagnosi preliminare:** in `inspectM4SelectorEnvelope`, quel codice deriva da `choice.message` assente/non oggetto, `role` differente da `assistant`, oppure **presenza** dei campi `tool_calls`, `refusal`, `function_call` indipendentemente dal loro valore. L'output raw non è disponibile; non è possibile sapere quale condizione specifica si sia verificata. Risposte Chat Completions possono includere campi opzionali neutri come `refusal:null`; il parser attuale li respinge in modo conservativo. Non cambiare il parser direttamente sul server attivo.
- **NEXT offline:** testare una classificazione più specifica che differenzi campi neutri da vere chiamate/rifiuti e la forma di `message`, senza log del testo generato né indebolire il controllo deterministico M4.1. Nessuna nuova inferenza autorizzata.

### M4.2.6 — Verifica rollback e compatibilità campi Chat Completions (2026-11-14)

- **Confermato dall'utente:** Cloudflare rollback `02c8708` Success, `/lab/ai-probe` → `PROBE_DISABLED`. Non sono state effettuate altre chiamate reali al modello.
- [PR #73](https://github.com/Lupus227/tagliando/pull/73) **MERGED** su `dev/fase14-ai`, commit `a5b9b1c631b74c6a5124a11871f7bf8728363489`; [CI #43623317403](https://github.com/Lupus227/tagliando/actions/runs/43623317403) **Success**, Node regression e Wrangler dry-run.
- Solo parser `worker/src/m4-output-diagnostics.mjs`: per un unico Chat Completion finale con ruolo assistant, `tool_calls=null/[]`, `refusal=null`, `function_call=null` sono metadati neutri. Qualsiasi tool call effettiva, rifiuto non nullo, function call non nulla, ruolo errato, risposta troncata o JSON non conforme rimane bloccato. Codici diagnostici separati e versione `tagliando.m4.output-diagnostic.v2`.
- Controller deterministico M4.1 invariato: selettore e fonti revisionate soltanto; nessun completamento o avanzamento. Aggiornate e ampliate fixture offline; nessun log raw AI e nessuna nuova chiamata in CI.
- **Causa del precedente `ROLE_OR_TOOL_UNSUPPORTED` ignota:** non abbiamo il payload grezzo del modello. La correzione è una compatibilità fondata sulla struttura Chat Completions, non una dimostrazione causale.
- `AI_PROBE_MODE=disabled` nei due Wrangler; expiry 2026-11-14T20:00:00Z invariata, KB 15.25.1 e PWA 0.12.1 invariate.
- **Cloudflare deployment `a5b9b1c` da confermare**; ultimo deployment verificato dall'utente `02c8708` Success con `PROBE_DISABLED`.

### M4.2.6 — Deployment e gate OFF verificati (2026-11-14)

- **Conferma diretta dell'utente:** deployment Cloudflare commit `a5b9b1c` **Success** e risposta del laboratorio Access-protetto `PROBE_DISABLED`.
- [PR #73](https://github.com/Lupus227/tagliando/pull/73) merged su `dev/fase14-ai`; [CI #43623317403](https://github.com/Lupus227/tagliando/actions/runs/43623317403) Success. Diagnostica v2 implementata e verificata con fixture offline: campi opzionali neutri ammessi, richieste tool/refusal effettive rifiutate, selettore sempre soggetto a M4.1.
- Entrambi Wrangler confermati da GitHub `AI_PROBE_MODE=disabled`, scadenza `2026-11-14T20:00:00Z` invariata. Nessuna nuova inferenza autorizzata né eseguita durante M4.2.6.
- **M4.2.6 chiusa** limitatamente a codice, CI, deployment e gate disabilitato. **Non** è dimostrata la compatibilità del parser v2 con un output reale successivo, né quale campo abbia causato `ROLE_OR_TOOL_UNSUPPORTED` nel secondo test.
- **NEXT:** nuovo intervento da concordare sulla roadmap; nessuna riattivazione automatica dell'AI.

### M4.3/M4.3.1 — Prima conversazione GPT-OSS 20B riuscita e rollback (2026-11-16)

- [PR #76](https://github.com/Lupus227/tagliando/pull/76): laboratorio `/lab/ai-chat`, staging `b072854` Success; utente verifica `CHAT_DISABLED` con 0 richieste prima di attivarlo.
- [PR #77](https://github.com/Lupus227/tagliando/pull/77): attivazione chat soltanto nel laboratorio fino a `2026-11-16T18:25:00Z`, merge `30ef242`; deploy Cloudflare Success confermato dall'utente.
- **Esito reale:** prima risposta «Ciao! Ho scelto il colore blu.»; secondo turno alla domanda fissata sul colore precedente «blu», sempre tramite browser staging Access-protetto. Risultati riportati dall'utente. Il secondo prompt conteneva la risposta precedente nell'history; la prova è di uso del contesto, non di memoria permanente.
- [PR #78](https://github.com/Lupus227/tagliando/pull/78): rollback a `AI_CHAT_MODE=disabled` merged su dev `22b9a28`, [CI #43922203057](https://github.com/Lupus227/tagliando/actions/runs/43922203057) Success. `AI_PROBE_MODE=disabled` invariato; scadenza chat 18:25 UTC mantenuta. **Deploy rollback Cloudflare non ancora confermato**.
- **Perimetro dimostrato:** due turni testuali in italiano su argomento innocuo, con stato conversazionale esplicito, senza contenuti KB. **Non dimostrati:** domande libere, risposte tecniche validate, affidabilità del modello su anomalie, integrazione voce/PWA, memorizzazione persistente e controllo di costi globale.
- **Prossimo checkpoint:** Cloudflare `22b9a28` Success e `CHAT_DISABLED`, `modelRequests=0`. Poi pianificare conversazione libera controllata (M4.4) mantenendo la separazione tra testo generato e azioni meccaniche.

### M4.3.1 — Conferma Cloudflare rollback dopo due turni reali (2026-11-16)

- **Confermato direttamente dall'utente:** deployment Cloudflare commit `22b9a28` **Success**; premuto il pulsante del laboratorio conversazionale → **`CHAT_DISABLED — Laboratorio conversazionale disabilitato. · Chiamate modello: 0`**.
- Stato di sicurezza finale M4.3.1 verificato in GitHub e sul Worker: `AI_CHAT_MODE=disabled` in entrambi Wrangler; `AI_PROBE_MODE=disabled`; cutoff 2026-11-16T18:25:00Z invariato; nessuna inferenza eseguibile tramite quel percorso.
- Chiusura M4.3.1: prova reale su due turni e successivo rollback completati. I risultati dimostrano generazione italiana e uso di contesto esplicito, **non** dialogo libero, istruzioni validate, trattamento anomalie o colloquio vocale.
- **NEXT da concordare:** M4.4 input conversazionale libero in laboratorio isolato e, successivamente, risposte tecniche basate su KB e controllore M4.1. Nessuna ulteriore attivazione live autorizzata da questa chiusura.

### M4.4 — Laboratorio per domande libere non tecniche (2026-11-16)

- [PR #81](https://github.com/Lupus227/tagliando/pull/81) **MERGED** su `dev/fase14-ai` commit `87fa60cbeaad137f759c26eed1d485ae753463e8`. [CI #43940430467](https://github.com/Lupus227/tagliando/actions/runs/43940430467) **Success**: test di regressione e Wrangler dry-run.
- Nuovo `/lab/ai-free` protetto da Access: un testo libero fino a 400 caratteri, quattro turni massimi, storico volatile fino a sei messaggi pregresse alternati, limite HTTP 5600 byte, input ruolo/forma validato, rate limiter 1 richiesta ogni 60 secondi.
- Ambito **non tecnico**: niente KB, tool, workflow o modifiche sessione, prompt che vieta istruzioni operative, filtro lessicale euristico su input/output che **non è barriera di sicurezza sufficientemente robusta** per guidare lavorazioni reali. Risposte non testate live.
- In entrambi Wrangler `AI_FREE_MODE=disabled` e scadenza 2026-11-16T18:25:00Z trascorsa; anche `AI_CHAT_MODE` e `AI_PROBE_MODE` disabled. PWA v0.12.1 e KB v15.25.1 invariati.
- **Non verificati ancora su Cloudflare:** deploy `87fa60c` e `FREE_CHAT_DISABLED`, `modelRequests=0` sulla nuova pagina. Nessuna inferenza M4.4 autorizzata.
- **NEXT:** prima verificare deploy e stop, poi concordare una finestra di prova reale separata con rollback. Il passaggio a risposte tecniche richiede le fonti revisionate e un gate deterministico, non soltanto questo laboratorio.

### M4.4 — Deployment e blocco AI OFF verificati (2026-11-16)

- **Conferma dell'utente:** Cloudflare deployment commit `87fa60c` **Success**, nuovo laboratorio `/lab/ai-free` risponde `FREE_CHAT_DISABLED — Laboratorio libero disabilitato. · Chiamate modello: 0`.
- [PR #81](https://github.com/Lupus227/tagliando/pull/81) merged su staging con CI Node + Wrangler dry-run Success; le tre modalità AI (`AI_FREE_MODE`, `AI_CHAT_MODE`, `AI_PROBE_MODE`) rimangono `disabled` nei due Wrangler. Scadenza free-lab già trascorsa.
- **M4.4 preparazione e collaudo OFF conclusi.** Nessuna risposta reale GPT-OSS M4.4 ancora prodotta; filtro tecnico lessicale NON garantisce sicurezza di risposte operative.
- **NEXT:** autorizzazione esplicita per un breve test live della sola conversazione innocua in italiano, rollback pronto, verifica costi. Nessuna attivazione automatica.

### M4.4.1 — Test GPT-OSS 20B su due turni liberi, accuratezza insufficiente (2026-11-16)

- Attivazione autorizzata [PR #84](https://github.com/Lupus227/tagliando/pull/84) merge `71d26cc`: deploy Cloudflare **Success** confermato dall'utente; primo turno `FREE_CHAT_READY` con **1 chiamata** al modello.
- **Test utente 1:** «Ciao, mi racconti una curiosità sulle stelle?» → il modello produce testo naturale su supernove ma afferma falsamente che stelle del Sistema Solare potrebbero fare esplodere l'intero universo in una notte. Questo è un errore scientifico grave, non una semplice imprecisione.
- **Test utente 2:** «Puoi ricordarmi quale curiosità sulle stelle mi hai appena raccontato? Riassumila in una frase.» → il modello risponde: «Le stelle più massicce possono esplodere in supernova, emettendo una luce che per un breve istante supera quella di un’intera galassia.» Coerenza contestuale e sintesi riuscite, ma non correggono retroattivamente l'errore nel primo turno.
- **Esito:** M4.4.1 ha provato input spontaneo, testo italiano e uso dello storico nel laboratorio Access; **accuratezza fattuale non superata**. La successiva integrazione tecnica richiede KB validata, grounding delle risposte, limiti verificabili e motore deterministico. Il filtro lessicale del laboratorio NON basta.
- [PR #85](https://github.com/Lupus227/tagliando/pull/85) rollback merged `4d15bcb` con CI Success; entrambi Wrangler ora AI_FREE_MODE disabled, cutoff `2026-11-16T20:20:00Z`, vecchi lab OFF. **Cloudflare rollback e `FREE_CHAT_DISABLED` ANCORA DA VERIFICARE**.
- Nessuna ulteriore inferenza autorizzata; PWA 0.12.1, KB 15.25.1, AI pubblica immutate.

### M4.4.1 — Cloudflare rimasto enabled dopo rollback GitHub, disattivazione manuale (2026-11-16)

- PR #85 merge `4d15bcb` e CI Success non hanno prodotto un deployment visibile su Cloudflare secondo l'utente.
- Il Worker ha ancora risposto `FREE_CHAT_READY` (1 chiamata), rifiutando una domanda innocua sulla torta di mele; **nuova anomalia di qualità delle risposte** da investigare dopo la messa in sicurezza.
- L'utente ha trovato `AI_FREE_MODE=enabled` nelle variabili Cloudflare, ha impostato personalmente `disabled` e premuto **Deploy**. **Non risulta ancora testata la risposta del Worker post-modifica.**
- GitHub `.github/workflows/fase14-tests.yml` contiene un `wrangler deploy --dry-run`; la compilazione CI non equivale a un deployment.
- Prossimo controllo: un solo invio browser per verificare `FREE_CHAT_DISABLED` e 0 chiamate, poi indagine sulla branch/integrazione automatica GitHub→Cloudflare; non attivare AI.

### M4.4.1 — Verifica post-deployment definitiva (2026-11-16)

- L'utente conferma Cloudflare commit `f9b1e32` **Success**, e successivo `/lab/ai-free`: **`FREE_CHAT_DISABLED — Laboratorio libero disabilitato. · Chiamate modello: 0`**.
- Chiusura M4.4.1: test 2 turni liberi positivo per continuità, negativo per accuratezza fattuale; rollback AI verificato sulla configurazione distribuita. **Nessun test live ulteriore autorizzato.**
- Prossimo passo da concordare: M4.5 risposta tecnica da KB validata (prototipo OP03 filtro aria) sotto controllore deterministico, non un chatbot libero con prompt di sicurezza.

### M4.5.1 — Evidenza OP03 offline e provenance gate (2026-11-17)

- [PR #92](https://github.com/Lupus227/tagliando/pull/92) merged in staging `6cfdaf8`; [CI #44185341521](https://github.com/Lupus227/tagliando/actions/runs/44185341521) Success (regressione Node, Wrangler dry-run). **Cloudflare commit `6cfdaf8` NON confermato** e test browser non richiesto, poiché non è stata aggiunta alcuna route.
- Sorgenti: `worker/src/m45-reviewed-evidence.mjs`, test `tests/m45-reviewed-evidence.test.cjs` e specifica `docs/M4_5_1_REVIEWED_EVIDENCE_OFFLINE.md`; nessun cambiamento alle istruzioni della KB o al ledger.
- Solo anteprima di testi in `VALIDATO_CONDIZIONATO` riferiti a OP03 P01-P07, con stepId, revision, status, scope, condizioni di arresto. Riusa policy e controllo applicabilità di M3; non usa LLM, non esegue azioni o progressi, non inventa dati.
- L'intento libero non è risolto dal semplice match lessicale: `QUESTION_NOT_MAPPED`, senza istruzioni. `aiUseAllowed=false` resta in ogni passaggio OP03 e impedisce invio al modello.
- L'utente chiede aggiornamento persistente dei registri e checkpoint in ciascuna fase e avviso/passaggio a nuova chat se l'attuale si satura.

### M4.5.2 — Mapping offline delle domande e gate di sicurezza (2026-11-17)

- [PR #94](https://github.com/Lupus227/tagliando/pull/94) merged su staging commit `57022f0`, [CI #44187592983](https://github.com/Lupus227/tagliando/actions/runs/44187592983) Success (regressione e Wrangler dry-run). **Deploy Cloudflare di questo commit NON verificato**; non è necessario al test offline, nessun nuovo endpoint.
- `worker/src/m452-question-mapper.mjs` traduce **17 formulazioni esatte** in mapping P01–P07 con `mappingId`, fonte e revisioni; non prova comprensione universale del linguaggio. `tests/m452-question-mapper.test.cjs` copre mapping, autenticità dei contenuti, differenze carta/spugna/misto, domande non mappate/ambigue, safety stop, quantità modello-specifiche, tentativi di injection e flag AI OFF.
- M3 `filterLabAnswer` esamina **la domanda originale prima del mapping**; successivo gate M4.5.1 recupera la fonte identica dal ledger, non da testo del client. Risposta prevista per sola revisione umana, non per attività operativa, non per modello AI. Nessun cambio a `aiUseAllowed=false`, KB, PWA, endpoint, progressione o Cloudflare vars.
- Prossima decisione proposta M4.5.3: corpus realistico con criteri di astensione e precisione e progettazione risposte minimali fondate sulla fonte. È richiesto accordo esplicito prima di ulteriori sviluppi e test live LLM.

### M4.5.3 — Benchmark OP03 offline, classificazione e granularità (2026-11-18)

- Autorizzato dal titolare **solo test e documentazione**; [PR #96](https://github.com/Lupus227/tagliando/pull/96) merged `43218225` su `dev/fase14-ai`; [CI finale #44357543306](https://github.com/Lupus227/tagliando/actions/runs/44357543306) **Success**. CI intermedia #44357471952: 233/233 test, Wrangler dry-run Success.
- `tests/fixtures/m453-op03-realistic-questions.json`: 40 frasi curate in 6 gruppi, non provenienti da utenti reali. `tests/m453-realistic-corpus.test.cjs` confronta il mapping con le fonti gold e il testo integrale del ledger e misura la baseline. Specifica `docs/M4_5_3_CORPUS_BASELINE.md`.
- Esito: 12/40 mappate correttamente nel piccolo corpus (precisione 100% **solo sui match accettati**, recall 12/24 = 50% sul corpus con fonte, 0/12 parafrasi); 28 rifiuti, 8/8 stop critici attesi, 16/16 rifiuti sulle richieste senza fonte gold. Nessun estratto breve, zero inferenze.
- **Rilevazione nuova:** la domanda P12 «Come verifico che il filtro sia montato correttamente?» produce `MODEL_REQUIRED`, sebbene non richieda un parametro modello-specifico: falso positivo della policy lessicale. La prima CI aveva fallito per decisione inattesa; il caso è stato conservato con `knownIssue`, senza cambiare runtime o nascondere l'errore.
- Nessuna modifica a PWA, Worker, controller, KB/ledger, endpoint, variabili Cloudflare. `aiUseAllowed=false` e tutti i flag di AI OFF. Il deployment Cloudflare del commit nuovo non è stato verificato e non è richiesto per questa fase offline.
- **NEXT non ancora approvata:** scelta tra correzione del falso positivo e sviluppo del recupero di fonti/estratti delimitati; la fase successiva richiede decisione esplicita.

### M4.5.3.1 — Correzione falso `MODEL_REQUIRED` (2026-11-18)

- Approvazione esplicita per la correzione limitata; [PR #98](https://github.com/Lupus227/tagliando/pull/98) merged `775b0854c35449e8c0ef649f300d3efb9c9a6908` su `dev/fase14-ai`; [CI #44359490707](https://github.com/Lupus227/tagliando/actions/runs/44359490707) Success, **237/237** Node e Wrangler dry-run.
- `worker/src/policy.mjs`: `che` escluso dal pattern ampio `che ... nome tecnico`; conservata intercettazione di richieste esplicite `che filtro`, `che tipo di filtro`, `che olio`, `che candela`, quantità, codici e serraggi. Stop e priorità invariati.
- Test nuovi `tests/m4531-model-required-regression.test.cjs`, corpus P12 aggiornato con `resolvedIn=M4.5.3.1`, suite M4.5.3 aggiornata, addendum al documento baseline. P12 da `MODEL_REQUIRED` (falso positivo) a **`QUESTION_NOT_MAPPED`**, ancora nessuna fonte o istruzione fornita.
- Corpus 40: 12 match e 28 rifiuti, 0/12 parafrasi, **0/12 falsi positivi modello-specifici** (prima 1), 8/8 casi critici bloccati. Risultati validi solo sul corpus curato; non certificano sicurezza del prodotto.
- Worker policy aggiornata nel repository; Cloudflare `775b085` **non verificato**, non attribuire un deployment alla CI. PWA/KB/ledger invariati, AI OFF.
- Prossima attività da definire in base alla roadmap: aumentare copertura linguistica e risposte circoscritte con controller deterministico, senza aprire automaticamente nuove funzioni.

### M4.5.4 — Grammatica delimitata e prove di parafrasi OP03 (2026-11-18)

- Autorizzazione a proseguire verso comprensione naturale con controllo deterministico; [PR #100](https://github.com/Lupus227/tagliando/pull/100) merged su `dev/fase14-ai` commit `b6df639590204d6bb49a9f7903d2b565fab9765d`, [CI #44362995018](https://github.com/Lupus227/tagliando/actions/runs/44362995018) Success, **243/243** test e Wrangler dry-run. Prima CI #44362850390 non superata su una variante al presente; successiva correzione e CI verde.
- Nuovo modulo **offline non importato dal Worker router** `worker/src/m454-bounded-paraphrases.mjs`: 7 gruppi grammaticali ancorati per OP03; guarda la domanda originale tramite M4.5.2/M3, non usa fuzzy/keyword-only/LLM, rimappa soltanto una corrispondenza certa su una domanda canonica già ammessa, con nuovo controllo di materiale/fonte M4.5.1.
- Test `tests/m454-bounded-paraphrases.test.cjs`, specifica `docs/M4_5_4_BOUNDED_PARAPHRASES_OFFLINE.md`: 12/12 parafrasi del precedente corpus ora selezionate, 12/12 ulteriori varianti curate, 25/25 negativi rifiutati. Confronto identico del passo al ledger. Non sono test di utenti reali e non dimostrano copertura generale.
- Nessun estratto sintetico, nessuna inferenza, nessuna autorizzazione o avanzamento. PWA 0.12.1, KB 15.25.1, ledger `aiUseAllowed=false`, config AI e API invariati.
- L'utente ha comunicato **Cloudflare `775b085` Success** per la correzione precedente; il controllo browser post-deploy `FREE_CHAT_DISABLED`/0 chiamate resta da verificare per quel commit. **M4.5.4 `b6df639` non pubblicata su Cloudflare (stato non attestato, non richiesto).**
- **NEXT:** decidere il metodo per estratti tecnici puntuali formalmente revisionati e risposta dialogica grounded, senza concedere a un modello l'autorizzazione di manutenzione.

### M4.5.5 — Proposta risposta focalizzata P03 (2026-11-18)

- Fonte consultata: `worker/src/review-ledger.mjs`, step `RASA-OP-03-P03`, revisione `F15.18-R2`, `VALIDATO_CONDIZIONATO`, `aiUseAllowed=false`.
- Prima proposta (solo documento): domanda «Posso lavare il filtro in carta?» → risposta candidata «No. Il filtro in carta non deve essere lavato né oliato.» Documento: `docs/M4_5_5_PROPOSTA_RISPOSTA_P03.md`.
- L'esperto **non ha ancora approvato** la risposta breve isolata; la revisione originale del passo non promuove automaticamente frasi isolate all'uso AI. Nessun codice operativo né KB modificata, nessun endpoint o deploy richiesto.
- Cloudflare `b6df639` **Success confermato dal titolare**; il modulo precedente M4.5.4 resta offline e non collegato al router. Ultimo browser gate OFF/0 chiamate confermato sul commit più vecchio `f9b1e32`.
- **NEXT:** richiedere approvazione/correzione specifica della candidata 01, quindi procedere una risposta alla volta.

### M4.5.5 — Approvazione candidata 01 (2026-11-22)

- L'esperto ha confermato senza modifiche la risposta breve «No. Il filtro in carta non deve essere lavato né oliato.» alla domanda «Posso lavare il filtro in carta?»; riferimento `RASA-OP-03-P03`, F15.18-R2.
- Stato del solo testo: `EXPERT_APPROVED_TEXT_ONLY`, registrato in `docs/M4_5_5_PROPOSTA_RISPOSTA_P03.md`. **Non** modifica `aiUseAllowed=false`, controller, KB, PWA, router, sessione né il deployment Cloudflare.
- Prossima verifica: risposta 02 su aria compressa per la carta, facendo attenzione a non autorizzare il riutilizzo improprio di un filtro compromesso.

### M4.5.5 — Approvazione candidata 02 (2026-11-22)

- L'esperto conferma «risposta corretta» per il testo «Sì, se necessario puoi effettuare un soffiaggio delicato con aria compressa, evitando getti aggressivi che potrebbero danneggiare il materiale filtrante. Il filtro in carta non deve essere lavato né oliato.» riferito a `RASA-OP-03-P03` F15.18-R2.
- Le candidate 01 e 02 sono `EXPERT_APPROVED_TEXT_ONLY` nel documento `docs/M4_5_5_PROPOSTA_RISPOSTA_P03.md`. L'approvazione non comporta uso AI, conferma del riutilizzo o avanzamento automatico. **Nessun codice, KB, PWA, deployment o test nuovo**.
- Prossima risposta da valutare: conservazione o sostituzione del filtro in carta, secondo P02 e P03 e condizioni del costruttore.

### M4.5.5 — Approvazione candidata 03 (2026-11-22)

- L'esperto conferma senza modifiche la risposta alla domanda «Devo sempre sostituire il filtro in carta durante il tagliando?», con possibilità di conservazione **solo** per filtro montato recentemente, pulito e integro nel rispetto del costruttore. Fonte P02 F15.17-R1 + P03 F15.18-R2.
- Documento `docs/M4_5_5_PROPOSTA_RISPOSTA_P03.md` aggiorna la candidata 03 a `EXPERT_APPROVED_TEXT_ONLY`, come 01 e 02. Nessun permesso AI, nessuna modifica runtime o KB, nessun deploy. 
- Prossima candidata da approvare: lavaggio della spugna P04 F15.19-R2 con condizioni di applicabilità, risciacquo, asciugatura e divieto solventi.

### M4.5.5 — Approvazione risposta 04, lavaggio spugna R2 (2026-11-22)

- L'esperto richiede di eliminare «e lavabile» dalla premessa della risposta alla domanda «Come posso lavare il filtro in spugna?». Approva espressamente la versione R2 con «perfetto, approvato».
- Testo integrale e ambito: `docs/M4_5_5_RISPOSTA_04_LAVAGGIO_SPUGNA.md`, fonte OP03 P04 F15.19-R2, status `EXPERT_APPROVED_TEXT_ONLY`. Invariati STOP per danni e filtro non idoneo, protezione dell'elemento carta nel misto e assenza di solventi.
- **Disallineamento da non nascondere:** la KB approvata precedentemente contiene tuttora `foamMustBeReusableAndWashable=true` e `stopIfFoamDamagedOrWashabilityUnknown=true`; l'approvazione del testo breve non li cancella. Eventuale revisione KB separata con nuova approvazione e test.
- Nessuna modifica runtime, KB, PWA, AI, deployment o CI per l'approvazione documentale.
- Prossima risposta da sottoporre all'esperto: oliatura sola spugna vs prefiltro misto (P05 F15.20-R3).

### M4.5.5 — Approvazione risposta 05 oliatura spugna (2026-11-22)

- Alla proposta «Devo oliare il filtro in spugna dopo averlo lavato?» l'esperto risponde «si ok». Testo integrale approvato senza modifiche in `docs/M4_5_5_RISPOSTA_05_OLIATURA_SPUGNA.md`, fonte `RASA-OP-03-P05` F15.20-R3; `EXPERT_APPROVED_TEXT_ONLY`.
- Distingue filtro in sola spugna: oliatura dopo completa asciugatura, distribuzione uniforme e rimozione eccessi; prefiltro misto con carta: non oliare nella procedura standard; eccezioni modello-specifiche non dedotte per supposizione. Prerequisiti, condizioni di stop e regola anti-avvio non disattivati.
- Nessuna modifica a KB, AI, router, PWA, Worker, sessione o Cloudflare. Rimane il disallineamento P04 («e lavabile») da valutare con revisione separata prima di alterare i gate.
- Prossima candidata da validare: pulizia scatola filtro P06 F15.21-R1.

### M4.5.5 — Approvazione risposta 06 pulizia scatola filtro (2026-11-22)

- Il titolare conferma «si, è corretto» alla formulazione breve per «Come pulisco la scatola del filtro aria?», fonte P06 F15.21-R1; approvazione senza modifiche documentata in `docs/M4_5_5_RISPOSTA_06_PULIZIA_SCATOLA.md`, stato `EXPERT_APPROVED_TEXT_ONLY`.
- Preservati divieti su getti di acqua/aria verso il condotto e inserimento di utensili/panni, protezione aspirazione e STOP su parti/guarnizioni danneggiate o contaminazione sospetta.
- PWA v0.12.1, KB v15.25.1, flag AI OFF, `aiUseAllowed=false`, Worker/Cloudflare invariati. Nessun nuovo deployment o collaudo runtime.
- Prossima risposta da sottoporre all'esperto: rimontaggio filtro aria P07 F15.22-R1, senza presumere completamento dei passaggi precedenti.

### M4.5.5 — Approvazione risposta 07 rimontaggio filtro (2026-11-22)

- L'esperto conferma «si approvo» senza modifiche per «Come rimonto correttamente il filtro aria?», fonte `RASA-OP-03-P07` F15.22-R1, con controlli su orientamento, sede, tenuta, coperchio, fissaggi e stop in presenza di anomalie.
- Testo integrale approvato: `docs/M4_5_5_RISPOSTA_07_RIMONTAGGIO_FILTRO.md`, `EXPERT_APPROVED_TEXT_ONLY` e `aiUseAllowed=false`. Con questa approvazione sono sette le **singole risposte testuali revisionate**, non l'intero operatore conversazionale.
- Nessun cambiamento a KB v15.25.1, Worker, PWA v0.12.1, sessione, AI, Cloudflare. P04 conserva il controllo sulla lavabilità nonostante la semplificazione già approvata per il testo breve R2.
- **NEXT da scegliere:** passare da testi isolati a catalogo offline verificabile di risposte contestualizzate con prerequisiti, provenienza/stop e test negativi, mantenendo il target di assistente AI realmente conversazionale e vocale.

### M4.5.6 — Prima integrazione verticale della PWA (2026-11-22)

- **Decisione di prodotto:** il titolare osserva correttamente che la PWA v0.12.1 ha già comandi vocali, gestione anomalie, guida e registro; non sviluppare un secondo catalogo di domande/risposte o un'altra checklist.
- **Esecuzione:** [PR #110](https://github.com/Lupus227/tagliando/pull/110) merged su `dev/fase14-ai`, commit `87f0973`; [CI #45046111810](https://github.com/Lupus227/tagliando/actions/runs/45046111810) Success, **248 test Node superati** + Wrangler dry-run. Modifiche limitate a route staging `/api/lab/voice-bridge`, pannello voce sulla copia PWA preesistente `/pilot/`, 5 nuovi test e montaggio route/assets, nessuna modifica ai file pubblici `app.js`, `voice.js`, `support.js`.
- **Funzione esatta:** per OP03/Carta/Trattamento carta, l'utente detta la domanda nel pannello, il Worker verifica Access, origine, rate, policy, mappa a P03 F15.18-R2 e restituisce una singola risposta breve approvata «No. Il filtro in carta non deve essere lavato né oliato.»; la copia PWA la mostra e può leggerla con TTS. Tutte le altre richieste non ammesse falliscono senza risposta tecnica, e lo stato PWA non viene modificato dal ponte.
- **Limiti:** non ancora AI conversazionale; è una *prova di trasporto end-to-end*, non è stata testata nel browser né distribuita su Cloudflare. `aiUseAllowed=false`, `modelRequests=0`, no generazione, no modifica delle procedure. Il dialogo vocale principale della PWA rimane distinto dal pulsante sperimentale; integrarli è lo step successivo dopo il test.
- **Prova da eseguire:** deployment Cloudflare commit `87f0973`, quindi eseguire i passi in `docs/M4_5_6_COLLAUDO_PWA_VOCE_WORKER.md`. Non ripetere sviluppo PWA o review già conclusi.

### M4.5.6 — Esito primo test `87f0973` e fix `65c0c5e` (2026-11-22)

- Screenshot del titolare: pannello nuovo caricato su Cloudflare staging dopo deployment `87f0973` Success, ma digitando «Posso lavare filtro in carta?» la PWA mostra «Scegli Operazione 3, filtro Carta, passaggio Trattamento carta» e non invia nulla al Worker; «Riascolta» disabilitato per assenza di risposta. Evidenza di **gate locale contesto**, non blocco del Worker né prova che il microfono sia guasto.
- [PR #112](https://github.com/Lupus227/tagliando/pull/112) merged commit `65c0c5e`, [CI #45047462576](https://github.com/Lupus227/tagliando/actions/runs/45047462576) Success 248/248 + Wrangler dry-run. Il pannello mostra contesto OP/metodo/passo e può navigare con pulsante esplicito (senza confermare), il Worker ora riconosce anche alias esatto senza articolo **solo dopo preflight del testo originale**. Nessun cambiamento di autorizzazioni e zero modello AI.
- **NEXT:** deploy del commit `65c0c5e` (non confermato). Prova positiva e negativa dalla copia `/pilot/` come da `docs/M4_5_6_COLLAUDO_PWA_VOCE_WORKER.md`. Non scambiare CI e staging browser.

### M4.5.6 — Riscontro positivo della prova di staging (2026-11-22)

- Il titolare riferisce testualmente «procedura riuscita» dopo la PR #112 (contesto mostrato e preparazione della copia PWA, alias della domanda senza articolo).
- Considerare superato il blocco funzionale segnalato nello screenshot iniziale; **non assegnare esiti individuali non riportati** a microfono, TTS, STOP, navigazione o hash Cloudflare. Ultimo commit Cloudflare esplicitamente dichiarato in precedenza `87f0973` Success. La CI PR #112 era 248/248 Success.
- Prossimo obiettivo concordato: **collegare il Worker al dialogo vocale principale**, riutilizzando `voice.js` anziché rendere definitivo il pulsante del laboratorio. Miglioramento staging isolato; niente AI generativa/KB runtime.

### M4.5.7 — Dialogo vocale principale collegato in staging (2026-11-22)

- Dopo il risultato positivo M4.5.6, l'integrazione effettiva del Worker nel ciclo vocale standard della **copia PWA** è stata sviluppata e integrata con [PR #115](https://github.com/Lupus227/tagliando/pull/115), commit `5bb2644`, CI #45048959298 **251/251 test Node + Wrangler dry-run Success**.
- La sola risposta HTTP `/pilot/voice.js` viene estesa in modo fail-closed da `worker/src/pilot-voice-runtime.mjs`. L'originale `voice.js` e la PWA pubblica non cambiano. Dopo la priorità a comandi e anomalie, una sola domanda approvata sul filtro in carta raggiunge `/api/lab/voice-bridge`, quindi ritorna la risposta approvata attraverso la voce normale (`say`/`listen`) senza conferma/avanzamento automatico.
- **Non ancora confermato deployment Cloudflare di M4.5.7 né test browser/iPhone.** Next: pubblicazione staging `5bb2644`, collaudo del normale «Avvia dialogo» e domanda sul filtro carta, verifica voce, sicurezza e conferme invariati.
- Modello AI ancora disabilitato, KB 15.25.1 `aiUseAllowed=false`; non scambiare questa integrazione con comprensione naturale generalizzata.

### M4.5.7 — Deployment e percorso vocale positivo verificati (2026-11-22)

- Il titolare conferma Cloudflare `5bb2644` **Success**, e che la sequenza del dialogo PWA è corretta e l'assistente risponde esattamente «No. Il filtro in carta non deve essere lavato né oliato». Questo verifica il primo collegamento **dentro il ciclo vocale principale** con il Worker nel pilot protetto.
- Non inventare esiti su comandi critici, test del negativo, race, modello dispositivo/browser né sull'avanzamento; restano da collaudare separatamente. Non dichiarare AI libera funzionante: il riconoscimento dell'intento è ancora di tipo strettamente deterministico.
- Prossimo sviluppo incrementale: **classificazione semantica con AI**, solo in staging e sotto gate, separata dal controllore di sicurezza e dalla selezione della risposta breve approvata. La KB non deve essere inviata a un modello né i flag `aiUseAllowed` alterati implicitamente; il costo del modello e la relativa attivazione devono essere controllati.

### M4.5.8 — Classificatore semantico AI, spento per default (2026-11-22)

- Dopo il successo effettivo sul dialogo vocale principale M4.5.7, si è sviluppato un componente LLM reale per **l'interpretazione dell'intento**, non la generazione di istruzioni. [PR #117](https://github.com/Lupus227/tagliando/pull/117) merged su `dev/fase14-ai` commit `a872c543`, [CI #45053935498](https://github.com/Lupus227/tagliando/actions/runs/45053935498) Success **257 test Node** e Wrangler dry-run.
- Endpoint `/api/lab/semantic-paper` accessibile soltanto in staging protetto; doppio limiter, input originale prima sottoposto a safety preflight, nessun accesso del modello alla KB, etichette di output strettamente validate, risposta tecnica preapprovata verificata da funzione M4.5.6 e passaggio non modificato.
- **AI non attivata**: variabile `AI_SEMANTIC_MODE=disabled` in entrambi Wrangler e scadenza obbligatoria; test solo con modello simulato, nessuna nuova chiamata reale o spesa. Nuovo endpoint non collegato ancora alla PWA vocale. I flag AI precedenti e `aiUseAllowed=false` non cambiano.
- **NEXT:** dopo definizione autorizzazione e costo, deploy + test reale di classificazione nel Worker; se positivo, integrare il fallback LLM nel dialogo già esistente e collaudare i casi STOP e i comandi. Non ricostruire checklist o cataloghi statici.

## D. PRECISE DECISIONI SULL'OPERAZIONE 04

La versione KB `15.25.1` contiene:
- P01 `RASA-OP-04-P01` riapprovata `F15.25-G1-R1`: chiedere **prima** dell'operazione «La candela è stata sostituita nel corso dell'anno oppure ha poche ore di funzionamento?».
- Risposte: **Sì, è seminuova** → P02/P03 controllo e possibile riutilizzo *soltanto se integra/idonea*; se emergono anomalie, sospendere il rimontaggio fino a ricambio verificato. **No, è da sostituire / Non lo so** → ricambio nuovo compatibile verificato prima dello smontaggio.
- Domanda unica e persistenza della scelta nella sessione, senza duplicazioni.
- P02 rimozione: chiave per candele oppure **bussola esagonale profonda** di misura corretta, senza pressione sulla ceramica; arresto su resistenza anomala e rischio filetto.
- P03 `F15.25-R3`: controllo sede/candela vecchia o nuova; riutilizzo condizionato; **rimosse** misura e regolazione della distanza elettrodi per privati.
- L'originale P01 (`F15.23-R1`) è conservato nel ledger nella revisione precedente.
- **Non ancora realizzato:** la PWA presenta ancora istruzioni originali e non mostra la domanda/rami validati. Non considerare il metadata un controllore di esecuzione.

### Intervento runtime autorizzato ma NON realizzato

Nella conversazione del 2026-11-09 il titolare ha **autorizzato** l'implementazione circoscritta a OP04: UI domanda iniziale, percorsi, persistenza, comandi vocali, sicurezza e collaudo su staging/iPhone Safari; senza modificare le altre operazioni e senza abilitare AI. Sono stati letti i sorgenti, ma **non risultano commit di implementazione o PR aperte per questa richiesta**.

È stato creato soltanto il branch `feat/open07-runtime-candela-branch-0-12-2` **senza modifiche rispetto a `dev/fase14-ai`** (checkpoint). Un tentativo di preparare un file per il controller non è arrivato alla scrittura e non ha creato file. **Nessuna funzionalità OPEN-07 è stata consegnata.**

**Non inferire che l'autorizzazione autorizzi a implementare qualunque architettura futura:** prima confrontare l'intervento con la roadmap master e discutere l'architettura globale. La scelta degli step successivi è espressamente differita dall'utente.

## E. BACKLOG APERTO / DIPENDENZE

- [#37 / OPEN-07](https://github.com/Lupus227/tagliando/issues/37): scelta candela seminuova implementata in KB ma non in PWA, gate sessione/navigazione/voce non collaudati. **BLOCCANTE per F15.26 e chiusura OP04**, salvo diversa decisione esplicita documentata.
- [#1](https://github.com/Lupus227/tagliando/issues/1): evitare la ripetizione di passaggi già completati.
- [#2](https://github.com/Lupus227/tagliando/issues/2): affilatura lama opzionale con valutazione degli strumenti e delle capacità.
- [#3](https://github.com/Lupus227/tagliando/issues/3): fissaggi lama/coppie di serraggio verificabili; niente valori empirici universali.
- OPEN-01: nella PWA `setStatus('stopped')` da anomalia manuale **avanza** all'operazione successiva mentre la voce no.
- OPEN-02: collaudo end-to-end dell'Operazione 2 non completo.
- OPEN-03: 29 passaggi KB pendenti.
- OPEN-05: controllo preventivo coppia/attrezzatura prima di certi smontaggi.
- OPEN-06: metadata `reviewScope` poco leggibile, non bloccante.

**Controllare il registro per tutti i dettagli/altre decisioni.** Le issue sono backlog, non approvazioni automatiche di codice.

## F. PROCEDURA OBBLIGATORIA DI APERTURA CHAT

L'assistente **prima di proporre nuove modifiche** deve:

1. leggere e usare [ROADMAP_MASTER.md](ROADMAP_MASTER.md) (**visione e milestone**);
2. leggere **questo checkpoint** (**stato e punto di ripresa**);
3. leggere [REGISTRO_PROGETTO.md](REGISTRO_PROGETTO.md) (**decisioni, approvazioni, bug, deployment**);
4. consultare [issue aperte](https://github.com/Lupus227/tagliando/issues?q=is%3Aissue+is%3Aopen), PR aperte e stato branch `main`/`dev/fase14-ai`;
5. verificare versione/commit del codice KB, eventuale nuovo JSON di Cloudflare confermato dall'utente e situazione PWA; distinguere **dati certi** da ipotesi;
6. presentare un **riassunto di ripresa** in poche righe: obiettivo, milestone, stato, attività rimaste aperte, ultima modifica collaudata, punto di decisione;
7. **non avviare nuove fasi o modifiche non richieste** e non richiedere conferma di decisioni già approvate.

### Regola anti-deriva obbligatoria

Ogni volta che emerge un'attività, controllare:

- *A quale milestone della ROADMAP_MASTER contribuisce?*
- *Serve direttamente all'assistente AI target o è un miglioramento accessorio?*
- *La decisione è stata approvata? I suoi prerequisiti sono soddisfatti?*
- *Qual è il risultato osservabile, come lo testeremo, quale costo/complessità introduce?*
- *Stiamo creando una funzione generale o una soluzione ad hoc che raddoppia gli sforzi?*

Se una risposta manca, interrompere l'implementazione e chiarire la decisione tecnica prima del codice.

## G. PROCEDURA DI CHIUSURA CHAT / ROTAZIONE CONTESTO

Prima di invitare ad aprire un'altra chat:

- aggiornare **questo file**: versione/codice, PR, commit, passaggi validati, test, deployment **effettivamente confermato**, issue e stato di ogni attività;
- aggiornare [REGISTRO_PROGETTO.md](REGISTRO_PROGETTO.md) con le nuove decisioni e lo storico, senza sovrascrivere risultati precedenti;
- aggiornare la roadmap **solo in caso di decisione di prodotto/architettura concordata**;
- verificare le issue live e non marcare come svolte attività non provate;
- indicare **il prossimo punto da discutere**, non una nuova operazione automaticamente eseguita;
- creare un messaggio breve di riavvio, eventualmente copiabile nella nuova chat.

**Cadenzamento consigliato già approvato:** circa ogni 20–25 scambi tecnici o ai passaggi di fase/consumo elevato di contesto. Non attendere saturazione.

## H. TESTO DA USARE NELLA NUOVA CHAT

> Stiamo continuando il progetto **App tagliando** del repository `Lupus227/tagliando`. **Prima di fare qualunque proposta, leggi nell'ordine `ROADMAP_MASTER.md`, `CHECKPOINT_RIPRESA.md`, `REGISTRO_PROGETTO.md` sul branch `main`; poi consulta le GitHub Issue aperte, le PR e lo stato live di `dev/fase14-ai`.** Non usare soltanto la memoria o lo storico della chat. Presenta un riepilogo di obiettivo del prodotto AI ibrido, stato effettivo, attività aperte e decisioni già approvate. **Non riprendere automaticamente l'implementazione di un ramo specifico**: prima scegliamo insieme i prossimi step in funzione della roadmap. Non confondere PWA, KB in repository e deployment Cloudflare.

Questo testo si può copiare nelle istruzioni persistenti del Progetto ChatGPT quando l'interfaccia lo permette. Il repository **non può obbligare automaticamente ogni nuova conversazione a leggere quei documenti**; serve l'istruzione all'avvio o la richiesta esplicita all'assistente. Nessun sistema attuale garantisce la ricostruzione esatta dei messaggi privati della chat precedente.

## I. PUNTO DI RIPRESA ATTUALE (AGGIORNARE SEMPRE)

**Progetto e priorità:** assistente AI tecnico conversazionale + Knowledge Base validata + motore deterministico. Primo caso OP03 filtro aria; Emergent in standby, nessuna migrazione, PWA pubblica 0.12.1 invariata.

**Stato confermato:** `dev/fase14-ai` commit `a872c543` dopo PR #117, CI #45053935498 Success 257/257 + Wrangler dry-run. Ultimo deployment Cloudflare **esplicitamente confermato** dal titolare `5bb2644` Success con sequenza normale PWA e risposta filtro carta corretta. **Il codice M4.5.8 NON è ancora distribuito né autorizzato all'inferenza**; `AI_SEMANTIC_MODE=disabled`, `AI_FREE_MODE/CHAT_MODE/PROBE_MODE=disabled` in entrambi Wrangler, KB v15.25.1 `aiUseAllowed=false`, PWA pubblica e normale `/api/assist` invariati. Test con modello simulato, nessun costo. La futura interpretazione AI deve restituire un'intenzione, non istruzioni o modifica dello stato.

**Set di prove browser M3, tutte positive secondo l'utente (2026-11-10):**
- [x] Apertura laboratorio protetto.
- [x] Visualizzazione istruzioni validate filtro carta.
- [x] Anomalia P01 «Non riesco ad aprire il coperchio» → blocco.
- [x] Selezione spugna → passaggi lavaggio e oliatura.
- [x] Selezione misto → nessuna oliatura prefiltro nella guida standard.
- [x] Comando «Fatto» → nessuna conferma automatica.
- [x] Ricarica pagina → mantenuti tipo filtro e passaggio selezionato.
- [ ] Domanda totalmente fuori ambito: non provata dall'utente.
- [ ] Test esplicito su iPhone Safari: non confermato.
- [ ] AI libera e conversazionale: non implementata.

**Diagnosi:** completata la prima prova di integrazione KB→console e guardie selezionate; non è collaudato un controller di esecuzione universale né una lavorazione reale. L'AI non deve mai decidere il progresso sulla base della sola formulazione di una risposta.

**NEXT (M4.5.8 — PROVA REALE DI CLASSIFICAZIONE, CON AUTORIZZAZIONE):** Il codice del classificatore è pronto su `dev/fase14-ai` commit `a872c543`, PR #117 e CI 257/257. Non costruire cataloghi ulteriori. Per testare un modello **reale** nel Worker Cloudflare serve separata accensione controllata del flag `AI_SEMANTIC_MODE`, con `AI_SEMANTIC_EXPIRES_AT` a scadenza ravvicinata, verifica della quota gratuita e 1 chiamata/minuto globale tramite `AI_PROBE_LIMITER`. Su staging Access-provato, testare una frase spontanea diversa dalle tre formule esatte già usate (ad es. «È possibile sciacquare il filtro di carta sotto il rubinetto?»), l'output deve essere etichetta AI e risposta fissa P03 F15.18-R2; `UNKNOWN`, anomalie e ambiguità devono dare niente risposta tecnica. Solo dopo collaudo endpoint e consenso della fase modello, integrare il fallback semantico nel `voice.js` staging e verificare la normale esperienza vocale. PWA pubblica e flag KB invariati.
