/* M3: console di sola prova, isolata dalla PWA pubblica e dal dialogo AI. */
export const filterLabPage = `<!doctype html>
<html lang="it"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Tagliando — Laboratorio filtro aria</title>
<style>
:root{font-family:system-ui,-apple-system,sans-serif;color:#183047;background:#f6f9fa}
*{box-sizing:border-box}body{max-width:850px;margin:22px auto;padding:0 15px;line-height:1.55}
h1{font-size:1.5rem;margin:0 0 10px}h2{font-size:1.1rem}
.warning{background:#fff7e4;border-left:4px solid #b06b00;padding:13px;margin:14px 0}
.panel{background:white;border:1px solid #d1dfe1;border-radius:12px;margin:15px 0;padding:17px}
label{display:block;font-weight:650;margin:12px 0 6px}
button,select,textarea{font:inherit;max-width:100%}button,select{padding:11px;border:1px solid #8299a4;border-radius:7px}
button{background:#eef4f6;cursor:pointer}button.primary{background:#155e72;color:white;border-color:#155e72}
button:disabled{opacity:.45;cursor:not-allowed}textarea{width:100%;min-height:84px;padding:10px;border:1px solid #8299a4;border-radius:7px}
.actions{display:flex;flex-wrap:wrap;gap:9px;margin:13px 0}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit}
small,.muted{color:#52626b}#status{min-height:28px;font-weight:650}#answer{border-left:3px solid #155e72;padding:12px;background:#f2f7f7}
#answer[hidden]{display:none}#stop{border-left-color:#aa2938;background:#fff2f2}
#stop[hidden]{display:none}
</style></head><body>
<h1>Laboratorio — Filtro dell'aria</h1>
<p><strong>Primo collegamento alla Knowledge Base validata</strong> · staging protetto da Cloudflare Access.</p>
<div class="warning"><strong>Ambiente sperimentale, non usare per effettuare manutenzione reale.</strong>
Non è un assistente AI: le domande sono controllate da regole conservative e il server riporta esclusivamente testi approvati. Le conferme sono simulazioni locali, non certificano operazioni svolte.</div>
<div class="panel">
<label for="kind">Tipo di filtro identificato</label>
<select id="kind"><option value="">Non ancora identificato</option>
<option value="carta">Carta</option><option value="spugna">Spugna</option><option value="misto">Misto (carta + prefiltro in spugna)</option></select>
<label for="step">Passaggio da consultare</label>
<select id="step"></select>
<div class="actions"><button id="show" class="primary">Mostra istruzioni approvate</button>
<button id="reset">Azzera solo questo laboratorio</button></div>
<p class="muted">Tipo filtro e passaggio sono salvati soltanto nel browser di questo laboratorio. La PWA pubblica non viene modificata.</p>
</div>
<div class="panel">
<h2>Consulta il passaggio</h2>
<label for="question">Domanda o difficoltà (testuale)</label>
<textarea id="question" maxlength="450" placeholder="Es. Non riesco ad aprire il coperchio"></textarea>
<div class="actions"><button id="ask">Verifica domanda nella guida validata</button></div>
<p id="status" role="status" aria-live="polite">Seleziona un passaggio e richiedi le istruzioni.</p>
<div id="answer" hidden><h2 id="title"></h2><pre id="instruction"></pre>
<p><strong>Condizione di arresto approvata</strong></p><pre id="stopCondition"></pre>
<p class="muted" id="reference"></p></div>
<div id="stop" class="warning" hidden></div>
<div class="actions"><button id="prev">Passaggio precedente</button><button id="next" disabled>Passaggio successivo</button></div>
<p class="muted">L'avanzamento di questa pagina NON modifica il registro di manutenzione. Nessuna richiesta raggiunge un provider AI.</p>
</div>
<script src="/lab/filtro-aria/client.js" defer></script>
</body></html>`;

export const filterLabClient = `'use strict';
(function(){
 const $=id=>document.getElementById(id);
 const all=[
  ['RASA-OP-03-P01','Preparazione e apertura'],
  ['RASA-OP-03-P02','Valutazione del materiale'],
  ['RASA-OP-03-P03','Trattamento del filtro in carta'],
  ['RASA-OP-03-P04','Lavaggio del filtro in spugna'],
  ['RASA-OP-03-P05','Oliatura filtro in spugna'],
  ['RASA-OP-03-P06','Pulizia della scatola filtro'],
  ['RASA-OP-03-P07','Rimontaggio del filtro']
 ];
 const key='tagliando-filter-lab-v1';
 let saved={type:'',step:all[0][0]};
 try{
  const data=JSON.parse(localStorage.getItem(key)||'null');
  if(data&&typeof data==='object'&&['carta','spugna','misto',''].includes(data.type)&&
    all.some(x=>x[0]===data.step))saved={type:data.type,step:data.step};
 }catch(_){}
 $('kind').value=saved.type;
 function allowed(type){
  return all.filter(x=>{
   if(x[0].endsWith('P03'))return type!=='spugna';
   if(x[0].endsWith('P04'))return type!=='carta';
   if(x[0].endsWith('P05'))return type==='spugna';
   if(x[0].endsWith('P02')||x[0].endsWith('P06')||x[0].endsWith('P07'))return Boolean(type);
   return true;
  });
 }
 function persist(){try{localStorage.setItem(key,JSON.stringify(saved));}catch(_){}}
 function resetOutput(){ $('answer').hidden=true;$('stop').hidden=true;$('next').disabled=true; }
 function rebuild(){
  const xs=allowed(saved.type);
  if(!xs.some(x=>x[0]===saved.step))saved.step=xs[0][0];
  $('step').replaceChildren();
  xs.forEach(x=>{const o=document.createElement('option');o.value=x[0];o.textContent=x[1];$('step').appendChild(o);});
  $('step').value=saved.step;persist();resetOutput();
  $('prev').disabled=xs[0][0]===saved.step;
  $('status').textContent='Passaggio selezionato. Premi «Mostra istruzioni approvate».';
 }
 function setError(message){
   resetOutput();$('stop').hidden=false;$('stop').textContent=message;
   $('status').textContent='Avanzamento non autorizzato nella prova.';
 }
 async function ask(question){
   resetOutput();$('ask').disabled=true;$('show').disabled=true;
   $('status').textContent='Verifico le fonti revisionate…';
   try{
     const res=await fetch('/api/lab/filtro-aria',{method:'POST',credentials:'same-origin',
       headers:{'Content-Type':'application/json'},
       body:JSON.stringify({stepId:saved.step,filterType:saved.type||null,question})});
     let body;try{body=await res.json();}catch(_){throw Error('Risposta del server non leggibile.');}
     if(!res.ok||!body.ok||body.decision!=='REVIEWED_STEP'){
       setError(body.message||body.code||'Richiesta non disponibile.');return;
     }
     $('title').textContent=body.title;
     $('instruction').textContent=body.instruction;
     $('stopCondition').textContent=body.stopCondition;
     const ref=body.references&&body.references[0];
     $('reference').textContent=ref?('Fonte validata: '+ref.stepId+' · '+ref.revision):'Fonte non disponibile';
     $('answer').hidden=false;
     $('status').textContent='Estratto approvato recuperato. Nessuna risposta AI è stata generata.';
     $('next').disabled=false;
   }catch(_){setError('Connessione o sessione Cloudflare Access non disponibile: nessun avanzamento.');}
   finally{$('ask').disabled=false;$('show').disabled=false;}
 }
 $('kind').addEventListener('change',()=>{saved.type=$('kind').value;saved.step='RASA-OP-03-P01';rebuild();});
 $('step').addEventListener('change',()=>{saved.step=$('step').value;persist();rebuild();});
 $('show').addEventListener('click',()=>ask('Mostra passaggio'));
 $('ask').addEventListener('click',()=>ask($('question').value.trim()));
 $('prev').addEventListener('click',()=>{
  const xs=allowed(saved.type),i=xs.findIndex(x=>x[0]===saved.step);
  if(i>0){saved.step=xs[i-1][0];rebuild();}
 });
 $('next').addEventListener('click',()=>{
  if($('next').disabled)return;
  const xs=allowed(saved.type),i=xs.findIndex(x=>x[0]===saved.step);
  if(i>=0&&i<xs.length-1){saved.step=xs[i+1][0];rebuild();}
  else $('status').textContent='Fine consultazione della procedura. Nessuna lavorazione è stata certificata.';
 });
 $('reset').addEventListener('click',()=>{
  saved={type:'',step:all[0][0]};$('kind').value='';$('question').value='';rebuild();
 });
 rebuild();
})();`;
