# APP TAGLIANDO — ROADMAP MASTER E VISIONE DEL PRODOTTO

**Versione:** 1.0 — 2026-11-10  
**Stato:** riferimento strategico permanente; la selezione dei prossimi interventi è **da concordare con il titolare del progetto**.  
**Repository:** [Lupus227/tagliando](https://github.com/Lupus227/tagliando)  
**Da leggere insieme a:** [CHECKPOINT_RIPRESA.md](CHECKPOINT_RIPRESA.md) e [REGISTRO_PROGETTO.md](REGISTRO_PROGETTO.md).

> **MISSIONE NON NEGOZIABILE:** realizzare un **assistente tecnico AI conversazionale e prevalentemente vocale** per manutenzione e, in moduli separati, diagnosi e riparazione di macchine da giardinaggio. Il tagliando gratuito del rasaerba a benzina è il **primo caso d'uso per sviluppare e verificare la piattaforma**, non l'intero prodotto. Non trasformare la missione in una checklist, in un manuale statico o in un insieme di menu Sì/No.

## 1. Risultato che vogliamo ottenere

Un operatore, anche inesperto, deve poter lavorare sulla macchina conversando con un assistente che:

1. comprenda domande spontanee in linguaggio naturale, dubbi, richieste di chiarimento e anomalie;
2. spieghi **una fase alla volta**, con parole comprensibili ma tecnicamente corrette, senza occupare inutilmente le mani;
3. chieda i dati mancanti sul tipo di macchina, sul motore, sugli utensili e sulle condizioni reali soltanto quando necessari;
4. scelga e aggiorni percorsi **autorizzati**, senza inventare procedure, parametri o cause diagnostiche;
5. ricordi le risposte date, i passaggi completati/saltati e i problemi segnalati; non ripeta inutilmente istruzioni già svolte, salvo nuovi prerequisiti di sicurezza;
6. interrompa o sospenda la procedura quando una condizione critica, una specifica incerta o una competenza/attrezzatura mancante lo richiede;
7. produca un registro di sessione recuperabile e un resoconto di ciò che è stato eseguito, saltato o sospeso.

**L'innovazione cercata è l'interazione intelligente e affidabile mentre si effettua una lavorazione reale**. La lettura vocale del testo e i comandi «Fatto»/«Ripeti» sono il prototipo iniziale, non equivalgono all'AI conversazionale target.

### Pubblico e sviluppo commerciale già concordati

- **Gratuito:** tagliandi e manutenzione preventiva per privati, anche con bassa manualità; la guida deve essere semplice, progressiva e sicura.
- **Avanzato/a pagamento (ipotesi freemium):** diagnostica guasti, riparazioni, procedure più impegnative, anche per appassionati, tecnici e meccanici; nessuna esclusività del pubblico.
- **Macchine:** si parte dai rasaerba a benzina; l'architettura deve permettere di estendere a decespugliatori, motoseghe e altre attrezzature, senza presumere che una procedura valga per ogni modello.
- **Budget iniziale:** circa **50–100 €**, preferendo componenti gratuiti e costi marginali controllati finché non si valida la fattibilità e l'interesse reale.
- **Posizionamento:** non un chatbot generalista; un assistente di officina specializzato, affidabile e controllato.

## 2. Architettura target **ibrida** — responsabilità distinte

```text
OPERATORE (voce / interfaccia)
    |
    v
LIVELLO CONVERSAZIONALE
- ASR/speech-to-text, comprensione linguaggio naturale, dialogo,
  chiarimenti contestuali, TTS, gestione delle interruzioni
    |
    v
ORCHESTRATORE / MOTORE DETERMINISTICO
- stato di operazione e step, transizioni, prerequisiti, rami,
  checklist/verifiche, conferme, arresti, recupero sessione
    |
    +---------------------+
    |                     |
    v                     v
KNOWLEDGE BASE VALIDATA   POLICY DI SICUREZZA
- passi e condizioni      - guardie fail-closed
- varianti per modello    - no autorizzazioni implicite
- fonti e revisioni       - stop e instradamento tecnico
    |                     |
    +----------+----------+
               v
OUTPUT CONTROLLATO (risposta tecnica + prossimo stato + registro)
```

**Regola di autorità:**
- **Knowledge Base:** contenuti tecnici, fonti, revisioni, condizioni di validità, limitazioni. Le istruzioni approvate dell'esperto sono autorevoli soltanto nel loro ambito.
- **Motore deterministico:** decisione su quando si può procedere, cambiare ramo, registrare «Fatto», saltare o sospendere; è responsabile della sicurezza e dello stato.
- **AI conversazionale:** comprende e risponde con naturalezza, usando soltanto le istruzioni autorizzate e gli esiti dei controlli; **non può** modificare il workflow in autonomia o inventare valori.
- **Voce:** modalità primaria desiderata per il lavoro a mani libere; lo schermo resta alternativa e supporto. Non promettere microfono sempre attivo a schermo bloccato: Safari/iOS impone limiti reali.

**Non confondere i tre stati del sistema:** sorgenti PWA GitHub, contenuti validati del Worker e Worker effettivamente distribuito su Cloudflare non sono sinonimi.

### Sicurezza / regole tecniche permanenti

- Un dato modello-specifico (coppia di serraggio, quantità di olio, grado/codice candela, limiti di usura ecc.) richiede identificazione e fonte verificata; non usare valori generici inventati.
- *Validato con condizioni* non significa *autorizzato universalmente* né *attivato nell'AI*.
- Le segnalazioni di anomalia non confermano un passaggio e non devono avanzare senza autorizzazione.
- Eliminare ripetizioni verbali inutili, conservando le guardie di sicurezza rilevanti.
- L'affilatura della lama è **opzionale** nel tagliando gratuito e subordinata a strumenti, capacità e condizioni adeguate.
- Diagnosi avanzata e riparazioni sono percorsi **distinti** dalla manutenzione preventiva, anche nella KB e nella futura offerta commerciale.

## 3. Fasi di prodotto e roadmap di riferimento

Questa è una **mappa di dipendenze e risultati**, non una decisione automatica sul prossimo commit. L'ordine fine dei lavori, i compromessi e le priorità si definiscono con l'utente dopo aver verificato lo stato attuale. Non aprire autonomamente nuove fasi solo perché appaiono in tabella.

| Livello | Risultato verificabile | Situazione al checkpoint |
|---|---|---|
| **M0 — Visione e perimetro** | Pubblico, freemium, primo caso d'uso, sicurezza, limiti di costo e definizione dell'assistente AI | **Decisioni di prodotto definite** |
| **M1 — Prototipo di interazione** | PWA con guida sequenziale, TTS/ASR, comandi base, segnalazioni, registrazione e ripresa | **PWA v0.12.1 esistente**, non ancora l'AI target; test su iPhone/Safari con limiti noti |
| **M2 — Fondazione tecnica per l'AI** | Gateway sicuro, KB strutturata, revisioni esplicite, test, fail-closed, tracciabilità | **Fase 14 svolta**, Fase 15 **in corso**: 24/53 validati con condizioni, 29 da validare |
| **M3 — Integrazione dell'esecuzione** | Il controller usa la KB validata, gestisce stato e percorsi senza duplicare regole in codice/UI; test di sicurezza e continuità | **Avviato laboratorio M3 filtro aria** [PR #45](https://github.com/Lupus227/tagliando/pull/45), CI Success e nuova console Access; **Cloudflare/UI da collaudare**. Nessun controller generale né AI già attivi; Issue #37 ancora aperta |
| **M4 — Assistente AI conversazionale** | Domande libere, chiarimenti situati, tool/KB retrieval controllati, ragionamento linguistico non autorizzativo, stop su incertezza | **Non attivo**; Worker non eroga risposte tecniche generate; abilitazione solo dopo gate esplicito e prove |
| **M5 — Validazione end-to-end** | Sessione tagliando sicura con voce e schermo, test su iPhone/Safari, rumore/interruzioni, rami, ripresa, anomalie, utenti pilota | **Non ancora superata come prodotto completo**; collaudi parziali disponibili |
| **M6 — Estensione e modello commerciale** | Altre macchine, moduli diagnosi/riparazioni e sperimentazione della monetizzazione freemium | **Visione definita, sviluppo futuro** |

**Vincoli fra livelli:** si possono *progettare* M3/M4 mentre M2 progredisce, ma l'AI non può utilizzare istruzioni tecniche non validate né essere presentata come pronta senza controlli. Prima di introdurre un'infrastruttura per un singolo ramo, verificare se esiste una soluzione generale e riutilizzabile. I test del backend non sostituiscono le prove dell'app su macchina/browser.

## 4. Debito e nodi reali che non vanno dimenticati

**Open issue ufficiali al checkpoint:** [#1](https://github.com/Lupus227/tagliando/issues/1) ripetizioni inutili; [#2](https://github.com/Lupus227/tagliando/issues/2) affilatura facoltativa; [#3](https://github.com/Lupus227/tagliando/issues/3) riconoscimento fissaggi e coppie verificabili; [#37](https://github.com/Lupus227/tagliando/issues/37) domanda candela seminuova / OP04. Controllare sempre le issue *live* prima di dichiarare qualcosa risolto.

**Registro OPEN-01–OPEN-07:** vedi [REGISTRO_PROGETTO.md](REGISTRO_PROGETTO.md), sezione E. Particolare attenzione a:
- **OPEN-01:** nella PWA una segnalazione *manuale* può avanzare alla lavorazione successiva, mentre quella vocale si sospende senza avanzare;
- **OPEN-02/05:** controlli incrociati e guardie dinamometriche ancora da collaudare a livello di motore di esecuzione;
- **OPEN-03:** 29/53 passi ancora da validare;
- **OPEN-06:** `reviewScope` è cumulativo e poco leggibile, non rappresenta l'ultimo passo;
- **OPEN-07:** la KB contiene la scelta Sì/No/Non so per la candela; la **PWA non la esegue ancora** e non ne garantisce persistenza/ramificazione. Vincolo GOV-15 vigente prima di dichiarare OP04 completa / iniziare F15.26; se si cambia la sequenza occorre una **nuova decisione esplicita**.

**Disallineamento architetturale attuale:** `app.js` ha istruzioni locali di prototipo; le istruzioni revisionate abitano il ledger del Worker. **Non aggiornare a mano decine di copie** come strategia permanente: l'integrazione dovrebbe rispettare un'unica fonte tecnica e preservare il comportamento fail-closed. La scelta dell'implementazione concreta non è stata ancora finalizzata.

## 5. Criteri di avanzamento e stop

Un intervento è **utile** se produce almeno uno dei seguenti effetti osservabili:
1. abilita un comportamento necessario dell'assistente target (non solo nuova documentazione);
2. riduce un rischio tecnico/sicurezza dimostrabile;
3. migliora qualità/tracciabilità delle conoscenze necessarie all'AI;
4. verifica un'ipotesi importante di fattibilità, usabilità o valore.

Ogni attività deve dichiarare: **milestone servita**, risultato misurabile, prerequisiti, cosa resta fuori scope, test di accettazione e se cambia KB / PWA / runtime / Cloudflare. Evitare PR/commit/deploy ripetitivi senza valore proporzionato; aggregare modifiche omogenee quando non pregiudica sicurezza e tracciabilità.

### Gate per la prima versione significativa

- [ ] Le procedure che l'AI può citare sono revisionate e correttamente limitate per condizioni/modello.
- [ ] Un controller deterministico applica davvero i prerequisiti e gli arresti, senza aggiramento manuale/vocale.
- [ ] Le domande libere ricevono risposte tratte dalle fonti autorizzate, con gestione esplicita di «non so» e casi fuori ambito.
- [ ] Stato e sessione si conservano attraverso navigazione, ripresa e interruzioni; anomalie non implicano conferma.
- [ ] Collaudi end-to-end su iPhone/Safari e scenari positivi/negativi; l'assistente non dichiara in modo falso un'operazione compiuta.
- [ ] Valutazione concreta dell'utilità per il pubblico target e del costo d'uso.

Questi sono **criteri di prodotto**, non una dichiarazione che siano già soddisfatti.

## 6. Decisioni di priorità aggiornate il 2026-11-10

Il titolare ha scelto di **mettere temporaneamente da parte Emergent** e proseguire con lo stack attuale. Prima di completare i restanti 29 passi, si verifica una **piccola integrazione reale** della KB validata, usando la procedura filtro aria OP03; la CI del laboratorio in staging è passata ([PR #45](https://github.com/Lupus227/tagliando/pull/45)), ma manca il collaudo Cloudflare/browser. **Questa è una prova di accesso ai contenuti approvati, non un LLM attivo.** Dopo il collaudo, progettare e scegliere esplicitamente la prima integrazione AI conversazionale con controllore deterministico, mantenendo la sicurezza fail-closed e i costi bassi.

### Decisioni che rimangono aperte


**Non procedere automaticamente con nuove funzioni oltre al laboratorio scelto.** Al prossimo incontro vanno discussi esplicitamente: modalità e ordine della validazione dei 29 passaggi; architettura generale per unire PWA e KB; ordine fra completamento del gate OP04 e progettazione del motore di esecuzione riutilizzabile; definizione della prima prova AI e dei criteri di sicurezza; strategia dei test sull'utente. Conservare nel frattempo gli impegni già approvati, senza interpretarli come un'autorizzazione indefinita a modificare il runtime.

## 7. Governance della continuità

1. **Inizio di ogni nuova chat:** leggere [CHECKPOINT_RIPRESA.md](CHECKPOINT_RIPRESA.md), **questo documento**, [REGISTRO_PROGETTO.md](REGISTRO_PROGETTO.md) e le issue aperte; verificare lo stato live dei rami. Prima di agire, mostrare un riepilogo breve e chiedere/attendere l'obiettivo della sessione se non già indicato.
2. **Prima di modifiche:** confrontare l'intervento con la missione, le decisioni approvate e i gate; non adottare una strada diversa solo perché una singola issue è complessa.
3. **Fine della chat / prima di una nuova:** aggiornare registro, checkpoint, issue rilevanti, PR/commit/CI/deployment confermati e punto esatto di ripresa; non inventare lo stato di Cloudflare da GitHub.
4. **Conflitti:** contenuti tecnici = revisioni esplicitamente approvate nel ledger + fonti; stato deploy = ultimo JSON effettivamente confermato; visione = questa roadmap e decisioni utente successive; registro = storia/governance; issue = lavoro aperto, non una nuova approvazione.
5. Nessuna memoria o chat permette di **garantire identità byte-per-byte del contesto** fra conversazioni: la continuità va ricostruita da **file persistenti e verificabili**. Se i file non sono accessibili, dichiararlo prima di procedere; non immaginare contenuti mancanti.

**Nota:** le milestone M0–M6 organizzano il progetto in modo coerente con la visione concordata. L'ordine operativo successivo e qualunque modifica di strategia richiedono una decisione esplicita del titolare.
