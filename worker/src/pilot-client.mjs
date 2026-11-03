/*
 * Fase 14.7 — Solo pannello PWA di collaudo. Nessuna modifica allo stato locale,
 * al dialogo vocale, al registro o ai passaggi. Nessuna attivazione automatica.
 */
export const pilotConnector = String.raw`(function () {
  'use strict';
  const questions = Object.freeze([
    {label:'Lama crepata — STOP',question:'La lama è crepata',code:'SAFETY_STOP',http:200},
    {label:'Quantità olio — manuale richiesto',question:'Quanto olio devo mettere?',code:'MODEL_REQUIRED',http:200},
    {label:'Cambio automobile — fuori ambito',question:'Come si ripara il cambio di un automobile?',code:'OUT_OF_SCOPE',http:200},
    {label:'Pulizia sottoscocca — non validata',question:'Come pulisco il sottoscocca?',code:'PENDING_VALIDATION',http:503}
  ]);
  function attach() {
    if (document.getElementById('pilotBackendPanel')) return;
    const main=document.querySelector('main');
    if(!main)return;
    const panel=document.createElement('section');
    panel.className='panel';
    panel.id='pilotBackendPanel';
    panel.setAttribute('aria-label','Collaudo collegamento PWA e backend');
    panel.innerHTML=[
      '<h2>Fase 14.7 — Collegamento backend (solo collaudo)</h2>',
      '<p class="note">COPIA DI PROVA: nessuna domanda parte automaticamente. ',
      'Non usare questa sessione per effettuare manutenzione reale.</p>',
      '<p class="muted small">Le richieste predefinite vanno soltanto al Worker protetto. ',
      'I dati macchina, le note, lo stato dei passaggi e i comandi vocali non vengono inviati.</p>',
      '<div id="pilotButtons" class="actions"></div>',
      '<p id="pilotBackendStatus" role="status" aria-live="polite">Nessuna richiesta inviata.</p>',
      '<pre id="pilotBackendResult" style="white-space:pre-wrap;overflow-wrap:anywhere"></pre>'
    ].join('');
    const anchor=document.getElementById('knowledgePanel')||document.getElementById('voicePanel');
    if(anchor)anchor.insertAdjacentElement('afterend',panel);
    else main.append(panel);
    const controls=panel.querySelector('#pilotButtons');
    const status=panel.querySelector('#pilotBackendStatus');
    const output=panel.querySelector('#pilotBackendResult');
    let busy=false;
    for(const item of questions){
      const button=document.createElement('button');
      button.type='button';
      button.textContent=item.label;
      button.addEventListener('click',async()=>{
        if(busy)return;
        busy=true;
        const buttons=controls.querySelectorAll('button');
        buttons.forEach(b=>b.disabled=true);
        status.textContent='Richiesta in corso; sessione PWA invariata.';
        output.textContent='';
        const controller=new AbortController();
        const watchdog=setTimeout(()=>controller.abort(),8000);
        try{
          const counter=document.getElementById('counter')?.textContent||'';
          const match=/Operazione\s+(\d+)/i.exec(counter);
          const operationId=match?Number(match[1]):null;
          const body={question:item.question};
          if(Number.isInteger(operationId)&&operationId>=1&&operationId<=8)
            body.operationId=operationId;
          const res=await fetch('/api/assist',{
            method:'POST',credentials:'same-origin',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(body),signal:controller.signal
          });
          const data=await res.json();
          const pass=res.status===item.http &&
            data.decision===item.code &&
            data.aiEnabled===false &&
            data.canGenerate===false &&
            data.sessionChanged===false &&
            Array.isArray(data.references)&&data.references.length===0;
          status.textContent=pass?'SUPERATO — stato della PWA non modificato':'DA VERIFICARE';
          output.textContent=JSON.stringify({
            http:res.status,decision:data.decision||data.code||'UNKNOWN',
            messaggio:typeof data.message==='string'?data.message:'',
            atteso:item.code,aiEnabled:data.aiEnabled,
            canGenerate:data.canGenerate,sessionChanged:data.sessionChanged
          },null,2);
        }catch(_){
          status.textContent='ERRORE DI COMUNICAZIONE — nessun cambiamento alla sessione.';
          output.textContent='Verifica Access, connessione e deployment. Nessun nuovo tentativo automatico.';
        }finally{
          clearTimeout(watchdog);
          busy=false;
          buttons.forEach(b=>b.disabled=false);
        }
      });
      controls.append(button);
    }
  }
  if(document.readyState==='loading')
    document.addEventListener('DOMContentLoaded',attach,{once:true});
  else attach();
})();`;
