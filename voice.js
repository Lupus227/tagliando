/* v0.8.0 - guida vocale a ciclo controllato; nessuna API esterna a pagamento. */
(() => {
 'use strict';
 const $=id=>document.getElementById(id);
 const Engine=window.SpeechRecognition||window.webkitSpeechRecognition;
 const synth=('speechSynthesis' in window)?window.speechSynthesis:null;
 let active=false, listening=false, recognition=null, speaking=false;
 let turn=0, retries=0, lastResult=false, lastError='';
 let pendingRestart=null;
 const setStatus=t=>{ $('voiceStatus').textContent=t; };
 const setHeard=t=>{ $('voiceHeard').textContent=t; };
 function refreshButtons(){ $('voiceDialog').textContent=active?'Dialogo attivo':'🎙 Avvia dialogo';$('voiceDialog').disabled=active; $('voiceListen').disabled=listening; }
 function clearPending(){ if(pendingRestart!==null){clearTimeout(pendingRestart);pendingRestart=null;} }
 function abortRecognition(){const r=recognition;recognition=null;listening=false;if(r){r.onend=null;r.onerror=null;r.onresult=null;try{r.abort();}catch(_){}} refreshButtons();}
 function stopSpeech(){speaking=false;if(synth)try{synth.cancel();}catch(_){} }
 function stopAll(message='Dialogo interrotto. Puoi ripartire quando vuoi.'){
   active=false;turn++;clearPending();abortRecognition();stopSpeech();setStatus(message);refreshButtons();
 }
 function speechText(){
   const op=$('opTitle')?.textContent||'Tagliando';
   const step=$('stepTitle')?.textContent||'';
   const instruction=$('stepText')?.textContent||'';
   return `${op}. ${step}. ${instruction}`;
 }
 function say(text,next){
   if(!synth||!window.SpeechSynthesisUtterance){setStatus('Lettura vocale non disponibile. Usa i pulsanti sullo schermo.');if(active)stopAll('Lettura non disponibile: dialogo fermato.');return;}
   abortRecognition();stopSpeech();speaking=true;
   let finished=false;const myTurn=turn;
   const u=new SpeechSynthesisUtterance(text);u.lang='it-IT';u.rate=0.93;
   const complete=(ok)=>{if(finished)return;finished=true;speaking=false;if(myTurn!==turn)return;if(!ok){stopAll('Sintesi vocale interrotta: usa i pulsanti manuali.');return;}if(typeof next==='function')next();};
   u.onend=()=>complete(true);u.onerror=()=>complete(false);
   try{synth.speak(u);}catch(_){complete(false);}
 }
 const normalize=s=>s.toLocaleLowerCase('it-IT').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').trim();
 function commandFor(t){const s=normalize(t);
  if(/^(fatto|eseguito|passaggio eseguito|ho finito|finito|si fatto|ok fatto)$/.test(s))return 'done';
  if(/^(ripeti|ripeti passaggio|leggi|leggi passaggio|puoi ripetere)$/.test(s))return 'repeat';
  if(/^(indietro|torna indietro|precedente|passo precedente)$/.test(s))return 'back';
  if(/^(segnala un problema|segnala problema|problema|anomalia|segnala anomalia)$/.test(s))return 'anomaly';
  if(/^(ferma|stop|ferma dialogo|interrompi)$/.test(s))return 'stop';
  return null;
 }
 function describeNext(prefix=''){
   if(!active)return;
   setStatus(prefix+'Sto leggendo il passaggio; ascolterò dopo la lettura.');
   say(speechText(),()=>listen(true));
 }
 function handle(transcript,automatic){
   const c=commandFor(transcript);retries=0;
   if(!c){
     setStatus('Frase riconosciuta ma non prevista: nessuna azione eseguita.');
     if(automatic&&active)say('Comando non previsto. Puoi dire fatto, ripeti, indietro oppure segnala un problema.',()=>listen(true));
     return;
   }
   if(c==='stop'){stopAll();return;}
   if(c==='anomaly'){
     stopAll('Anomalia: dialogo fermato. Compila la segnalazione sullo schermo per registrarla.');
     $('anomalyStart').click();return;
   }
   if(c==='repeat'){
     if(automatic&&active)describeNext('Ripeto. ');
     else {setStatus('Ripeto il passaggio.');say(speechText());}
     return;
   }
   if(c==='back'){
     if(!$('stepPrev').disabled){$('stepPrev').click();setStatus('Passaggio precedente.');}
     else setStatus('Sei già al primo passaggio.');
     if(automatic&&active)describeNext();return;
   }
   if(c==='done'){
     const beforeOp=$('opTitle').textContent;
     const beforeStep=$('stepTitle').textContent;
     $('stepConfirm').click(); // Stesso gestore di v0.6.4, nessuna seconda logica di avanzamento.
     const afterOp=$('opTitle').textContent;
     const afterStep=$('stepTitle').textContent;
     if(automatic&&active){
       if(beforeOp===afterOp&&beforeStep===afterStep){
         stopAll('Non è stato rilevato un avanzamento: dialogo fermato per evitare conferme ripetute.');
       }else if(beforeOp===afterOp){describeNext('Passaggio registrato. ');}
       else if(beforeOp!==afterOp){describeNext('Lavorazione completata. Passiamo alla successiva. ');}
     }else setStatus('Conferma eseguita. Controlla la schermata.');
   }
 }
 function listen(automatic){
   if(listening||speaking)return;
   if(!Engine){stopAll('Riconoscimento non disponibile su questo browser. Usa i comandi sullo schermo.');return;}
   const cycle=turn;lastResult=false;lastError='';
   try{
     const r=new Engine();recognition=r;
     r.lang='it-IT';r.interimResults=false;r.continuous=false;r.maxAlternatives=1;
     r.onstart=()=>{if(cycle!==turn)return;listening=true;setStatus('Ascolto attivo: pronuncia un comando.');refreshButtons();};
     r.onresult=event=>{
       if(cycle!==turn)return;
       lastResult=true;
       const words=event.results?.[0]?.[0]?.transcript||'';
       setHeard(`Riconosciuto: «${words}»`);
       // Non riavviare durante una sessione di riconoscimento ancora attiva.
       r.__command=words;
     };
     r.onerror=e=>{if(cycle!==turn)return;lastError=e.error||'sconosciuto';};
     r.onend=()=>{
       if(cycle!==turn)return;
       listening=false;recognition=null;refreshButtons();
       if(lastResult){handle(r.__command||'',automatic);return;}
       if(!automatic||!active){setStatus(lastError?`Ascolto terminato (${lastError}). Premi «Ascolta un comando» per riprovare.`:'Ascolto terminato senza comando.');return;}
       if(lastError==='not-allowed'||lastError==='service-not-allowed'||lastError==='audio-capture'||lastError==='network'){
         stopAll(`Ascolto non disponibile (${lastError}). Dialogo fermato; usa i pulsanti.`);return;
       }
       if(retries++>=1){stopAll('Non è stata rilevata una risposta. Dialogo in pausa; premi «Avvia dialogo» per riprovare.');return;}
       setStatus('Nessun comando rilevato. Riprovo una volta…');
       pendingRestart=setTimeout(()=>{pendingRestart=null;if(active&&cycle===turn)listen(true);},350);
     };
     setStatus(automatic?'Attivo il microfono…':'Attivo il microfono per un comando…');
     r.start();
   }catch(e){
     recognition=null;listening=false;refreshButtons();
     if(automatic)stopAll('Safari non ha consentito il riavvio automatico del microfono. Usa «Ascolta un comando» oppure riavvia il dialogo.');
     else setStatus('Impossibile attivare il microfono. Verifica i permessi Safari.');
   }
 }
 document.addEventListener('DOMContentLoaded',()=>{
   $('voiceDialog').addEventListener('click',()=>{
     if(active)return;
     if(!Engine){setStatus('Il riconoscimento vocale non è disponibile su questo browser.');return;}
     active=true;turn++;retries=0;refreshButtons();setHeard('');describeNext();
   });
   $('voiceListen').addEventListener('click',()=>{if(active)stopAll('Dialogo continuo sospeso; ascolto manuale disponibile.');turn++;stopSpeech();listen(false);});
   $('voiceRead').addEventListener('click',()=>{stopAll('Lettura del passaggio.');say(speechText());});
   $('voiceStop').addEventListener('click',()=>stopAll());
   document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&(active||listening||speaking))stopAll('App in background: audio e ascolto fermati per sicurezza.');});
   window.addEventListener('pagehide',()=>{if(active||listening||speaking)stopAll('Dialogo fermato.');});
   refreshButtons();setStatus(Engine?'Pronto. Tocca «Avvia dialogo» per provare il ciclo.':'Ascolto non disponibile qui; la guida manuale continua a funzionare.');
 });
})();
