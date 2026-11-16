/*
 * M4.3 — Isolated, read-only natural-language conversation lab.
 * Deliberately NOT the M4.1 selector or the public /api/assist endpoint.
 * Two fixed prompts, one model call per request; no technical guidance,
 * no tools, no KB access, no saved history, no session mutation.
 * AI_CHAT_MODE=disabled and expired by default.
 */
import {WORKERS_AI_MODEL_ID} from './workers-ai-binding.mjs';
import {chatLabPage,chatLabClient} from './m4-chat-lab-ui.mjs';

const STAGING='https://tagliando-ai-staging.maico-gua.workers.dev';
const HEADERS={
  'Content-Type':'application/json; charset=utf-8',
  'Cache-Control':'no-store, max-age=0',
  'X-Content-Type-Options':'nosniff',
  'Referrer-Policy':'no-referrer',
  'X-Robots-Tag':'noindex, nofollow',
  'Vary':'Origin'
};
const FIRST='Saluta brevemente in italiano, scegli un solo colore tra rosso, blu e verde e dichiara chiaramente quale hai scelto.';
const SECOND='Quale colore hai scelto nel messaggio precedente? Rispondi in italiano indicando soltanto quel colore.';
const SYSTEM='Laboratorio di conversazione, non di manutenzione. Rispondi in italiano, in modo breve e naturale. Non fornire istruzioni tecniche, non invocare strumenti e non usare JSON.';
const plain=value=>value!==null&&typeof value==='object'&&!Array.isArray(value)&&
 (Object.getPrototypeOf(value)===Object.prototype||Object.getPrototypeOf(value)===null);
const reply=(decision,message,modelRequests=0,extra={})=>({
  ok:decision==='CHAT_TEXT_READY',decision,message,modelRequests,
  aiEnabled:false,canGenerate:false,allowCompletion:false,
  sessionChanged:false,labTextOnly:true,...extra
});
const json=(status,value)=>new Response(JSON.stringify(value),{status,headers:HEADERS});
function validExpiry(env,now=Date.now()){
  const expiry=env?.AI_CHAT_EXPIRES_AT;
  if(typeof expiry!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(expiry))return false;
  const time=Date.parse(expiry);
  return Number.isFinite(time)&&now<time;
}
function validPrevious(value){
 return typeof value==='string'&&value.trim().length>0&&value.length<=800&&
  !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value);
}
export function extractChatText(raw){
  if(!plain(raw))return {code:'ENVELOPE_INVALID'};
  const hasResponse=Object.hasOwn(raw,'response');
  const hasChoices=Object.hasOwn(raw,'choices');
  if(hasResponse===hasChoices)return {code:'ENVELOPE_UNSUPPORTED'};
  let text;
  if(hasResponse){
    text=raw.response;
  }else{
    if(!Array.isArray(raw.choices)||raw.choices.length!==1||!plain(raw.choices[0]))
      return {code:'CHOICES_INVALID'};
    const choice=raw.choices[0];
    if(choice.finish_reason==='length')return {code:'OUTPUT_TRUNCATED'};
    if(choice.finish_reason!=='stop')return {code:'FINISH_REASON_UNSUPPORTED'};
    const m=choice.message;
    if(!plain(m))return {code:'MESSAGE_INVALID'};
    if(m.role!=='assistant')return {code:'ROLE_UNSUPPORTED'};
    if(m.tool_calls!==undefined&&m.tool_calls!==null&&
       !(Array.isArray(m.tool_calls)&&m.tool_calls.length===0))
      return {code:'TOOL_CALL_UNSUPPORTED'};
    if(m.refusal!==undefined&&m.refusal!==null)return {code:'REFUSAL_PRESENT'};
    if(m.function_call!==undefined&&m.function_call!==null)
      return {code:'FUNCTION_CALL_UNSUPPORTED'};
    text=m.content;
  }
  if(typeof text!=='string'||!text.trim())return {code:'TEXT_MISSING'};
  if(text.length>800)return {code:'TEXT_TOO_LONG'};
  if(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text))
    return {code:'TEXT_INVALID'};
  return {code:'TEXT_OK',text:text.trim()};
}
export async function runChatTurn(input,env,now=Date.now()){
  if(!plain(input)||!([1,2].includes(input.turn))||
    (input.turn===1&&Object.keys(input).join(',')!=='turn')||
    (input.turn===2&&(!validPrevious(input.previousAnswer)||
      Object.keys(input).sort().join(',')!=='previousAnswer,turn')))
    return reply('INVALID_INPUT','Turno non valido.');
  if(env?.AI_CHAT_MODE!=='enabled')
    return reply('CHAT_DISABLED','Laboratorio conversazionale disabilitato.');
  if(!validExpiry(env,now))
    return reply('CHAT_EXPIRED','Finestra conversazionale terminata.');
  if(!env.AI||typeof env.AI.run!=='function')
    return reply('AI_BINDING_UNAVAILABLE','Modello non disponibile.');
  const messages=[{role:'system',content:SYSTEM},{role:'user',content:FIRST}];
  if(input.turn===2)messages.push(
    {role:'assistant',content:input.previousAnswer},
    {role:'user',content:SECOND}
  );
  let raw;
  try{
    raw=await env.AI.run(WORKERS_AI_MODEL_ID,{
      messages,stream:false,max_tokens:160,temperature:0.2
    });
  }catch(_){
    return reply('MODEL_UNAVAILABLE','Chiamata al modello non riuscita.',1,{diagnosticCode:'PROVIDER_ERROR'});
  }
  const output=extractChatText(raw);
  if(output.code!=='TEXT_OK')
    return reply('CHAT_OUTPUT_REJECTED','Formato risposta non compatibile.',1,{
      diagnosticCode:output.code});
  return reply('CHAT_TEXT_READY','Risposta testuale ricevuta dal modello.',1,{
    text:output.text,turn:input.turn,modelId:WORKERS_AI_MODEL_ID});
}
async function readInput(request){
  if(!/^application\/json(?:\s*;.*)?$/i.test(request.headers.get('content-type')||''))return null;
  const declared=Number(request.headers.get('content-length'));
  if(Number.isFinite(declared)&&declared>1100)return null;
  const reader=request.body?.getReader();
  if(!reader)return null;
  const chunks=[];let total=0;
  try{
    while(true){
      const {done,value}=await reader.read();
      if(done)break;
      total+=value.byteLength;
      if(total>1100){await reader.cancel();return null;}
      chunks.push(value);
    }
    const arr=new Uint8Array(total);let offset=0;
    for(const chunk of chunks){arr.set(chunk,offset);offset+=chunk.byteLength;}
    const value=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(arr));
    if(!plain(value)||!([1,2].includes(value.turn)))return null;
    if(value.turn===1&&Object.keys(value).length===1)return {turn:1};
    if(value.turn===2&&Object.keys(value).length===2&&
       Object.hasOwn(value,'previousAnswer')&&validPrevious(value.previousAnswer))
      return {turn:2,previousAnswer:value.previousAnswer};
    return null;
  }catch(_){return null;}
  finally{try{reader.releaseLock();}catch(_){}}
}
export async function serveChatLab(request,env,ctx,verifyWorkerAccess){
  const url=new URL(request.url);
  const api=url.pathname==='/api/lab/ai-chat';
  const page=url.pathname==='/lab/ai-chat'||url.pathname==='/lab/ai-chat/';
  const js=url.pathname==='/lab/ai-chat/client.js';
  if(!api&&!page&&!js)return json(404,reply('NOT_FOUND','Percorso assente.'));
  if(request.method!==(api?'POST':'GET'))
    return json(405,reply('METHOD_NOT_ALLOWED','Metodo non consentito.'));
  if(env.SERVICE_MODE!=='guarded')
    return json(503,reply('SERVICE_DISABLED','Servizio disabilitato.'));
  if(url.origin!==STAGING||env.SELF_TEST_ORIGIN!==STAGING||
     (api&&request.headers.get('origin')!==STAGING))
    return json(403,reply('TEST_ORIGIN_DENIED','Origine non consentita.'));
  let actor;
  try{actor=await verifyWorkerAccess(request,env,ctx,api);}
  catch(_){return json(401,reply('UNAUTHORIZED','Access richiesto.'));}
  if(!api){
    return new Response(js?chatLabClient:chatLabPage,{status:200,headers:{
      ...HEADERS,
      'Content-Type':js?'application/javascript; charset=utf-8':'text/html; charset=utf-8',
      'X-Frame-Options':'DENY',
      'Content-Security-Policy':"default-src 'none'; script-src 'self'; connect-src 'self'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"
    }});
  }
  if(env.AI_CHAT_MODE!=='enabled')
    return json(503,reply('CHAT_DISABLED','Laboratorio conversazionale disabilitato.'));
  if(!validExpiry(env))
    return json(503,reply('CHAT_EXPIRED','Finestra conversazionale terminata.'));
  if(!actor?.sub)return json(401,reply('UNAUTHORIZED','Identità non verificata.'));
  if(!env.AI_PROBE_LIMITER||typeof env.AI_PROBE_LIMITER.limit!=='function')
    return json(503,reply('CHAT_LIMITER_REQUIRED','Limiter non disponibile.'));
  const input=await readInput(request);
  if(!input)return json(400,reply('INVALID_INPUT','Richiesta non valida.'));
  let limited;
  try{limited=await env.AI_PROBE_LIMITER.limit({key:'chat-lab-all-users'});}
  catch(_){return json(503,reply('CHAT_LIMITER_UNAVAILABLE','Limiter non disponibile.'));}
  if(limited?.success!==true)
    return json(429,reply('CHAT_RATE_LIMITED','Limite richieste: riprova dopo 60 secondi.'));
  const result=await runChatTurn(input,env);
  return json(result.ok?200:result.modelRequests?422:503,result);
}
