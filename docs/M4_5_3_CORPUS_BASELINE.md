# M4.5.3 — Corpus realistico OP03 e baseline offline

**Ambito autorizzato:** prove e documentazione su `dev/fase14-ai`, dopo M4.5.2. Nessuna nuova funzione utente, route, inferenza LLM, modifica KB, PWA o configurazione Cloudflare.

## 1. Finalità e fonti

Misurare i limiti del mapping esatto `mapQuestionToReviewedEvidence()` su domande plausibili per l'operazione OP03 (filtro aria di rasaerba a benzina). Il codice M4.5.2 conserva la provenienza di sette passaggi `VALIDATO_CONDIZIONATO`, tutti con `aiUseAllowed=false`.

**Attenzione:** le 40 domande sono state **redatte per il test**, non raccolte da utenti reali. Il corpus è piccolo e volutamente bilanciato per categoria; le metriche non rappresentano accuratezza generale, robustezza sul campo o sicurezza certificata.

- Dati di prova: `tests/fixtures/m453-op03-realistic-questions.json`.
- Regressione e report in console: `tests/m453-realistic-corpus.test.cjs`.
- Funzioni osservate, **non modificate**: `worker/src/m452-question-mapper.mjs`, `worker/src/m45-reviewed-evidence.mjs`, `worker/src/filter-lab.mjs`.

Esecuzione: `node --test tests/m453-realistic-corpus.test.cjs`. In CI, il workflow esistente lancia `node --test tests/*.test.cjs` e il dry-run Wrangler. La riga `M4.5.3 BASELINE OFFLINE` contiene il sommario JSON delle metriche. Un esito `Success` dimostra solo il superamento di questi test offline, non un deployment su Cloudflare.

## 2. Disegno del corpus

| Categoria | N. | Etichetta/oracolo |
|---|---:|---|
| Riconoscibili, formulazione curata | 12 | `goldStepId` e `QUESTION_MAPPED_TO_REVIEWED_EVIDENCE` |
| Parafrasi plausibili semanticamente collegate | 12 | `goldStepId` distinto dalla decisione attuale: 11 `QUESTION_NOT_MAPPED`, 1 `MODEL_REQUIRED` **erroneo** |
| Ambigue o incomplete | 6 | 3 `QUESTION_AMBIGUOUS` + 3 `QUESTION_NOT_MAPPED` |
| Anomalie / rischi | 5 | 3 `SAFETY_STOP` + 2 `OPERATOR_STOP` |
| Specifiche dipendenti dal modello | 3 | `MODEL_REQUIRED` |
| Fuori ambito | 2 | `OUT_OF_SCOPE` oppure `QUESTION_NOT_COVERED` |
| **Totale** | **40** | Contesto e decisione esplicitati per singolo caso |

`goldStepId` è l'etichetta editoriale della fonte potenzialmente pertinente, **non** un'autorizzazione a rispondere; nelle richieste ambigue/rischiose il valore è `null`. `focus` codifica il bisogno informativo per una futura valutazione di estratti mirati: non contiene né autorizza nuovi testi tecnici.

## 3. Metodo di misurazione

- **Precisione del mapping:** match con la fonte corretta / tutti i match accettati. Un match conta solo quando `source.stepId=goldStepId`.
- **Copertura delle domande interpretabili (recall nel corpus):** match corretti / 24 domande con `goldStepId` (12 esatte + 12 parafrasi).
- **Copertura parafrasi:** match corretti / 12 parafrasi; non confondere l'astensione sicura con comprensione semantica.
- **Blocchi critici:** esito di blocco e codice corretto per ciascuno degli 8 casi safety/model-specific.
- **Astensione su richieste non eleggibili:** 16 richieste senza `goldStepId` respinte senza `source` o `content`.
- **Granularità:** tutte le evidenze accettate sono anteprime **integrali e identiche** allo step; nessun estratto sintetico e nessuna risposta dialogica. Confronto byte-per-byte del contenuto con il ledger.
- **Invarianti di sicurezza in tutti i 40 casi:** zero chiamate al modello, `maySendToModel=false`, `aiEnabled=false`, `allowCompletion=false`, `sessionChanged=false`, `authorizesMaintenance=false`.

## 4. Baseline attesa dal comportamento M4.5.2

| Metrica | Atteso |
|---|---:|
| Domande riconosciute | 12/40 |
| Domande rifiutate | 28/40 |
| Match corretti / match accettati | 12/12 = 100% |
| Copertura domande interpretabili | 12/24 = 50% |
| Copertura delle parafrasi | 0/12 = 0% |
| Falsi positivi `MODEL_REQUIRED` su parafrasi | 1/12 |
| Blocchi critici corretti | 8/8 |
| Astensione su richieste non eleggibili | 16/16 |
| Anteprime dello step completo | 12 |
| Risposte brevi mirate / estratti prodotti | 0 |
| Richieste a Workers AI | 0 |

Questi numeri sono **asserzioni di baseline**: diventano risultati di collaudo solo dopo CI `Success`. La precisione al 100% è limitata ai match accettati nel corpus curato; non certifica precisione su linguaggio libero. Analogamente, 8/8 blocchi critici non dimostrano copertura di ogni situazione pericolosa o di tutte le formulazioni.

## 5. Limiti e possibili miglioramenti successivi

1. **Riconoscimento:** il matching esatto gestisce le frasi note ma non comprende parafrasi libere. Per migliorare la recall servirà una strategia di selezione del riferimento, da considerare non fidata fino al controllo deterministico.
2. **Pertinenza della risposta:** le dodici corrispondenze visualizzano il **passo intero**; non isolano il singolo dettaglio richiesto. Un futuro estratto dovrebbe essere selezionato solo fra segmenti verificati, con citazione di revisione/scope e senza alterarne il significato tecnico.
3. **Contesto:** il set non verifica identificazione reale del modello macchina, prerequisiti fisici, storico conversazionale, continuità vocale, recupero di sessione né rumore dell'ASR.
4. **Sicurezza:** il controllo lessicale e il piccolo set di domande non sono barriere sufficienti per un'assistenza operativa generativa.

### Anomalia osservata durante la prima CI

La prima CI della PR #96 ha fallito sulla domanda **P12**, «Come verifico che il filtro sia montato correttamente?». L'atteso iniziale era `QUESTION_NOT_MAPPED`, ma il controllo esistente ha restituito `MODEL_REQUIRED`: la regex considera `che` seguito da `filtro` un indizio di richiesta modello-specifica. Non si tratta di una domanda sulle specifiche del costruttore: **falso positivo nella motivazione dell'astensione**. Il corpus conserva la frase originale, annota `knownIssue=FALSE_POSITIVE_MODEL_REQUIRED` e la baseline riproduce il comportamento osservato. Non viene cambiata la policy, che richiede approvazione separata.

### Addendum M4.5.3.1 — Correzione mirata (2026-11-18)

La **baseline originale M4.5.3** ha rilevato 1 falso positivo `MODEL_REQUIRED` sulla domanda P12. Il risultato precedente resta documentato come evidenza storica. La correzione successiva restringe l'interpretazione della parola `che`: non basta una congiunzione subordinante seguita da `il filtro`, mentre restano bloccate richieste esplicite come «Che filtro devo comprare?» e «Che olio devo usare?».

- Il corpus conserva testo e identificativo P12, con `knownIssue=FALSE_POSITIVE_MODEL_REQUIRED` e `resolvedIn=M4.5.3.1`; il nuovo esito atteso è `QUESTION_NOT_MAPPED`, quindi continua a **non** mostrare contenuti tecnici.
- I test `tests/m4531-model-required-regression.test.cjs` verificano frasi subordinate, richieste modello-specifiche, priorità stop e assenza di autorizzazioni.
- Le metriche della baseline comparabili restano 12 match / 28 rifiuti, 0/12 parafrasi riconosciute e 8/8 blocchi critici. **Falsi positivi `MODEL_REQUIRED` nei 12 casi di parafrasi: da 1 a 0**, nel solo corpus curato.
- Nessun ampliamento del mapping, nessun LLM o stato di sessione; le risposte tecniche restano non autorizzate.

**Gate invariati:** `aiUseAllowed=false` per OP03; `AI_FREE_MODE`, `AI_CHAT_MODE`, `AI_PROBE_MODE` disabilitati; nessuna risposta operativa né autorizzazione al completamento. M4.5.3 non implica permesso di attivare modelli, pubblicare endpoint o sviluppare il prossimo sottolivello.
