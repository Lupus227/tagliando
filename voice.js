/* v0.7.0 - modulo vocale isolato. Nessuna chiamata ad API a pagamento. */
(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  let listening = false;
  let recognition = null;
  const status = message => { byId('voiceStatus').textContent = message; };
  const heard = message => { byId('voiceHeard').textContent = message; };
  const synth = ('speechSynthesis' in window) ? window.speechSynthesis : null;
  function stopAudio(){ if(synth) synth.cancel(); }
  function currentSpeech(){
    const op = byId('opTitle')?.textContent || 'Tagliando';
    const title = byId('stepTitle')?.textContent || '';
    const content = byId('stepText')?.textContent || '';
    return `${op}. ${title}. ${content}`;
  }
  function say(text){
    if(!synth || !('SpeechSynthesisUtterance' in window)) {status('Sintesi vocale non disponibile su questo browser.');return;}
    try{
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang='it-IT';u.rate=0.92;
      u.onerror=()=>status('Riproduzione vocale non riuscita. Il testo rimane sullo schermo.');
      synth.speak(u);
    }catch(e){status('Riproduzione vocale non disponibile.');}
  }
  function normalize(value){return value.toLocaleLowerCase('it-IT').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').trim();}
  function execute(command){
    const str=normalize(command);
    // Matching intenzionalmente limitato; niente interpretazione libera di diagnosi o sicurezza.
    if(/^(fatto|eseguito|passaggio eseguito|ho finito|finito)$/.test(str)) {
      const before = byId('stepTitle')?.textContent;
      confirmAndAdvance();
      const after = byId('stepTitle')?.textContent;
      status(before===after ? 'Conferma registrata. Controlla la schermata.' : 'Passaggio registrato; puoi ascoltare il successivo.');
      return;
    }
    if(/^(ripeti|ripeti passaggio|leggi|leggi passaggio)$/.test(str)) { status('Lettura del passaggio.');say(currentSpeech()); return; }
    if(/^(indietro|torna indietro|precedente|passo precedente)$/.test(str)) {
      if(!byId('stepPrev').disabled){byId('stepPrev').click();status('Tornato al passaggio precedente.');}
      else status('Sei già al primo passaggio di questa lavorazione.');
      return;
    }
    if(/^(segnala un problema|segnala problema|problema|anomalia|segnala anomalia)$/.test(str)) {
      byId('anomalyStart').click();status('Segnalazione aperta. Scrivi il problema e scegli «Registra e sospendi». Nessuna anomalia è stata salvata automaticamente.');
      return;
    }
    status('Comando non riconosciuto: nessuna modifica effettuata.');
  }
  function activate(){
    if(listening){status('Ascolto già in corso.');return;}
    const Engine = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!Engine){status('Riconoscimento vocale non disponibile qui. Prova in Safari, non dalla schermata Home.');return;}
    stopAudio();
    try{
      recognition=new Engine();
      recognition.lang='it-IT';
      recognition.interimResults=false;
      recognition.continuous=false;
      recognition.maxAlternatives=1;
      recognition.onstart=()=>{listening=true;status('Sto ascoltando: pronuncia un comando.');byId('voiceListen').disabled=true;};
      recognition.onresult=event=>{
        const result=event.results?.[0]?.[0]?.transcript || '';
        heard(`Riconosciuto: «${result}»`);
        execute(result);
      };
      recognition.onerror=event=>{
        const e=event.error;
        const messages={ 'not-allowed':'Permesso microfono negato: abilitalo nelle impostazioni di Safari.', 'service-not-allowed':'Servizio vocale non consentito su questo dispositivo.', 'network':'Servizio di riconoscimento non raggiungibile; prova con Internet attivo.', 'no-speech':'Nessuna voce rilevata. Riprova vicino al microfono.', 'audio-capture':'Microfono non disponibile.', 'aborted':'Ascolto interrotto.' };
        status(messages[e] || `Riconoscimento non riuscito (${e}).`);
      };
      recognition.onend=()=>{listening=false;byId('voiceListen').disabled=false;recognition=null;};
      recognition.start();
    }catch(e){listening=false;byId('voiceListen').disabled=false;status('Impossibile avviare il microfono qui. Prova da Safari.');}
  }
  document.addEventListener('DOMContentLoaded',()=>{
    byId('voiceListen').addEventListener('click',activate);
    byId('voiceRead').addEventListener('click',()=>{if(listening&&recognition)recognition.abort();status('Lettura del passaggio.');say(currentSpeech());});
    byId('voiceStop').addEventListener('click',()=>{stopAudio();if(listening&&recognition)recognition.abort();status('Audio e ascolto interrotti.');});
    if(!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) status('Voce in ingresso non disponibile in questa modalità; prova da Safari. La lettura può comunque funzionare.');
    else status('Pronto. Tocca «Ascolta un comando» e parla.');
  });
})();
