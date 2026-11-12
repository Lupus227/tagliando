/*
 * Access-protected staging UI / API. No free-form requests or state mutation.
 * To enable: explicit AI_PROBE_MODE='enabled' after CI and human review.
 */
import {runFixedM4Probe,aiProbeWindowValid} from './m4-ai-probe.mjs';

const STAGING='https://tagliando-ai-staging.maico-gua.workers.dev';
const headers={
 'Content-Type':'application/json; charset=utf-8',
 'Cache-Control':'no-store, max-age=0',
 'X-Content-Type-Options':'nosniff',
 'Referrer-Policy':'no-referrer',
 'X-Robots-Tag':'noindex, nofollow',
 'Vary':'Origin'
};
function result(decision,message){return {
 ok:false,decision,message,modelRequests:0,aiEnabled:false,
 canGenerate:false,allowCompletion:false,sessionChanged:false,references:[]};}
const json=(status,body)=>new Response(JSON.stringify(body),{status,headers});
async function readCase(request){
 if(!/^application\/json(?:\s*;.*)?$/i.test(request.headers.get('content-type')||''))
   return null;
 const declared=Number(request.headers.get('content-length'));
 if(Number.isFinite(declared)&&declared>128)return null;
 const reader=request.body?.getReader();
 if(!reader)return null;
 const chunks=[];let length=0;
 try{
   while(true){
     const {done,value}=await reader.read();
     if(done)break;
     length+=value.byteLength;
     if(length>128){await reader.cancel();return null;}
     chunks.push(value);
   }
   const arr=new Uint8Array(length);let i=0;
   for(const chunk of chunks){arr.set(chunk,i);i+=chunk.length;}
   const data=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(arr));
   if(!data||typeof data!=='object'||Array.isArray(data)||
     Object.keys(data).length!==1||typeof data.caseId!=='string'||
     !['paper-wash','cover-stuck','off-topic'].includes(data.caseId))return null;
   return data.caseId;
 }catch(_){return null;}
 finally{try{reader.releaseLock();}catch(_){}}
}
export const probeHtml=String.raw`<!doctype html><html lang="it"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Tagliando — AI M4.2.2</title>
<style>
:root{font-family:system-ui,-apple-system,sans-serif;background:#f6f8fa;color:#203847}
body{max-width:720px;margin:25px auto;padding:0 16px;line-height:1.6}
main{background:white;border:1px solid #cbd7dc;border-radius:12px;padding:20px}
.warning{border-left:4px solid #b96a00;background:#fff3db;padding:12px;margin:16px 0}
button,select{font:inherit;padding:10px;border-radius:7px}
button{background:#155d70;color:white;cursor:pointer;border:0;margin:12px 0}
pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#eef3f5;padding:12px}
</style></head><body><main>
<h1>M4.2.2 — Prima prova AI controllata</h1>
<div class="warning"><strong>Solo laboratorio, non usare per manutenzione reale.</strong>
Nessuna lavorazione viene confermata. Il modello non può autorizzare nuovi passaggi.
La prova non accetta domande libere: è una verifica iniziale del collegamento.</div>
<label for="case">Scenario predefinito</label>
<select id="case">
<option value="paper-wash">P03 — Posso lavare il filtro in carta?</option>
<option value="cover-stuck">P01 — Coperchio bloccato (arresto)</option>
<option value="off-topic">P03 — Domanda fuori ambito</option>
</select>
<p><button id="run" type="button">Avvia prova controllata</button></p>
<p id="status" role="status">Prova non ancora eseguita.</p>
<pre id="result"></pre>
<p><small>Staging protetto con Cloudflare Access. AI disattivata per impostazione predefinita.</small></p>
</main><script defer src="/lab/ai-probe/client.js"></script></body></html>`;
export const probeClient=String.raw`'use strict';
(()=>{
  const $=id=>document.getElementById(id);
  $('run').addEventListener('click',async()=>{
    $('run').disabled=true;
    $('status').textContent='Verifica server in corso…';
    $('result').textContent='';
    try{
      const r=await fetch('/api/lab/ai-probe',{
        method:'POST',credentials:'same-origin',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({caseId:$('case').value})
      });
      const data=await r.json();
      const {instruction,stopCondition,title,references,decision,message,diagnosticCode}=data;
      $('status').textContent=(r.ok?'Risposta laboratorio: ':'Controllo di arresto: ')+(decision||'ERRORE');
      // Only server-assembled reviewed text, never raw model output.
      $('result').textContent=[
        message||'',
        title||'',
        instruction||'',
        stopCondition?'Condizione di arresto: '+stopCondition:'',
        references?.[0]?.stepId?'Fonte: '+references[0].stepId+' · '+references[0].revision:'',
        diagnosticCode?'Diagnostica strutturale: '+diagnosticCode:'',
        'Chiamate al modello: '+String(data.modelRequests??0)
      ].filter(Boolean).join('\n\n');
    }catch(_){$('status').textContent='Connessione non disponibile.';}
    finally{$('run').disabled=false;}
  });
})();`;
export async function serveM4Probe(request,env,ctx,verifyWorkerAccess){
 const url=new URL(request.url);
 const isPage=url.pathname==='/lab/ai-probe'||url.pathname==='/lab/ai-probe/';
 const isClient=url.pathname==='/lab/ai-probe/client.js';
 const isApi=url.pathname==='/api/lab/ai-probe';
 if(!isPage&&!isClient&&!isApi)return json(404,result('NOT_FOUND','Percorso non trovato.'));
 if(request.method!==(isApi?'POST':'GET'))
   return json(405,result('METHOD_NOT_ALLOWED','Metodo non consentito.'));
 if(env.SERVICE_MODE!=='guarded')
   return json(503,result('SERVICE_DISABLED','Laboratorio disabilitato.'));
 if(url.origin!==STAGING||env.SELF_TEST_ORIGIN!==STAGING||
   (isApi&&request.headers.get('origin')!==STAGING))
   return json(403,result('TEST_ORIGIN_DENIED','Origine non autorizzata.'));
 let actor;
 try{actor=await verifyWorkerAccess(request,env,ctx,isApi);}
 catch(_){return json(401,result('UNAUTHORIZED','Access richiesto.'));}
 if(!isApi){
   const isJs=isClient;
   return new Response(isJs?probeClient:probeHtml,{status:200,headers:{
     ...headers,
     'Content-Type':isJs?'application/javascript; charset=utf-8':'text/html; charset=utf-8',
     'X-Frame-Options':'DENY',
     'Content-Security-Policy':"default-src 'none'; script-src 'self'; connect-src 'self'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"
   }});
 }
 if(env.AI_PROBE_MODE!=='enabled')
   return json(503,result('PROBE_DISABLED','Prima prova AI non ancora abilitata.'));
 if(!aiProbeWindowValid(env))
   return json(503,result('PROBE_EXPIRED','Finestra temporanea della prova AI terminata.'));
 // Rate limit is approximate; Workers Free quota is the account-level daily
 // ceiling. Do not claim this binding is a hard cost cap on Workers Paid.
 if(!env.AI_PROBE_LIMITER||typeof env.AI_PROBE_LIMITER.limit!=='function')
   return json(503,result('PROBE_LIMITER_REQUIRED','Limiter prova non disponibile.'));
 if(!actor?.sub)return json(401,result('UNAUTHORIZED','Identità non verificata.'));
 const caseId=await readCase(request);
 if(!caseId)return json(400,result('INVALID_INPUT','Scenario non valido.'));
 let rate;
 try{rate=await env.AI_PROBE_LIMITER.limit({key:'fixed-probe-all-users'});}
 catch(_){return json(503,result('PROBE_LIMITER_UNAVAILABLE','Limiter non disponibile.'));}
 if(rate?.success!==true)
   return json(429,result('PROBE_RATE_LIMITED','Limite prove raggiunto.'));
 const output=await runFixedM4Probe(caseId,env);
 const status=output.decision==='MODEL_UNAVAILABLE'?503:
   output.decision==='MODEL_OUTPUT_REJECTED'?422:200;
 return json(status,output);
}
