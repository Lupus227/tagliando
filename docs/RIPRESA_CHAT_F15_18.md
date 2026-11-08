# Scheda di ripresa — App Tagliando, dopo Fase 15.18
**Data:** 2026-11-08 · **Stato della scheda:** predisposta per passaggio anticipato a nuova chat.

## Avvio obbligatorio della nuova chat

1. Leggere il [registro permanente](../REGISTRO_PROGETTO.md) su `main`; controllare le [Issue GitHub aperte](https://github.com/Lupus227/tagliando/issues).
2. Verificare separatamente stato del codice staging, GitHub Actions e **deployment effettivo Cloudflare**; non considerarli equivalenti.
3. Non riproporre per approvazione i passaggi già approvati né cambiare PWA/AI senza nuovo mandato.

## Stato tecnico canonico

| Campo | Ultimo Cloudflare confermato dall'utente | Stato del codice staging dopo PR #12 |
|---|---|---|
| Commit | `97a1ee1` | `063dc43` |
| Versione KB | `15.17.0` | `15.18.0` |
| Procedure | 8 | 8 |
| Passaggi totali | 53 | 53 |
| Validati con condizioni | 16 | 17 |
| Ancora da validare | 37 | 36 |
| Ultimo step | `RASA-OP-03-P02` | `RASA-OP-03-P03` |
| AI e retrieval tecnico | Disabilitati | Disabilitati |
| GitHub Actions | Success | [Success, run 42528155237](https://github.com/Lupus227/tagliando/actions/runs/42528155237) |
| Deployment Cloudflare | Success verificato tramite JSON fornito dall'utente | **DA VERIFICARE**; mai inferire da GitHub Actions |

**Backend:** ramo `dev/fase14-ai`; catalogo `tagliando.knowledge.v1`. La versione di origine del catalogo (`14.3.0`) è distinta dalla versione cumulativa del registro di revisione (`15.18.0`). PWA pubblica di riferimento: **v0.12.1**, invariata; repository `Lupus227/tagliando`.

## Decisione tecnica più recente (già approvata)

- **F15.18-R2**, `RASA-OP-03-P03`: trattamento carta. L'utente ha approvato la revisione con la risposta **«confermo»**.
- Campo: carta e elemento carta dei filtri misti; saltare se il sistema contiene soltanto spugna.
- Caso A: nuovo filtro compatibile, rispettando forma/dimensioni/tenuta. Caso B: mantenere pulito e protetto il filtro installato da poco, ancora integro e pulito.
- **Non lavare né oliare i filtri di carta.** Eliminata espressamente la frase «salvo esplicita previsione del costruttore».
- Eventuale unica pulizia riportata: **soffiaggio delicato con aria compressa**, mai getti aggressivi. Eliminata espressamente la frase «eventuali metodi di pulizia devono rispettare le istruzioni specifiche».
- Prefiltro spugna del sistema misto da trattare separatamente nei passaggi seguenti.
- Se il sostitutivo non è compatibile: non montare, registrare anomalia, non avviare senza elemento idoneo correttamente installato.
- Revisione inserita nell'overlay immutabile `worker/src/review-ledger.mjs`; test e `knowledge-status` aggiornati. PR [#12](https://github.com/Lupus227/tagliando/pull/12) già integrata in `dev/fase14-ai`.

## Prima azione in nuova chat — **solo verifica del deployment**

Chiedere all'utente di confermare che il deploy Cloudflare del commit **`063dc43`** risulti `Success`, quindi leggere/incollare il risultato dell'endpoint protetto:

https://tagliando-ai-staging.maico-gua.workers.dev/api/knowledge-status

Valori attesi: `version="15.18.0"`, `stepCount=53`, `validatedSteps=17`, `conditionalValidatedSteps=17`, `pendingSteps=36`, `latestReviewedStepId="RASA-OP-03-P03"`, `aiEnabled=false`, `canGenerate=false`, `readyForTechnicalAnswers=false`.

Solo dopo questa verifica registrare il deployment effettivo nel file `REGISTRO_PROGETTO.md` su `main` (con PR documentale autonoma secondo GOV-14), evitando di modificare il codice della PWA.

## Successiva fase dopo verifica

**Fase 15.19 — `RASA-OP-03-P04`, lavaggio del filtro in spugna.** Presentare **un solo testo tecnico proposto** all'utente esperto, chiedere l'approvazione, poi creare revisione condizionata + audit fail-closed + test su ramo staging. Non approvare automaticamente `P04` senza esplicita conferma.

## Vincoli trasversali sempre attivi

- `REGISTRO_PROGETTO.md` governa le decisioni; le Issue aperte (#1: deduplicazione istruzioni già eseguite; #2: affilatura facoltativa; #3: fissaggi/coppie) rappresentano backlog, non approvazioni.
- Solo procedure validate con campo di applicazione esplicito; niente valori tecnici universali non verificati, nessuna abilitazione AI prima di decisione separata.
- F15.15: audit statico lama 20/20 superato; **test integrati del motore runtime ancora da eseguire**. In particolare guardia coppia P07 prima dello smontaggio P02.
- **OPEN-01:** nella PWA, ticket anomalia manuale causa avanzamento involontario; già deciso **non correggere ora**, ma chiudere prima del rilascio. Via vocale si sospende correttamente.
- Non ripetere istruzioni già completate senza ragioni di sicurezza; non inferire dal contesto che requisiti critici siano ancora soddisfatti se è cambiata la macchina/sessione/stato.
- **GOV-14:** approvazione tecnica in chat obbligatoria per nuove istruzioni; le PR di documentazione e modifiche già autorizzate nel perimetro concordato si possono gestire autonomamente dopo i controlli, senza chiedere una seconda conferma amministrativa.
- Per prevenire saturazione della chat, preparare una nuova scheda di ripresa all'incirca ogni 20–25 scambi tecnici o prima, e avvisare l'utente **prima** della saturazione.

## Testo breve da usare nella nuova chat

«Continuiamo App Tagliando. Leggi il REGISTRO_PROGETTO.md e docs/RIPRESA_CHAT_F15_18.md nel repository GitHub Lupus227/tagliando, controlla le Issue aperte. È stata approvata e integrata F15.18-R2 (filtro carta P03). Il commit staging è 063dc43, GitHub Actions Success, ma il deployment Cloudflare 15.18.0 va ancora verificato. Riprendi esattamente da quella verifica, senza rifare le approvazioni già ottenute. Poi procediamo con F15.19-P04.»
