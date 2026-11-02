/* Fase 14.3 — recupero deterministico di riferimenti tecnici, OFFLINE.
 * Modulo di ANTEPRIMA per futura integrazione AI: nessuna API, nessuna
 * mutazione dello stato dell'app e nessuna trasmissione di dati.
 * In presenza di contenuti DA_VALIDARE: externalTransmissionAllowed=false.
 */
(() => {
  'use strict';
  const KB = window.TagliandoKnowledge;
  if (!KB) throw new Error('Caricare knowledge.js prima di retrieval.js');
  const SCHEMA = 'tagliando.retrieval.v1';
  const MAX_QUERY = 500;
  const MAX_REFERENCES = 3;
  const LIMIT = 1800;
  const normalize = x => String(x ?? '').toLocaleLowerCase('it-IT').normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ').trim();
  const stopwords = new Set('e ed o ma di del della delle degli dei da al allo alla alle il lo la i gli le un una uno in nel nell per con che cosa come quale quali quali sono ho hai avete posso devo fare faccio quale quando dove questo questa quella vorrei mi me si non su sul sulla ecco mio mia meglio spiegami dimmi serve vorrei voglio'.split(' '));
  const tokens = s => [...new Set(normalize(s).split(' ').filter(w => w.length >= 3 && !stopwords.has(w)))];

  // Lexical gates are deliberately conservative; they are NOT a certified safety detector.
  const anchors = [
    [1, /\b(sottoscocca|scocca|incrostazion\w*|erba sotto|pulizia della scocca)\b/],
    [2, /\b(lama|lame|taglient\w*|affilat\w*|mozzo|portalama|equilibratur\w*|bilanciament\w*)\b/],
    [3, /\b(filtro|filtri|prefiltro|spugna|elemento filtrante)\b/],
    [4, /\b(candela|candele|pipetta|elettrodi|accensione)\b/],
    [5, /\b(ruota|ruote|boccola|boccole|cuscinetto|cuscinetti)\b/],
    [6, /\b(cavo|cavi|leveragg\w*|comando di arresto|freno motore|fissaggi|viti)\b/],
    [7, /\b(olio|lubrificant\w*|astina|basamento)\b/],
    [8, /\b(benzina|carburante|rimessaggio|vaschetta|stabilizzante|serbatoio)\b/]
  ];
  const outside = /\b(automobile|automobili|auto|cambio auto|cambio dell auto|frizione|centralina|motocicletta|moto|camion)\b/;
  const repair = /\b(ripara\w*|riparazione|revisiona\w*|tarare|taratura|modificare|truccare|rimuovere la sicurezza)\b/;
  const specific = /\b(quanto|quanti|quanta|quale|quali|dimmi)\b.{0,55}\b(nm|newton|coppia|serrare|stringere|gradi|angolo|ml|litri|olio|viscosita|candela|ricambio|filtro|lama|capacita|tipo|sigla|codice)\b|\b(quale olio|che olio|che candela|che filtro|coppia di serraggio|distanza elettrodi|capacita olio|gradazione|valore in nm|specifiche motore|codice ricambio|numero di giri|diametro esatto)\b/;
  const commands = /^(fatto|ho finito|avanti|indietro|salta|conferma|registra|ferma|riprendiamo|annulla|pausa|stop)\b/;
  const generic = /\b(precauzioni|sicurezza|rischi|avvertenze|scopo|obiettivo|spiega\w*|spiegami|ripeti|chiarisci|passaggio corrente|cosa devo fare)\b/;

  function envelope(decision, reason, extra = {}) {
    return {
      schema: SCHEMA,
      decision,
      reason,
      aiReady: false,
      externalTransmissionAllowed: false,
      stateChanged: false,
      sourceSchema: KB.schema,
      references: [],
      ...extra
    };
  }
  function buildPreview(question, context = {}, database) {
    const q = String(question ?? '').trim();
    if (!q || q.length > MAX_QUERY) return envelope('REJECT', 'Domanda assente o superiore a 500 caratteri.');
    let kb;
    try { kb = database || KB.getKnowledge(); } catch (_) { return envelope('UNAVAILABLE', 'Base di conoscenza non accessibile.'); }
    if (!KB.validate(kb).ok) return envelope('UNAVAILABLE', 'Archivio tecnico incoerente: retrieval bloccato.');

    const core = KB.answer(q, context, kb);
    if (core.kind === 'stop') return envelope('SAFETY_STOP', core.text);
    const normalized = normalize(q);
    if (core.kind === 'model' || specific.test(normalized)) {
      return envelope('MODEL_REQUIRED', 'Parametro dipendente dal modello: usare il manuale del costruttore. Non inviare la richiesta al modello AI senza dati tecnici verificati.');
    }
    if (outside.test(normalized) || repair.test(normalized)) {
      return envelope('OUT_OF_SCOPE', 'Riparazione o dominio non compresi nelle procedure preventive attuali.');
    }
    if (commands.test(normalized)) {
      return envelope('COMMAND', 'I comandi operativi sono gestiti solo dal controllore deterministico, non dall’AI.');
    }
    const currentId = Number(context.operationId ?? context.operation);
    const current = kb.procedures.find(p => p.operationId === currentId);
    const method = String(context.method ?? '');
    const selected = current && KB.activeSteps(current, method).find(s =>
      String(context.stepTitle || '').trim() && normalize(s.title) === normalize(context.stepTitle));
    const found = anchors.filter(([id, re]) => re.test(normalized)).map(([id]) => id);
    // "olio sul filtro": due componenti, nessun contesto univoco: chiedere chiarimento.
    let target = null;
    if (found.length > 1) {
      if (current && found.includes(currentId) && /\b(questa|questo|qui|passaggio)\b/.test(normalized)) target = current;
      else return envelope('CLARIFY', 'Sono citate più lavorazioni. Specifica quale componente intendi.');
    } else if (found.length === 1) target = kb.procedures.find(p => p.operationId === found[0]);
    else if (selected && generic.test(normalized)) target = current;
    else return envelope('NO_MATCH', 'Non è stato identificato un componente univoco nelle otto procedure.');
    if (!target) return envelope('NO_MATCH', 'Lavorazione non presente nella base tecnica.');

    // Sia operazione sia modalità devono coincidere; altrimenti solo passaggi comuni.
    const selectedMethod = current && target.operationId === currentId ? method : '';
    const candidates = KB.activeSteps(target, selectedMethod);
    const qtokens = tokens(q);
    const scoreFor = s => {
      const title = new Set(tokens(s.title));
      const body = new Set(tokens(s.instruction + ' ' + s.warning));
      let score = qtokens.reduce((n, t) => n + (title.has(t) ? 6 : 0) + (body.has(t) ? 2 : 0), 0);
      if (selected && target.id === current?.id && selected.id === s.id && generic.test(normalized)) score += 12;
      return score;
    };
    const ranked = candidates.map(s => ({s, rank: scoreFor(s)}))
      .sort((a, b) => b.rank - a.rank || a.s.index - b.s.index);
    const meaningful = ranked.filter(x => x.rank > 0);
    let rows;
    if (meaningful.length) rows = meaningful.slice(0, MAX_REFERENCES);
    else if (selected && target.id === current?.id && generic.test(normalized)) rows = [{s: selected, rank: 12}];
    else return envelope('CLARIFY', 'Componente identificato, ma non trovo un passaggio preciso per la domanda.');

    const references = [];
    let length = 0;
    for (const {s} of rows) {
      const ref = {
        id: s.id,
        operationId: target.operationId,
        operation: target.title,
        method: selectedMethod || null,
        step: s.title,
        instruction: s.instruction,
        warning: s.warning,
        provenance: s.source,
        reviewStatus: s.review.status
      };
      const size = JSON.stringify(ref).length;
      if (length + size > LIMIT) break;
      length += size;
      references.push(ref);
    }
    if (!references.length) return envelope('UNAVAILABLE', 'Selezione troppo estesa o fuori dai limiti.');
    const allReviewed = references.every(x => x.reviewStatus === 'VALIDATO');
    // La validazione dei contenuti è necessaria, ma NON sufficiente per abilitare AI:
    // il backend dovrà ripetere autorizzazione, policy e verifica fonti server-side.
    return envelope('PREVIEW_ONLY', allReviewed
      ? 'Riferimenti trovati; integrazione backend non ancora autorizzata.'
      : 'Riferimenti trovati, ma ancora DA_VALIDARE. Non trasmettere al modello AI.', {
        operation: {id: target.id, title: target.title},
        context: {operationId: current ? current.operationId : null, method: selectedMethod || null,
          stepId: selected?.id ?? null},
        references,
        referenceCount: references.length,
        maxReferenceCount: MAX_REFERENCES
      });
  }
  window.TagliandoRetrieval = Object.freeze({schema: SCHEMA, version:'14.3.0',
    buildPreview, maxQueryLength:MAX_QUERY});
})();