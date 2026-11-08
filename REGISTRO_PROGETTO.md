# REGISTRO DI PROGETTO — APP TAGLIANDO

**Versione del registro:** 1.0 · **Aggiornato:** 2026-11-08  
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

## B. Architettura e ambito prodotto

- **PWA stabile di riferimento:** v0.12.1, GitHub Pages, prova su iPhone/Safari; comandi vocali e ticket anomalie già collaudati in precedenza. Nessuna modifica PWA richiesta dalla Fase 15 corrente.
- **Knowledge Base canonica:** `tagliando.knowledge.v1`; 8 procedure e 53 passaggi. Le revisioni tecniche sono tracciate nel backend Cloudflare; `main` GitHub ospita il codice PWA, non è prova dell'ultima KB.
- **Infrastruttura:** Cloudflare Workers/Pages staging; protezione Access "All traffic"; backend testato prima delle revisioni.
- **Architettura target:** ibrida; procedure controllate e validate + AI conversazionale che chiarisce, chiede dati mancanti e seleziona solo percorsi autorizzati.
- **Budget iniziale desiderato:** circa 50–100 €, con preferenza per soluzioni gratuite finché la fattibilità non sia verificata.
- **Affilatura lama:** operazione **facoltativa** nel tagliando gratuito; si salta se mancano competenza, strumenti o condizioni di sicurezza. Non compromettere le altre attività del tagliando, registrando l'omissione.
- **Dati tecnici specifici:** quantità d'olio, coppie di serraggio, codici ricambi, geometrie e limiti di usura richiedono identificazione di macchina/motore e riferimento appropriato; non presentarli come universali.

## C. Stato ufficiale noto al 2026-11-08

Fonte: risultato JSON riportato dall'utente dopo deployment Cloudflare `23642ef` dichiarato **Success**.

```json
{
  "ok": true,
  "schema": "tagliando.knowledge.v1",
  "version": "15.14.0",
  "sourceAppVersion": "0.12.1",
  "procedureCount": 8,
  "stepCount": 53,
  "pendingSteps": 39,
  "validatedSteps": 14,
  "conditionalValidatedSteps": 14,
  "reviewScope": "pulizia_completa_e_sicurezza_smontaggio_mozzo_ispezione_affilatura_equilibratura_rimontaggio_verifica_condizionati",
  "latestReviewedStepId": "RASA-OP-02-P08",
  "readyForTechnicalAnswers": false,
  "aiEnabled": false,
  "canGenerate": false,
  "sessionChanged": false
}
```

**Interpretazione:** 14/53 passaggi validati *con condizioni* (26,4%), 39 in attesa. Non significa che le procedure siano universalmente applicabili né che la risposta AI sia autorizzata. Non è stato eseguito in questa registrazione un nuovo test del backend in tempo reale.

## D. Registro tecnico dei passaggi approvati nella Fase 15

Le denominazioni qui servono per orientamento. Il **testo completo approvato** è quello distribuito nella KB 15.14.0; i riassunti seguenti NON lo sostituiscono.

| ID | Passaggio | Stato nel JSON 15.14.0 | Decisioni principali recuperate |
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

**Nota di accuratezza:** i titoli e i punti riassuntivi derivano dallo storico disponibile e da riferimenti alla PWA; se nasce un conflitto con il testo canonico KB, consultare la KB e correggere il registro, non reinterpretare in autonomia il testo approvato.

## E. Problemi e decisioni differite

| ID | Problema | Decisione | Priorità / condizione di chiusura |
|---|---|---|---|
| OPEN-01 | Nella PWA v0.12.1, `app.js` la segnalazione **manuale** di anomalia richiama `setStatus('stopped')`, che causa un avanzamento alla successiva operazione; `recordVoiceAnomaly()` non avanza. Verificato mediante lettura del codice GitHub 2026-11-08. | **Non modificare ora la PWA.** Integrare la correzione nella futura revisione della gestione stati/anomalie, evitando lavoro doppio se l'AI sostituisce la logica. | **Bloccante prima di uso operativo/rilascio**; non bloccante per validazione documentale KB. |
| OPEN-02 | Test integrati di Operazione 2 / sequenze e diramazioni non ancora completati. | Eseguire Fase 15.15 senza cambiare PWA o KB già approvata se non emerge un difetto effettivamente bloccante. | Prossima fase. |
| OPEN-03 | 39 passaggi KB ancora pendenti; generazione AI disabilitata. | Continuare revisione per singolo passaggio, con approvazione tecnica + deployment/collaudo. | Prima di autorizzare risposte tecniche AI. |
| OPEN-04 | Testo completo delle revisioni precedenti non integralmente copiato in questo registro. | Fare riferimento alla KB 15.14.0 e all'archivio delle chat per le formulazioni esatte; aggiungere tracciabilità puntuale progressivamente senza inventare contenuti. | Miglioramento della tracciabilità. |

## F. Sequenza di lavoro successiva

1. **Fase 15.15:** verifica integrata dell'Operazione 2, per coerenza tra prerequisiti, affilatura opzionale, arresti per anomalie, registrazione delle omissioni, fissaggio e controllo finale.
2. Se i test non evidenziano blocchi reali della KB, iniziare **Operazione 3 — Filtro aria**, sempre un passaggio alla volta.
3. Trattare `OPEN-01` durante la progettazione del controllo stati nell'integrazione AI, e comunque prima del rilascio utilizzabile sul campo.
4. Non attivare `aiEnabled`, `canGenerate` o `readyForTechnicalAnswers` senza validazione e collaudo espliciti.

## G. Protocollo di gestione del registro e cambio chat

**Aggiornamento obbligatorio:** ogni decisione approvata genera una riga modificata o nuova; ogni deployment verificato aggiorna la sezione C, mantenendo uno storico minimo qui sotto. Distinguere sempre **proposto / approvato / implementato / distribuito / collaudato**.

**Checkpoint di chat:** dopo circa 20–25 scambi tecnici, al cambio di fase, o quando lunghi blocchi di codice/JSON rendano la conversazione pesante, avvisare l'utente che conviene preparare il cambio. Non promettere di conoscere i token residui esatti.

**Scheda di ripresa minima:** repository e ramo; link a questo registro; ultima versione KB e deployment; conteggi validati/pendenti; ultimo step; vincoli di sicurezza; ultimo intervento effettivamente svolto; anomalie aperte; prossima singola azione. La scheda serve come promemoria; il registro resta la fonte delle decisioni.

**Nuova chat:** l'assistente deve aprire il registro su GitHub e confrontarlo con l'ultimo JSON/risultato disponibile. L'accesso automatico tra chat dipende dalla disponibilità degli strumenti e dal contesto; per maggiore affidabilità, avviare la nuova chat con:  
`Continuiamo App Tagliando. Leggi prima REGISTRO_PROGETTO.md nel repository Lupus227/tagliando, verifica lo stato attuale e prosegui dalla prossima fase.`

## H. Storico aggiornamenti

| Data | Evento | Evidenza / stato |
|---|---|---|
| 2026-10 / 2026-11 | PWA v0.12.1 collaudata per ticket vocali e sospensione senza avanzamento implicito. | Storico progetto; PWA resta congelata in Fase 15. |
| 2026-11-08 | Deployment Knowledge Base `15.14.0` / `23642ef` comunicato **Success**. | JSON utente: 14 condizionati, 39 pendenti, AI disabilitata. |
| 2026-11-08 | Revisione P08: eliminata una ripetizione della messa in sicurezza; restante testo approvato. | Conferma utente; deployment `15.14.0`. |
| 2026-11-08 | Problema `OPEN-01` rilevato e deliberatamente differito. | Revisione `app.js` e decisione utente/assistente. |
| 2026-11-08 | Richiesti registro permanente e avvisi anticipati di passaggio chat. | Requisiti di continuità GOV-09–GOV-12. |
