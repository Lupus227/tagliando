/*
 * Deterministic SERVER-side guard. Not a diagnosis, not a safety certificate.
 * It cannot authorize procedures, calculate specifications or create tickets.
 */
const norm = value => String(value).toLocaleLowerCase('it-IT').normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, ' ')
  .replace(/\s+/g, ' ').trim();
const hazard = [
  {re:/\b(lama|tagliente)\b.*\b(crep\w*|fessur\w*|rott\w*|spezzat\w*|lesionat\w*|piegat\w*)\b|\b(crep\w*|fessur\w*|rott\w*|spezzat\w*|lesionat\w*|piegat\w*)\b.*\b(lama|tagliente)\b/,
    message:'Possibile danno alla lama: sospendi il lavoro. Non affilare né rimontare una lama compromessa.'},
  {re:/\b(motore|leva|freno|arresto)\b.*\b(non si spegne|non spegne|non si ferma|resta acceso|rimane acceso)\b|\b(non si spegne|non spegne|non si ferma|resta acceso|rimane acceso)\b.*\b(motore|leva|freno)\b/,
    message:'Possibile guasto al comando di arresto. Non utilizzare la macchina; interrompi e registra il problema.'},
  {re:/\b(perdo|perdita|perde|gocciola|fuoriesce|odore forte|puzza)\b.*\b(benzina|carburante)\b|\b(benzina|carburante)\b.*\b(perdita|perde|fuoriesce|gocciola)\b/,
    message:'Possibile perdita di carburante. Non avviare il motore e tieni lontane fonti di innesco.'},
  {re:/\b(filetto|filettatura|sede candela)\b.*\b(spanat\w*|danneggiat\w*|rovinat\w*)\b|\b(spanat\w*|danneggiat\w*|rovinat\w*)\b.*\b(filetto|filettatura|sede candela)\b/,
    message:'Filettatura potenzialmente danneggiata: non forzare e richiedi una verifica tecnica.'}
];
// M4.5.3.1: 'che' may introduce a subordinate clause ("che il filtro ...").
// Keep MODEL_REQUIRED for explicit 'che filtro/che tipo di filtro' requests,
// without interpreting every following technical noun as a requested spec.
const modelParameter = /\b(quanto|quanti|quanta|quale|quali)\b.{0,55}\b(olio|benzina|carburante|nm|newton|coppia|serraggio|candela|capacita|ricambio|filtro|gradazione|viscosita|gradi|litri|ml|quantita)\b|\bche\s+(?:tipo\s+di\s+)?(?:olio|benzina|carburante|candela|filtro|ricambio|gradazione|viscosita|coppia|serraggio|quantita)\b|\b(coppia di serraggio|quantita olio|codice candela|distanza elettrodi|capacita del motore|torque|specifiche del motore)\b/;
const command = /^(fatto|avanti|salta|indietro|registra|pausa|stop|riprendiamo|annulla|ho finito|ferma)\b/;
const unsupported = /\b(automobile|auto|camion|moto|centralina|cambio|frizione)\b|\b(riparare|riparazione|revisionare|rimappare|truccare)\b/;

export function evaluateSafety(question) {
  const q = norm(question);
  const threat = hazard.find(x => x.re.test(q));
  if (threat) return {decision:'SAFETY_STOP',message:threat.message,canGenerate:false};
  if (command.test(q)) return {decision:'COMMAND',message:'La gestione dei comandi rimane nel controllore deterministico della PWA.',canGenerate:false};
  if (unsupported.test(q)) return {decision:'OUT_OF_SCOPE',message:'Richiesta fuori dalle procedure preventive disponibili.',canGenerate:false};
  if (modelParameter.test(q)) return {decision:'MODEL_REQUIRED',message:'Serve una fonte del costruttore verificata per il modello esatto. Non fornire valori ipotetici.',canGenerate:false};
  // No server-side validated technical source exists yet.
  return {decision:'PENDING_VALIDATION',message:'La conoscenza tecnica non è ancora stata validata per risposte conversazionali.',canGenerate:false};
}
