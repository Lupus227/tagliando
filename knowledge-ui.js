/* Fase 14.2 — Interfaccia sperimentale in sola lettura.
 * Non usa microfono, non invia richieste e non modifica lo stato della PWA.
 */
(() => {
  'use strict';
  const engine = window.TagliandoKnowledge;
  const anchor = document.getElementById('voicePanel');
  if (!engine || !anchor || document.getElementById('knowledgePanel')) return;

  const panel = document.createElement('section');
  panel.className = 'panel';
  panel.id = 'knowledgePanel';
  panel.setAttribute('aria-label', 'Base di conoscenza sperimentale');
  panel.innerHTML = [
    '<h2>Base tecnica — Fase 14.2 (sperimentale)</h2>',
    '<p class="muted small">Consultazione locale delle otto procedure. Nessuna AI generativa collegata, nessuna modifica al tagliando.</p>',
    '<p class="note">TUTTI I CONTENUTI SONO DA VALIDARE. Attieniti al manuale del costruttore; non usare questo pannello come autorizzazione operativa.</p>',
    '<label for="knowledgeQuestion">Domanda tecnica</label>',
    '<textarea id="knowledgeQuestion" rows="2" maxlength="500" placeholder="Es. Quali precauzioni? Quale passaggio riguarda il filtro?"></textarea>',
    '<div class="actions"><button id="knowledgeAsk" type="button" class="primary">Consulta la base</button>',
    '<button id="knowledgeExport" type="button">Esporta archivio JSON</button></div>',
    '<p id="knowledgeAnswer" role="status" aria-live="polite" style="white-space:pre-wrap"></p>',
    '<p id="knowledgeSources" class="muted small"></p>'
  ].join('');
  anchor.insertAdjacentElement('afterend', panel);
  const $ = id => document.getElementById(id);

  function context() {
    const count = $('counter')?.textContent || '';
    const m = count.match(/Operazione\s+(\d+)/i);
    return {
      operationId: m ? Number(m[1]) : 0,
      method: $('method')?.value || '',
      stepTitle: $('stepTitle')?.textContent || ''
    };
  }
  function ask() {
    try {
      const res = engine.answer($('knowledgeQuestion').value, context());
      $('knowledgeAnswer').textContent = res.kind === 'stop' ? 'SOSPENDERE — ' + res.text : res.text;
      $('knowledgeSources').textContent = res.sources.length
        ? 'Riferimenti: ' + res.sources.join(', ') + ' · Stato: DA_VALIDARE'
        : 'Nessun riferimento tecnico citabile. Nessuna operazione eseguita.';
    } catch (_) {
      $('knowledgeAnswer').textContent = 'Consultazione temporaneamente non disponibile.';
      $('knowledgeSources').textContent = 'La sessione di manutenzione non è stata modificata.';
    }
  }
  $('knowledgeAsk').addEventListener('click', ask);
  $('knowledgeQuestion').addEventListener('keydown', event => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) ask();
  });

  $('knowledgeExport').addEventListener('click', () => {
    try {
      const db = engine.getKnowledge(), report = engine.validate(db);
      if (!report.ok) throw new Error('Verifica struttura non superata.');
      const file = new Blob([JSON.stringify(db, null, 2)], {type: 'application/json;charset=utf-8'});
      const url = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'tagliando-base-tecnica-DA_VALIDARE.json';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 3000);
      $('knowledgeSources').textContent = 'Esportazione: ' + report.procedureCount + ' procedure, ' +
        report.stepCount + ' passaggi. Tutti DA_VALIDARE.';
    } catch (_) {
      $('knowledgeSources').textContent = 'Esportazione bloccata: archivio tecnico non coerente.';
    }
  });
})();