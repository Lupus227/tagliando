/* v0.11.0 - supporto contestuale deterministico. Non esegue diagnosi né inventa procedure. */
(()=>{'use strict';
 const norm=s=>String(s||'').toLocaleLowerCase('it-IT').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
 const has=(s,pattern)=>pattern.test(s);
 function resolve(transcript,context){
  const s=norm(transcript),op=Number(context?.operation)||0;
  if(!s||!op)return null;
  // I segnali gravi hanno precedenza sulle domande di aiuto; non cambiano mai lo stato del tagliando.
  const danger=[
   {op:2,re:/\b(lama|tagliente)\b.*\b(crep|fessur|rotta|spezzat|piegat)|\b(crep|fessur|rotta|spezzat|piegat)\w*.*\b(lama|tagliente)\b/,msg:'Interrompi l’intervento sulla lama. Non affilare né rimontare una lama lesionata, deformata o rotta. Serve una valutazione e, se necessario, la sostituzione con un ricambio idoneo.'},
   {op:6,re:/\b(leva|freno|comando|motore)\b.*\b(non si spegne|non spegne|resta acceso|non si ferma)|\b(non si spegne|non spegne|resta acceso|non si ferma).*\b(motore|leva)\b/,msg:'Interrompi il tagliando operativo. Il comando di arresto deve funzionare correttamente. Non usare la macchina fino alla riparazione e alla verifica della funzione di sicurezza.'},
   {op:4,re:/\b(filettatura|filetto|sede candela)\b.*\b(spanat|rovinat|danneggiat)|\b(spanat|rovinat|danneggiat)\w*.*\b(filettatura|filetto)\b/,msg:'Interrompi il montaggio della candela. Non forzare la filettatura della testata: occorre una verifica tecnica prima di procedere.'},
   {op:7,re:/\b(perdita|perde|fuoriesce)\b.*\b(olio|motore)|\b(olio|motore)\b.*\b(perdita|perde|fuoriesce)\b/,msg:'Ferma la lavorazione e verifica la causa della perdita d’olio. Il tagliando non sostituisce un intervento di riparazione.'},
   {op:8,re:/\b(benzina|carburante)\b.*\b(perdita|perde|versat|terra|fuoriuscit)|\b(perdita|perde|versat|fuoriuscit).*\b(benzina|carburante)\b/,msg:'Interrompi l’intervento. Allontana le fonti d’innesco, evita di avviare il motore e gestisci la perdita di carburante in sicurezza.'},
  ];
  for(const item of danger){if(item.op===op&&has(s,item.re))return {kind:'stop',message:item.msg};}
  const help=[
   {op:3,re:/\b(coperchio|scatola filtro)\b.*\b(non riesco|non si apre|non viene|bloccato|incastrato|togliere|aprire)|\b(non riesco|bloccato|incastrato)\b.*\b(coperchio|scatola filtro)\b/,msg:'Per il coperchio della scatola filtro, controlla se è fissato da una vite o da linguette a incastro. Non forzare. Se il fissaggio non è riconoscibile, consulta il manuale del modello.'},
   {op:3,re:/\b(spugna|filtro)\b.*\b(dura|indurita|sgretola|sbriciola|rotta|danneggiata)|\b(indurita|sgretola|sbriciola)\b.*\b(spugna|filtro)\b/,msg:'Una spugna indurita, sgretolata o danneggiata deve essere sostituita. Non considerarla recuperabile con una semplice pulizia.'},
   {op:2,re:/\b(mozzo|linguetta|fiecca|chiavetta)\b.*\b(cadut|sfilat|uscit|persa)|\b(cadut|sfilat|uscit|persa)\w*.*\b(mozzo|linguetta|fiecca|chiavetta)\b/,msg:'Durante lo smontaggio il mozzo può sfilarsi. Controlla che linguetta e sedi siano presenti, integre e correttamente accoppiate. Se noti danni o non riconosci il montaggio, sospendi e verifica il manuale.'},
   {op:2,re:/\b(angolo|inclinazione)\b.*\b(lama|affilatura|tagliente)|\b(lama|affilatura|tagliente)\b.*\b(angolo|inclinazione)\b/,msg:'La procedura di officina segue l’angolo originale quando riconoscibile. Il riferimento di 30–35 gradi non è universale: prima di modificare il profilo verifica che sia compatibile con la lama.'},
   {op:4,re:/\b(quale|che|tipo|codice|modello)\b.*\b(candela)\b|\b(candela)\b.*\b(quale|codice|modello|compatibile)\b/,msg:'Il codice, la distanza degli elettrodi e il serraggio della candela dipendono dal motore. Occorre identificare il modello e verificare le specifiche del costruttore.'},
   {op:7,re:/\b(quanto|quanta|quantita|quale|quanto ne)\b.*\b(olio|litri|millilitri)|\b(olio)\b.*\b(quanto|quanta|mettere|versare|quantita)\b/,msg:'La quantità e la gradazione dell’olio dipendono dal motore. Identifica il modello, consulta il manuale e controlla il livello secondo la procedura prescritta. Non usare una quantità generica.'},
   {op:5,re:/\b(ruota|cuscinetto|boccola)\b.*\b(bloccata|non gira|frenata|dura)|\b(bloccata|non gira|frenata)\b.*\b(ruota|cuscinetto)\b/,msg:'Verifica che la ruota possa girare liberamente e che il supporto sia integro. Un cuscinetto bloccato o danneggiato richiede valutazione e possibile sostituzione; non allentare un fissaggio fino a renderlo insicuro.'},
   {op:8,re:/\b(vaschetta|vite|carburatore)\b.*\b(scarico|drenaggio|svuotare)|\b(scarico|drenaggio)\b.*\b(vaschetta|carburatore)\b/,msg:'Il drenaggio dalla vaschetta è un’alternativa solo se prevista dal costruttore e con raccolta del carburante in contenitore idoneo. Non eseguire l’operazione con motore caldo o vicino a fonti d’innesco.'},
  ];
  for(const item of help){if(item.op===op&&has(s,item.re))return {kind:'answer',message:item.msg};}
  if(/\b(non riesco|e bloccato|si e rotto|cosa faccio|come faccio|perche non|non funziona|ho trovato|ho notato|posso usare|devo sostituire)\b/.test(s)){
    return {kind:'unknown',message:'Ho capito che segnali una difficoltà, ma non ho una risposta verificata per questo caso nella lavorazione attuale. Non forzare il componente. Puoi chiedere le precauzioni o interrompere e registrare l’anomalia.'};
  }
  return null;
 }
 window.TagliandoContextHelp={resolve,normalize:norm};
})();
