/*
 * M4.2.1 — Workers AI binding inspection ONLY; zero inference.
 *
 * This module is intentionally not imported by worker/src/index.mjs.
 * No calls to env.AI.run, no route, no provider secrets, no KB upload.
 * Future inference requires a separate explicit authorization and code review.
 */
export const WORKERS_AI_MODEL_ID='@cf/openai/gpt-oss-20b';
export const WORKERS_AI_BINDING_NAME='AI';

export function inspectWorkersAiBinding(env) {
  const bindingAvailable=Boolean(env && typeof env==='object' &&
    env.AI && typeof env.AI.run==='function');
  return Object.freeze({
    provider:'cloudflare-workers-ai',
    modelId:WORKERS_AI_MODEL_ID,
    binding:WORKERS_AI_BINDING_NAME,
    bindingAvailable,
    decision:bindingAvailable?'INFERENCE_DISABLED':'AI_BINDING_UNAVAILABLE',
    aiEnabled:false,
    canGenerate:false,
    modelInputAllowed:false,
    modelRequests:0,
    allowCompletion:false,
    sessionChanged:false
  });
}
