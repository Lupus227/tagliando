# Cloudflare Worker — Fase 14.4 (staging, senza AI)

## Stato
Il backend è presente soltanto nel ramo dev/fase14-ai, non è stato distribuito.
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
- Cloudflare Access deve essere attivato per proteggere l'intero Worker prima di pubblicare un indirizzo.
- L'endpoint assist richiede CORS ristretto, Access JWT valido e RATE LIMITER. CORS da solo NON autentica.
- Rate limiter di esempio: 10 richieste/minuto per utente e per località Cloudflare; non è un tetto di spesa globale.
- Se fonte tecnica non revisionata: PENDING_VALIDATION / HTTP 503, non istruzioni AI.
- La classificazione per parole chiave non è una diagnosi completa né una validazione di sicurezza.
- Il Worker non cambia stato dei passaggi, non archivia richieste e non genera ticket.
- Non fidarsi di fonti inviate dal browser: prima di AI servirà una base canonica revisionata sul server.
- La configurazione iniziale blocca tutte le chiamate /api/assist.

## Prima di un futuro collaudo Cloudflare
1. Attivare Zero Trust/Access nell'account e limitare l'accesso al solo collaudatore.
2. Proteggere il Worker tramite la pagina Access del Worker (tutti gli URL, senza bypass pubblico).
3. Impostare ACCESS_TEAM_DOMAIN e ACCESS_AUD in base all'app Access creata; non sono password.
4. Verificare che namespace_id del rate limiter non sia già utilizzato.
5. Soltanto dopo verifiche, configurare una route protetta e impostare SERVICE_MODE=guarded.
6. Provare autenticazione, CORS e funzionamento su iPhone Safari: cookie cross-site e preflight
   potrebbero impedire chiamate dalla PWA GitHub Pages.
7. Mai caricare una chiave LLM su GitHub. Per il futuro usare Workers Secrets.
8. Per AI a consumo aggiungere limiti globali di budget a prova di concorrenza; il rate limit locale non basta.

## Test
Con Node.js 22+: node --test tests/*.test.cjs
Con Wrangler installato: npx wrangler dev --config worker/wrangler.jsonc
Il Worker Hello World esiste su Cloudflare ed è protetto con Cloudflare Access.
L'integrazione Git è collegata, ma le build risultano disabilitate.
NON eseguire ancora wrangler deploy né attivare le build fino al controllo dei prerequisiti.

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
L'API /api/assist resta spenta tramite SERVICE_MODE=disabled. L'endpoint /health non utilizza AI.
Questo aggiornamento documentale genera un commit sul ramo sperimentale per attivare una build.
Verificare il risultato nella scheda Deployments > View build history del Worker.

### Collaudo autenticazione (Fase 14.5, successiva alla build Access)
- GET /api/auth-check: verifica all'interno del Worker firma RS256, issuer, AUD e scadenza del JWT Cloudflare Access.
- Senza token valido, ritorna HTTP 401 con codice ACCESS_VERIFICATION_FAILED; non espone soggetto né token.
- Con token valido, ritorna HTTP 200 e JSON {ok:true,accessVerified:true,aiEnabled:false,modelRequests:0,sessionChanged:false}.
- Non occorre abilitare SERVICE_MODE: rimane disabled e /api/assist resta disabilitato.
- Per il collaudo manuale, autenticarsi nel browser sul dominio Worker e aprire /api/auth-check.
- Se compare HTTP 401 dietro Access dopo login, raccogliere soltanto codice di errore e log generico, mai incollare cookie o JWT in chat.
- Riprova anche l'indirizzo in incognito: prima dell'autenticazione deve comparire il login Cloudflare.
