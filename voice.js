/* v0.12.1 - segnalazioni completamente vocali; nessuna diagnosi AI. */
(() => {
 'use strict';
 const $=id=>document.getElementById(id);
 const Engine=window.SpeechRecognition||window.webkitSpeechRecognition;
 const synth=('speechSynthesis' in window)?window.speechSynthesis:null;
 let active=false, listening=false, recognition=null, speaking=false, paused=false;
 let turn=0, retries=0, lastResult=false, lastError='';
 let pendingRestart=null;
 let anomalyFlow=null; // {stage,description,critical,warning,operation}
 const setStatus=t=>{ $('voiceStatus').textContent=t; };
 const setHeard=t=>{ $('voiceHeard').textContent=t; };
 const setDraft=t=>{ const el=$('voiceAnomalyDraft');if(!el)return;el.textContent=t||'';el.hidden=!t; };
 function refreshButtons(){ $('voiceDialog').textContent=active?'Dialogo attivo':'🎙 Avvia dialogo';$('voiceDialog').disabled=active; $('voiceListen').disabled=listening; }
 function clearPending(){ if(pendingRestart!==null){clearTimeout(pendingRestart);pendingRestart=null;} }
 function abortRecognition(){const r=recognition;recognition=null;listening=false;if(r){r.onend=null;r.onerror=null;r.onresult=null;try{r.abort();}catch(_){}} refreshButtons();}
 function stopSpeech(){speaking=false;if(synth)try{synth.cancel();}catch(_){} }
 function stopAll(message='Dialogo interrotto. Puoi ripartire quando vuoi.'){
   active=false;paused=false;anomalyFlow=null;setDraft('');turn++;clearPending();abortRecognition();stopSpeech();setStatus(message);refreshButtons();
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
 // Le frasi composte non devono mai trasformarsi in un completamento accidentale.
 // Si richiede esplicitamente all'utente di segnalare l'anomalia o di ripetere il comando.
 function ambiguousIntent(t){
   const s=normalize(t);
   const completion=/\b(fatto|finito|completato|eseguito|procedi|prosegui|avanti)\b/.test(s);
   const difficulty=/\b(ma|pero|problema|anomalia|rotto|rotta|crepa|crepata|guasto|non riesco|non funziona|bloccato|bloccata|dubbio)\b/.test(s);
   if(/\b(non ho finito|non e finito|non e fatto|non ho completato|non e completato|non ancora finito)\b/.test(s))return 'not-done';
   if(completion&&difficulty)return 'mixed';
   return null;
 }

 function commandFor(t){
   const s=normalize(t);
   if(/\b(ferma dialogo|interrompi dialogo|stop dialogo|termina dialogo|fermati|stop)\b/.test(s))return 'stop';
   if(/\b(segnala un problema|segnala problema|ho un problema|c e un problema|anomalia|segnala anomalia)\b/.test(s))return 'anomaly';
   if(/\b(aspetta|attendi|un momento|un attimo|metti in pausa|pausa|ferma un attimo)\b/.test(s))return 'pause';
   if(/\b(riprendiamo|riprendi|continuiamo|possiamo continuare|sono pronto|sono pronta|ricominciamo)\b/.test(s))return 'resume';
   if(/\b(quali precauzioni|che precauzioni|quali rischi|cosa devo evitare|attenzione a cosa|avvertenze|sicurezza del passaggio)\b/.test(s))return 'caution';
   if(/\b(qual e lo scopo|a cosa serve|perche questa operazione|perche lo facciamo|qual e l obiettivo|qual e il fine)\b/.test(s))return 'purpose';
   if(/\b(che modalita|quale modalita|modalita selezionata|che metodo sto usando|quale metodo ho scelto)\b/.test(s))return 'method';
   if(/\b(a che punto siamo|quanto manca|quanti passaggi mancano|quanti passaggi ho fatto|stato di avanzamento)\b/.test(s))return 'progress';
   if(/^(aiuto|cosa posso chiederti|quali comandi conosci|che comandi posso dire)$/.test(s))return 'help';
   if(/\b(non ho capito|spiegami meglio|cosa devo fare|che devo fare|puoi spiegare|chiarisci|spiegazione)\b/.test(s))return 'explain';
   if(/\b(ripeti|ripeti passaggio|leggilo di nuovo|puoi ripetere|rileggi)\b/.test(s))return 'repeat';
   if(/\b(indietro|torna indietro|precedente|passo precedente)\b/.test(s))return 'back';
   if(/^(fatto|ho fatto|eseguito|passaggio eseguito|ho finito|finito|si fatto|ok fatto|completato|ho completato|possiamo proseguire|andiamo avanti|passo successivo|procedi|prosegui|tutto fatto)$/.test(s))return 'done';
   return null;
 }
 function explainStep(){
   const title=$('stepTitle')?.textContent||'questo passaggio';
   const instruction=$('stepText')?.textContent||'';
   const caution=$('stepCaution')?.textContent||'';
   // Mai generare nuove istruzioni: si leggono esclusivamente informazioni già visibili nella guida.
   return `Siamo al passaggio: ${title}. ${instruction}${caution?' Attenzione: '+caution:''}. Se il testo non chiarisce il tuo dubbio, ferma il lavoro e chiedi a un tecnico.`;
 }
 function contextualAnswer(command){
   // Solo testo della guida attualmente visualizzata. Nessun valore tecnico dedotto o inventato.
   if(command==='caution'){
     const caution=($('stepCaution')?.textContent||'').replace(/^ATTENZIONE\s*[·:.-]?\s*/i,'').trim();
     return caution?`Precauzioni per questo passaggio: ${caution}`:'Non ho precauzioni specifiche verificate per questo passaggio. Consulta il manuale prima di procedere.';
   }
   if(command==='purpose'){
     const goal=$('opGoal')?.textContent?.trim();
     return goal?`Lo scopo della lavorazione è: ${goal}`:'Lo scopo non è disponibile nella procedura attuale.';
   }
   if(command==='method'){
     const select=$('method');const label=select?.selectedOptions?.[0]?.textContent?.trim();
     return label?`La modalità selezionata è: ${label}.`:'Non è stata individuata una modalità selezionata.';
   }
   if(command==='progress'){
     const step=$('stepCount')?.textContent?.trim()||'';
     const op=$('counter')?.textContent?.trim()||'';
     const confirmed=$('stepProgress')?.textContent?.trim()||'';
     return `${op}. ${step}. ${confirmed}`.trim()||'Non riesco a leggere lo stato di avanzamento.';
   }
   if(command==='help')return 'Puoi dire fatto, ripeti, indietro, aspetta, riprendiamo, spiegami meglio, quali precauzioni, qual è lo scopo, quale modalità, a che punto siamo, segnala un problema o ferma dialogo. Se segnali un problema, puoi descriverlo, confermarlo e registrarlo interamente a voce.';
   return 'Non ho una risposta verificata.';
 }
 // Si usa sempre il ciclo parlato anche quando l'utente ha iniziato da "Ascolta un comando".
 function keepVoiceOpen(){
   if(!active){active=true;paused=false;turn++;retries=0;refreshButtons();}
 }
 function cleanReport(text){
   let s=String(text||'').trim();
   s=s.replace(/^(?:(?:ho\s+)?(?:finito|fatto|completato)|passaggio\s+eseguito)\s*[,!.;:]?\s*(?:ma|per[oò])\s+/i,'');
   s=s.replace(/^(?:segnala(?:mi)?\s+(?:un\s+)?(?:problema|anomalia)|ho\s+(?:un\s+)?problema|c[’']?è\s+(?:un\s+)?problema)\s*[,.:;-]?\s*/i,'');
   return s.trim().replace(/[.!?]+$/,'').trim();
 }
 function meaningfulReport(text){
   const s=normalize(text);
   if(s.length<7)return false;
   if(/^(problema|un problema|anomalia|ho un problema|c e un problema|segnala un problema|un anomalia|una anomalia|ma ho un problema)$/.test(s))return false;
   return true;
 }
 function currentOperation(){
   const text=$('counter')?.textContent||'';
   const match=text.match(/Operazione\s+(\d+)/i);
   return match?Number(match[1]):0;
 }
 function riskFor(description){
   return window.TagliandoContextHelp?.resolve(description,{
     operation:currentOperation(),step:$('stepTitle')?.textContent||'',method:$('method')?.value||''
   });
 }
 function anomalyAsk(text){
   keepVoiceOpen();
   setStatus('Segnalazione vocale in corso: ascolto e conferma senza toccare lo schermo.');
   say(text,()=>{if(active)listen(true);});
 }
 function startAnomalyFlow(transcript,{critical=false,warning=''}={}){
   const op=currentOperation();
   let description=cleanReport(transcript);
   if(!meaningfulReport(description))description='';
   const danger=description?riskFor(description):null;
   const isCritical=Boolean(critical||danger?.kind==='stop');
   const advisory=isCritical?(warning||danger?.message||'Interrompi il lavoro.'):'';
   anomalyFlow={stage:description?'confirm':'describe',description,critical:isCritical,warning:advisory,operation:op};
   setDraft(description?`Segnalazione da confermare: ${description}`:'Segnalazione vocale: in attesa della descrizione.');
   if(description){
     anomalyAsk(`${advisory?advisory+' ':''}Ho rilevato questa anomalia: ${description}. Vuoi registrarla e sospendere la lavorazione? Dì registra, modifica oppure annulla segnalazione.`);
   }else{
     anomalyAsk(`${advisory?advisory+' ':''}Descrivi l'anomalia che hai riscontrato. Ti ascolto.`);
   }
 }
 function cancelAnomalyFlow(){
   const critical=Boolean(anomalyFlow?.critical);
   anomalyFlow=null;setDraft('');
   if(critical){
     setStatus('Segnalazione annullata. Possibile pericolo: lavorazione non confermata.');
     say('Segnalazione non registrata. Per sicurezza, non proseguire con questa lavorazione prima di una verifica.',()=>stopAll('Dialogo interrotto per precauzione. La lavorazione non è stata confermata.'));
   }else{
     setStatus('Segnalazione annullata. Nessuna operazione modificata.');
     say('Segnalazione annullata. Riprendiamo dal passaggio corrente.',()=>describeNext());
   }
 }
 function finishVoiceAnomaly(){
   const flow=anomalyFlow;
   if(!flow)return;
   const api=window.TagliandoApp?.recordVoiceAnomaly;
   if(typeof api!=='function'){
     say('Non posso registrare la segnalazione in questo momento. Il lavoro rimane sospeso. Usa il registro manuale.',()=>stopAll('Registrazione non disponibile. Nessuna conferma eseguita.'));
     return;
   }
   if(flow.operation!==currentOperation()){
     say('Lavorazione cambiata durante la segnalazione. Nessuna anomalia registrata.',()=>stopAll('Segnalazione non registrata: operazione cambiata.'));
     return;
   }
   const result=api(flow.description);
   if(!result?.ok){
     anomalyFlow.stage='describe';anomalyFlow.description='';setDraft('Segnalazione non salvata: ripeti la descrizione.');
     anomalyAsk('La descrizione non è sufficiente. Descrivi nuovamente il problema.');
     return;
   }
   anomalyFlow=null;setDraft('');
   setStatus(`Anomalia registrata per l'operazione ${result.operation}. Lavorazione sospesa; dialogo fermato.`);
   say(`Anomalia registrata. La lavorazione ${result.operation} è sospesa e il passaggio non viene confermato. Il dialogo è terminato.`,()=>stopAll(`Segnalazione salvata · operazione ${result.operation} sospesa.`));
 }
 function handleAnomalyResponse(transcript){
   if(!anomalyFlow)return;
   const s=normalize(transcript);
   // Le parole di conferma sono valide esclusivamente nello stato di conferma,
   // mai come comando «Fatto» durante la normale procedura.
   if(/^(ferma dialogo|interrompi dialogo|stop dialogo|fermati|stop)$/.test(s)){
     stopAll('Dialogo interrotto. Segnalazione non registrata.');return;
   }
   if(/^(annulla|annulla segnalazione|non registrare|lascia perdere|no annulla)$/.test(s)){
     cancelAnomalyFlow();return;
   }
   if(anomalyFlow.stage==='describe'){
     if(/^(ripeti|non ho capito|cosa devo dire)$/.test(s)){
       anomalyAsk('Descrivi liberamente il problema riscontrato, ad esempio: la lama è crepata.');return;
     }
     const desc=cleanReport(transcript);
     if(!meaningfulReport(desc)){
       anomalyAsk('Non ho capito la descrizione. Dimmi quale componente presenta il problema e che cosa hai osservato.');return;
     }
     const risk=riskFor(desc);
     anomalyFlow.description=desc;
     if(risk?.kind==='stop'){anomalyFlow.critical=true;anomalyFlow.warning=risk.message;}
     anomalyFlow.stage='confirm';
     setDraft(`Segnalazione da confermare: ${desc}`);
     anomalyAsk(`${risk?.kind==='stop'?risk.message+' ':''}Ho capito: ${desc}. Vuoi registrare questa anomalia? Dì registra, modifica oppure annulla segnalazione.`);
     return;
   }
   if(anomalyFlow.stage==='confirm'){
     if(/^(si|confermo|registra|registra anomalia|registra segnalazione|salva|salva segnalazione|va bene|esatto)$/.test(s)){
       finishVoiceAnomaly();return;
     }
     if(/^(modifica|correggi|riformula|ripeti descrizione|voglio modificare)$/.test(s)){
       anomalyFlow.stage='describe';anomalyFlow.description='';
       setDraft('Segnalazione vocale: descrizione da modificare.');
       anomalyAsk('Descrivi nuovamente l’anomalia, ti ascolto.');return;
     }
     anomalyAsk('Per evitare registrazioni errate, rispondi: registra, modifica oppure annulla segnalazione.');
   }
 }
 function listenWhilePaused(automatic){
   setStatus('In pausa. In ascolto per «Riprendiamo»; puoi anche premere «Ferma dialogo».');
   if(automatic&&active)listen(true);
 }
 function describeNext(prefix=''){
   if(!active)return;
   setStatus(prefix+'Sto leggendo il passaggio; ascolterò dopo la lettura.');
   say(speechText(),()=>listen(true));
 }
 function handle(transcript,automatic){
   retries=0;
   if(anomalyFlow){handleAnomalyResponse(transcript);return;}
   const uncertain=ambiguousIntent(transcript);
   if(uncertain){
     const risk=riskFor(transcript);
     if(risk?.kind==='stop'){
       startAnomalyFlow(transcript,{critical:true,warning:risk.message});
       return;
     }
     if(uncertain==='mixed'){
       startAnomalyFlow(transcript);
       return;
     }
     const msg=uncertain==='not-done'
       ?'Ricevuto, il passaggio resta da completare. Dimmi fatto soltanto quando hai concluso; puoi anche dire aspetta o segnala un problema.'
       :'La tua frase contiene sia un possibile completamento sia una difficoltà. Non registro il passaggio come eseguito. Se hai rilevato un problema, dì segnala un problema; altrimenti ripeti fatto solo dopo aver completato il lavoro.';
     setStatus('Conferma non registrata: frase ambigua o lavoro non completato.');
     if(automatic&&active)say(msg,()=>listen(true));else say(msg);
     return;
   }
   const c=commandFor(transcript);
   if(!c){
     const contextual=riskFor(transcript);
     if(contextual){
       setStatus(contextual.kind==='stop'?'Possibile condizione critica: dialogo interrotto.':contextual.kind==='unknown'?'Richiesta fuori dalla base verificata.':'Chiarimento contestuale disponibile.');
       if(contextual.kind==='stop'){
         startAnomalyFlow(transcript,{critical:true,warning:contextual.message});
       }else if(automatic&&active){say(contextual.message,()=>listen(true));}
       else say(contextual.message);
       return;
     }
     setStatus('Frase riconosciuta ma non prevista: nessuna azione eseguita.');
     if(automatic&&active){
       if(paused)listenWhilePaused(true);
       else say('Non ho una risposta verificata per questa richiesta. Il passaggio non è stato modificato. Puoi dire ripeti, quali precauzioni oppure segnala un problema per interrompere e annotare la difficoltà.',()=>listen(true));
     }
     return;
   }
   if(c==='stop'){stopAll();return;}
   if(c==='pause'){
     paused=true;
     if(automatic&&active){
       setStatus('Dialogo in pausa: puoi dire «Riprendiamo».');
       say('Va bene, aspetto. Quando sei pronto, pronuncia riprendiamo.',()=>listenWhilePaused(true));
     }else setStatus('In pausa. Per riprendere, premi «Avvia dialogo».');
     return;
   }
   if(c==='resume'){
     paused=false;
     if(automatic&&active)describeNext('Riprendiamo dal passaggio corrente. ');
     else setStatus('Pronto: premi «Avvia dialogo» per continuare.');
     return;
   }
   if(c==='anomaly'){
     startAnomalyFlow(transcript);
     return;
   }
   if(paused){
     setStatus('Dialogo in pausa. Pronuncia «Riprendiamo» per continuare.');
     if(automatic&&active)listenWhilePaused(true);
     return;
   }
   if(['caution','purpose','method','progress','help'].includes(c)){
     const response=contextualAnswer(c);
     if(automatic&&active)say(response,()=>listen(true));
     else {setStatus('Informazione letta dalla procedura corrente.');say(response);}
     return;
   }
   if(c==='explain'){
     if(automatic&&active)say(explainStep(),()=>listen(true));
     else {setStatus('Spiegazione del passaggio corrente.');say(explainStep());}
     return;
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
     $('stepConfirm').click();
     const afterOp=$('opTitle').textContent;
     const afterStep=$('stepTitle').textContent;
     if(automatic&&active){
       if(beforeOp===afterOp&&beforeStep===afterStep){
         stopAll('Non è stato rilevato un avanzamento: dialogo fermato per evitare conferme ripetute.');
       }else if(beforeOp===afterOp){describeNext('Passaggio registrato. ');}
       else {describeNext('Lavorazione completata. Passiamo alla successiva. ');}
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
     r.onstart=()=>{if(cycle!==turn)return;listening=true;setStatus(paused?'In pausa: pronuncia «Riprendiamo».':'Ascolto attivo: pronuncia un comando.');refreshButtons();};
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
       if(retries++>=2){stopAll('Non è stata rilevata una risposta. Il microfono è stato fermato; premi «Avvia dialogo» per riprendere.');return;}
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
     active=true;paused=false;turn++;retries=0;refreshButtons();setHeard('');describeNext();
   });
   $('voiceListen').addEventListener('click',()=>{if(active)stopAll('Dialogo continuo sospeso; ascolto manuale disponibile.');turn++;stopSpeech();listen(false);});
   $('voiceRead').addEventListener('click',()=>{stopAll('Lettura del passaggio.');say(speechText());});
   $('voiceStop').addEventListener('click',()=>stopAll());
   document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&(active||listening||speaking))stopAll('App in background: audio e ascolto fermati per sicurezza.');});
   window.addEventListener('pagehide',()=>{if(active||listening||speaking)stopAll('Dialogo fermato.');});
   refreshButtons();setStatus(Engine?'Pronto. Tocca «Avvia dialogo» per iniziare. Disponibili pausa, chiarimenti e segnalazione vocale completa.':'Ascolto non disponibile qui; la guida manuale continua a funzionare.');
 });
})();
