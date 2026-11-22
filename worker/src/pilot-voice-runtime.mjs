/*
 * M4.5.7 — Inject one narrowly scoped Worker question into the EXISTING
 * PWA voice.js only when SERVED via the Cloudflare Access-protected pilot.
 * The source snapshot and the public PWA remain untouched.
 *
 * Injection point is after the existing anomaly/command/contextual prechecks
 * and before the normal unknown-command fallback. Fail closed if that exact
 * source anchor changes. No general chatbot; no AI or session modification.
 */
const ANCHOR="     setStatus('Frase riconosciuta ma non prevista: nessuna azione eseguita.');";
const ENTRY=String.raw`
     // M4.5.7: SINGLE approved question in the normal voice loop, pilot only.
     // Priorities remain: anomalous mixed commands, voice commands, riskFor().
     if(active && !paused && [
       'posso lavare il filtro in carta',
       'posso lavare filtro in carta',
       'il filtro in carta si puo lavare'
     ].includes(normalize(transcript))){
       const scopedTurn=turn;
       const before={
         operationId:currentOperation(),
         filterType:$('method')?.value||'',
         currentStep:$('stepTitle')?.textContent?.trim()||''
       };
       const same=()=>active && !paused && turn===scopedTurn &&
         currentOperation()===before.operationId &&
         ($('method')?.value||'')===before.filterType &&
         ($('stepTitle')?.textContent?.trim()||'')===before.currentStep;
       const vocalize=(message)=>{
         if(!same())return;
         say(message,()=>{
           if(automatic && same())listen(true);
         });
       };
       if(before.operationId!==3||before.filterType!=='carta'||
          before.currentStep!=='Trattamento carta'){
         setStatus('Domanda al Worker non inviata: contesto filtro carta non selezionato.');
         vocalize('La risposta sul filtro in carta è disponibile soltanto al passaggio Trattamento carta, nell operazione Filtro aria. Nessun passaggio è stato modificato.');
         return;
       }
       const controller=new AbortController();
       const watchdog=setTimeout(()=>controller.abort(),8000);
       setStatus('Verifico la tua domanda nel Worker, senza cambiare il passaggio.');
       fetch('/api/lab/voice-bridge',{
         method:'POST',credentials:'same-origin',
         headers:{'Content-Type':'application/json'},
         body:JSON.stringify({...before,question:transcript}),
         signal:controller.signal
       }).then(async response=>{
         const data=await response.json();
         if(!same())return;
         if(response.ok && data?.decision==='STAGING_APPROVED_REPLY' &&
           data.aiEnabled===false && data.canGenerate===false &&
           data.modelRequests===0 && data.sessionChanged===false &&
           data.allowCompletion===false && data.maySendToModel===false &&
           data.source?.stepId==='RASA-OP-03-P03' &&
           data.source?.revision==='F15.18-R2' &&
           data.answer==='No. Il filtro in carta non deve essere lavato né oliato.'){
           setStatus('Risposta approvata dal Worker; il passaggio resta da confermare.');
           vocalize(data.answer);
         }else{
           setStatus('Risposta tecnica non autorizzata: nessuna azione eseguita.');
           vocalize('Non ho una risposta verificata per questa richiesta nel contesto corrente. Il passaggio non è stato modificato.');
         }
       }).catch(()=>{
         if(!same())return;
         setStatus('Worker non raggiungibile: nessuna azione sulla lavorazione.');
         vocalize('Il collegamento non è disponibile. Non ho modificato il passaggio.');
       }).finally(()=>clearTimeout(watchdog));
       return;
     }
`;
export function pilotVoiceWithReadOnlyWorkerBridge(original){
  if(typeof original!=='string'||!original.startsWith('/* v0.12.1')||
    original.split(ANCHOR).length!==2 ||
    !original.includes('const c=commandFor(transcript);') ||
    !original.includes('const contextual=riskFor(transcript);') ||
    !original.includes('function listen(automatic)') ||
    original.includes('M4.5.7: SINGLE approved question'))
    throw new Error('PILOT_VOICE_SOURCE_CHANGED');
  return original.replace(ANCHOR,ENTRY+ANCHOR);
}
