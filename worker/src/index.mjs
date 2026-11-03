/*
 * Fase 14.4 — Worker sperimentale: nessuna integrazione AI o chiave API.
 * Anche se distribuito per errore, SERVICE_MODE=disabled blocca /api/assist.
 * Richieste abilitate SOLO dopo Access + rate limit + revisione configurazione.
 */
import {verifyWorkerAccess} from './access.mjs';
import {evaluateSafety} from './policy.mjs';
import {testPage, testRunner} from './test-page.mjs';
import {servePilot} from './pilot.mjs';

const MAX_BODY_BYTES = 2048;
const MAX_QUESTION_CHARS = 500;
const baseHeaders = {
  'Content-Type':'application/json; charset=utf-8',
  'Cache-Control':'no-store, max-age=0',
  'X-Content-Type-Options':'nosniff',
  'Referrer-Policy':'no-referrer',
  'X-Robots-Tag':'noindex, nofollow',
  'Vary':'Origin'
};
function respond(status, data, origin = null) {
  const headers = {...baseHeaders};
  if (origin) headers['Access-Control-Allow-Origin'] = origin;
  return new Response(JSON.stringify(data), {status,headers});
}
function error(status, code, origin = null) {
  return respond(status, {ok:false,code,aiEnabled:false}, origin);
}
async function readLimitedJson(request) {
  if (!/^application\/json(?:\s*;.*)?$/i.test(request.headers.get('content-type') || ''))
    return {error:'UNSUPPORTED_CONTENT_TYPE'};
  const declared = Number(request.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) return {error:'BODY_TOO_LARGE'};
  const reader = request.body?.getReader();
  if (!reader) return {error:'BAD_BODY'};
  let length = 0;
  const chunks = [];
  try {
    while (true) {
      const {done,value} = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BODY_BYTES) {
        await reader.cancel();
        return {error:'BODY_TOO_LARGE'};
      }
      chunks.push(value);
    }
    const buffer = new Uint8Array(length);
    let offset=0;
    for (const chunk of chunks) {buffer.set(chunk, offset);offset += chunk.length;}
    const data = JSON.parse(new TextDecoder('utf-8', {fatal:true}).decode(buffer));
    if (data === null || Array.isArray(data) || typeof data !== 'object') return {error:'BAD_BODY'};
    const keys = Object.keys(data);
    if (!keys.length || keys.some(k=>!['question','operationId'].includes(k))) return {error:'BAD_BODY'};
    if (typeof data.question !== 'string' ||
      !data.question.trim() || data.question.length > MAX_QUESTION_CHARS ||
      /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(data.question)) return {error:'BAD_QUESTION'};
    if (data.operationId !== undefined &&
      (!Number.isInteger(data.operationId) || data.operationId < 1 || data.operationId > 8))
      return {error:'BAD_OPERATION'};
    return {data:{question:data.question, operationId:data.operationId ?? null}};
  } catch (_) {
    return {error:'BAD_BODY'};
  } finally {
    try {reader.releaseLock();} catch (_) {}
  }
}
const worker = {
  async fetch(request, env = {}, ctx = {}) {
    const url = new URL(request.url);
    if (url.pathname === '/health' && request.method === 'GET') {
      return respond(200, {ok:true,service:'tagliando-ai-gateway',
        stage:'14.4',aiEnabled:false,modelRequests:0});
    }
    // Diagnostic endpoint: verifies the signed Access assertion inside the Worker.
    // Does not disclose tokens, identities, email or Access configuration.
    // Intentionally independent from SERVICE_MODE so AI stays disabled.
    if (url.pathname === '/api/auth-check') {
      if (request.method !== 'GET') return error(405,'METHOD_NOT_ALLOWED');
      try {
        await verifyWorkerAccess(request, env, ctx);
      } catch (_) {
        return error(401,'ACCESS_VERIFICATION_FAILED');
      }
      return respond(200, {ok:true, accessVerified:true,
        aiEnabled:false, modelRequests:0, sessionChanged:false});
    }
    // Fase 14.7 — PWA snapshot isolated behind Access on the same origin.
    // No changes to the public PWA, existing API, or voice command handlers.
    if (url.pathname === '/pilot' || url.pathname.startsWith('/pilot/'))
      return servePilot(request, env, ctx, verifyWorkerAccess);

    // Same-origin staging console, never reachable without signed Access identity.
    // Not an API bypass: it can only call the ordinary guarded /api/assist route.
    if (url.pathname === '/test' || url.pathname === '/test/runner.js') {
      if (request.method !== 'GET') return error(405,'METHOD_NOT_ALLOWED');
      if (env.SERVICE_MODE !== 'guarded') return error(503,'SERVICE_DISABLED');
      if (env.SELF_TEST_ORIGIN !== url.origin ||
          env.SELF_TEST_ORIGIN !== 'https://tagliando-ai-staging.maico-gua.workers.dev')
        return error(403,'TEST_ORIGIN_DENIED');
      try { await verifyWorkerAccess(request,env,ctx); }
      catch (_) { return error(401,'UNAUTHORIZED'); }
      const js=url.pathname === '/test/runner.js';
      return new Response(js ? testRunner : testPage, {
        status:200,
        headers:{...baseHeaders,
          'Content-Type':js?'application/javascript; charset=utf-8':'text/html; charset=utf-8',
          'X-Frame-Options':'DENY',
          'Content-Security-Policy':"default-src 'none'; script-src 'self'; connect-src 'self'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"
        }
      });
    }
    if (url.pathname !== '/api/assist') return error(404,'NOT_FOUND');
    if (!['POST','OPTIONS'].includes(request.method)) return error(405,'METHOD_NOT_ALLOWED');

    // Origin is NOT authentication. It only reduces cross-site browser exposure.
    const origin = request.headers.get('origin');
    const configuredApp = env.ALLOWED_ORIGIN === 'https://lupus227.github.io';
    const appOrigin = configuredApp && origin === env.ALLOWED_ORIGIN;
    // The Access-protected test console may submit same-origin POST requests.
    // Never accept a self-test origin derived from arbitrary Host/Origin headers.
    const selfTestOrigin = env.SERVICE_MODE === 'guarded' &&
      env.SELF_TEST_ORIGIN === 'https://tagliando-ai-staging.maico-gua.workers.dev' &&
      env.SELF_TEST_ORIGIN === url.origin && origin === url.origin;
    if (!configuredApp || !(appOrigin || selfTestOrigin))
      return error(403,'ORIGIN_DENIED');
    if (request.method === 'OPTIONS') {
      const headers = {...baseHeaders,'Access-Control-Allow-Origin':origin,
        'Access-Control-Allow-Methods':'POST, OPTIONS',
        'Access-Control-Allow-Headers':'Content-Type',
        'Access-Control-Max-Age':'300'};
      return new Response(null, {status:204,headers});
    }
    if (env.SERVICE_MODE !== 'guarded') return error(503,'SERVICE_DISABLED',origin);
    let actor;
    try {
      actor = await verifyWorkerAccess(request, env, ctx, true);
    } catch (_) {
      return error(401,'UNAUTHORIZED',origin);
    }
    // Fail closed without a configured per-actor limiter. This limiter is approximate,
    // NOT a strict global cost budget. No upstream AI calls exist in this version.
    if (!env.API_LIMITER || typeof env.API_LIMITER.limit !== 'function')
      return error(503,'RATE_LIMITER_REQUIRED',origin);
    let limited;
    try {limited = await env.API_LIMITER.limit({key: 'assist:' + actor.sub});}
    catch (_) {return error(503,'RATE_LIMITER_UNAVAILABLE',origin);}
    if (!limited || limited.success !== true) return error(429,'RATE_LIMITED',origin);

    const body = await readLimitedJson(request);
    if (body.error) return error(body.error === 'BODY_TOO_LARGE' ? 413 : 400,body.error,origin);
    const result = evaluateSafety(body.data.question);
    const status = result.decision === 'PENDING_VALIDATION' ? 503 : 200;
    return respond(status,{ok:status === 200,decision:result.decision,
      message:result.message,operationId:body.data.operationId,
      aiEnabled:false,canGenerate:false,sessionChanged:false,
      references:[]},origin);
  }
};
export default worker;
