# M4.5.6 — Prima prova voce → Worker → voce nella PWA di staging

**Stato:** codice integrato in `dev/fase14-ai` mediante [PR #110](https://github.com/Lupus227/tagliando/pull/110), commit `87f0973`. [CI #45046111810](https://github.com/Lupus227/tagliando/actions/runs/45046111810) **Success**: 248/248 test Node, compilazione Wrangler `--dry-run`. **Deployment Cloudflare di M4.5.6 NON ancora confermato; collaudo browser/telefono da eseguire.**

## Obiettivo e vincoli

Dimostrare il percorso completo in una **copia già esistente della PWA v0.12.1** (`/pilot/` staging Access-protetto), non creare un secondo sistema checklist o un chatbot a regole fisse.

1. La domanda viene dettata con Web Speech API nel nuovo pannello isolato della copia PWA; in alternativa è scritta.
2. Il pannello legge **soltanto** operazione, tipo filtro, titolo del passo visibile e domanda, e li invia in POST `/api/lab/voice-bridge` allo stesso origin staging.
3. Il Worker autentica con Cloudflare Access, verifica origin, rate limit, schema/dimensione input e invoca le guardie M3/M4.5.2/M4.5.4 + fonte P03 F15.18-R2. Restituisce esclusivamente la risposta n. 01 già approvata **come testo**: «No. Il filtro in carta non deve essere lavato né oliato.»
4. La PWA mostra e tenta di leggere la risposta via sintesi vocale. Non conferma il passo e non altera la sessione. Se il browser blocca la voce automatica, è disponibile `Riascolta risposta`.

**Non è ancora conversazione AI libera:** questo primo test volutamente vincolato verifica il trasporto esistente e la selezione di una singola risposta approvata. `aiEnabled=false`, `modelRequests=0`, `canGenerate=false`, `allowCompletion=false`, `sessionChanged=false`, `maySendToModel=false`. Non è una guida autorizzata per operazioni fisiche.

## Collaudo dopo conferma del deployment

**URL:** https://tagliando-ai-staging.maico-gua.workers.dev/pilot/

1. Accedi con Cloudflare Access da browser supportato e apri la copia PWA. Le risorse del dialogo vocale esistente non vengono sovrascritte.
2. Scegli **Operazione 3 — Filtro aria**, tipo **Carta**, passaggio **Trattamento carta**. Ferma il dialogo vocale principale prima della prova per evitare due microfoni contemporaneamente.
3. Scorri al pannello **Prova vocale PWA → Worker → voce · M4.5.6**. Premi **Dettala** e pronuncia «Posso lavare il filtro in carta?». Alternativa: inserisci la domanda nel campo e premi **Chiedi al Worker**.
4. **Atteso positivo:** il pannello mostra esattamente «No. Il filtro in carta non deve essere lavato né oliato.» con riferimento `RASA-OP-03-P03 / F15.18-R2`, tenta di leggerlo; pulsante `Riascolta risposta` disponibile. Nessun passaggio viene segnato completato e nessuna anomalia è cancellata.
5. **Negativi:** domanda «La lama è crepata» → nessuna risposta tecnica (`SAFETY_STOP`); «Fatto» → nessuna risposta tecnica (`COMMAND`); domanda su altra operazione/metodo/passaggio → prova disabilitata dal contesto; «Come pulisco il filtro in carta?» → nessuna risposta breve, perché non coincide con il divieto di lavaggio.
6. **Browser Safari/iPhone:** annotare se il microfono riconosce la domanda e se la prima lettura TTS parte automaticamente o solo dopo aver premuto `Riascolta risposta`. Se iOS limita la sintesi vocale dopo fetch asincrono, questo è un limite di interazione da risolvere nel prossimo intervento, **non** un test passato.

**Riportare:** commit Cloudflare effettivamente distribuito, tipo dispositivo/browser, esito domanda positiva, esito negativo, risposta vocale e integrità dello stato del passo.

## Evidenze e confini

- Codice Worker: `worker/src/m456-approved-voice-bridge.mjs`, `worker/src/index.mjs`.
- UI: `worker/src/pilot-voice-bridge.mjs`, collegata da `worker/src/pilot.mjs` solo alla copia di staging.
- Prove automatiche: `tests/m456-staging-voice-bridge.test.cjs`; 5 nuovi test, totale CI 248.
- PWA pubblica GitHub Pages e file `voice.js`, `support.js`, `app.js` **non modificati**.
- KB v15.25.1 `aiUseAllowed=false`, modalità modello AI disabilitate e route pubblica `/api/assist` **invariati**.
- Ultimo deployment Cloudflare precedente dichiarato dal titolare: `b6df639` Success; **non confondere CI del nuovo commit con il suo deployment**.

## Passo successivo, dopo il test sul dispositivo

1. Se voce → Worker → voce è verificato, definire l'**integrazione nel dialogo vocale già esistente** della PWA, evitando un secondo bottone come soluzione finale.
2. Separare l'interpretazione libera tramite AI dalla selezione delle sole fonti/autorizzazioni consentite dal controllore. Fino a test di sicurezza e consenso esplicito, NON usare testi `EXPERT_APPROVED_TEXT_ONLY` come prompt ad un modello AI.
3. Estendere la copertura senza duplicare le regole della PWA in un nuovo catalogo operativo, e affrontare il precedente disallineamento terminologico P04 «lavabile» con una revisione tecnica separata.
