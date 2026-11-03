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
