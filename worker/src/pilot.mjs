/*
 * Fase 14.7 — Anteprima PWA isolata su Worker Access-protected.
 * Utilizza uno snapshot esatto dei file dev (non carica risorse remote).
 * Non condivide origin, localStorage, sessione o service worker con GitHub Pages.
 */
import {pilotAssets,pilotSourceCommit} from './pilot-assets.mjs';
import {pilotConnector} from './pilot-client.mjs';

const PILOT_ORIGIN='https://tagliando-ai-staging.maico-gua.workers.dev';
const mime=Object.freeze({
  'index.html':'text/html; charset=utf-8',
  'app.js':'application/javascript; charset=utf-8',
  'voice.js':'application/javascript; charset=utf-8',
  'support.js':'application/javascript; charset=utf-8',
  'knowledge.js':'application/javascript; charset=utf-8',
  'retrieval.js':'application/javascript; charset=utf-8',
  'knowledge-ui.js':'application/javascript; charset=utf-8',
  'style.css':'text/css; charset=utf-8',
  'pilot-connector.js':'application/javascript; charset=utf-8'
});
const cacheHeaders={
  'Cache-Control':'no-store, max-age=0',
  'X-Content-Type-Options':'nosniff',
  'X-Frame-Options':'DENY',
  'Referrer-Policy':'no-referrer',
  'X-Robots-Tag':'noindex, nofollow'
};
const pilotPolicy="default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; worker-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";
function previewHTML(){
  const original=pilotAssets['index.html'];
  // Strictly require the known original structure rather than publishing a
  // partially patched page when its source HTML changes.
  for(const snippet of ['<body><main>','</body>','<script src="./app.js" defer></script>'])
    if(!original.includes(snippet))throw Error('pilot_index_structure_changed');
  return original
    .replace('<link rel="manifest" href="./manifest.webmanifest">','')
    .replace('<link rel="apple-touch-icon" href="./icons/apple-touch-icon.png">','')
    .replace('<meta name="apple-mobile-web-app-capable" content="yes">','')
    .replace('<body><main>', '<body><main><section role="alert" style="padding:14px;background:#fff4d2;border:2px solid #a86400;border-radius:8px;margin:15px 0;color:#332700"><strong>COLLAUDO FASE 14.7 — COPIA ISOLATA</strong><p>Non usare questa copia durante una manutenzione reale. La sessione locale è distinta da quella pubblica. I comandi vocali e le procedure non sono stati modificati; i test backend richiedono un clic esplicito.</p></section>')
    .replace('</body>','<script src="./pilot-connector.js" defer></script></body>');
}
export async function servePilot(request, env, ctx, verifyAccess){
  const url=new URL(request.url);
  if(request.method!=='GET')
    return Response.json({ok:false,code:'METHOD_NOT_ALLOWED',aiEnabled:false},{status:405,headers:cacheHeaders});
  if(env.SERVICE_MODE!=='guarded')
    return Response.json({ok:false,code:'SERVICE_DISABLED',aiEnabled:false},{status:503,headers:cacheHeaders});
  if(url.origin!==PILOT_ORIGIN || env.SELF_TEST_ORIGIN!==PILOT_ORIGIN)
    return Response.json({ok:false,code:'PILOT_ORIGIN_DENIED',aiEnabled:false},{status:403,headers:cacheHeaders});
  try{await verifyAccess(request,env,ctx);}
  catch(_){return Response.json({ok:false,code:'UNAUTHORIZED',aiEnabled:false},{status:401,headers:cacheHeaders});}

  if(url.pathname==='/pilot')
    return new Response(null,{status:302,headers:{...cacheHeaders,Location:'/pilot/'}});
  if(!url.pathname.startsWith('/pilot/'))
    return Response.json({ok:false,code:'NOT_FOUND',aiEnabled:false},{status:404,headers:cacheHeaders});
  const name=url.pathname.slice('/pilot/'.length)||'index.html';
  if(!Object.hasOwn(mime,name))
    return Response.json({ok:false,code:'NOT_FOUND',aiEnabled:false},{status:404,headers:cacheHeaders});

  const html=name==='index.html';
  const source=html?previewHTML():name==='pilot-connector.js'?pilotConnector:pilotAssets[name];
  if(typeof source!=='string')
    return Response.json({ok:false,code:'ASSET_NOT_FOUND',aiEnabled:false},{status:503,headers:cacheHeaders});
  const headers={...cacheHeaders,'Content-Type':mime[name], 'X-Pilot-Source-Revision':pilotSourceCommit};
  if(html)headers['Content-Security-Policy']=pilotPolicy;
  return new Response(source,{status:200,headers});
}
