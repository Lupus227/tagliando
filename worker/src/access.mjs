/*
 * Fase 14.4 — Cloudflare Access JWT verification, no dependencies.
 * Header CF-Access-Jwt-Assertion is untrusted until signature/claims are checked.
 * Do not authorize from email headers, client-provided IDs or CORS alone.
 */
const b64 = str => {
  if (!/^[A-Za-z0-9_-]+$/.test(str) || str.length > 12000) throw new Error('bad_token');
  const bin = atob(str.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - str.length % 4) % 4));
  return Uint8Array.from(bin, x => x.charCodeAt(0));
};
const jsonPart = segment => JSON.parse(new TextDecoder('utf-8', {fatal:true}).decode(b64(segment)));
const validTeam = str => typeof str === 'string' && /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.cloudflareaccess\.com$/.test(str);
const validAud = str => typeof str === 'string' && /^[a-f0-9]{32,128}$/i.test(str);
const keysCache = new Map(); // Up to one trusted Access team per deployment in production.

export async function verifyAccessJwt(token, env, fetcher = fetch) {
  const team = env.ACCESS_TEAM_DOMAIN, aud = env.ACCESS_AUD;
  if (!validTeam(team) || !validAud(aud)) throw new Error('access_not_configured');
  if (typeof token !== 'string' || token.length < 70 || token.length > 8192) throw new Error('missing_token');
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('bad_token');
  const [h,p,s] = parts;
  const header = jsonPart(h), payload = jsonPart(p);
  if (!header || header.alg !== 'RS256' || typeof header.kid !== 'string' ||
    !/^[a-zA-Z0-9_-]{8,160}$/.test(header.kid)) throw new Error('bad_header');
  const expectedIssuer = 'https://' + team;
  const now = Math.floor(Date.now() / 1000);
  if (!payload || payload.iss !== expectedIssuer ||
    !(Array.isArray(payload.aud) ? payload.aud.includes(aud) : payload.aud === aud) ||
    typeof payload.sub !== 'string' || !payload.sub.trim() ||
    typeof payload.exp !== 'number' || payload.exp <= now ||
    typeof payload.iat !== 'number' || payload.iat > now + 60 ||
    (payload.nbf !== undefined && (typeof payload.nbf !== 'number' || payload.nbf > now))) {
    throw new Error('bad_claims');
  }
  // The trusted issuer controls its keys. Cache only public JWKS for 5 min.
  let entry = keysCache.get(team);
  if (!entry || entry.expiresAt <= Date.now()) {
    const res = await fetcher(expectedIssuer + '/cdn-cgi/access/certs', {
      method: 'GET', redirect: 'error',
      signal: AbortSignal.timeout(3000),
      headers: {Accept: 'application/json'}
    });
    if (!res.ok) throw new Error('jwks_unavailable');
    const jwks = await res.json();
    if (!jwks || !Array.isArray(jwks.keys) || jwks.keys.length > 30) throw new Error('bad_jwks');
    entry = {keys:jwks.keys, expiresAt:Date.now() + 5 * 60_000};
    keysCache.set(team, entry);
  }
  const jwk = entry.keys.find(k => k.kid === header.kid && k.kty === 'RSA' &&
    (k.alg === undefined || k.alg === 'RS256') &&
    (k.use === undefined || k.use === 'sig'));
  if (!jwk) throw new Error('unknown_key');
  const key = await crypto.subtle.importKey('jwk', jwk, {
    name:'RSASSA-PKCS1-v1_5', hash:'SHA-256'
  }, false, ['verify']);
  const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64(s),
    new TextEncoder().encode(h + '.' + p));
  if (!ok) throw new Error('invalid_signature');
  return {sub:payload.sub, aud};
}

/*
 * For requests directly authenticated by Cloudflare Access, ctx.access is a
 * trusted runtime assertion supplied by Cloudflare, not a client HTTP header.
 * Validate its application audience to avoid accepting another Access app.
 * Explicitly fail closed on an AUD mismatch: NEVER fall back to JWT then.
 *
 * The cryptographic JWT verifier is retained for environments where a genuine
 * signed Cf-Access-Jwt-Assertion is forwarded but ctx.access is unavailable.
 * No unsigned cookie / email / header is accepted as proof of identity.
 */
export async function verifyWorkerAccess(request, env, ctx, requireSubject = false) {
  if (ctx?.access) {
    if (!validAud(env.ACCESS_AUD) || ctx.access.aud !== env.ACCESS_AUD)
      throw new Error('access_audience_mismatch');
    if (!requireSubject) return {sub:null, aud:env.ACCESS_AUD};

    if (typeof ctx.access.getIdentity !== 'function')
      throw new Error('access_identity_unavailable');
    const identity = await ctx.access.getIdentity();
    // Cloudflare returns a per-user UUID; service tokens have a separate ID.
    // Refuse a shared/anonymous rate-limit key when neither is available.
    const sub = identity?.user_uuid || identity?.service_token_id;
    if (typeof sub !== 'string' || !sub.trim() || sub.length > 256)
      throw new Error('access_subject_unavailable');
    return {sub, aud:env.ACCESS_AUD};
  }
  return verifyAccessJwt(request.headers.get('cf-access-jwt-assertion'),env);
}
