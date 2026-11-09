# REGISTRO DI PROGETTO — APP TAGLIANDO

**Versione del registro:** 1.15 · **Aggiornato:** 2026-11-09  
**Responsabile approvazioni tecniche:** titolare del progetto (utente).  
**Ambito:** MVP PWA per manutenzione preventiva guidata dei rasaerba a motore; estensibile ad altre macchine.  
**Repository PWA:** `Lupus227/tagliando`.  
**Regola di governo:** questo documento registra le decisioni, ma **non** sostituisce gli schemi JSON della Knowledge Base né prova, da solo, lo stato del backend Cloudflare.

> **COME RIPRENDERE IN UNA NUOVA CHAT:** prima di proporre codice o nuove revisioni, leggere l'ultima versione di `REGISTRO_PROGETTO.md` nel repository `Lupus227/tagliando`; verificare l'ultimo deployment e la risposta JSON del backend forniti dall'utente; ripartire dall'azione aperta più recente. Non presupporre che le decisioni siano memorizzate integralmente dalla chat precedente.

## A. Regole inderogabili del processo

| ID | Decisione / vincolo | Stato |
|---|---|---|
| GOV-01 | Una revisione o verifica per volta; distinguere proposta, approvazione tecnica, implementazione, deployment e collaudo. Non attribuire lo stato 'eseguito' a interventi soltanto discussi. | APPROVATO |
| GOV-02 | I contenuti della Knowledge Base diventano utilizzabili dall'AI solo se esplicitamente validati e dentro le condizioni di applicabilità. Non inventare istruzioni né valori tecnici modello-specifici. | APPROVATO |
| GOV-03 | `aiEnabled=false`, `canGenerate=false`, `readyForTechnicalAnswers=false` sino a sblocco esplicito e collaudi previsti. | APPROVATO / ATTIVO |
| GOV-04 | Non intervenire sulla PWA v0.12.1, `voice.js` o sul ramo `main` per risolvere aspetti non bloccanti: modifiche isolabili, reversibili e soggette ad approvazione/collaudo; preferire ramo di lavoro. | APPROVATO |
| GOV-05 | Lo sviluppo della Knowledge Base e del backend prosegue separatamente dalla PWA. Non confondere il codice PWA su GitHub con lo stato della KB distribuita su Cloudflare. | APPROVATO |
| GOV-06 | Il tagliando è manutenzione preventiva guidata per utente medio, non diagnosi guasti complessa: diagnostica e riparazioni specialistiche saranno moduli separati. | APPROVATO |
| GOV-07 | Le ripetizioni inutili di precauzioni già espresse nel passaggio immediatamente precedente si eliminano quando questo non compromette i controlli di sicurezza necessari. | APPROVATO |
| GOV-08 | Registrare sia le lavorazioni completate sia quelle non eseguite, i motivi e le anomalie. Nessuna segnalazione di anomalia deve equivalere a una conferma implicita. | APPROVATO |
| GOV-09 | Prima di una nuova chat, aggiornare il registro e redigere una scheda di ripresa; segnalare preventivamente la convenienza del cambio, senza aspettare una saturazione del contesto. | APPROVATO 2026-11-08 |
| GOV-10 | Un checkpoint di continuità si effettua orientativamente ogni 20–25 scambi tecnici, o prima in caso di molto codice/JSON e ai passaggi di fase. Non esiste un misuratore affidabile dello spazio chat residuo. | APPROVATO 2026-11-08 |
| GOV-11 | All'avvio di un nuovo lavoro/chat sul progetto, consultare questo registro **prima** di proporre modifiche. Quando non disponibile, dichiararlo e chiedere un collegamento o estratto, senza supporre decisioni mancanti. | APPROVATO 2026-11-08 |
| GOV-12 | Il registro si aggiorna dopo ciascuna nuova decisione tecnica approvata e dopo i collaudi/deployment rilevanti; conservare le modifiche come storico e non sovrascrivere silenziosamente gli esiti. | APPROVATO 2026-11-08 |
| GOV-13 | All'inizio di ogni sessione di lavoro sul progetto, a ogni cambio fase e prima di chiudere decisioni sul comportamento dell'app, consultare le Issue GitHub **aperte** e confrontarle con questo registro e la KB. Le Issue possono essere appunti o ipotesi non approvate: non autorizzano codice né modifiche alla KB. | APPROVATO COME PROTOCOLLO DI LAVORO 2026-11-08 |
| GOV-14 | **Autonomia PR proporzionata al rischio:** l'approvazione tecnica espressa in chat è sufficiente per le revisioni di contenuti già concordati. L'assistente può creare, verificare e unire autonomamente PR di **sola documentazione/registro**, oppure PR tecniche già esplicitamente approvate nel loro esatto ambito, dopo controlli previsti; non richiedere una seconda approvazione amministrativa per il merge. Richiedere invece esplicita approvazione per nuovo testo tecnico, modifiche sostanziali a PWA, sicurezza, motore di esecuzione, infrastruttura, AI, produzione o per differenze rispetto a ciò che era stato approvato. Non aggirare eventuali branch protection e verificare il risultato. | APPROVATO 2026-11-08 |

## B. Architettura e ambito prodotto

- **PWA stabile di riferimento:** v0.12.1, GitHub Pages, prova su iPhone/Safari; comandi vocali e ticket anomalie già collaudati in precedenza. Nessuna modifica PWA richiesta dalla Fase 15 corrente.
- **Knowledge Base canonica:** `tagliando.knowledge.v1`; 8 procedure e 53 passaggi. Le revisioni tecniche sono tracciate nel backend Cloudflare; `main` GitHub ospita il codice PWA, non è prova dell'ultima KB.
- **Infrastruttura:** Cloudflare Workers/Pages staging; protezione Access "All traffic"; backend testato prima delle revisioni.
- **Architettura target:** ibrida; procedure controllate e validate + AI conversazionale che chiarisce, chiede dati mancanti e seleziona solo percorsi autorizzati.
- **Budget iniziale desiderato:** circa 50–100 €, con preferenza per soluzioni gratuite finché la fattibilità non sia verificata.
- **Affilatura lama:** operazione **facoltativa** nel tagliando gratuito; si salta se mancano competenza, strumenti o condizioni di sicurezza. Non compromettere le altre attività del tagliando, registrando l'omissione.
- **Dati tecnici specifici:** quantità d'olio, coppie di serraggio, codici ricambi, geometrie e limiti di usura richiedono identificazione di macchina/motore e riferimento appropriato; non presentarli come universali.

## C. Stato ufficiale noto al 2026-11-09

**Ultimo deployment Cloudflare verificato:** `ca738c9` sul ramo `dev/fase14-ai`, confermato dall'utente come **Success** con risposta JSON dell'endpoint Access-protetto `/api/knowledge-status`.

```json
{
  "ok": true,
  "schema": "tagliando.knowledge.v1",
  "version": "15.22.0",
  "sourceAppVersion": "0.12.1",
  "procedureCount": 8,
  "stepCount": 53,
  "pendingSteps": 32,
  "validatedSteps": 21,
  "conditionalValidatedSteps": 21,
  "reviewScope": "pulizia_completa_e_sicurezza_smontaggio_mozzo_ispezione_affilatura_equilibratura_rimontaggio_verifica_condizionati_e_filtro_aria_preparazione_apertura_valutazione_trattamento_carta_lavaggio_spugna_oliatura_spugna_pulizia_scatola_filtro_e_rimontaggio_filtro_condizionati",
  "latestReviewedStepId": "RASA-OP-03-P07",
  "readyForTechnicalAnswers": false,
  "aiEnabled": false,
  "canGenerate": false,
  "sessionChanged": false
}
```

**Interpretazione:** 21/53 passaggi validati **con condizioni** (circa 39,6%), 32 pendenti. **AI, retrieval tecnico e generazione disabilitati.** L'utente ha confermato il 2026-11-09 il deployment Cloudflare `ca738c9` **Success** e comunicato il JSON dell'endpoint Access-protetto `/api/knowledge-status`, coerente con KB `15.22.0`. La verifica Cloudflare è basata sulla risposta dell'utente, non su un'interrogazione diretta indipendente. [GitHub Actions Success](https://github.com/Lupus227/tagliando/actions/runs/42628921922): test di regressione e compilazione di controllo Wrangler superati. Le PR [#26](https://github.com/Lupus227/tagliando/pull/26) e [#27](https://github.com/Lupus227/tagliando/pull/27) hanno integrato F15.22-R1 e allineato una sola asserzione testuale senza modificare il testo tecnico.

**Fase 15.22 chiusa:** `RASA-OP-03-P07 — Rimontaggio filtro aria` approvato e distribuito. **Operazione 03 (filtro aria) completa: sette passaggi condizionatamente validati.** P06 riguarda la pulizia del vano e dei condotti senza contaminazione; P07 riguarda il posizionamento degli elementi, la chiusura e la tenuta all'aria non filtrata: sono passaggi distinti. La struttura JSON resta identica per contratto; avanzano versione, conteggi, scope e ultimo ID revisionato. **Prossima attività:** proposta F15.23 / `RASA-OP-04-P01 — Verifica ricambio candela`, da sottoporre all'esperto. Catalogo canonico di origine, PWA v0.12.1 e `voice.js` invariati.

**Versioni precedenti confermate:**
- `15.21.0`: commit `8224ac1`, 20 validati con condizioni, 33 pendenti, ultimo `RASA-OP-03-P06`.
- `15.20.0`: commit `613114b`, 19 revisioni condizionate, 34 pendenti, ultimo `RASA-OP-03-P05`.
- `15.19.0`: commit `bd3a380`, 18 condizionati, 35 pendenti, ultimo `RASA-OP-03-P04`.
- `15.18.0`: commit `063dc43`, 17 condizionati, 36 pendenti, ultimo `RASA-OP-03-P03`.
- `15.17.0`: commit `97a1ee1`, 16 passaggi validati con condizioni, 37 pendenti, ultimo `RASA-OP-03-P02`.
- `15.16.0`: commit `0360eaf`, 15 condizionati, 38 pendenti, ultimo `RASA-OP-03-P01`.
- `15.14.0`: commit `23642ef`, 14 condizionati, 39 pendenti, ultimo `RASA-OP-02-P08`.

Catalogo canonico di origine immutato; PWA v0.12.1 e `voice.js` invariati.

## D. Registro tecnico dei passaggi approvati nella Fase 15

Le denominazioni qui servono per orientamento. Il **testo completo approvato** è tracciato nel registro revisioni del Worker e distribuito tramite l'overlay KB; i riassunti seguenti NON lo sostituiscono.

| ID | Passaggio | Stato / revisione | Decisioni principali recuperate |
|---|---|---|---|
| RASA-OP-01-P01 | Sicurezza generale | Validato con condizioni | Verifiche preliminari di sicurezza e arresti. |
| RASA-OP-01-P02 | Preparazione / accesso sottoscocca | Validato con condizioni | Orientamento compatibile con il modello; candela verso l'alto come riferimento non universale; inclinazione graduale (orientativamente 45°) e stop per instabilità/perdite. |
| RASA-OP-01-P03 | Rimozione incrostazioni | Validato con condizioni | Raschietto/spatola non affilata, protezione da danni alla scocca e al gruppo di taglio. |
| RASA-OP-01-P04 | Pulizia finale | Validato con condizioni | Pulizia con aria e attrezzi controllati; idropulitrice non proposta indiscriminatamente ai privati; compatibilità con modello e componenti. |
| RASA-OP-01-P05 | Asciugatura | Validato con condizioni | Preferire metodi idonei; eventuale asciugatura tramite funzionamento motore solo in condizioni esplicitamente sicure e pertinenti, non come azione universale. |
| RASA-OP-01-P06 | Ispezione scocca | Validato con condizioni | Distinguere ruggine superficiale da danni strutturali/corrosione passante che richiedono intervento separato. |
| RASA-OP-02-P01 | Preparazione / sicurezza lama | Validato con condizioni | Presupposti di sicurezza prima dell'intervento sulla lama. |
| RASA-OP-02-P02 | Smontaggio lama | Validato con condizioni | Attrezzatura e immobilizzazione idonee; strumenti di officina non generalizzati a utenti inesperti. |
| RASA-OP-02-P03 | Mozzo e linguetta | Validato con condizioni | Verifica sede, centraggio e integrità; anomalie da gestire senza rimontaggio automatico. |
| RASA-OP-02-P04 | Ispezione lama | Validato con condizioni | Se crepata o gravemente compromessa non affilare: fermarsi e sostituire con ricambio corretto. |
| RASA-OP-02-P05 | Affilatura | Validato con condizioni | Geometria originaria e caratteristiche del modello prevalgono su angoli empirici; prevenire surriscaldamento/asportazione eccessiva. |
| RASA-OP-02-P06 | Equilibratura | Validato con condizioni | Verifica bilanciamento mediante supporto idoneo; eventuali squilibri non ignorati. |
| RASA-OP-02-P07 | Montaggio/serraggio | Validato con condizioni | **Prima dello smontaggio** verificare disponibilità di coppia prescritta e chiave dinamometrica/metodo di serraggio corretto. Altrimenti saltare l'affilatura; non usare una regolazione empirica dell'avvitatore per sostituire la coppia prescritta. |
| RASA-OP-02-P08 | Verifica finale | Validato con condizioni | Freno motore può opporre resistenza significativa alla rotazione senza bloccarla totalmente. Evitare forzature e artifici impropri; arresto per giochi/interferenze/anomalie. **Eliminata** la frase iniziale ridondante: «Prima di procedere, assicurati che il motore sia spento, il cappuccio della candela sia scollegato e isolato e l'eventuale sistema di avviamento elettrico sia disabilitato.» Restante testo approvato. |
| RASA-OP-03-P01 | Preparazione/apertura scatola filtro aria | **Approvato F15.16-R1 e deployment Cloudflare confermato** | Con macchina stabile, in normale posizione di lavoro e motore spento/freddo, osservare il fissaggio e aprire senza forzare. Identificare filtro carta/spugna/misto prima di estrarlo, prevenire contaminazione ingresso carburatore. Arresto e registrazione se coperchio bloccato o fissaggi danneggiati. Nessun trattamento filtro autorizzato. |
| RASA-OP-03-P02 | Valutazione materiale filtrante | **Approvato F15.17-R1, CI e deployment Cloudflare confermati** | Estrarre senza contaminare l'aspirazione. Carta: sostituzione normalmente prevista, mantenibile solo se recente, pulita, integra e conforme alle istruzioni del costruttore. Spugna: riutilizzabile soltanto se morbida, elastica, integra; sostituire se indurita/friabile/lacerata/deformata. Misto: verificare separatamente i due elementi. Se serve ricambio compatibile non disponibile, registrare sospensione e non avviare senza filtrazione montata correttamente. Lavaggio, oliatura e pulizia esclusi da P02. |
| RASA-OP-03-P03 | Trattamento filtro in carta | **F15.18-R2 approvato; PR #12, CI e deployment Cloudflare confermati** | Carta o elemento carta del misto; saltare se solo spugna. Sostituire con ricambio compatibile oppure conservare elemento recente, integro e pulito. **Non lavare né oliare i filtri in carta**; unico metodo di pulizia eventualmente descritto: soffiaggio delicato con aria compressa, mai getti aggressivi. Pre-filtro in spugna gestito separatamente. Non montare ricambio non compatibile; registrare anomalia e non avviare senza filtro idoneo installato. **Eliminate su esplicita richiesta le eccezioni del costruttore al divieto di lavaggio/oliatura e la frase che suggeriva ulteriori metodi di pulizia.** |
| RASA-OP-03-P04 | Lavaggio filtro spugna | **F15.19-R2 approvato; PR #15/#16/#17, CI e deployment Cloudflare bd3a380 confermati** | Solo spugna e prefiltro spugna dei filtri misti; salto per sola carta. Lavaggio in acqua tiepida con detergente **specifico per filtri aria**, compressione ripetuta durante l'immersione senza torsione, risciacquo e asciugatura completa; verifica integrità. Gasolio, benzine e idrocarburi come detergente **sconsigliati**; solventi (diluente/acetone/...) **assolutamente vietati**. Elemento carta protetto dall'acqua. Oliatura rinviata a P05. Arresto per spugna danneggiata/lavabilità non determinabile/ricambio compatibile mancante; no avvio senza filtro idoneo correttamente trattato e rimontato. |
| RASA-OP-03-P05 | Oliatura filtro in spugna | **F15.20-R3 approvato; PR #20, CI e deployment Cloudflare `613114b` confermati** | **Filtro in sola spugna:** oliare; **prefiltro in spugna con carta:** non oliare nella procedura standard. Configurazioni specifiche solo con conoscenza pregressa dell'operatore riferita al modello, senza supposizioni. Spugna asciutta dopo lavaggio; olio spray specifico per filtri aria oppure immersione in olio motore nuovo/pulito; comprimere senza torcere per distribuire e rimuovere eccesso. Nessun accumulo/gocciolamento; conservare pulito fino al rimontaggio. Se manca olio idoneo richiesto, registrare anomalia e sospendere; non avviare prima del corretto trattamento/rimontaggio. |
| RASA-OP-03-P06 | Pulizia della scatola filtro aria | **F15.21-R1 approvato; PR #23, CI e deployment Cloudflare `8224ac1` confermati** | Con filtro rimosso, pulire vano e coperchio con panno asciutto o leggermente inumidito. Per residui oleosi, detergente compatibile con plastica/guarnizioni ed eliminazione residui; pulire superfici di tenuta del filtro. Evitare ingresso polvere/liquidi/oggetti nel condotto carburatore, non dirigere getti d'aria/acqua all'ingresso e non introdurre utensili/panni nel condotto. Verificare pulizia e assenza di umidità. Rimontaggio gestito in P07 (successivamente approvato come F15.22-R1). Se scatola o guarnizioni danneggiate o sospetta contaminazione aspirazione, registrare anomalia e sospendere rimontaggio fino a verifica. |
| RASA-OP-03-P07 | Rimontaggio filtro aria | **F15.22-R1 approvato; PR #26/#27, CI e deployment Cloudflare `ca738c9` confermati** | Dopo i trattamenti previsti, scatola asciutta e pulita. Inserire filtro carta, spugna precedentemente trattata o sistema misto nel giusto orientamento rispettando guide e superfici di tenuta, senza pieghe/deformazioni. Chiudere coperchio su guide, linguette e ganci/viti senza forzare; verificare stabilità e assenza di fessure che permettono bypass d'aria non filtrata. Arresto e registrazione anomalia per filtro fuori sede, coperchio non chiudibile, fissaggi danneggiati o tenuta incerta; nessun avviamento senza filtrazione correttamente installata. |

**Nota di accuratezza:** i titoli e i punti riassuntivi derivano dallo storico disponibile e da riferimenti alla PWA; se nasce un conflitto con il testo canonico KB, consultare la KB e correggere il registro, non reinterpretare in autonomia il testo approvato.

## E. Problemi e decisioni differite

| ID | Problema | Decisione | Priorità / condizione di chiusura |
|---|---|---|---|
| OPEN-01 | Nella PWA v0.12.1, `app.js` la segnalazione **manuale** di anomalia richiama `setStatus('stopped')`, che causa un avanzamento alla successiva operazione; `recordVoiceAnomaly()` non avanza. Verificato mediante lettura del codice GitHub 2026-11-08. | **Non modificare ora la PWA.** Integrare la correzione nella futura revisione della gestione stati/anomalie, evitando lavoro doppio se l'AI sostituisce la logica. | **Bloccante prima di uso operativo/rilascio**; non bloccante per validazione documentale KB. |
| OPEN-02 | Verifica integrata dell'Operazione 2: **audit statico 20/20 superato in F15.15**; collaudo effettivo di percorsi, navigazione e stati ancora assente. | Testare T1–T8 quando esisterà il controllore di esecuzione della procedura; nessuna modifica alla PWA o alla KB ora. Vedi [relazione F15.15](docs/FASE15_15_VERIFICA_INTEGRATA.md). | **Bloccante prima del rilascio**, non per avviare revisione OP03. |
| OPEN-03 | **32** passaggi pendenti nella KB 15.22.0 confermata su Cloudflare con JSON Access-protetto. AI disabilitata. | Continuare revisione per singolo passaggio, con approvazione tecnica, test e prova del deployment. | Prima di autorizzare risposte tecniche AI. |
| OPEN-04 | Testo completo delle revisioni precedenti non integralmente copiato in questo registro. | Fare riferimento alla KB 15.14.0 e all'archivio delle chat per le formulazioni esatte; aggiungere tracciabilità puntuale progressivamente senza inventare contenuti. | Miglioramento della tracciabilità. |
| OPEN-05 | **Guardia P07→P02:** la coppia pertinente, la fonte e la dinamometrica devono essere dichiarate/verificate prima dello smontaggio benché il prerequisito sia documentato in P07. | In futuro il motore di esecuzione deve applicare la guardia preventiva (fail closed), con test positivo/negativo e verifica del salto sicuro. | **Bloccante prima del rilascio**; requisito già dichiarato nel ledger. |


### Issue GitHub da controllare

| Issue | Oggetto | Stato e relazione con la KB |
|---|---|---|
| [#1](https://github.com/Lupus227/tagliando/issues/1) | Evitare ripetizioni di procedure già confermate nella sessione, salvo ricontrolli di sicurezza per cambi di contesto. | **OPEN**; requisito della futura UX/motore conversazionale; nessuna modifica immediata. |
| [#2](https://github.com/Lupus227/tagliando/issues/2) | Affilatura facoltativa nel tagliando gratuito, subordinata a strumenti, capacità e sicurezza. | **OPEN**; decisione di prodotto già recepita nel registro, implementazione di branch e navigazione ancora da progettare. |
| [#3](https://github.com/Lupus227/tagliando/issues/3) | Identificazione visiva di fissaggi lama e attribuzione di coppie con evidenze tecniche verificabili; ipotesi empirica 60 Nm non approvata per uso universale. | **OPEN**, attività di ricerca e progettazione. La nota storica della Issue del 2026-11-07 che descrive P07 come da validare **non prevale** sul JSON successivo 15.14.0 che riporta P07/P08 validati *con condizioni*; la ricerca su riconoscimento/coppie resta aperta. |

Le Issue sono un **backlog di requisiti, problemi e proposte**. Il registro costituisce la mappa delle decisioni. Il backend KB distribuito e i relativi test costituiscono la prova dello stato di validazione. Non equiparare *Issue open* a *passaggio KB non validato*.

## F. Sequenza di lavoro successiva

1. **Fase 15.15:** audit statico **completato (20/20)**. Non equivale al collaudo runtime; vedi [relazione](docs/FASE15_15_VERIFICA_INTEGRATA.md) e `OPEN-02`.
2. **Fase 15.16:** P01 filtro aria **approvato, integrato, testato e deployment Cloudflare 15.16.0 confermato dall'utente**.
3. **Fase 15.17:** `RASA-OP-03-P02` approvato, integrato, CI Success e **deployment Cloudflare 15.17.0 confermato con JSON dell'utente**.
4. **Fase 15.18:** P03 trattamento carta **R2 approvato, integrato, CI Success e deployment Cloudflare 15.18.0 confermato dall'utente**.
5. **Fase 15.19:** `RASA-OP-03-P04 — Lavaggio spugna` approvato con tre modifiche dall'esperto; integrazione in `dev/fase14-ai` e CI Success per commit `bd3a380`. **Deployment Cloudflare `bd3a380` e JSON di `/api/knowledge-status` confermati il 2026-11-09:** KB `15.19.0`, 18 condizionati, 35 pendenti, AI off. **Fase chiusa.**

6. **Fase 15.20:** `RASA-OP-03-P05` approvato dall'esperto (R3), integrato e testato su `dev/fase14-ai` (commit `613114b`, CI Success). **Deployment Cloudflare `613114b` e JSON Access-protetto confermati dall'utente il 2026-11-09:** KB 15.20.0 / 19 con condizioni / 34 pendenti, AI disabilitata. **Fase chiusa.**

7. **Fase 15.21:** `RASA-OP-03-P06 — Pulizia scatola filtro` approvata dall'esperto (R1), integrata e testata nel backend `dev/fase14-ai` (commit `8224ac1`, CI Success). **Deployment Cloudflare `8224ac1` e JSON Access-protetto confermati dall'utente il 2026-11-09:** KB `15.21.0`, 20 con condizioni, 33 pendenti, ultimo `RASA-OP-03-P06`, AI disabilitata. **Fase chiusa.**

8. **Fase 15.22:** `RASA-OP-03-P07` approvato senza modifiche (R1), integrato e testato su `dev/fase14-ai` (commit finale `ca738c9`, CI Success). **Deployment Cloudflare `ca738c9` e JSON Access confermati dall'utente il 2026-11-09:** KB 15.22.0, 21 validati con condizioni, 32 pendenti, ultimo `RASA-OP-03-P07`, AI disabilitata. **Fase chiusa.**

9. **Fase 15.23 — prossima azione:** proporre `RASA-OP-04-P01 — Verifica ricambio candela` per revisione tecnica; non integrare il passaggio senza approvazione.

10. Trattare `OPEN-01` e `OPEN-05` durante la progettazione del controllo stati e dei prerequisiti dell'AI, e comunque prima dell'utilizzo operativo.
11. Non attivare `aiEnabled`, `canGenerate` o `readyForTechnicalAnswers` senza validazione e collaudo espliciti.

## G. Protocollo di gestione del registro e cambio chat

**Aggiornamento obbligatorio:** ogni decisione approvata genera una riga modificata o nuova; ogni deployment verificato aggiorna la sezione C, mantenendo uno storico minimo qui sotto. Distinguere sempre **proposto / approvato / implementato / distribuito / collaudato**.

**Checkpoint di chat:** dopo circa 20–25 scambi tecnici, al cambio di fase, o quando lunghi blocchi di codice/JSON rendano la conversazione pesante, avvisare l'utente che conviene preparare il cambio. Non promettere di conoscere i token residui esatti.

**Scheda di ripresa minima:** repository e ramo; link a questo registro; ultima versione KB e deployment; conteggi validati/pendenti; ultimo step; vincoli di sicurezza; ultimo intervento effettivamente svolto; anomalie aperte; prossima singola azione. La scheda serve come promemoria; il registro resta la fonte delle decisioni.


**Controllo Issue GitHub:** a ogni nuova chat/sessione sul progetto e a ogni passaggio di fase, interrogare GitHub per tutte le Issue aperte (`Lupus227/tagliando`), leggere quelle nuove o aggiornate e confrontarne i contenuti con registro e versioni KB. Se la connessione GitHub non è disponibile, dichiararlo. **Questo controllo avviene nel corso della conversazione, non in background continuo.**

**Nuova chat:** l'assistente deve aprire il registro su GitHub e confrontarlo con l'ultimo JSON/risultato disponibile. L'accesso automatico tra chat dipende dalla disponibilità degli strumenti e dal contesto; per maggiore affidabilità, avviare la nuova chat con:  
`Continuiamo App Tagliando. Leggi prima REGISTRO_PROGETTO.md nel repository Lupus227/tagliando, verifica lo stato attuale e prosegui dalla prossima fase.`


**Scheda di continuità per cambio chat:** [Ripresa F15.18](docs/RIPRESA_CHAT_F15_18.md). Aprire il registro e le Issue GitHub nella nuova conversazione. Distinguere il CI Success dal deployment non ancora verificato.

## H. Storico aggiornamenti

| Data | Evento | Evidenza / stato |
|---|---|---|
| 2026-10 / 2026-11 | PWA v0.12.1 collaudata per ticket vocali e sospensione senza avanzamento implicito. | Storico progetto; PWA resta congelata in Fase 15. |
| 2026-11-08 | Deployment Knowledge Base `15.14.0` / `23642ef` comunicato **Success**. | JSON utente: 14 condizionati, 39 pendenti, AI disabilitata. |
| 2026-11-08 | Revisione P08: eliminata una ripetizione della messa in sicurezza; restante testo approvato. | Conferma utente; deployment `15.14.0`. |
| 2026-11-08 | Problema `OPEN-01` rilevato e deliberatamente differito. | Revisione `app.js` e decisione utente/assistente. |
| 2026-11-08 | Richiesti registro permanente e avvisi anticipati di passaggio chat. | Requisiti di continuità GOV-09–GOV-12. |
| 2026-11-08 | Verifica delle Issue #1–#3 e integrazione nel protocollo di ripresa. | Issue #3 contiene un dato storico antecedente al JSON KB 15.14.0; GOVERNANCE GOV-13. |
| 2026-11-08 | F15.15: audit statico integrato OP02 20/20 verifiche superate. | Nessuna modifica PWA/KB, nessun collaudo runtime. Aperto `OPEN-05` su guardia preventiva P07→P02; relazione [F15.15](docs/FASE15_15_VERIFICA_INTEGRATA.md). |
| 2026-11-08 | F15.16-R1 approvato: apertura filtro aria, stop su fissaggi danneggiati. | Commit staging `0360eaf`, CI success; deployment success confermato successivamente dall'utente. |
| 2026-11-08 | F15.16-R1: deployment Cloudflare confermato dall'utente. | Commit `0360eaf` Success; endpoint `/api/knowledge-status`: 15.16.0, validati con condizioni 15, pendenti 38, AI disabilitata. |
| 2026-11-08 | F15.17-R1: P02 valutazione materiale carta/spugna/misto approvata e integrata nel codice staging. | Commit `97a1ee1`, PR #9 integrata; [CI success](https://github.com/Lupus227/tagliando/actions/runs/42524314782), 16 validati con condizioni e 37 pendenti nel codice. **Deployment Cloudflare successivamente confermato dall'utente.** |
| 2026-11-08 | F15.17: deployment Cloudflare e stato KB verificati. | Commit `97a1ee1` Success; JSON endpoint: 15.17.0, 16 revisioni condizionate, 37 pendenti, ultimo `RASA-OP-03-P02`, AI disabilitata. |
| 2026-11-08 | F15.18-R2: trattamento filtro carta approvato dopo due rimozioni esplicite. | Commit staging `063dc43`, PR #12 integrata, [CI Success](https://github.com/Lupus227/tagliando/actions/runs/42528155237); codice KB 15.18.0 / 17 condizionati / 36 pendenti. Cloudflare successivamente confermato dall'utente. |
| 2026-11-08 | F15.18: deployment Cloudflare verificato. | L'utente riporta `063dc43` Success e JSON `15.18.0`, 17 condizionati, 36 pendenti, ultimo `RASA-OP-03-P03`; `aiEnabled=false`. |
| 2026-11-08 | Aggiornata la scheda di ripresa per il cambio chat, secondo GOV-09/GOV-10. | [Scheda di ripresa F15.18](docs/RIPRESA_CHAT_F15_18.md); prossima attività: **F15.19 / RASA-OP-03-P04**, senza nuova verifica di F15.18. |
| 2026-11-09 | F15.19-R2: lavaggio filtro spugna approvato con tre modifiche. | Detergente specifico filtri aria; compressione durante immersione; gasolio/benzine/idrocarburi sconsigliati e solventi assolutamente vietati. PR #15, #16 e #17 integrate in `dev/fase14-ai`; commit `bd3a380`; [CI Success](https://github.com/Lupus227/tagliando/actions/runs/42619147181). **Deployment Cloudflare e risposta Access-protetta confermati dall'utente il 2026-11-09.** |
| 2026-11-09 | F15.19 deployment confermato e fase conclusa. | `bd3a380` Success dichiarato dall'utente; JSON Access: `15.19.0`, 18 revisioni condizionate, 35 pendenti, ultimo `RASA-OP-03-P04`, AI disabilitata. Prossima revisione `RASA-OP-03-P05` ancora da valutare. |
| 2026-11-09 | F15.20-R3: oliatura spugna approvata e integrata. | L'esperto conferma R3: filtro sola spugna oliato, prefiltro spugna+carta non oliato nella guida standard, configurazioni particolari soltanto con conoscenza pregressa riferita al modello. PR #20 integrata su `dev/fase14-ai`, commit `613114b`, [GitHub Actions Success](https://github.com/Lupus227/tagliando/actions/runs/42622646240) (regressioni e Wrangler dry-run). KB `15.20.0` attesa, 19 condizionati, 34 pendenti, AI off. **Deployment Cloudflare `613114b` e JSON Access successivamente confermati dall'utente il 2026-11-09.** |
| 2026-11-09 | F15.20 deployment verificato e fase chiusa. | L'utente conferma `613114b` Success e JSON Access: KB `15.20.0`, 19 revisioni condizionate, 34 pendenti, ultimo `RASA-OP-03-P05`; `readyForTechnicalAnswers=false`, `aiEnabled=false`, `canGenerate=false`. Prossima proposta F15.21 / `RASA-OP-03-P06` (ancora DA_VALIDARE). |
| 2026-11-09 | F15.21-R1: pulizia scatola filtro approvata e integrata. | Proposta approvata senza modifiche dall'esperto; detergente compatibile, protezione condotto aspirazione, no getti verso carburatore, stop su danni o corpi estranei. [PR #23](https://github.com/Lupus227/tagliando/pull/23) integrata su `dev/fase14-ai`, commit `8224ac1`; [CI Success](https://github.com/Lupus227/tagliando/actions/runs/42626360094) (regressioni e Wrangler dry-run). KB `15.21.0` attesa, 20 condizionati, 33 pendenti, AI off. **Deployment Cloudflare e JSON Access successivamente confermati dall'utente il 2026-11-09.** |
| 2026-11-09 | F15.21 — deployment Cloudflare confermato e fase chiusa. | L'utente riporta `8224ac1` Success e JSON `/api/knowledge-status`: KB `15.21.0`, 20 revisioni condizionate, 33 pendenti, ultimo `RASA-OP-03-P06`, AI disabilitata. Prossimo passaggio `RASA-OP-03-P07` ancora da validare. |
| 2026-11-09 | F15.22-R1: rimontaggio filtro aria approvato, integrato e testato. | L'esperto approva R1 senza modifiche. [PR #26](https://github.com/Lupus227/tagliando/pull/26) integrata, poi correzione esclusiva del test tramite [PR #27](https://github.com/Lupus227/tagliando/pull/27) senza toccare contenuto tecnico. Commit finale `ca738c9`; [GitHub Actions Success](https://github.com/Lupus227/tagliando/actions/runs/42628921922) (regressioni e Wrangler dry-run). KB attesa `15.22.0`, 21 condizionati, 32 pendenti, AI off. **Deployment Cloudflare `ca738c9` e JSON Access successivamente confermati dall'utente il 2026-11-09.** |
| 2026-11-09 | F15.22 — deployment 15.22.0 confermato e operazione filtro aria completa. | L'utente conferma `ca738c9` Success, KB `15.22.0`, 21 validati con condizioni, 32 pendenti, ultimo `RASA-OP-03-P07`, AI off. P06 pulizia scatola e P07 rimontaggio sono fasi tecnicamente distinte benché lo schema JSON sia uguale. Prossima proposta F15.23 / `RASA-OP-04-P01`, ancora `DA_VALIDARE`. |
