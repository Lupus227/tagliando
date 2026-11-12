/*
 * M4.2.2: fixed, read-only inference probe, disabled by default.
 * No KB instructions are sent to the model. The model proposes only a source
 * selector, which the existing M4.1 contract checks before rendering text.
 */
import {prepareM4Turn,reviewM4Candidate} from './m4-contract.mjs';
import {WORKERS_AI_MODEL_ID} from './workers-ai-binding.mjs';
import {inspectM4SelectorEnvelope,classifyM4CandidateReview} from './m4-output-diagnostics.mjs';

const SCENARIOS=Object.freeze({
  'paper-wash':Object.freeze({operationId:3,stepId:'RASA-OP-03-P03',
    filterType:'carta',question:'Posso lavare con acqua il filtro in carta?'}),
  'cover-stuck':Object.freeze({operationId:3,stepId:'RASA-OP-03-P01',
    filterType:null,question:'Non riesco ad aprire il coperchio del filtro.'}),
  'off-topic':Object.freeze({operationId:3,stepId:'RASA-OP-03-P03',
    filterType:'carta',question:'Quale film esce al cinema?'})
});
function result(decision,message,modelRequests=0,extra={}){
  return {ok:false,decision,message,modelRequests,aiEnabled:false,
    canGenerate:false,allowCompletion:false,sessionChanged:false,
    probeInferenceExecuted:modelRequests===1,references:[],...extra};
}
/*
 * M4.2.4 — same strict M4.2.3 envelope rules, with a fixed diagnostic code.
 * This compatibility export remains unchanged for existing M4.2.3 tests.
 */
export function parseM4SelectorEnvelope(raw){
  return inspectM4SelectorEnvelope(raw).candidate;
}
// Trusted deploy-time expiry. A missing or malformed deadline FAILS CLOSED.
export function aiProbeWindowValid(env,nowMs=Date.now()){
  const expiry=env?.AI_PROBE_EXPIRES_AT;
  if(typeof expiry!=='string' ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(expiry))return false;
  const deadline=Date.parse(expiry);
  return Number.isFinite(deadline)&&Number.isFinite(nowMs)&&nowMs<deadline;
}
export const M4_PROBE_MODEL_ID=WORKERS_AI_MODEL_ID;

export async function runFixedM4Probe(caseId,env){
  if(!Object.hasOwn(SCENARIOS,caseId))
    return result('INVALID_CASE','Prova non riconosciuta.');
  // Refuse the inference BEFORE checking any source if the deployment is
  // not explicitly enabled. Binding presence alone cannot activate the model.
  if(env?.AI_PROBE_MODE!=='enabled')
    return result('PROBE_DISABLED','La prova AI è disabilitata.');
  if(!aiProbeWindowValid(env))
    return result('PROBE_EXPIRED','La finestra della prova AI è terminata.');
  const question=SCENARIOS[caseId];
  const state={mode:'READ_ONLY_LAB',operationId:3,stepId:question.stepId,
    filterType:question.filterType,blocked:false};
  const prepared=prepareM4Turn(question,state);
  if(!prepared.ok)return result(prepared.decision,prepared.message,0,{testCase:caseId});
  if(!env.AI||typeof env.AI.run!=='function')
    return result('AI_BINDING_UNAVAILABLE','Binding AI non disponibile.');
  let output;
  try{
    // Strictly fixed question, no personal input and no reviewed KB prose.
    output=await env.AI.run(WORKERS_AI_MODEL_ID,{
      messages:[
        {role:'system',content:
          'Laboratorio filtro aria OP03. Non scrivere istruzioni tecniche. '+
          'Restituisci soltanto JSON. Se la domanda riguarda il passaggio '+
          'P03 del filtro in carta, rispondi esattamente con '+
          '{"action":"SHOW_REVIEWED_STEP","sourceStepId":"RASA-OP-03-P03",'+
          '"sourceRevision":"F15.18-R2"}. Altrimenti rispondi '+
          '{"action":"ABSTAIN"}. Non aggiungere altri campi.'},
        {role:'user',content:
          'Passaggio corrente: '+prepared.stepId+'\nDomanda: '+prepared.question}
      ],
      stream:false,max_tokens:192,temperature:0
    });
  }catch(_){
    return result('MODEL_UNAVAILABLE','Modello non disponibile; nessun avanzamento.',1,{diagnosticCode:'PROVIDER_ERROR'});
  }
  // No raw response or model-generated instruction is returned or logged.
  // First inspect its envelope; M4.1 remains the FINAL authorization gate.
  const inspected=inspectM4SelectorEnvelope(output);
  const reviewed=reviewM4Candidate(prepared,inspected.candidate,state);
  const diagnosticCode=inspected.candidate===null?
    inspected.diagnosticCode:
    classifyM4CandidateReview(inspected.candidate,reviewed,prepared.source);
  return {...reviewed,diagnosticCode,modelRequests:1,probeInferenceExecuted:true,
    testCase:caseId,mode:'fixed_read_only_probe',modelId:WORKERS_AI_MODEL_ID};
}
