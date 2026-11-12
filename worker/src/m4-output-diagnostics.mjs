/*
 * M4.2.4 — Structural-only diagnostics for the fixed OP03 AI probe.
 *
 * No raw model response, generated prose, question, prompt, user identity,
 * dynamic provider data or model error message is logged or returned.
 * Diagnostic codes are a closed vocabulary, NOT an authorization decision.
 * M4.1 reviewM4Candidate remains the mandatory authorization boundary.
 */
export const M4_DIAGNOSTIC_VERSION='tagliando.m4.output-diagnostic.v1';

const plain=value=>value!==null&&typeof value==='object'&&
  !Array.isArray(value)&&
  (Object.getPrototypeOf(value)===Object.prototype||
   Object.getPrototypeOf(value)===null);

function inspected(code,candidate=null){
  return {diagnosticCode:code,candidate};
}

/*
 * Accepted envelopes are exactly the ones supported in M4.2.3.
 * This function only adds a deterministic reason for rejection; it does not
 * make extraction more permissive. A malformed or unrecognized output always
 * has candidate=null.
 */
export function inspectM4SelectorEnvelope(raw){
  if(!plain(raw))return inspected('ENVELOPE_UNKNOWN');
  const hasResponse=Object.hasOwn(raw,'response');
  const hasChoices=Object.hasOwn(raw,'choices');
  if(hasResponse&&hasChoices)return inspected('ENVELOPE_AMBIGUOUS');
  if(!hasResponse&&!hasChoices)return inspected('ENVELOPE_UNKNOWN');

  let candidate;
  if(hasResponse){
    candidate=raw.response;
  }else{
    if(!Array.isArray(raw.choices)||raw.choices.length!==1)
      return inspected('CHOICES_INVALID');
    const choice=raw.choices[0];
    if(!plain(choice))return inspected('CHOICES_INVALID');
    if(choice.finish_reason==='length')return inspected('OUTPUT_TRUNCATED');
    if(choice.finish_reason!=='stop')return inspected('FINISH_REASON_INVALID');
    if(!plain(choice.message)||choice.message.role!=='assistant'||
       Object.hasOwn(choice.message,'tool_calls')||
       Object.hasOwn(choice.message,'refusal')||
       Object.hasOwn(choice.message,'function_call'))
      return inspected('ROLE_OR_TOOL_UNSUPPORTED');
    candidate=choice.message.content;
  }

  if(typeof candidate==='string'){
    if(candidate.length>512)return inspected('OUTPUT_TOO_LONG');
    if(!candidate.length)return inspected('CONTENT_UNSUPPORTED');
    try{candidate=JSON.parse(candidate);}
    catch(_){return inspected('JSON_INVALID');}
  }
  if(!plain(candidate))return inspected('SELECTOR_NOT_OBJECT');
  return inspected('SELECTOR_PARSED',candidate);
}

/*
 * No model text leaves this module. The code is always a static token.
 * This is run AFTER reviewM4Candidate: never substitute it for the review.
 */
export function classifyM4CandidateReview(candidate,reviewed,expectedSource){
  if(!plain(reviewed))return 'CONTROLLER_REJECTED';
  if(reviewed.decision==='REVIEWED_SOURCE_DRY_RUN'&&reviewed.ok===true)
    return 'SOURCE_ACCEPTED';
  if(reviewed.decision==='NO_SUPPORTED_ANSWER')
    return 'MODEL_ABSTAINED';
  if(reviewed.decision!=='MODEL_OUTPUT_REJECTED')
    return 'CONTROLLER_REJECTED';
  if(!plain(candidate)||typeof candidate.action!=='string')
    return 'SELECTOR_ACTION_INVALID';
  if(candidate.action==='ABSTAIN'){
    return Object.keys(candidate).length===1?'CONTROLLER_REJECTED':'SELECTOR_SHAPE_INVALID';
  }
  if(candidate.action!=='SHOW_REVIEWED_STEP')
    return 'SELECTOR_ACTION_INVALID';
  const allowed=['action','sourceStepId','sourceRevision'];
  if(Object.keys(candidate).length!==3||
     Object.keys(candidate).some(k=>!allowed.includes(k))||
     allowed.some(k=>!Object.hasOwn(candidate,k))||
     typeof candidate.sourceStepId!=='string'||
     typeof candidate.sourceRevision!=='string')
    return 'SELECTOR_SHAPE_INVALID';
  if(!plain(expectedSource))return 'CONTROLLER_REJECTED';
  if(candidate.sourceStepId!==expectedSource.stepId)
    return 'SOURCE_STEP_MISMATCH';
  if(candidate.sourceRevision!==expectedSource.revision)
    return 'SOURCE_REVISION_MISMATCH';
  return 'CONTROLLER_REJECTED';
}
