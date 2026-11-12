# APP TAGLIANDO — CHECKPOINT DI RIPRESA FRA CHAT

**Checkpoint:** 2026-11-12; **prima prova GPT-OSS 20B eseguita sullo staging, risposta rifiutata correttamente dal gate di sicurezza**. L'utente conferma Cloudflare deploy `536f19c` Success e scenario `paper-wash` con esito `MODEL_OUTPUT_REJECTED`. Il modello **non ha prodotto istruzioni mostrate all'utente** e non ha potuto avanzare la sessione. La richiesta al provider è verosimilmente avvenuta, ma il valore `modelRequests` non è stato riportato e l'output grezzo non è disponibile. **Rollback su GitHub:** [PR #60](https://github.com/Lupus227/tagliando/pull/60) merged in `dev/fase14-ai` commit `c4d6fff`, [CI #43202354800 Success](https://github.com/Lupus227/tagliando/actions/runs/43202354800); entrambi Wrangler tornati a `AI_PROBE_MODE=disabled`, finestra di scadenza mantenuta. **Deployment Cloudflare di `c4d6fff` NON ANCORA confermato**: fino alla verifica evitare nuove prove. KB `15.25.1` e PWA `0.12.1` invariati.  
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
| Commit deployment Cloudflare confermato dall'utente | **`232e473` · Success**, include la PR #45 / `5687f30` |
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
| Comprensione libera con AI | **NON implementata**; la console restituisce esclusivamente testi validati dopo controlli deterministici |
| Ultima PR tecnica KB | [#41](https://github.com/Lupus227/tagliando/pull/41), merge nel branch di staging |
| Stato di issue OP04 | [#37 — APERTA, BLOCCANTE](https://github.com/Lupus227/tagliando/issues/37) |
| Compito immediato di questa conversazione | **Rollback PR #60 integrato su dev** dopo `MODEL_OUTPUT_REJECTED` della prima prova. Confermare Cloudflare deployment `c4d6fff` Success e test `PROBE_DISABLED`; poi diagnosticare il formato della risposta GPT-OSS 20B con test offline, senza nuove inferenze |

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

**Stato confermato:** Cloudflare `53a64a4` Success per M4.2.2, JSON KB `15.25.1`, AI OFF e prova browser `PROBE_DISABLED` attestati dall'utente; PR #55 integrata su `dev/fase14-ai`, CI #43195514912 Success. Nessuna inferenza reale GPT-OSS 20B eseguita. KB 15.25.1, 24/53 con condizioni, 29 pendenti. AI off; `/api/assist` resta non generativo. Issue #37/OPEN-07 resta aperta.

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

**NEXT (prima terminare rollback Cloudflare; poi diagnostica offline):** confermare deployment `c4d6fff` Success e pagina `/lab/ai-probe` → `PROBE_DISABLED`. Non effettuare nuove chiamate reali. `MODEL_OUTPUT_REJECTED` prova che il contratto ha rifiutato l'output, ma **non** prova quale campo fosse presente nella risposta. Il parser di `worker/src/m4-ai-probe.mjs` accetta solo `raw.response`, mentre Cloudflare supporta Chat Completions con input `messages` per GPT-OSS; possibile incompatibilità del formato. Preparare fixture/test del parser per diversi envelope documentati (`choices`, `response`, ecc.) mantenendo validazione `reviewM4Candidate`, prima di decidere una nuova prova; l'AI globale resta OFF.
