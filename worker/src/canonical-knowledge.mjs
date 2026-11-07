/*
 * Fase 14.9 — Catalogo tecnico CANONICO lato Worker.
 * Trascrizione deterministica di app.js/OP mediante schema knowledge v1.
 *
 * IMPORTANTISSIMO:
 * - La presenza di un'istruzione nell'archivio NON equivale a validazione.
 * - Copia originale: 53/53 DA_VALIDARE. Revisioni condizionate separate nel registro.
 * - Nessun modello può utilizzare istruzioni, neppure quelle revisionate.
 * - Non accettare contenuti, riferimenti o stati di revisione dal client.
 * - Prima di promuovere una revisione serve una procedura di approvazione
 *   tecnica documentata e una modifica esplicita delle barriere server.
 */
import {REVIEW_LEDGER,auditReviewLedger} from './review-ledger.mjs';

const RAW_CATALOG = {
  "schema": "tagliando.knowledge.v1",
  "version": "14.3.0",
  "sourceAppVersion": "0.12.1",
  "source": "app.js / OP",
  "validation": "DA_VALIDARE",
  "procedures": [
    {
      "id": "RASA-OP-01",
      "operationId": 1,
      "title": "Pulizia del sottoscocca",
      "objective": "Rimuovere croste di terra ed erba dal soffitto interno e dai passaggi dell’aria per recuperare l’efficienza di taglio e raccolta.",
      "context": "La pulizia a secco è più rapida; quella con acqua può risultare più approfondita.",
      "scope": "manutenzione_preventiva_rasaerba_benzina",
      "source": {
        "file": "app.js",
        "record": "OP[id=1]"
      },
      "review": {
        "status": "DA_VALIDARE",
        "reviewer": null,
        "reviewedAt": null,
        "revision": null
      },
      "methods": [
        {
          "id": "secco",
          "label": "Pulizia a secco"
        },
        {
          "id": "acqua",
          "label": "Pulizia con acqua (se consentita)"
        }
      ],
      "steps": [
        {
          "id": "RASA-OP-01-P01",
          "index": 1,
          "title": "Preparazione",
          "instruction": "Identifica macchina e motore, attendi il raffreddamento, verifica arresto completo e protezione dall’avviamento accidentale.",
          "warning": "Non accedere al sottoscocca se non puoi mettere in sicurezza la macchina.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=1].steps[0]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-01-P02",
          "index": 2,
          "title": "Accesso al sottoscocca",
          "instruction": "Nel metodo di officina descritto si solleva il fronte della macchina e la si appoggia posteriormente, mantenendo la candela in alto. Verifica prima compatibilità con il modello, stabilità e possibili perdite.",
          "warning": "L’orientamento deve rispettare il manuale del motore; non assumere che candela e filtro abbiano sempre la stessa posizione.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=1].steps[1]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-01-P03",
          "index": 3,
          "title": "Rimozione incrostazioni",
          "instruction": "Rimuovi erba e terra da soffitto e condotto dell’aria del sottoscocca utilizzando utensili idonei e senza danneggiare scocca, protezioni o lama.",
          "warning": "Non mettere le mani sul tagliente. Fermati se trovi danni che rendono l’intervento non sicuro.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=1].steps[2]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-01-P04",
          "index": 4,
          "title": "Pulizia finale",
          "instruction": "Completa a secco con spazzola e rimozione dei residui oppure, se hai scelto il lavaggio e il costruttore lo consente, usa acqua senza dirigere getti in cuscinetti, aspirazione, comandi o componenti elettrici.",
          "warning": "L’idropulitrice non va applicata indiscriminatamente: verifica sempre le istruzioni specifiche.",
          "methods": [
            "acqua",
            "secco"
          ],
          "source": {
            "file": "app.js",
            "record": "OP[id=1].steps[3]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-01-P05",
          "index": 5,
          "title": "Asciugatura",
          "instruction": "Se hai usato acqua, asciuga preferibilmente con aria compressa controllata, evitando getti sulle parti sensibili. Se hai lavorato a secco, verifica l’assenza di residui e umidità.",
          "warning": "L’avviamento del motore per asciugare è una pratica riferita dall’esperto, non un’istruzione automatica del prototipo.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=1].steps[4]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-01-P06",
          "index": 6,
          "title": "Controllo della scocca",
          "instruction": "Controlla che le croste siano state eliminate e che non ci siano crepe, fori o danni evidenti. Registra eventuali riparazioni da fare separatamente.",
          "warning": "In presenza di danni strutturali o di sicurezza, sospendi e registra l’anomalia.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=1].steps[5]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        }
      ]
    },
    {
      "id": "RASA-OP-02",
      "operationId": 2,
      "title": "Affilatura della lama",
      "objective": "Preparare i taglienti per la stagione successiva, mantenendo il corretto montaggio e la sicurezza del gruppo di taglio.",
      "context": "Attrezzi di officina: pistola a impulsi, smerigliatrice angolare e disco lamellare grana 60–80. Questo prototipo non autorizza l’uso di utensili non conosciuti.",
      "scope": "manutenzione_preventiva_rasaerba_benzina",
      "source": {
        "file": "app.js",
        "record": "OP[id=2]"
      },
      "review": {
        "status": "DA_VALIDARE",
        "reviewer": null,
        "reviewedAt": null,
        "revision": null
      },
      "methods": [
        {
          "id": "standard",
          "label": "Affilatura e controllo"
        }
      ],
      "steps": [
        {
          "id": "RASA-OP-02-P01",
          "index": 1,
          "title": "Messa in sicurezza",
          "instruction": "Identifica la lama, arresta il motore, scollega la pipetta secondo il manuale, immobilizza in sicurezza la macchina e usa protezioni adeguate.",
          "warning": "La lama può tagliare anche se apparentemente poco affilata.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=2].steps[0]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-02-P02",
          "index": 2,
          "title": "Smontaggio",
          "instruction": "Rimuovi il fissaggio con attrezzo adatto, immobilizzando la lama senza afferrarne i taglienti. Verifica la sequenza di rondelle e distanziali.",
          "warning": "Se il fissaggio è bloccato, non forzare rischiando lesioni o danni.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=2].steps[1]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-02-P03",
          "index": 3,
          "title": "Mozzo e linguetta",
          "instruction": "Controlla se il mozzo portalama si è sfilato e se la linguetta (“fiecca”), quando presente, è rimasta nella sua sede. Verifica integrità e corretto accoppiamento.",
          "warning": "Se la linguetta o il mozzo sono deformati, crepati o usurati, non rimontare come se fossero sani.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=2].steps[2]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-02-P04",
          "index": 4,
          "title": "Ispezione lama",
          "instruction": "Controlla che non siano presenti crepe, deformazioni gravi o consumo eccessivo. Prima dell’affilatura decidi se la lama è recuperabile.",
          "warning": "Una lama compromessa va sostituita, non riaffilata.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=2].steps[3]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-02-P05",
          "index": 5,
          "title": "Ripristino del tagliente",
          "instruction": "L’esperto segue l’angolo originale quando riconoscibile; in alternativa usa indicativamente 30–35° per lame compatibili, lavorando sui due taglienti dalla faccia superiore.",
          "warning": "Angolo, geometria e limiti di usura sono specifici della lama. Evita surriscaldamento e asportazione eccessiva di materiale.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=2].steps[4]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-02-P06",
          "index": 6,
          "title": "Equilibratura",
          "instruction": "Verifica il bilanciamento con un supporto appropriato sul foro centrale; nel metodo di officina esperto il controllo veniva riservato ai casi dubbi.",
          "warning": "Per utenti non esperti è consigliabile verificarlo sempre; non usare un dito come supporto a contatto con il tagliente.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=2].steps[5]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-02-P07",
          "index": 7,
          "title": "Montaggio e serraggio",
          "instruction": "Alloggia correttamente la lama nella sede di centraggio del mozzo, riposiziona eventuale linguetta e dispositivi di fissaggio. Serra secondo la coppia prescritta dal costruttore.",
          "warning": "La regolazione “media” della pistola a impulsi non corrisponde a una coppia verificata. Usa il metodo e la coppia prescritti.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=2].steps[6]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-02-P08",
          "index": 8,
          "title": "Verifica finale",
          "instruction": "Con il motore non avviabile, verifica il corretto fissaggio e l’assenza di interferenze con una rotazione manuale controllata della lama, senza afferrare il tagliente.",
          "warning": "Se si avvertono giochi, interferenze o anomalie, non avviare la macchina.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=2].steps[7]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        }
      ]
    },
    {
      "id": "RASA-OP-03",
      "operationId": 3,
      "title": "Filtro dell’aria",
      "objective": "Ripristinare filtraggio e flusso d’aria verso il motore.",
      "context": "Filtri in carta e in spugna richiedono trattamenti diversi. Pulire sempre anche la scatola filtro.",
      "scope": "manutenzione_preventiva_rasaerba_benzina",
      "source": {
        "file": "app.js",
        "record": "OP[id=3]"
      },
      "review": {
        "status": "DA_VALIDARE",
        "reviewer": null,
        "reviewedAt": null,
        "revision": null
      },
      "methods": [
        {
          "id": "carta",
          "label": "Filtro in carta"
        },
        {
          "id": "spugna",
          "label": "Filtro in spugna"
        },
        {
          "id": "misto",
          "label": "Filtro carta con prefiltro spugna"
        }
      ],
      "steps": [
        {
          "id": "RASA-OP-03-P01",
          "index": 1,
          "title": "Preparazione e apertura",
          "instruction": "A motore spento e freddo, identifica il tipo di filtro e apri la scatola filtro secondo il sistema di fissaggio presente.",
          "warning": "Proteggi l’ingresso al carburatore da polvere e sporco durante la manutenzione.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=3].steps[0]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-03-P02",
          "index": 2,
          "title": "Valutazione del materiale",
          "instruction": "Controlla lo stato dell’elemento. Il filtro in carta viene normalmente sostituito nel tagliando, tranne quando è stato montato recentemente ed è ancora integro. La spugna si riutilizza solo se morbida e non sgretolata.",
          "warning": "Non trattare con liquidi un elemento in carta non lavabile.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=3].steps[1]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-03-P03",
          "index": 3,
          "title": "Trattamento carta",
          "instruction": "Per carta: sostituisci con elemento compatibile, oppure conserva quello recente se pulito e idoneo. Per filtro misto, tratta la carta separatamente dalla spugna.",
          "warning": "Non soffiare aggressivamente né lavare la carta se il costruttore non lo prevede.",
          "methods": [
            "carta",
            "misto"
          ],
          "source": {
            "file": "app.js",
            "record": "OP[id=3].steps[2]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-03-P04",
          "index": 4,
          "title": "Lavaggio spugna",
          "instruction": "Per spugna: utilizza detergente compatibile per filtri, risciacqua se previsto e lascia asciugare completamente. Sostituisci se indurita, friabile o deformata.",
          "warning": "Il gasolio è citato come pratica d’officina, ma non è proposto come detergente standard dell’app.",
          "methods": [
            "spugna",
            "misto"
          ],
          "source": {
            "file": "app.js",
            "record": "OP[id=3].steps[3]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-03-P05",
          "index": 5,
          "title": "Oliatura spugna",
          "instruction": "Quando prevista per quello specifico elemento, distribuisci olio filtri spray oppure olio motore pulito, eliminando l’eccesso secondo le indicazioni del produttore.",
          "warning": "Non tutti i prefiltri in spugna devono essere oliati; verifica il tipo.",
          "methods": [
            "spugna",
            "misto"
          ],
          "source": {
            "file": "app.js",
            "record": "OP[id=3].steps[4]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-03-P06",
          "index": 6,
          "title": "Pulizia scatola filtro",
          "instruction": "Pulisci scatola, coperchio e area vicina all’ingresso d’aria; rimuovi residui di olio e polvere evitando di introdurli nel carburatore.",
          "warning": "Usa solo detergenti compatibili con plastica, guarnizioni e componenti vicini.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=3].steps[5]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-03-P07",
          "index": 7,
          "title": "Rimontaggio",
          "instruction": "Inserisci gli elementi nel verso giusto e chiudi la scatola filtro. Verifica l’aderenza e l’assenza di aperture involontarie.",
          "warning": "Non avviare il motore senza il filtro previsto correttamente installato.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=3].steps[6]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        }
      ]
    },
    {
      "id": "RASA-OP-04",
      "operationId": 4,
      "title": "Sostituzione della candela",
      "objective": "Rinnovare la candela di accensione durante il tagliando stagionale.",
      "context": "Codice candela, distanza elettrodi e serraggio dipendono dal motore e dal tipo di candela.",
      "scope": "manutenzione_preventiva_rasaerba_benzina",
      "source": {
        "file": "app.js",
        "record": "OP[id=4]"
      },
      "review": {
        "status": "DA_VALIDARE",
        "reviewer": null,
        "reviewedAt": null,
        "revision": null
      },
      "methods": [
        {
          "id": "standard",
          "label": "Sostituzione candela"
        }
      ],
      "steps": [
        {
          "id": "RASA-OP-04-P01",
          "index": 1,
          "title": "Verifica ricambio",
          "instruction": "Identifica una candela nuova con caratteristiche e codice corrispondenti a quelli prescritti dal costruttore del motore.",
          "warning": "Non basarti soltanto sulla somiglianza esteriore.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=4].steps[0]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-04-P02",
          "index": 2,
          "title": "Rimozione",
          "instruction": "Su motore spento e freddo, stacca la pipetta e svita la candela con chiave adatta. Evita contaminazioni del foro della testata.",
          "warning": "Non lavorare con testata calda.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=4].steps[1]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-04-P03",
          "index": 3,
          "title": "Controllo sede e candela",
          "instruction": "Ispeziona filetto e sede; verifica eventuale distanza elettrodi se richiesta e lo stato del terminale superiore.",
          "warning": "Se il filetto nella testata è danneggiato, fermati e richiedi riparazione qualificata.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=4].steps[2]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-04-P04",
          "index": 4,
          "title": "Avvitamento iniziale",
          "instruction": "Inizia SEMPRE l’avvitamento della candela a mano, senza utensili a impulsi, per evitare imbocchi incrociati.",
          "warning": "Se incontra resistenza anomala, non forzare.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=4].steps[3]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-04-P05",
          "index": 5,
          "title": "Serraggio finale",
          "instruction": "Completa con coppia o angolo di serraggio previsto per candela e testata; la rondella di tenuta va compressa secondo le istruzioni specifiche.",
          "warning": "I riferimenti empirici di mezzo giro o 15–25 Nm non sono universali.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=4].steps[4]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-04-P06",
          "index": 6,
          "title": "Pipetta e prova",
          "instruction": "Ricollega saldamente la pipetta. Quando la macchina è completamente sicura e pronta all’avviamento, verifica il normale funzionamento.",
          "warning": "Se non parte, controlla prima collegamento pipetta e compatibilità del ricambio; non procedere a diagnosi automatica.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=4].steps[5]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        }
      ]
    },
    {
      "id": "RASA-OP-05",
      "operationId": 5,
      "title": "Lubrificazione delle ruote",
      "objective": "Favorire una rotazione libera delle ruote evitando attriti e giochi anomali.",
      "context": "Il trattamento varia tra boccole, cuscinetti aperti e cuscinetti sigillati.",
      "scope": "manutenzione_preventiva_rasaerba_benzina",
      "source": {
        "file": "app.js",
        "record": "OP[id=5]"
      },
      "review": {
        "status": "DA_VALIDARE",
        "reviewer": null,
        "reviewedAt": null,
        "revision": null
      },
      "methods": [
        {
          "id": "boccola",
          "label": "Ruote con boccola"
        },
        {
          "id": "aperto",
          "label": "Cuscinetti aperti"
        },
        {
          "id": "sigillato",
          "label": "Cuscinetti sigillati"
        }
      ],
      "steps": [
        {
          "id": "RASA-OP-05-P01",
          "index": 1,
          "title": "Sostegno stabile",
          "instruction": "Spegni e metti in sicurezza il rasaerba; sostienilo con supporti adeguati, lasciando le ruote libere.",
          "warning": "Non affidarti a supporti instabili o improvvisati.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=5].steps[0]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-05-P02",
          "index": 2,
          "title": "Smontaggio ruota",
          "instruction": "Lavora su una ruota alla volta. Se presente, rimuovi la borchia, quindi dado e ruota; conserva correttamente tutti i componenti.",
          "warning": "Attenzione a dadi autobloccanti e piccoli fermi.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=5].steps[1]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-05-P03",
          "index": 3,
          "title": "Lubrificazione boccole",
          "instruction": "Applica un sottile velo di grasso appropriato sul perno e nella boccola pulita, se previsti dalla configurazione.",
          "warning": "Non contaminare superfici che il costruttore prescrive asciutte.",
          "methods": [
            "boccola"
          ],
          "source": {
            "file": "app.js",
            "record": "OP[id=5].steps[2]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-05-P04",
          "index": 4,
          "title": "Lubrificazione cuscinetti aperti",
          "instruction": "Se le sfere sono visibili e accessibili e il costruttore ammette il trattamento, applica poche gocce di lubrificante compatibile.",
          "warning": "Non smontare cuscinetti pressati o trattenuti da seeger senza attrezzatura e procedura adeguate.",
          "methods": [
            "aperto"
          ],
          "source": {
            "file": "app.js",
            "record": "OP[id=5].steps[3]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-05-P05",
          "index": 5,
          "title": "Controllo cuscinetti sigillati",
          "instruction": "Verifica la libera rotazione del cuscinetto senza tentare di aprirlo per lubrificarlo. Se ruvido o bloccato, annota la necessità di sostituzione.",
          "warning": "Non perforare né rimuovere schermature di cuscinetti sigillati.",
          "methods": [
            "sigillato"
          ],
          "source": {
            "file": "app.js",
            "record": "OP[id=5].steps[4]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-05-P06",
          "index": 6,
          "title": "Montaggio ruota",
          "instruction": "Rimonta in sequenza gli elementi e serra secondo il sistema di fissaggio previsto; se necessario sostituisci dadi autobloccanti usurati.",
          "warning": "Non allentare un dado per compensare una ruota frenata se così si perde il bloccaggio sicuro.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=5].steps[5]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-05-P07",
          "index": 7,
          "title": "Controllo finale",
          "instruction": "Verifica che ogni ruota giri liberamente senza gioco eccessivo. Eventuali problemi alla trasmissione o agli ingranaggi vanno registrati separatamente.",
          "warning": "L’eventuale lubrificazione della trasmissione richiede compatibilità con materiali e specifiche del gruppo.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=5].steps[6]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        }
      ]
    },
    {
      "id": "RASA-OP-06",
      "operationId": 6,
      "title": "Controllo viti e cavi",
      "objective": "Verificare fissaggi e corretto funzionamento dei comandi, compresa la leva di arresto motore.",
      "context": "Nessun cronometro richiesto nel tagliando ordinario; devono essere rispettati i requisiti di sicurezza del modello.",
      "scope": "manutenzione_preventiva_rasaerba_benzina",
      "source": {
        "file": "app.js",
        "record": "OP[id=6]"
      },
      "review": {
        "status": "DA_VALIDARE",
        "reviewer": null,
        "reviewedAt": null,
        "revision": null
      },
      "methods": [
        {
          "id": "standard",
          "label": "Verifica cavi e fissaggi"
        }
      ],
      "steps": [
        {
          "id": "RASA-OP-06-P01",
          "index": 1,
          "title": "Ispezione comandi",
          "instruction": "A motore spento, verifica guaine, cavi, molle e leveraggi della leva di sicurezza e, se presente, della trazione.",
          "warning": "Se i cavi sono sfilacciati, arrugginiti, deformati o bloccati, sospendi e registra.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=6].steps[0]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-06-P02",
          "index": 2,
          "title": "Controllo gioco cavi",
          "instruction": "Controlla il gioco e la corsa della leva. Se previsto dal costruttore, esegui regolazione mediante apposito registro senza impedire il fine corsa corretto.",
          "warning": "Una regolazione errata del cavo di arresto può impedire lo spegnimento.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=6].steps[1]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-06-P03",
          "index": 3,
          "title": "Viti e supporto motore",
          "instruction": "Verifica che i fissaggi accessibili, in particolare il supporto motore, non siano allentati. Esegui serraggi solo con valori e metodi previsti per il modello.",
          "warning": "Fissaggi ripetutamente allentati possono indicare vibrazioni anomale da indagare separatamente.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=6].steps[2]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-06-P04",
          "index": 4,
          "title": "Verifica funzionale sicurezza",
          "instruction": "Con macchina rimontata, area libera e condizioni idonee per avvio, verifica che il rilascio della leva di sicurezza arresti il motore.",
          "warning": "Se il motore non si arresta correttamente, non utilizzare la macchina: apri anomalia di sicurezza.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=6].steps[3]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-06-P05",
          "index": 5,
          "title": "Controllo conclusivo",
          "instruction": "Verifica normale scorrimento dei comandi e assenza di parti mobili o fissaggi anomali; registra problemi di trazione per intervento separato.",
          "warning": "Il funzionamento del comando non sostituisce eventuali requisiti del costruttore sul tempo di arresto della lama.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=6].steps[4]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        }
      ]
    },
    {
      "id": "RASA-OP-07",
      "operationId": 7,
      "title": "Sostituzione olio motore",
      "objective": "Rimuovere l’olio usato e riportare il livello al valore previsto dal costruttore.",
      "context": "L’esperto privilegia la pompa aspirante; scarico inferiore soltanto quando appropriato.",
      "scope": "manutenzione_preventiva_rasaerba_benzina",
      "source": {
        "file": "app.js",
        "record": "OP[id=7]"
      },
      "review": {
        "status": "DA_VALIDARE",
        "reviewer": null,
        "reviewedAt": null,
        "revision": null
      },
      "methods": [
        {
          "id": "aspira",
          "label": "Aspirazione con pompa"
        },
        {
          "id": "scarico",
          "label": "Scarico da tappo (se previsto)"
        }
      ],
      "steps": [
        {
          "id": "RASA-OP-07-P01",
          "index": 1,
          "title": "Identificazione olio e capacità",
          "instruction": "Verifica sul manuale la gradazione, la capacità, l’intervallo e il metodo corretto di lettura dell’astina. Prepara recipiente idoneo per olio esausto.",
          "warning": "SAE 30/10W-40 e 450–530 ml sono esempi ricorrenti nell’esperienza d’officina, non valori universali.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=7].steps[0]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-07-P02",
          "index": 2,
          "title": "Preparazione",
          "instruction": "Se previsto, porta il motore a temperatura moderata, poi spegnilo, attendi e previeni riavviamenti accidentali.",
          "warning": "Attenzione alle superfici calde e all’olio che può provocare ustioni.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=7].steps[1]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-07-P03",
          "index": 3,
          "title": "Estrazione con pompa",
          "instruction": "Apri il bocchettone e aspira attraverso la cannula fino a rimuovere l’olio secondo le possibilità del modello. Eventuale lieve rialzo frontale richiede stabilità e autorizzazione del manuale.",
          "warning": "Non forzare la cannula né assumere che tutti i motori consentano aspirazione completa.",
          "methods": [
            "aspira"
          ],
          "source": {
            "file": "app.js",
            "record": "OP[id=7].steps[2]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-07-P04",
          "index": 4,
          "title": "Scarico tramite tappo",
          "instruction": "Solo se il manuale prevede lo scarico inferiore e sono disponibili attrezzi, guarnizioni e contenitore corretti: scarica e richiudi con serraggio previsto.",
          "warning": "Teste particolari e guarnizioni delicate possono danneggiarsi: se non hai i ricambi adeguati, non procedere.",
          "methods": [
            "scarico"
          ],
          "source": {
            "file": "app.js",
            "record": "OP[id=7].steps[3]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-07-P05",
          "index": 5,
          "title": "Rifornimento",
          "instruction": "Aggiungi olio idoneo in quantità graduale, tenendoti inizialmente sotto la capacità nominale e verificando via via il livello.",
          "warning": "Non versare quantità a occhio e non avviare il motore senza olio.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=7].steps[4]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-07-P06",
          "index": 6,
          "title": "Misura livello",
          "instruction": "Misura con il sistema prescritto dal motore: su alcuni modelli l’astina si avvita, su altri si appoggia. Resta entro i riferimenti min/max.",
          "warning": "Non presumere il metodo di lettura in base alla sola marca.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=7].steps[5]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-07-P07",
          "index": 7,
          "title": "Chiusura e verifica",
          "instruction": "Chiudi il tappo, pulisci eventuali tracce d’olio e verifica l’assenza di perdite. Smaltisci l’olio usato presso punto di raccolta autorizzato.",
          "warning": "Se ci sono perdite dal basamento o dall’albero, sospendi e registra un problema distinto.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=7].steps[6]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        }
      ]
    },
    {
      "id": "RASA-OP-08",
      "operationId": 8,
      "title": "Carburante e rimessaggio",
      "objective": "Ridurre i problemi di riavvio dopo un lungo periodo di inutilizzo.",
      "context": "Le indicazioni del costruttore possono prevedere svuotamento o carburante fresco con stabilizzante. Non miscelare procedure incompatibili.",
      "scope": "manutenzione_preventiva_rasaerba_benzina",
      "source": {
        "file": "app.js",
        "record": "OP[id=8]"
      },
      "review": {
        "status": "DA_VALIDARE",
        "reviewer": null,
        "reviewedAt": null,
        "revision": null
      },
      "methods": [
        {
          "id": "esaurimento",
          "label": "Consumo controllato carburante residuo"
        },
        {
          "id": "drenaggio",
          "label": "Drenaggio vaschetta (se previsto)"
        },
        {
          "id": "manuale",
          "label": "Procedura alternativa da manuale"
        }
      ],
      "steps": [
        {
          "id": "RASA-OP-08-P01",
          "index": 1,
          "title": "Piano rimessaggio",
          "instruction": "Verifica la procedura prevista per il motore: serbatoio vuoto, vaschetta drenata oppure carburante stabilizzato secondo specifica.",
          "warning": "Non presumere che svuotare tutto sia obbligatorio per ogni modello.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=8].steps[0]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-08-P02",
          "index": 2,
          "title": "Preparazione area",
          "instruction": "Lavora all’aperto o in ambiente ventilato idoneo, lontano da fiamme, scintille, sigarette e superfici calde. Prepara un contenitore omologato e un sistema contro gli sversamenti.",
          "warning": "La benzina è molto infiammabile; non usare bottiglie o contenitori improvvisati.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=8].steps[1]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-08-P03",
          "index": 3,
          "title": "Rimozione carburante serbatoio",
          "instruction": "Se è prevista la rimozione, aspira il carburante con attrezzatura idonea a benzina e richiudi il serbatoio. Verifica il corretto smaltimento o riutilizzo consentito.",
          "warning": "Non usare pompe o utensili elettrici non certificati per liquidi infiammabili.",
          "methods": [
            "esaurimento",
            "drenaggio"
          ],
          "source": {
            "file": "app.js",
            "record": "OP[id=8].steps[2]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-08-P04",
          "index": 4,
          "title": "Esaurimento controllato",
          "instruction": "Solo quando previsto dal costruttore e con macchina montata e in condizioni operative sicure, puoi interrompere l’alimentazione e lasciare funzionare il motore fino allo spegnimento spontaneo.",
          "warning": "Non garantisce necessariamente il drenaggio completo della vaschetta. Non operare in locali chiusi per rischio monossido.",
          "methods": [
            "esaurimento"
          ],
          "source": {
            "file": "app.js",
            "record": "OP[id=8].steps[3]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-08-P05",
          "index": 5,
          "title": "Drenaggio vaschetta",
          "instruction": "A motore spento e freddo, se è presente una vite di drenaggio prevista dal manuale, predisponi una raccolta che eviti cadute di benzina a terra e procedi solo se hai accesso sicuro.",
          "warning": "Se manca spazio o non puoi raccogliere il carburante senza sversamenti, non intervenire.",
          "methods": [
            "drenaggio"
          ],
          "source": {
            "file": "app.js",
            "record": "OP[id=8].steps[4]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-08-P06",
          "index": 6,
          "title": "Metodo alternativo",
          "instruction": "Seleziona la procedura di rimessaggio alternativa esattamente come riportata dal manuale per quel motore (per esempio carburante fresco con stabilizzante approvato).",
          "warning": "Questa modalità non prescrive automaticamente quantità o prodotti.",
          "methods": [
            "manuale"
          ],
          "source": {
            "file": "app.js",
            "record": "OP[id=8].steps[5]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        },
        {
          "id": "RASA-OP-08-P07",
          "index": 7,
          "title": "Controllo finale",
          "instruction": "Verifica chiusura dei tappi, posizione del rubinetto, assenza di perdite e condizioni idonee al deposito. Registra il metodo utilizzato.",
          "warning": "Se rilevi perdite o odori persistenti di carburante, sospendi e intervieni in sicurezza.",
          "methods": [],
          "source": {
            "file": "app.js",
            "record": "OP[id=8].steps[6]"
          },
          "review": {
            "status": "DA_VALIDARE",
            "reviewer": null,
            "reviewedAt": null,
            "revision": null
          }
        }
      ]
    }
  ]
};

const EXPECTED_PROCEDURES=8;
const EXPECTED_STEPS=53;
const pad=n=>String(n).padStart(2,'0');
const string=v=>typeof v==='string' && v.trim().length>0;
function deepFreeze(value){
  if(value && typeof value==='object' && !Object.isFrozen(value)){
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}
export const CANONICAL_KNOWLEDGE=deepFreeze(RAW_CATALOG);
const snapshot=JSON.stringify(CANONICAL_KNOWLEDGE);

// Il catalogo di origine resta immutato: l'eventuale validazione si trova
// esclusivamente nel registro tracciato delle revisioni.
export function auditCanonicalKnowledge(candidate=CANONICAL_KNOWLEDGE){
  const errors=[];
  if(!candidate || typeof candidate!=='object' || Array.isArray(candidate))
    return {ok:false, errors:['BAD_CATALOG']};
  if(candidate.schema!=='tagliando.knowledge.v1' ||
     candidate.version!=='14.3.0' ||
     candidate.sourceAppVersion!=='0.12.1' ||
     candidate.source!=='app.js / OP' ||
     candidate.validation!=='DA_VALIDARE' ||
     !Array.isArray(candidate.procedures) ||
     candidate.procedures.length!==EXPECTED_PROCEDURES)
    errors.push('INVALID_SCHEMA_OR_SOURCE');
  let stepCount=0;
  const ps=Array.isArray(candidate.procedures)?candidate.procedures:[];
  for(let i=0;i<ps.length;i++){
    const op=ps[i], n=i+1, opId='RASA-OP-'+pad(n);
    if(!op || op.operationId!==n || op.id!==opId ||
       !string(op.title) || !string(op.objective) || !string(op.context) ||
       op.scope!=='manutenzione_preventiva_rasaerba_benzina' ||
       op.source?.file!=='app.js' || op.source?.record!=='OP[id='+n+']' ||
       !reviewPending(op.review)){
      errors.push('INVALID_OPERATION_'+n);
      continue;
    }
    if(!Array.isArray(op.methods) || op.methods.length===0 ||
       op.methods.some(m=>!m || !/^[a-z][a-z0-9_-]{0,29}$/.test(m.id) || !string(m.label)) ||
       new Set(op.methods.map(m=>m.id)).size!==op.methods.length)
      errors.push('INVALID_METHODS_'+n);
    const validMethods=new Set((op.methods||[]).map(m=>m.id));
    if(!Array.isArray(op.steps) || !op.steps.length){
      errors.push('MISSING_STEPS_'+n);
      continue;
    }
    stepCount+=op.steps.length;
    for(let j=0;j<op.steps.length;j++){
      const step=op.steps[j], sid=opId+'-P'+pad(j+1);
      if(!step || step.id!==sid || step.index!==j+1 ||
         !string(step.title) || !string(step.instruction) || !string(step.warning) ||
         step.source?.file!=='app.js' ||
         step.source?.record!=='OP[id='+n+'].steps['+j+']' ||
         !reviewPending(step.review) || !Array.isArray(step.methods) ||
         step.methods.some(m=>!validMethods.has(m)) ||
         new Set(step.methods).size!==step.methods.length)
        errors.push('INVALID_STEP_'+sid);
    }
  }
  if(stepCount!==EXPECTED_STEPS)errors.push('INVALID_STEP_COUNT');
  if(JSON.stringify(candidate)!==snapshot)errors.push('CATALOG_SNAPSHOT_MISMATCH');
  return {ok:errors.length===0,errors};
}
function reviewPending(r){
  return Boolean(r && r.status==='DA_VALIDARE' && r.reviewer===null &&
    r.reviewedAt===null && r.revision===null);
}
export function canonicalKnowledgeStatus(){
  const integrity=auditCanonicalKnowledge();
  if(!integrity.ok)throw new Error('CANONICAL_KNOWLEDGE_INVALID');
  const reviews=auditReviewLedger(CANONICAL_KNOWLEDGE);
  if(!reviews.ok)throw new Error('TECHNICAL_REVIEW_INVALID');
  const reviewed=REVIEW_LEDGER.length;
  return Object.freeze({
    schema:CANONICAL_KNOWLEDGE.schema,
    version:'15.13.0',
    sourceAppVersion:CANONICAL_KNOWLEDGE.sourceAppVersion,
    procedureCount:EXPECTED_PROCEDURES,
    stepCount:EXPECTED_STEPS,
    pendingSteps:EXPECTED_STEPS-reviewed,
    validatedSteps:reviewed,
    conditionalValidatedSteps:reviewed,
    reviewScope:'pulizia_completa_e_sicurezza_smontaggio_mozzo_ispezione_affilatura_equilibratura_rimontaggio_condizionati',
    latestReviewedStepId:REVIEW_LEDGER.at(-1)?.stepId||null,
    readyForTechnicalAnswers:false,
    aiEnabled:false,
    canGenerate:false,
    sessionChanged:false
  });
}
// Nessuna routine di retrieval di istruzioni è esposta dal Worker in 15.1.
// Per abilitare in futuro una risposta tecnica occorrerà un gate dedicato.
