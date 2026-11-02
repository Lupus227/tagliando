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
