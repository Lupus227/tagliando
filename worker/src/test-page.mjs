/*
 * Fase 14.6 — Console di collaudo controllata, sullo stesso dominio del Worker.
 * Nessun input libero, nessuna chiave/cookie/token è letto o mostrato dal client.
 * Il server abilita questa risorsa soltanto in SERVICE_MODE=guarded e con Access.
 */
export const testPage = `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Tagliando — collaudo API protetta</title>
<style>
:root {color-scheme:light;font-family:system-ui,Arial,sans-serif}
body {max-width:740px;margin:32px auto;padding:0 18px;line-height:1.55;color:#17212b}
h1 {font-size:1.55rem}
p {max-width:68ch}
button {display:block;width:100%;margin:10px 0;padding:13px;text-align:left;cursor:pointer;border:1px solid #9aa7b5;border-radius:8px;background:#f6f8fb;color:#142030;font-size:1rem}
button:disabled {opacity:.55;cursor:wait}
pre {padding:16px;overflow:auto;white-space:pre-wrap;word-break:break-word;border-radius:8px;background:#f1f4f7}
small {color:#555}
</style>
</head>
<body>
<h1>Tagliando — Fase 14.6</h1>
<p>Console temporanea per verificare vere richieste <code>POST /api/assist</code> con autenticazione Cloudflare Access, limiti d'uso e risposte deterministiche. Nessun modello AI viene interrogato.</p>
<p><strong>Seleziona un solo test alla volta:</strong></p>
<button type="button" data-case="hazard">1 — Lama crepata (arresto di sicurezza)</button>
<button type="button" data-case="model">2 — Quanto olio? (specifiche modello necessarie)</button>
<button type="button" data-case="scope">3 — Cambio automobile (fuori ambito)</button>
<button type="button" data-case="pending">4 — Pulizia sottoscocca (procedura non validata)</button>
<p><strong>Risultato</strong></p>
<pre id="output" role="status" aria-live="polite">Seleziona un test.</pre>
<small>Ambiente staging protetto. Risposta HTTP 429: limite richieste raggiunto; evitare ripetizioni rapide. Non incollare cookie o token nel supporto.</small>
<script src="/test/runner.js" defer></script>
</body>
</html>`;
export const testRunner = `'use strict';
const scenarios = {
  hazard:{question:'La lama è crepata',expect:'SAFETY_STOP',status:200},
  model:{question:'Quanto olio devo mettere?',expect:'MODEL_REQUIRED',status:200},
  scope:{question:'Come si ripara il cambio di un automobile?',expect:'OUT_OF_SCOPE',status:200},
  pending:{question:'Come pulisco il sottoscocca?',expect:'PENDING_VALIDATION',status:503}
};
const output=document.getElementById('output');
const buttons=[...document.querySelectorAll('button[data-case]')];
for(const button of buttons){
  button.addEventListener('click', async()=>{
    const entry=scenarios[button.dataset.case];
    if(!entry)return;
    buttons.forEach(x=>x.disabled=true);
    output.textContent='Richiesta in corso…';
    try{
      const response=await fetch('/api/assist',{
        method:'POST',credentials:'same-origin',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({question:entry.question,operationId:1})
      });
      let payload;
      try{payload=await response.json()}catch(_){payload={code:'NON_JSON_RESPONSE'}}
      const passed=response.status===entry.status&&
        payload.decision===entry.expect&&payload.aiEnabled===false;
      output.textContent=JSON.stringify({
        test:button.textContent.trim(),
        esito:passed?'SUPERATO':'DA_VERIFICARE',
        httpStatus:response.status,
        atteso:{httpStatus:entry.status,decision:entry.expect},
        risultato:payload
      },null,2);
    }catch(error){
      output.textContent='ERRORE DI RETE: '+(error?.name||'FetchError')+
        '. Verifica la sessione Cloudflare e il deployment.';
    }finally{buttons.forEach(x=>x.disabled=false)}
  });
}`;
