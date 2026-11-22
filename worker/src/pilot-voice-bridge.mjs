/*
 * M4.5.6 — Voice input + readback on the EXISTING protected PWA pilot copy.
 * Isolated from voice.js and the public PWA; no automatic state progression.
 * One-button microphone capture, same-origin Worker verification, TTS playback.
 * Not an AI conversation; the first proven end-to-end transport slice.
 */
export const pilotVoiceBridge = String.raw`(function(){
 'use strict';
 const $=id=>document.getElementById(id);
 const Engine=window.SpeechRecognition||window.webkitSpeechRecognition;
 const synth=('speechSynthesis' in window)?window.speechSynthesis:null;
 const panel=document.createElement('section');
 panel.className='panel';
 panel.id='pilotVoiceBridge';
 panel.innerHTML=[
   '<h2>Prova vocale PWA → Worker → voce · M4.5.6</h2>',
   '<p class="note"><strong>Solo staging protetto: nessuna manutenzione reale.</strong> ',
   'Questo modulo usa la PWA esistente e una sola risposta breve approvata, non un modello AI. ',
   'Non modifica il registro né lo stato del passaggio.</p>',
   '<p class="muted small">Apri Operazione 3 · Filtro aria, scegli Carta e il passaggio ',
   'Trattamento carta. Ferma prima il dialogo vocale principale, se attivo.</p>',
   '<p id="bridgeContext" role="status" aria-live="polite"></p>',
   '<button type="button" id="bridgePrepare">Prepara la PWA per questa prova (senza confermare passaggi)</button>',
   '<p class="muted small">Questo pulsante cambia solo operazione, modalità e passaggio visualizzati nel prototipo; la PWA salva normalmente la navigazione. Non conferma lavorazioni e non elimina anomalie.</p>',
   '<label for="bridgeQuestion">Domanda (anche dettata)</label>',
   '<textarea id="bridgeQuestion" maxlength="450" placeholder="Posso lavare il filtro in carta?"></textarea>',
   '<div class="actions">',
   '<button type="button" id="bridgeMic">🎙 Dettala</button>',
   '<button type="button" id="bridgeSend">Chiedi al Worker</button>',
   '<button type="button" id="bridgeRead" disabled>🔊 Riascolta risposta</button>',
   '</div>',
   '<p id="bridgeStatus" role="status" aria-live="polite">Pronto per un test isolato.</p>',
   '<p id="bridgeReply" class="note" aria-live="polite"></p>',
   '<p class="muted small" id="bridgeSource"></p>'
 ].join('');
 const main=document.querySelector('main');
 if(!main)return;
 const anchor=$('voicePanel');
 if(anchor)anchor.insertAdjacentElement('afterend',panel);
 else main.append(panel);
 const question=$('bridgeQuestion'),reply=$('bridgeReply'),status=$('bridgeStatus');
 const source=$('bridgeSource'),mic=$('bridgeMic'),send=$('bridgeSend'),read=$('bridgeRead');
 const prepare=$('bridgePrepare'),contextStatus=$('bridgeContext');
 let busy=false,rec=null,approved=null,utterance=null;
 function context(){
   const match=/Operazione\s+(\d+)/i.exec($('counter')?.textContent||'');
   return {operationId:match?Number(match[1]):null,filterType:$('method')?.value||'',
     currentStep:$('stepTitle')?.textContent?.trim()||''};
 }
 function showContext(){
   const c=context();
   contextStatus.textContent='Contesto PWA rilevato: operazione '+
     (c.operationId??'non rilevata')+', filtro '+(c.filterType||'non selezionato')+
     ', passaggio '+(c.currentStep||'non rilevato')+'.';
   return c;
 }
 function readyContext(c){
   return c.operationId===3&&c.filterType==='carta'&&
     c.currentStep==='Trattamento carta';
 }
 function existingDialogActive(){
   return ($('voiceDialog')?.textContent||'').includes('Dialogo attivo');
 }
 function updateButtons(){
   mic.disabled=busy||!Engine;
   send.disabled=busy;
   read.disabled=busy||!approved||!synth;
   prepare.disabled=busy;
 }
 function speak(value){
   if(!synth||!window.SpeechSynthesisUtterance){
     status.textContent='Risposta visualizzata: sintesi vocale non disponibile.';
     return;
   }
   // Only the bridge's own response is spoken, and only after server approval.
   if(existingDialogActive()){
     status.textContent='Ferma il dialogo vocale principale prima di riascoltare.';
     return;
   }
   utterance=new SpeechSynthesisUtterance(value);
   utterance.lang='it-IT';utterance.rate=0.93;
   utterance.onend=()=>{utterance=null;};
   utterance.onerror=()=>{utterance=null;status.textContent='Lettura automatica non disponibile: usa Riascolta risposta.';};
   try{synth.speak(utterance);}
   catch(_){utterance=null;status.textContent='Lettura automatica non disponibile: usa Riascolta risposta.';}
 }
 function clearAnswer(){
   approved=null;reply.textContent='';source.textContent='';updateButtons();
 }
 async function ask(text){
   if(busy)return;
   clearAnswer();
   if(existingDialogActive()){
     status.textContent='Ferma il dialogo vocale principale prima di usare questa prova.';
     return;
   }
   const before=showContext();
   if(!readyContext(before)){
     status.textContent='Richiesta bloccata prima del Worker: contesto PWA diverso. Premi «Prepara la PWA per questa prova» oppure seleziona manualmente Operazione 3 / Carta / Trattamento carta.';
     return;
   }
   if(typeof text!=='string'||!text.trim()||text.length>450){
     status.textContent='Inserisci o detta una domanda breve.';return;
   }
   busy=true;updateButtons();
   status.textContent='Verifica della domanda sul Worker protetto…';
   const controller=new AbortController();
   const watchdog=setTimeout(()=>controller.abort(),8000);
   try{
     const response=await fetch('/api/lab/voice-bridge',{
       method:'POST',credentials:'same-origin',
       headers:{'Content-Type':'application/json'},
       body:JSON.stringify({...before,question:text}),signal:controller.signal
     });
     const data=await response.json();
     // Ignore late answers if user navigated to another step or changed method.
     if(JSON.stringify(context())!==JSON.stringify(before)){
       status.textContent='Il contesto è cambiato: risposta scartata, nessun avanzamento.';
       return;
     }
     if(response.ok&&data.decision==='STAGING_APPROVED_REPLY'&&
       data.aiEnabled===false&&data.modelRequests===0&&
       data.canGenerate===false&&data.sessionChanged===false&&
       data.allowCompletion===false&&data.maySendToModel===false&&
       data.source?.stepId==='RASA-OP-03-P03'&&
       data.source?.revision==='F15.18-R2'&&typeof data.answer==='string'){
       approved=data.answer;
       reply.textContent=approved;
       source.textContent='Fonte: '+data.source.stepId+' · '+data.source.revision+
         ' · Solo collaudo, nessuna conferma del passaggio.';
       status.textContent='Risposta tecnica revisionata ricevuta; provo a leggerla.';
       updateButtons();
       speak(approved);
     }else{
       status.textContent='Nessuna risposta breve autorizzata: '+String(data.decision||'ERRORE');
       reply.textContent=String(data.message||'Nessun contenuto tecnico erogato.');
     }
   }catch(_){
     status.textContent='Worker non raggiungibile: verifica Access, connessione e deployment.';
   }finally{
     clearTimeout(watchdog);busy=false;updateButtons();
   }
 }
 prepare.addEventListener('click',()=>{
   if(busy)return;
   if(existingDialogActive()){
     status.textContent='Ferma prima il dialogo vocale principale.';return;
   }
   clearAnswer();
   // Navigate using the PWA's EXISTING controls: no confirmation, completion,
   // anomaly report or reset is triggered. The app saves its normal navigation.
   const destination=$('operations')?.querySelectorAll('li')?.[2];
   if(!destination){status.textContent='Elenco operazioni non disponibile.';return;}
   destination.click();
   const method=$('method');
   if(!method||!Array.from(method.options).some(o=>o.value==='carta')){
     status.textContent='Modalità Carta non disponibile nella PWA.';return;
   }
   if(method.value!=='carta'){
     method.value='carta';
     method.dispatchEvent(new Event('change',{bubbles:true}));
   }
   // PWA contains seven OP03 steps; the third is Trattamento carta.
   for(let i=0;i<2;i++){
     const next=$('stepNext');
     if(!next||next.disabled)break;
     next.click();
   }
   const c=showContext();
   status.textContent=readyContext(c)
     ? 'Contesto pronto. Ora premi «Dettala» oppure «Chiedi al Worker». Nessun passaggio confermato.'
     : 'Navigazione non completata. Controlla il contesto mostrato sopra.';
 });
 send.addEventListener('click',()=>ask(question.value));
 read.addEventListener('click',()=>{if(approved)speak(approved);});
 mic.addEventListener('click',()=>{
   if(busy||!Engine)return;
   if(existingDialogActive()){
     status.textContent='Ferma prima il dialogo vocale principale.';return;
   }
   if(!readyContext(showContext())){
     status.textContent='Ascolto bloccato: contesto PWA diverso. Premi «Prepara la PWA per questa prova».';
     return;
   }
   clearAnswer();busy=true;updateButtons();
   let heard='',failure='';
   try{
     rec=new Engine();
     rec.lang='it-IT';rec.interimResults=false;rec.continuous=false;rec.maxAlternatives=1;
     rec.onresult=e=>{
       heard=e.results?.[0]?.[0]?.transcript||'';
       question.value=heard.slice(0,450);
     };
     rec.onerror=e=>{failure=e.error||'riconoscimento non disponibile';};
     rec.onend=()=>{
       rec=null;busy=false;updateButtons();
       if(heard){status.textContent='Domanda riconosciuta: '+heard;ask(heard);}
       else status.textContent='Nessuna domanda riconosciuta: '+failure;
     };
     status.textContent='Ascolto una domanda…';
     rec.start();
   }catch(_){rec=null;busy=false;updateButtons();status.textContent='Microfono non disponibile. Prova a scrivere la domanda.';}
 });
 document.addEventListener('visibilitychange',()=>{
   if(document.visibilityState==='hidden'&&rec){
     const old=rec;rec=null;
     old.onresult=null;old.onerror=null;old.onend=null;
     try{old.abort();}catch(_){}
     busy=false;status.textContent='App in background: ascolto interrotto.';updateButtons();
   }
 });
 showContext();
 updateButtons();
})();`;
