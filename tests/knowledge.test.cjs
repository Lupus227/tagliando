'use strict';
// Test eseguibili con: node --test tests/knowledge.test.cjs
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const source = name => fs.readFileSync(path.join(root, name), 'utf8');

// Non si esegue il DOMContentLoaded: il test ispeziona i dati OP e il modulo knowledge.
const sandbox = {window: {addEventListener() {}}, document: {}};
vm.createContext(sandbox);
vm.runInContext(source('app.js'), sandbox, {filename: 'app.js'});
vm.runInContext(source('knowledge.js'), sandbox, {filename: 'knowledge.js'});
const K = sandbox.window.TagliandoKnowledge;
const kb = K.getKnowledge();

test('schema delle otto lavorazioni e 53 passaggi reali', () => {
  const report = K.validate(kb);
  assert.equal(report.ok, true, report.errors.join('; '));
  assert.equal(report.procedureCount, 8);
  assert.equal(report.stepCount, 53);
});
test('provenienza, ID stabili e stato DA_VALIDARE', () => {
  assert.equal(kb.procedures[1].steps[0].id, 'RASA-OP-02-P01');
  assert.equal(kb.procedures[1].steps[0].source.file, 'app.js');
  assert.ok(kb.procedures.every(p => p.review.status === 'DA_VALIDARE'));
  assert.ok(kb.procedures.every(p => p.steps.every(s => s.review.status === 'DA_VALIDARE')));
});
test('passaggi per modalità coerenti con app.js', () => {
  for (const operation of kb.procedures) for (const method of operation.methods) {
    const actual = K.activeSteps(operation, method.id);
    assert.ok(actual.length);
    assert.ok(actual.every(step => step.methods.length === 0 || step.methods.includes(method.id)));
  }
});
test('modalità sconosciuta non abilita passaggi esclusivi', () => {
  const proc = kb.procedures.find(p => p.operationId === 3);
  assert.ok(K.activeSteps(proc, 'non-esiste').every(step => !step.methods.length));
});
test('lama crepata: STOP senza cambiamenti di stato', () => {
  const r = K.answer('Fatto, ma la lama è crepata', {operationId:2});
  assert.equal(r.kind, 'stop');
  assert.equal(r.stateChanged, false);
});
test('comando motore non si spegne: STOP', () => {
  assert.equal(K.answer('Il motore non si spegne', {operationId:6}).kind, 'stop');
});
test('perdita benzina: STOP', () => {
  assert.equal(K.answer('Ho una perdita di benzina', {operationId:8}).kind, 'stop');
});
test('filetto candela danneggiato: STOP', () => {
  assert.equal(K.answer('Il filetto della candela è spanato', {operationId:4}).kind, 'stop');
});
test('quantità olio: nessun valore non verificato', () => {
  const r = K.answer('Quanto olio devo mettere?', {operationId:7});
  assert.equal(r.kind, 'model');
  assert.equal(r.sources.length, 0);
});
test('coppia di serraggio: nessun valore non verificato', () => {
  assert.equal(K.answer('Qual è la coppia di serraggio?', {operationId:2}).kind, 'model');
});
test('domanda relativa alla sicurezza del passaggio corrente', () => {
  const r = K.answer('Quali precauzioni?', {operationId:2, method:'standard', stepTitle:'Messa in sicurezza'});
  assert.equal(r.kind, 'reference');
  assert.equal(r.sources[0], 'RASA-OP-02-P01');
});
test('domanda fuori ambito: nessuna procedura inventata', () => {
  assert.equal(K.answer('Come riparare il cambio?', {operationId:1}).kind, 'unknown');
});
test('la conoscenza non modifica dati tecnici', () => {
  const before = JSON.stringify(kb);
  K.answer('Spiegami il passaggio corrente', {operationId:2, method:'standard', stepTitle:'Messa in sicurezza'});
  assert.equal(JSON.stringify(kb), before);
});
test('metodo inesistente segnalato dalla validazione', () => {
  const altered = K.build([{id:1,title:'A',goal:'B',methods:[['m','Metodo']],steps:[['T','I','W','inesistente']]}]);
  assert.equal(K.validate(altered).ok, false);
});
test('moduli caricati dopo app e inclusi nella cache sperimentale', () => {
  const html = source('index.html');
  const sw = source('sw.js');
  assert.match(html, /<script src="\.\/app\.js" defer>/);
  assert.match(html, /<script src="\.\/knowledge\.js" defer><\/script><script src="\.\/retrieval\.js" defer><\/script><script src="\.\/knowledge-ui\.js" defer>/);
  assert.match(sw, /tagliando-v0143-dev/);
  assert.match(sw, /'\.\/knowledge\.js','\.\/retrieval\.js','\.\/knowledge-ui\.js'/);
});

test('perdo benzina: fermo cautelativo', () => {
  assert.equal(K.answer('Perdo benzina dal carburatore', {operationId:8}).kind, 'stop');
});
