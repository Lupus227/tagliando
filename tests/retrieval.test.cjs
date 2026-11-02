'use strict';
// Eseguire: node --test tests/*.test.cjs
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const load = file => fs.readFileSync(path.join(root, file), 'utf8');
const sandbox = {window: {addEventListener() {}}, document: {}};
vm.createContext(sandbox);
for (const file of ['app.js', 'knowledge.js', 'retrieval.js'])
  vm.runInContext(load(file), sandbox, {filename: file});
const K = sandbox.window.TagliandoKnowledge;
const R = sandbox.window.TagliandoRetrieval;
const get = (q, ctx = {}, kb) => R.buildPreview(q, ctx, kb);

test('base reale: 8 lavorazioni, 53 passaggi', () => {
  const report = K.validate(K.getKnowledge());
  assert.equal(report.ok, true);
  assert.equal(report.procedureCount, 8);
  assert.equal(report.stepCount, 53);
});
test('domande su sicurezza: lama crepata', () => {
  assert.equal(get('Fatto, ma la lama è crepata', {operationId:2}).decision, 'SAFETY_STOP');
});
test('domande su sicurezza: motore non si spegne', () => {
  assert.equal(get('Il motore non si spegne', {operationId:6}).decision, 'SAFETY_STOP');
});
test('domande su sicurezza: perdita di benzina', () => {
  assert.equal(get('Ho una perdita di benzina', {operationId:8}).decision, 'SAFETY_STOP');
  assert.equal(get('Perdo benzina dal carburatore', {operationId:8}).decision, 'SAFETY_STOP');
});
test('domande su sicurezza: filettatura candela', () => {
  assert.equal(get('Il filetto della candela è spanato', {operationId:4}).decision, 'SAFETY_STOP');
});
test('valori dipendenti dal modello: quantità olio', () => {
  assert.equal(get('Quanto olio devo mettere?', {operationId:7}).decision, 'MODEL_REQUIRED');
});
test('valori dipendenti dal modello: coppia', () => {
  assert.equal(get('Qual è la coppia di serraggio?', {operationId:2}).decision, 'MODEL_REQUIRED');
});
test('valori dipendenti dal modello: benzina', () => {
  assert.equal(get('Quanta benzina devo mettere?', {operationId:8}).decision, 'MODEL_REQUIRED');
});
test('fuori ambito: riparazione cambio auto', () => {
  assert.equal(get('Come riparo il cambio dell’automobile?', {operationId:1}).decision, 'OUT_OF_SCOPE');
});
test('comandi operativi non diventano richieste AI', () => {
  for (const q of ['Fatto', 'Avanti', 'Registra']) assert.equal(get(q, {operationId:2}).decision, 'COMMAND');
});
test('contesto attivo: precauzioni da passo specifico', () => {
  const p = get('Quali precauzioni?', {operationId:2,method:'standard',stepTitle:'Messa in sicurezza'});
  assert.equal(p.decision, 'PREVIEW_ONLY');
  assert.equal(p.references[0].id, 'RASA-OP-02-P01');
});
test('affilatura: riferimento più attinente al tagliente', () => {
  const p = get('Come affilo la lama?', {operationId:2,method:'standard'});
  assert.equal(p.decision, 'PREVIEW_ONLY');
  assert.equal(p.references[0].id, 'RASA-OP-02-P04');
});
test('filtro in spugna: metodo coerente', () => {
  const p = get('Come lavare il filtro in spugna?', {operationId:3,method:'spugna'});
  assert.equal(p.decision, 'PREVIEW_ONLY');
  assert.equal(p.references[0].id, 'RASA-OP-03-P04');
});
test('filtro in carta: esclude passaggi riservati alla spugna', () => {
  const p = get('Come lavare il filtro in spugna?', {operationId:3,method:'carta'});
  assert.ok(p.references.every(x => !['RASA-OP-03-P04', 'RASA-OP-03-P05'].includes(x.id)));
});
test('domanda su più procedure senza disambiguazione', () => {
  assert.equal(get('Devo mettere olio sul filtro?', {operationId:3,method:'spugna'}).decision, 'CLARIFY');
});
test('domanda sconosciuta o senza componente specifico', () => {
  assert.equal(get('A che punto siamo?', {operationId:2}).decision, 'NO_MATCH');
});
test('nessuna risposta generativa per domanda vuota o eccessiva', () => {
  assert.equal(get('   ').decision, 'REJECT');
  assert.equal(get('x'.repeat(501)).decision, 'REJECT');
});
test('archivio corrotto blocca le risposte', () => {
  const data = JSON.parse(JSON.stringify(K.getKnowledge()));
  data.procedures[0].steps[0].methods.push('inesistente');
  assert.equal(get('Pulizia del sottoscocca', {}, data).decision, 'UNAVAILABLE');
});
test('massimo 3 riferimenti e limite di dimensione rispettati', () => {
  const p = get('Come cambio il filtro in carta?', {operationId:3,method:'carta'});
  assert.ok(p.references.length <= 3);
  assert.ok(JSON.stringify(p.references).length <= 1800);
});
test('nessuna attivazione AI nemmeno con validazioni artificiali', () => {
  const data = JSON.parse(JSON.stringify(K.getKnowledge()));
  for (const p of data.procedures) {
    p.review.status = 'VALIDATO';
    for (const s of p.steps) s.review.status = 'VALIDATO';
  }
  const p = get('Come affilo la lama?', {operationId:2,method:'standard'}, data);
  assert.equal(p.aiReady, false);
  assert.equal(p.externalTransmissionAllowed, false);
});
test('retrieval non modifica la sessione o la base di conoscenza', () => {
  const data = K.getKnowledge();
  const before = JSON.stringify(data);
  for (const q of ['Affilatura lama', 'Il motore non si spegne', 'Che olio serve?']) {
    const p = get(q, {operationId:2,method:'standard'}, data);
    assert.equal(p.stateChanged, false);
    assert.equal(p.externalTransmissionAllowed, false);
  }
  assert.equal(JSON.stringify(data), before);
});
test('script e cache offline in corretta sequenza', () => {
  const html = load('index.html'), sw = load('sw.js');
  assert.match(html, /knowledge\.js" defer><\/script><script src="\.\/retrieval\.js" defer><\/script><script src="\.\/knowledge-ui\.js"/);
  assert.match(sw, /tagliando-v0143-dev/);
  assert.match(sw, /'\.\/retrieval\.js'/);
});
