# APP TAGLIANDO — CHECKPOINT DI RIPRESA FRA CHAT

**Checkpoint:** 2026-11-10, aggiornato dopo merge PR #45 e CI Success. Ultimo deployment Cloudflare effettivamente confermato dall'utente: 2026-11-09 KB 15.25.1 / commit 90283d4.  
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
| Commit deployment Cloudflare confermato dall'utente | **`90283d4` · Success** |
| Operazioni/passaggi | **8 / 53** |
| Passaggi validati con condizioni | **24** |
| Passaggi ancora pendenti | **29** |
| Ultimo step *revisionato* | **`RASA-OP-04-P01`** (ri-revisione P01; non un 25º passaggio) |
| Gate AI | `readyForTechnicalAnswers=false`, `aiEnabled=false`, `canGenerate=false` |
| Ultima CI verificata per KB | [GitHub Actions #42711458895 — Success](https://github.com/Lupus227/tagliando/actions/runs/42711458895) |
| Nuovo laboratorio M3 solo staging | [PR #45](https://github.com/Lupus227/tagliando/pull/45), commit **`5687f30`** su `dev/fase14-ai` |
| CI nuova prova M3 | [GitHub Actions #42898433457 — Success](https://github.com/Lupus227/tagliando/actions/runs/42898433457) (test + Wrangler dry-run) |
| Deployment Cloudflare nuovo codice M3 | **DA CONFERMARE**; il solo merge o CI Success non prova che sia raggiungibile |
| Console protetta da provare | `https://tagliando-ai-staging.maico-gua.workers.dev/lab/filtro-aria` |
| Comprensione libera con AI | **NON implementata**; la console restituisce esclusivamente testi validati dopo controlli deterministici |
| Ultima PR tecnica KB | [#41](https://github.com/Lupus227/tagliando/pull/41), merge nel branch di staging |
| Stato di issue OP04 | [#37 — APERTA, BLOCCANTE](https://github.com/Lupus227/tagliando/issues/37) |
| Compito immediato di questa conversazione | **Collaudare il laboratorio M3 appena integrato; mantenere Emergent in standby.** |

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
- **Stato effettivo:** code merge + test automatici + Wrangler dry-run completati; **deployment Cloudflare del nuovo commit e collaudi UI/iPhone ancora non confermati**.
- **Prossimo intervento verificabile**: controllare nella dashboard Cloudflare il deploy di `5687f30`; aprire la console protetta, controllare carta/spugna/misto, domanda «Non riesco ad aprire il coperchio», richiesta «Fatto», domanda estranea, recupero del tipo filtro e del passaggio. Riportare esito e URL/ID deploy; solo allora valutare l'integrazione LLM sotto policy e costi.

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

**Decisione aggiornata:** per la prima volta si sta rendendo consultabile una procedura validata dentro un laboratorio Access-protetto, come preparazione all'assistente AI target. **Emergent in standby** su scelta del titolare.

**Lavoro già integrato:** [PR #45](https://github.com/Lupus227/tagliando/pull/45), commit `5687f30` su `dev/fase14-ai`, [CI Success](https://github.com/Lupus227/tagliando/actions/runs/42898433457). Console `/lab/filtro-aria`, nessuna AI generativa, nessuna modifica alla PWA pubblica. KB `15.25.1`, 24/53 con condizioni, AI off.

**NEXT:** verificare il nuovo deployment su Cloudflare e collaudare su PC e poi iPhone le condizioni dei tre tipi di filtro e gli arresti. **Non dichiarare prodotto AI pronto**: il collegamento a un modello LLM e il controller generale sono ancora futuri. **OPEN-07** rimane aperta per OP04.
