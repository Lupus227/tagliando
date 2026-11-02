/* Assistente di officina — Fase 14.2 (sperimentale).
 * Base di conoscenza LOCALE, ricavata in sola lettura da OP in app.js.
 * Non conferma operazioni, non modifica sessioni, non invia dati a server.
 * Nessuna AI generativa e nessuna procedura certificata.
 */
(() => {
  'use strict';
  const SCHEMA = 'tagliando.knowledge.v1';
  const VERSION = '14.3.0';
  const STATUS = 'DA_VALIDARE';
  const CAUTION = 'Indicazione sperimentale da verificare sul manuale del modello effettivo.';
  const text = v => String(v == null ? '' : v).trim();
  const norm = v => text(v).toLocaleLowerCase('it-IT').normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  const skip = new Set('sono della delle degli dello dopo prima come cosa quale quali voglio vorrei posso devo serve fare faccio questo questa dove perche alla alle allo con nel nella nello una uno del dei per che hai sul sui gli cui piu non quando qual lavorazione passaggio'.split(' '));
  const terms = v => norm(v).split(' ').filter(w => w.length >= 3 && !skip.has(w));
  const pad = n => String(n).padStart(2, '0');

  function build(operations) {
    if (!Array.isArray(operations)) throw new TypeError('Archivio delle procedure non disponibile.');
    return {
      schema: SCHEMA,
      version: VERSION,
      sourceAppVersion: '0.12.1',
      source: 'app.js / OP',
      validation: STATUS,
      procedures: operations.map(op => ({
        id: 'RASA-OP-' + pad(op.id),
        operationId: op.id,
        title: text(op.title),
        objective: text(op.goal),
        context: text(op.context),
        scope: 'manutenzione_preventiva_rasaerba_benzina',
        source: {file: 'app.js', record: 'OP[id=' + op.id + ']'},
        review: {status: STATUS, reviewer: null, reviewedAt: null, revision: null},
        methods: (op.methods || []).map(m => ({id: text(m[0]), label: text(m[1])})),
        steps: (op.steps || []).map((s, i) => ({
          id: 'RASA-OP-' + pad(op.id) + '-P' + pad(i + 1),
          index: i + 1,
          title: text(s[0]),
          instruction: text(s[1]),
          warning: text(s[2]),
          methods: text(s[3]).split('|').filter(Boolean),
          source: {file: 'app.js', record: 'OP[id=' + op.id + '].steps[' + i + ']'},
          review: {status: STATUS, reviewer: null, reviewedAt: null, revision: null}
        }))
      }))
    };
  }

  function validate(kb) {
    const errors = [];
    if (!kb || kb.schema !== SCHEMA || !Array.isArray(kb.procedures)) {
      return {ok: false, errors: ['Schema o elenco procedure non valido.'], procedureCount: 0, stepCount: 0};
    }
    if (kb.procedures.length !== 8) errors.push('Attese esattamente 8 procedure.');
    const allIds = new Set(), opIds = new Set();
    for (const op of kb.procedures) {
      if (!Number.isInteger(op.operationId) || op.operationId < 1 || opIds.has(op.operationId)) errors.push('ID operazione non valido o duplicato.');
      opIds.add(op.operationId);
      if (allIds.has(op.id)) errors.push('ID ripetuto: ' + op.id);
      allIds.add(op.id);
      if (!op.title || !op.objective || !Array.isArray(op.steps) || !op.steps.length) errors.push('Procedura incompleta: ' + op.id);
      const methods = new Set((op.methods || []).map(m => m.id));
      if (!methods.size || methods.has('')) errors.push('Metodi assenti o non validi: ' + op.id);
      for (const step of op.steps || []) {
        if (!step.title || !step.instruction || !step.warning) errors.push('Passaggio incompleto: ' + step.id);
        if (allIds.has(step.id)) errors.push('ID ripetuto: ' + step.id);
        allIds.add(step.id);
        if (!Array.isArray(step.methods)) errors.push('Elenco metodi non valido: ' + step.id);
        else for (const m of step.methods) if (!methods.has(m)) errors.push('Metodo sconosciuto ' + m + ' in ' + step.id);
      }
    }
    return {ok: errors.length === 0, errors, procedureCount: kb.procedures.length,
      stepCount: kb.procedures.reduce((n, op) => n + (op.steps || []).length, 0)};
  }

  function activeSteps(op, method) {
    if (!op || !Array.isArray(op.steps)) return [];
    const allowed = (op.methods || []).some(m => m.id === method);
    // Un metodo assente/non valido NON autorizza a mostrare passaggi esclusivi.
    return op.steps.filter(s => !s.methods.length || (allowed && s.methods.includes(method)));
  }

  const dangers = [
    {re: /\b(lama|tagliente)\b.*\b(crep\w*|fessur\w*|rott\w*|romp\w*|lesionat\w*|spezzat\w*|piegat\w*)\b|\b(crep\w*|fessur\w*|rott\w*|romp\w*|lesionat\w*|spezzat\w*|piegat\w*)\b.*\b(lama|tagliente)\b/,
     message: 'Possibile lama danneggiata: non affilarla né rimontarla. Sospendi l’intervento e registra una segnalazione di sicurezza.'},
    {re: /\b(motore|leva|freno|comando)\b.*\b(non si spegne|non spegne|non si ferma|resta acceso|rimane acceso)\b|\b(non si spegne|non spegne|non si ferma|resta acceso|rimane acceso)\b.*\b(motore|leva|freno|comando)\b/,
     message: 'Possibile guasto al comando di arresto: non usare la macchina. Sospendi la lavorazione e registra l’anomalia.'},
    {re: /\b(perdita|perde|perdo|fuoriesce|gocciola|cola|sgocciola|puzza|odore forte|odore di)\b.*\b(benzina|carburante)\b|\b(benzina|carburante)\b.*\b(perdita|perde|perdo|fuoriesce|gocciola|cola|sgocciola|puzza|odore forte|odore di)\b/,
     message: 'Possibile perdita di carburante: ferma l’intervento, evita fonti di innesco e non avviare la macchina.'},
    {re: /\b(filetto|filettatura|sede candela)\b.*\b(spanat\w*|rovinat\w*|danneggiat\w*)\b|\b(spanat\w*|rovinat\w*|danneggiat\w*)\b.*\b(filetto|filettatura|sede candela)\b/,
     message: 'Possibile filettatura della candela danneggiata: non forzare il montaggio. Sospendi per verifica tecnica.'}
  ];
  const parameters = /\b(coppia|serraggio in nm|newton metro|nm|gradazione|viscosita|capacita|quanti ml|quanto olio|quale olio|che olio|distanza elettrodi|intervallo di manutenzione|numero di giri|codice candela|codice filtro|quale candela|che candela|quale filtro|che filtro devo|quale lama|che ricambio|quale ricambio|quanto serrare|quanto stringere|a quanti newton|verso inclinare|ricambio compatibile|compatibilita|tempo di arresto|angolo esatto|quanti gradi)\b/;
  const repairs = /\b(pulire il carburatore|riparare il carburatore|tarare il carburatore|regolare il carburatore|rimappare centralina|smontare il motore|riparare la frizione|riparare il cambio)\b/;

  function result(kind, message, sources) {
    return {kind, text: message, sources: sources || [], stateChanged: false};
  }
  function answer(question, context = {}, database) {
    const kb = database || getKnowledge();
    const q = text(question).slice(0, 500), normalized = norm(q);
    if (!q) return result('invalid', 'Inserisci una domanda tecnica.');
    if (!validate(kb).ok) return result('unavailable', 'Archivio tecnico incoerente: consultazione bloccata.');
    const hazard = dangers.find(x => x.re.test(normalized));
    if (hazard) return result('stop', hazard.message);
    if (repairs.test(normalized)) return result('unknown', 'Richiesta di riparazione fuori dalle otto procedure validate per la consultazione. Non fornisco istruzioni non verificate.');
    if (parameters.test(normalized)) return result('model', 'Il dato dipende dal modello e non è verificato nella base attuale. Consulta il manuale del costruttore: non usare valori ipotetici.');

    const current = kb.procedures.find(p => p.operationId === Number(context.operationId || context.operation));
    const method = text(context.method);
    const selected = current && activeSteps(current, method).find(s => norm(s.title) === norm(context.stepTitle) && text(context.stepTitle));
    if (current && /\b(scopo|obiettivo|a cosa serve)\b/.test(normalized)) {
      return result('reference', current.objective + '\n\n' + CAUTION, [current.id]);
    }
    if (selected && /\b(precauzioni|rischi|avvertenze|sicurezza|cosa devo evitare)\b/.test(normalized)) {
      return result('reference', selected.warning + '\n\n' + CAUTION, [selected.id]);
    }
    if (selected && /\b(spiegami|ripeti|chiarisci|passaggio corrente)\b/.test(normalized)) {
      return result('reference', selected.title + '. ' + selected.instruction + '\n\nAttenzione: ' + selected.warning + '\n\n' + CAUTION, [selected.id]);
    }

    const words = terms(q);
    if (!words.length) return result('unknown', 'Domanda troppo generica: specifica componente e controllo desiderato.');
    const matches = [];
    for (const p of kb.procedures) {
      // Per un'altra operazione o senza modalità conosciuta, solo passi comuni a tutte le modalità.
      const available = activeSteps(p, current && p.operationId === current.operationId ? method : '');
      for (const step of available) {
        const titleWords = new Set(terms(p.title + ' ' + step.title));
        const bodyWords = new Set(terms(p.objective + ' ' + step.instruction + ' ' + step.warning));
        const titleMatches = words.filter(w => titleWords.has(w)).length;
        const bodyMatches = words.filter(w => bodyWords.has(w)).length;
        // Il solo contesto di sessione non costituisce evidenza di pertinenza.
        if (titleMatches < 1 && bodyMatches < 2) continue;
        const score = 5 * titleMatches + bodyMatches + (current && current.operationId === p.operationId ? 1 : 0);
        matches.push({p, step, score});
      }
    }
    matches.sort((a, b) => b.score - a.score);
    const winner = matches[0];
    // Query con un unico termine generico non autorizzano una procedura.
    if (!winner || winner.score < 5 || (words.length === 1 && winner.score < 6)) {
      return result('unknown', 'Nessun riferimento tecnico sufficientemente pertinente. Non deduco operazioni o valori mancanti.');
    }
    // Le risposte testuali riportano soltanto contenuto già presente nelle procedure.
    return result('reference', winner.p.title + ' — ' + winner.step.title + '\n\n' +
      winner.step.instruction + '\n\nAttenzione: ' + winner.step.warning + '\n\n' + CAUTION, [winner.step.id]);
  }
  function getKnowledge() {
    if (typeof OP === 'undefined') throw new Error('Archivio OP non disponibile: caricare app.js prima di knowledge.js');
    return build(OP);
  }
  window.TagliandoKnowledge = Object.freeze({
    schema: SCHEMA, version: VERSION, status: STATUS,
    build, validate, activeSteps, answer, getKnowledge
  });
})();