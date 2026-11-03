'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');

function mountVoice(){
  const elements=new Map();
  const eventHandlers=new Map();
  const getElement=id=>{
    if(!elements.has(id)){
      const handlers={};
      elements.set(id,{
        textContent:'',disabled:false,hidden:false,value:'',
        addEventListener:(name,fn)=>{handlers[name]=fn;},
        click(){handlers.click?.();},
        fire(name){handlers[name]?.();}
      });
    }
    return elements.get(id);
  };
  let id=0;
  const scheduled=new Map();
  const timers={
    setTimeout(fn,ms){const k=++id;scheduled.set(k,{fn,ms});return k;},
    clearTimeout(k){scheduled.delete(k);},
    fire(ms){for(const [k,t] of [...scheduled])if(t.ms===ms){scheduled.delete(k);t.fn();}},
    pending(){return scheduled.size;}
  };
  const recognizers=[];
  class Recognition{
    constructor(){this.abortCalls=0;this.stopCalls=0;this.started=false;recognizers.push(this);}
    start(){this.started=true;this.onstart?.();}
    abort(){this.abortCalls++;}
    stop(){this.stopCalls++;}
  }
  const utterances=[];
  const synth={
    cancelCalls:0,
    speak(u){utterances.push(u);},
    cancel(){this.cancelCalls++;}
  };
  function Utterance(text){this.text=text;}
  const doc={
    getElementById:getElement,
    addEventListener(name,fn){eventHandlers.set(name,fn);},
    visibilityState:'visible'
  };
  const win={
    webkitSpeechRecognition:Recognition,
    speechSynthesis:synth,
    SpeechSynthesisUtterance:Utterance,
    addEventListener(){}
  };
  const context={window:win,document:doc,
    SpeechSynthesisUtterance:Utterance,
    setTimeout:timers.setTimeout,clearTimeout:timers.clearTimeout};
  const js=fs.readFileSync(path.join(__dirname,'../voice.js'),'utf8');
  vm.runInNewContext(js,context,{filename:'voice.js'});
  eventHandlers.get('DOMContentLoaded')();
  const startListening=()=>{
    getElement('voiceDialog').click();
    const u=utterances.at(-1);
    assert.ok(u,'initial instruction synthesized');
    u.onend();
    const r=recognizers.at(-1);
    assert.ok(r?.started,'recognizer started');
    return r;
  };
  return {get:getElement,recognizers,utterances,synth,timers,startListening};
}

test('Safari: stop dialog immediately aborts recognition but waits for onend before rearming',()=>{
  const s=mountVoice(),r=s.startListening();
  assert.equal(s.get('voiceDialog').disabled,true);
  const oldOnEnd=r.onend,oldOnResult=r.onresult;
  s.get('voiceStop').click();
  assert.equal(r.abortCalls,1);
  assert.equal(s.get('voiceDialog').disabled,true);
  assert.equal(s.get('voiceListen').disabled,true);
  assert.match(s.get('voiceStatus').textContent,/Chiusura/);
  assert.equal(s.recognizers.length,1);
  oldOnResult({results:[[{transcript:'Fatto'}]]});
  oldOnEnd();
  assert.equal(s.recognizers.length,1,'stale callbacks cannot restart recognition');
  r.onend();
  assert.equal(s.get('voiceDialog').disabled,false);
  assert.equal(s.get('voiceListen').disabled,false);
  assert.match(s.get('voiceStatus').textContent,/Riconoscimento vocale terminato/);
  s.get('voiceDialog').click();
  assert.equal(s.utterances.length,2,'new dialogue only after confirmed closure');
});

test('Safari: absent onend triggers stop() fallback and blocks reactivation safely',()=>{
  const s=mountVoice(),r=s.startListening();
  s.get('voiceStop').click();
  s.timers.fire(1200);
  assert.equal(r.stopCalls,1);
  s.timers.fire(4000);
  assert.equal(s.get('voiceDialog').disabled,true);
  assert.match(s.get('voiceStatus').textContent,/Chiudi questa scheda/);
  s.get('voiceDialog').click();
  assert.equal(s.recognizers.length,1);
  r.onend();
  assert.equal(s.get('voiceDialog').disabled,false);
  assert.match(s.get('voiceStatus').textContent,/terminato/);
});

test('Safari: mic stop while speaking invalidates old speech callback',()=>{
  const s=mountVoice();
  s.get('voiceDialog').click();
  const u=s.utterances.at(-1);
  s.get('voiceStop').click();
  assert.equal(s.get('voiceDialog').disabled,false);
  u.onend();
  assert.equal(s.recognizers.length,0,'old TTS completion cannot reopen microphone');
  assert.match(s.get('voiceStatus').textContent,/Dialogo interrotto/);
});

test('Safari: manual listening stop waits for browser onend',()=>{
  const s=mountVoice();
  s.get('voiceListen').click();
  const r=s.recognizers.at(-1);
  assert.ok(r.started);
  s.get('voiceStop').click();
  assert.equal(r.abortCalls,1);
  assert.equal(s.get('voiceListen').disabled,true);
  r.onend();
  assert.equal(s.get('voiceListen').disabled,false);
});

test('Safari: switching from listening to manual reading never reopens mic before closure',()=>{
  const s=mountVoice(),r=s.startListening();
  s.get('voiceRead').click();
  assert.equal(r.abortCalls,1);
  assert.equal(s.utterances.length,1,'do not start speech while old microphone still closing');
  assert.equal(s.get('voiceDialog').disabled,true);
  r.onend();
  s.get('voiceRead').click();
  assert.equal(s.utterances.length,2);
  assert.equal(s.recognizers.length,1,'reading does not start listening');
});
