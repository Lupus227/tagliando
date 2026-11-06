# Cloudflare Worker — Fase 14.4 (staging, senza AI)

## Stato
Il backend staging è pubblicato su Cloudflare dal ramo dev/fase14-ai. Il ramo main non è stato modificato.
Nessun provider LLM è integrato. La PWA v0.12.1 resta su main.
Non inserire chiavi Cloudflare, GitHub o LLM nel repository pubblico.

## Moduli
- src/index.mjs: endpoint GET /health, POST /api/assist; richieste max 2048 byte e domande max 500 caratteri.
- src/access.mjs: verifica JWT Access RS256 firmato, issuer, audience e scadenza attraverso JWKS.
- src/policy.mjs: stop cautelativi, richieste fuori ambito e dati modello-specifici.
- ../wrangler.jsonc: configurazione di deployment alla radice (Cloudflare Build command predefinito).
- wrangler.jsonc: configurazione equivalente per gli sviluppatori che lavorano da /worker.
- tests/worker.test.cjs: test con chiavi RSA generate localmente solo per collaudo.

## Protezioni
- La comunicazione a servizi AI esterni NON è implementata.
- Cloudflare Access protegge tutte le richieste al Worker staging; la protezione deve essere mantenuta.
- L'endpoint assist richiede CORS ristretto, Access JWT valido e RATE LIMITER. CORS da solo NON autentica.
- Rate limiter di esempio: 10 richieste/minuto per utente e per località Cloudflare; non è un tetto di spesa globale.
- Se fonte tecnica non revisionata: PENDING_VALIDATION / HTTP 503, non istruzioni AI.
- La classificazione per parole chiave non è una diagnosi completa né una validazione di sicurezza.
- Il Worker non cambia stato dei passaggi, non archivia richieste e non genera ticket.
- Non fidarsi di fonti inviate dal browser: prima di AI servirà una base canonica revisionata sul server.
- SERVICE_MODE=guarded permette soltanto chiamate Access-autenticate, verificate con AUD, limitate e prive di AI.

## Requisiti per il collaudo protetto
1. Attivare Zero Trust/Access nell'account e limitare l'accesso al solo collaudatore.
2. Proteggere il Worker tramite la pagina Access del Worker (tutti gli URL, senza bypass pubblico).
3. Impostare ACCESS_TEAM_DOMAIN e ACCESS_AUD in base all'app Access creata; non sono password.
4. Verificare che namespace_id del rate limiter non sia già utilizzato.
5. Confermato: la route staging è protetta e SERVICE_MODE=guarded è abilitato per il solo collaudo.
6. Provare autenticazione, CORS e funzionamento su iPhone Safari: cookie cross-site e preflight
   potrebbero impedire chiamate dalla PWA GitHub Pages.
7. Mai caricare una chiave LLM su GitHub. Per il futuro usare Workers Secrets.
8. Per AI a consumo aggiungere limiti globali di budget a prova di concorrenza; il rate limit locale non basta.

## Test
Con Node.js 22+: node --test tests/*.test.cjs
Con Wrangler installato: npx wrangler dev --config worker/wrangler.jsonc
Il Worker applicativo è distribuito su Cloudflare ed è protetto con Cloudflare Access.
L'integrazione Git è collegata e le build automatiche sono abilitate sul ramo dev/fase14-ai.
Usare le build Git Cloudflare; non eseguire deploy manuali né modificare il ramo main.

## Privacy
Le domande non sono conservate dal codice della fase. Cloudflare può comunque raccogliere
metadati di traffico; per il servizio pubblico servirà una politica sulla privacy.

## Rollback
Non fare merge nel ramo main. La PWA già pubblicata e la sessione iPhone restano immutate.

NOTA: il valore workers_dev=true mantiene l'URL workers.dev esistente. Prima di ogni deployment verificare che la protezione Access 'All traffic' rimanga applicata a questo Worker. Il repository non contiene account_id o credenziali.

### Cloudflare Workers Builds — interfaccia novembre 2026
La schermata Production di Settings > Builds non mostra necessariamente Deploy command.
Il comando predefinito registrato durante Connect è npx wrangler deploy.
Con Root directory = '.', Wrangler ora trova la configurazione ../wrangler.jsonc
posta alla radice del repository (da qui raggiunta come wrangler.jsonc).
Le due configurazioni devono restare equivalenti; il test CI ne verifica la coerenza.
Non utilizzare il Preview command per un deployment di produzione.
Build di produzione abilitate dall'utente per il primo collaudo protetto; esaminare sempre il risultato in Cloudflare prima del test /health.

### Primo deployment controllato — 2026-11-02
Cloudflare Access All traffic è stato verificato tramite accesso in navigazione incognito.
Production branch Cloudflare: dev/fase14-ai, Root directory: / (repository root).
Deploy command: npx wrangler deploy --config worker/wrangler.jsonc.
L'API /api/assist è disponibile esclusivamente in modalità guarded, senza modelli AI. L'endpoint /health non utilizza AI.
Questo aggiornamento documentale genera un commit sul ramo sperimentale per attivare una build.
Verificare il risultato nella scheda Deployments > View build history del Worker.

### Collaudo autenticazione (Fase 14.5, successiva alla build Access)
- GET /api/auth-check: usa prima l'identità autenticata nativamente da Cloudflare (`ctx.access`) con confronto rigoroso dell'AUD atteso. Solo quando `ctx.access` è assente accetta un JWT firmato e ne verifica RS256, issuer, AUD e scadenza.
- Senza contesto Access autenticato né JWT valido, ritorna HTTP 401 con codice ACCESS_VERIFICATION_FAILED; non espone soggetto né token. Un AUD nativo errato NON può essere aggirato tramite JWT fallback.
- Con token valido, ritorna HTTP 200 e JSON {ok:true,accessVerified:true,aiEnabled:false,modelRequests:0,sessionChanged:false}.
- Nella fase 14.5 SERVICE_MODE era disabled; nella fase 14.6 è guarded, ma nessuna chiamata AI è implementata.
- Per il collaudo manuale, autenticarsi nel browser sul dominio Worker e aprire /api/auth-check.
- Se compare HTTP 401 dietro Access dopo login, raccogliere soltanto codice di errore e log generico, mai incollare cookie o JWT in chat.
- In modalita guarded, il rate limiter usa `user_uuid` (o service_token_id) ottenuto dal contesto Cloudflare; se manca un identificativo affidabile, la richiesta viene rifiutata.
- Riprova anche l'indirizzo in incognito: prima dell'autenticazione deve comparire il login Cloudflare.

### Fase 14.6 — Collaudo API reale tramite console protetta
- Origin della console: https://tagliando-ai-staging.maico-gua.workers.dev (SELF_TEST_ORIGIN immutabile).
- GET /test: pagina HTML Access-autenticata, fruibile soltanto con SERVICE_MODE=guarded.
- GET /test/runner.js: script di test same-origin, con CSP restrictiva e senza lettura di cookie o token.
- POST /api/assist: resta il solo percorso applicativo; accetta Origin GitHub Pages oppure esclusivamente l'Origin della console sullo stesso Worker di staging.
- Ogni POST richiede identità Access valida, AUD corretto, limitazione per utente e body JSON valido.
- Scenari: SAFETY_STOP (200), MODEL_REQUIRED (200), OUT_OF_SCOPE (200), PENDING_VALIDATION (503).
- Nessuna API AI, chiave LLM, salvataggio richiesta o mutazione di sessione.
- Test su PWA GitHub Pages rinviato: Cloudflare Access può bloccare i preflight OPTIONS e i cookie di terze parti; non aprire bypass a cuor leggero.
- Se si sospende il collaudo, ripristinare SERVICE_MODE=disabled in entrambi i file Wrangler.


### Fase 14.7 — Copia PWA protetta per il primo test end-to-end
- Endpoint: GET /pilot/ (solo Worker staging con Cloudflare Access attivo).
- Copia immutabile di 8 file PWA dal ramo dev, fotografati al commit e21c22e;
  i test confrontano **byte per byte** lo snapshot con i file sorgente del repository.
- Non richiede modifiche a main, all'interfaccia della PWA pubblica, a voice.js,
  support.js o ai comandi di avanzamento/conferma delle operazioni.
- Sul Worker la copia è su un ORIGIN diverso da GitHub Pages: non condivide
  localStorage o Service Worker con la PWA pubblica.
- Per evitare cache non valide e confusione con la versione pubblica, il pilot
  applica Cache-Control: no-store e CSP con worker-src 'none'; non installare il
  pilot come app né usarlo per svolgere manutenzione reale.
- Un pannello aggiuntivo consente quattro DOMANDE FISSE, inviate manualmente
  con POST /api/assist alla STESSA origine, senza inviare dati macchina,
  note, identificativi della sessione o registrazioni vocali.
- Ogni risposta è mostrata con textContent; non modifica passi,
  registri, anomalie, metodi o stato vocale.
- Nessun collegamento cross-origin è stato abilitato dalla PWA pubblica;
  la documentazione Cloudflare conferma la criticità del preflight OPTIONS con
  Access e dei cookie di terze parti, soprattutto su Safari.
- /pilot/ funziona solo se SERVICE_MODE=guarded, SELF_TEST_ORIGIN combacia con
  il dominio workers.dev previsto e il token/access context supera la verifica.
- Per rollback: riportare SERVICE_MODE=disabled oppure rimuovere il mount /pilot/
  nel ramo dev; non intervenire su main.
- Esito Browser Cloudflare e prova iPhone: DA COLLAUDARE.

### Fase 14.8 — Chiusura microfono Safari, collaudo
- Problema segnalato: «Ferma dialogo» arrestava la sintesi ma non dava conferma
  di rilascio del riconoscimento audio su iPhone Safari.
- Correzione isolata in voice.js del ramo dev: invalidazione ciclo e risultati
  precedenti, abort(), attesa di onend, tentativo stop() dopo 1,2 s se necessario.
- Non si permette un nuovo ascolto mentre l'istanza è in chiusura.
- Se Safari non emette onend entro 4 s, la UI suggerisce di chiudere la scheda;
  la possibilità di riavvio resta bloccata per sicurezza.
- La scritta «Riconoscimento vocale terminato» segnala l'evento onend della
  Web Speech API, non certifica la disattivazione dell'indicatore privacy iOS.
- Snapshot /pilot/ aggiornato esclusivamente per voice.js. Le altre
  procedure, il motore backend e la PWA pubblica non cambiano.
- Interazione reale iPhone dopo deployment: DA VERIFICARE.

### Fase 14.9 — Archivio canonico lato server (revisione NON ancora effettuata)
- Il Worker contiene ora worker/src/canonical-knowledge.mjs: copia completa e
  immutabile del catalogo 8 procedure / 53 passaggi, ricavata da app.js/OP e
  verificata campo per campo contro knowledge.js tramite test automatici.
- Stato di TUTTI i passaggi: DA_VALIDARE. Stato di ogni procedura: DA_VALIDARE.
  Quindi 0/53 istruzioni tecniche sono approvate per risposte online.
- Il catalogo comprende ID stabili, passaggi, precauzioni, varianti di metodo,
  contesto, provenienza testuale e campi di revisione.
- L'API /api/assist continua a fornire soltanto risposte deterministiche
  cautelative, comandi non operativi e PENDING_VALIDATION; NON espone il catalogo.
- Il Worker interrompe le risposte se il catalogo è incoerente con lo snapshot.
- GET /api/knowledge-status: richiede Cloudflare Access e SERVICE_MODE=guarded;
  restituisce esclusivamente schema, versione e numeri di revisione, non istruzioni.
- Non è possibile approvare un passaggio modificando un parametro della PWA:
  la revisione richiederà una modifica tracciata lato backend, una fonte tecnica
  adeguata e una nuova verifica dei rischi.
- Non sono stati aggiunti modelli AI, connessioni esterne, storage, segreti o
  nuove funzioni alla PWA pubblica/voice.js/pilot.js.
- Accettazione fase 14.9: CI + deployment Cloudflare + controllo protetto
  /api/knowledge-status con 8/53/0 approvazioni.
- Passo successivo: revisione tecnica guidata delle singole procedure,
  dando priorità a prerequisiti di sicurezza e dati modello-specifici.

### Fase 15.1 — Revisione tecnica condizionata del passaggio RASA-OP-01-P01
- Approvazione esplicita dell'esperto del testo «Preparazione e messa in
  sicurezza» (2026-11-04), senza modifiche richieste. Revisione F15.1-R1.
- Evidenze: manuali ufficiali Toro (arresto parti mobili, isolamento candela,
  raffreddamento e disattivazione avviamento elettrico ove presente).
- Nuovo registro immutabile worker/src/review-ledger.mjs con testo
  approvato, condizioni di arresto, ambito, date e fonti citabili.
- Validazione condizionata LIMITATA a sicurezza generale preparatoria,
  NON è attestazione di applicabilità a ogni modello. I dispositivi di
  avviamento elettrico e l'orientamento fisico richiedono il manuale effettivo.
- Il catalogo originario 14.9 resta IDENTICO alla PWA (53/53 DA_VALIDARE);
  l'approvazione viene applicata come overlay di revisione sul Worker:
  passaggi validati con condizioni 1/53, in attesa 52/53.
- GET /api/knowledge-status restituisce solo contatori e ID revisionato.
  Nessuna nuova route legge o fornisce istruzioni. /api/assist NON usa il
  testo approvato ed esegue ancora i controlli safety deterministici.
- AI non attiva; nessun costo, provider, segreto, mutazione di sessione,
  modifica a voice.js, /pilot, main o PWA pubblica.
- Test: snapshot, registro immutabile, tentativi di approvazione falsa,
  status Access e mancata esposizione del testo.
- Confermare Deployments e /api/knowledge-status nel collaudo live prima
  di dichiarare distribuita la fase 15.1.

### Fase 15.2 — Accesso al sottoscocca (F15.2-R1)
- Testo finale approvato dall'esperto in chat il 2026-11-04.
- 45 gradi: riferimento pratico indicativo e NON soglia universale o certificata.
  Inclinazione progressiva solo con orientamento compatibile e sostegno stabile.
- Candela anteriore: possibile inclinazione posteriore della macchina mantenendo
  la candela in alto; controllare carburatore, filtro, condizioni del motore.
- Posizione verticale: ammessa soltanto su modelli predisposti e nel rispetto
  delle istruzioni specifiche del costruttore.
- STOP: perdite di olio/carburante, instabilita, incompatibilita della configurazione.
  L'assenza di perdite visibili non dimostra di per se la sicurezza.
- Registro server aggiornato a 2 revisioni CONDIZIONATE su 53; 51 ancora da
  validare. Catalogo sorgente 53/53 DA_VALIDARE mantenuto intatto.
- Nessuna API di istruzioni, AI, modifica a main, voice.js o pilot.
- Deployment Git e lettura /api/knowledge-status devono essere collaudati.

### Fase 15.3 — Rimozione delle incrostazioni (F15.3-R1)
- Testo di officina confermato: spatola in acciaio rigida, bordo non affilato,
  varie misure; pressione adeguata a distaccare croste vegetali e terra.
- Conservate precauzioni sul tagliente, appoggio sulla lama, danni strutturali
  e stabilita della macchina.
- Rimossa su esplicita richiesta dell'esperto l'istruzione aggiuntiva che
  proponeva un metodo alternativo in caso di incrostazioni non rimovibili.
- Revisione condizionata: 3/53 approvate, 50 in attesa. AI ancora disabilitata.
- Nessuna modifica a main, PWA pubblica, voice.js o catalogo fonte.

### Fase 15.4 — Pulizia finale del sottoscocca (F15.4-R1)
- Revisione dell'esperto approvata il 2026-11-05 e registrata nel registro
  tecnico: aria compressa senza richiedere regolazione della pressione,
  lavaggio quando ammesso dal costruttore con tubo e pistola da giardino.
- Idropulitrice: documentata solo come pratica di officina per incrostazioni
  resistenti, non istruzione proposta al privato ne all'AI.
- Asciugatura lasciata al passaggio distinto RASA-OP-01-P05.
- Stato revisioni condizionate 4/53; in attesa 49/53. Catalogo originale
  invariato e AI disabilitata.
- Corretto il controllo del registro per la data dell'approvazione 15.4.
- Nessuna modifica a main, PWA pubblica, pilot o voice.js.

### Fase 15.5 — Asciugatura del sottoscocca (F15.5-R1)
- Approvazione esperto 2026-11-05: metodi A aria compressa, B asciugatura
  naturale, C avvio motore dopo ripristino completo nella normale posizione.
- Metodo C esclusivamente all'aperto, su superficie liscia e solida (cemento
  o piastrelle) libera da pietre, erba e detriti proiettabili dalla lama.
- Proteggere pavimentazioni delicate dal possibile sgocciolamento di acqua sporca.
- Funzionamento indicativo 5–10 minuti, sempre sorvegliato; non bloccare la
  leva presenza operatore, non avviare macchina inclinata o in ambienti chiusi.
- Su esplicita richiesta eliminata la clausola generica "se il modello lo consente";
  la durata resta una stima d'officina, non una specifica universale.
- Cinque revisioni condizionate su 53; 48 in attesa, AI disabilitata.
- Nessuna modifica al catalogo fonte, main, PWA pubblica o componente voce.

### Fase 15.6 — Controllo della scocca (F15.6-R1)
- Approvazione esplicita dell'esperto in data 2026-11-05. Ispezione dopo
  pulizia/asciugatura: residui, scocca metallica o plastica, condotti, protezioni
  e punti di fissaggio.
- Ruggine superficiale comune: non implica da sola arresto o riparazione.
  Corrosione passante, perforazioni o perdita significativa di spessore
  richiedono valutazione di un meccanico specializzato.
- Classificazione: scocca integra (nessun intervento); difetti superficiali
  (annotare senza arresto automatico); danni strutturali o di sicurezza
  (registrare anomalia, sospendere utilizzo, richiedere intervento specialista).
- Riparazioni escluse dall'operazione ordinaria di pulizia. Il catalogo
  originale e i metadati "DA_VALIDARE" non sono modificati.
- Tutti i 6 passaggi di RASA-OP-01 sono revisionati con CONDIZIONI; l'eventuale
  approvazione della procedura nel suo insieme e il rilascio AI sono distinti.
- 6/53 passaggi revisionati condizionatamente, 47 ancora in attesa; AI,
  retrieval e generazione restano disabilitati.
- Nessuna modifica a main, PWA pubblica, sistema vocale o pilot.

### Fase 15.7 — Messa in sicurezza per affilatura lama (F15.7-R1)
- Passaggio RASA-OP-02-P01 approvato dall'esperto il 2026-11-06.
  Confermata ripetizione intenzionale delle precauzioni di sicurezza quando
  una nuova operazione viene avviata direttamente senza eseguire le precedenti.
- Motore arrestato, lama completamente ferma, componenti caldi raffreddati,
  pipetta candela isolata; disabilitare avviamento elettrico dove presente
  secondo il costruttore; guanti e sostegno stabile.
- Inclinazione/accesso: rinvio alle revisioni RASA-OP-01-P01/P02, senza
  attribuire nuova approvazione o bypassare condizioni di orientamento.
- Bloccaggio lama e smontaggio non autorizzati da questo passo: trattati
  nei passaggi successivi dell'operazione di affilatura.
- Il catalogo originale resta immutato; 7/53 revisioni condizionate,
  46 passaggi ancora in attesa. /api/assist non esegue retrieval tecnico,
  nessun provider AI, attivazione o modifica della PWA pubblica.
