# Scheda di ripresa — App Tagliando, dopo Fase 15.18

**Aggiornato:** 2026-11-08 · **Stato:** Fase 15.18 conclusa, pronto per Fase 15.19.

## Per iniziare la nuova chat

1. Consultare [REGISTRO_PROGETTO.md](../REGISTRO_PROGETTO.md) (v1.8 o successiva), le [Issue GitHub aperte](https://github.com/Lupus227/tagliando/issues) e questa scheda.
2. **Non chiedere nuovamente il JSON di F15.18**: l'utente ha già confermato il deployment Cloudflare `063dc43` **Success** e fornito una risposta coerente dell'endpoint protetto.
3. Iniziare dalla proposta tecnica per **Fase 15.19 — `RASA-OP-03-P04`, lavaggio del filtro in spugna**, da sottoporre a nuova approvazione dell'utente esperto prima di modificare la KB.

## Ultimo stato Cloudflare verificato (da JSON fornito dall'utente)

| Campo | Stato |
|---|---|
| Commit Cloudflare | `063dc43` — **Success** dichiarato dall'utente |
| Versione KB | **`15.18.0`** |
| Fonte schema | `tagliando.knowledge.v1` |
| Procedure / passaggi | 8 / 53 |
| Passaggi validati con condizioni | **17** |
| Passaggi pendenti | **36** |
| Ultimo step validato | **`RASA-OP-03-P03`** |
| `readyForTechnicalAnswers`, `aiEnabled`, `canGenerate` | **false** |
| PWA GitHub Pages | **v0.12.1**, non modificata |
| GitHub Actions | [Success per `063dc43`](https://github.com/Lupus227/tagliando/actions/runs/42528155237) |
| Repository backend | `Lupus227/tagliando` → `dev/fase14-ai` |

Non confondere il catalogo canonico d'origine `14.3.0` (immutato) con la versione cumulativa di revisione `15.18.0`. Il deployment è verificato **tramite riscontro dell'utente**, non con accesso indipendente a Cloudflare Access. AI e retrieval tecnico restano disabilitati.

## Ultima decisione tecnica approvata

**F15.18-R2** per `RASA-OP-03-P03` — filtro in carta. Revisione approvata dall'utente con «confermo», implementata nell'overlay tracciato `worker/src/review-ledger.mjs` mediante [PR #12](https://github.com/Lupus227/tagliando/pull/12).

- Applicare a filtro in carta e componente carta dei filtri misti; saltare se è presente solo spugna.
- Sostituire con elemento compatibile per dimensioni e tenuta, oppure conservare protetto quello recente, integro e pulito.
- **Non lavare né oliare la carta**, senza inserire eccezioni.
- Unica pulizia eventualmente prevista nel testo: **soffiaggio delicato con aria compressa**, mai getti aggressivi.
- Due frasi eliminate su richiesta dell'esperto: «salvo esplicita previsione del costruttore» e «eventuali metodi di pulizia devono rispettare le istruzioni specifiche».
- Nei filtri misti, il prefiltro spugna è trattato separatamente.
- Un ricambio non compatibile non va montato; registrare anomalia e non avviare senza sistema filtrante idoneo correttamente installato.

**Non ripetere l'approvazione P03.** Il contenuto canonico della revisione è nel ledger del backend, non nella presente scheda riassuntiva.

## Prossimo passo — Fase 15.19

**`RASA-OP-03-P04 — Lavaggio del filtro in spugna`**. Presentare una proposta tecnica per approvazione, coerente con le decisioni già prese e limitata a questo passaggio. Distinguere il trattamento della spugna dalla carta e dai filtri misti. Solo dopo approvazione creare overlay condizionato, audit fail-closed, test e deployment staging. Non abilitare AI.

## Problemi aperti e vincoli trasversali

- **OPEN-01:** la segnalazione *manuale* di anomalia nella PWA v0.12.1 può avanzare involontariamente; correzione rinviata all'integrazione futura del motore di esecuzione, ma obbligatoria prima del rilascio.
- **OPEN-02:** F15.15, audit statico dell'Operazione 2 superato 20/20, ma collaudi runtime del motore di esecuzione ancora mancanti.
- **OPEN-05:** verificare coppia, fonte e dinamometrica *prima* dello smontaggio lama (guardia P07→P02); implementazione runtime futura obbligatoria.
- **Issue GitHub [#1](https://github.com/Lupus227/tagliando/issues/1)**: evitare ripetizioni delle operazioni già confermate, conservando i ricontrolli di sicurezza quando il contesto cambia.
- **Issue [#2](https://github.com/Lupus227/tagliando/issues/2)**: affilatura lama facoltativa; registrare eseguito/saltato/interrotto.
- **Issue [#3](https://github.com/Lupus227/tagliando/issues/3)**: classificazione fissaggi/coppie ancora oggetto di ricerca; nessuna coppia universale autorizzata.
- L'AI deve operare solo dentro contenuti validati e condizioni pertinenti; nessuna specifica inventata.
- **GOV-14:** l'approvazione tecnica in chat è necessaria per nuovi testi; dopo approvazione, documentazione, PR e merge del perimetro autorizzato possono essere gestiti autonomamente con verifiche.
- Evitare ulteriori modifiche alla PWA pubblica finché non saranno progettate le nuove logiche. A ogni 20–25 scambi tecnici, o prima se il contesto è corposo, predisporre nuovo handoff.

## Messaggio consigliato per la nuova chat

«Riprendiamo App Tagliando dalla Fase 15.19. Leggi prima REGISTRO_PROGETTO.md e docs/RIPRESA_CHAT_F15_18.md in Lupus227/tagliando; controlla le Issue aperte. La Fase 15.18 è già approvata e il deployment Cloudflare 063dc43 Success con KB 15.18.0, 17 validati con condizioni, 36 pendenti, AI disabilitata. Non richiedermi nuovamente il JSON. Proponi soltanto RASA-OP-03-P04, lavaggio spugna, per la mia valutazione tecnica.»
