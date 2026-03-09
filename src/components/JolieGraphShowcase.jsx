
const sections = {
  en: [
    {
      title: 'The problem: microservice complexity',
      text: 'In microservice architectures, services communicate through a mesh of messages — requests, responses, and one-way notifications. As the number of services grows, understanding the communication flow becomes increasingly difficult. JolieGraph solves this by statically analyzing Jolie source code and automatically generating directed graphs (IDFA) that represent every possible communication path.',
      type: 'image',
      image: '/screenshots/joliegraph/tagliata_bene.png',
      alt: 'Microservice communication mesh',
    },
    {
      title: 'Example: NotifierService',
      text: 'This Jolie service receives a notifyAll request containing a list of recipients, then iterates over them sending a one-way notification to each one via an external NotificationSender service. JolieGraph parses this code, traverses the AST, and builds the corresponding automaton — a compact graph capturing the loop and all communication primitives.',
      type: 'code',
      code: `service NotifierService {
  inputPort NotifierPort {
    RequestResponse:
      notifyAll(NotifyRequest)(void)
  }
  outputPort NotificationSender {
    OneWay:
      notify(NotificationRequest)
  }
  main {
    notifyAll(request)() {
      for (recipient in request.recipients) {
        notify@NotificationSender({
          .recipient = recipient,
          .message = request.message
        })
      }
    }
  }
}`,
      file: 'notifier.ol',
      lang: 'Jolie',
    },
    {
      title: 'Generated graph: loop pattern',
      text: 'The generated automaton for NotifierService has just 2 states: state 1 receives the incoming request (INPUT REQUEST), transitions to state 2, which sends notifications in a self-loop (OUTPUT ONE-WAY). After the loop, the response is sent back (INPUT RESPONSE) and the service returns to the initial state. Edge colors encode direction: blue for input, red for output, green for branching.',
      type: 'image',
      image: '/screenshots/joliegraph/for_colorato.png',
      alt: 'NotifierService automaton — loop pattern',
    },
    {
      title: 'Example: PaymentService',
      text: 'A more complex service: PaymentService receives a payment request, delegates a credit check to an external service (RequestResponse), and branches — if credit is sufficient, it confirms; otherwise it alerts and logs the failure. This demonstrates how JolieGraph handles conditional branching (if/else) and multiple output ports.',
      type: 'code',
      code: `service PaymentService {
  inputPort PaymentPort {
    RequestResponse: pay(PaymentRequest)(bool)
  }
  outputPort CreditChecker {
    RequestResponse: check(PaymentRequest)(bool)
  }
  outputPort Confirmer { OneWay: confirm(string) }
  outputPort AlertService { OneWay: alert(string) }
  outputPort Logger { OneWay: log(string) }

  main {
    pay(req)(res) {
      check@CreditChecker(req)(res)
      if (enoughCredit) {
        confirm@Confirmer(req.userId)
      } else {
        alert@AlertService(req.userId)
        log@Logger("Payment failed for " + req.userId)
      }
    }
  }
}`,
      file: 'payment.ol',
      lang: 'Jolie',
    },
    {
      title: 'Generated graph: branching pattern',
      text: 'The PaymentService automaton has 6 states. From state 1 (initial), it receives the pay request and delegates to CreditChecker. State 4 is the branching point: one edge goes to confirm (green, reaching state 6), another to alert+log (the else branch). Both paths converge to state 5, which sends the response back. The graph makes the communication architecture immediately visible — something impossible to grasp from code alone in large systems.',
      type: 'image',
      image: '/screenshots/joliegraph/if_colorato.png',
      alt: 'PaymentService automaton — branching pattern',
    },
    {
      title: 'DOT output format',
      text: 'JolieGraph outputs standard DOT format (Graphviz), making it easy to render, embed, or process further. Each node represents an automaton state, and each edge is labeled with the communication type (INPUT/OUTPUT), the primitive (REQUEST, RESPONSE, ONE-WAY), the operation name, the target port, and the data type. The graphs can be rendered with any Graphviz-compatible tool.',
      type: 'code',
      code: `strict digraph G {
  69 [ label="1" ];
  64 [ label="2" ];
  67 [ label="3" ];
  66 [ label="4" ];
  65 [ label="5" ];
  68 [ label="6" ];
  69 -> 64 [ label="INPUT REQUEST\\npay@PaymentPort\\nPaymentRequest" ];
  64 -> 67 [ label="OUTPUT REQUEST\\ncheck@CreditChecker\\nPaymentRequest" ];
  67 -> 66 [ label="OUTPUT RESPONSE\\ncheck@CreditChecker\\nbool" ];
  66 -> 65 [ label="OUTPUT ONE-WAY\\nalert@AlertService\\nstring" ];
  66 -> 68 [ label="OUTPUT ONE-WAY\\nconfirm@Confirmer\\nstring" ];
  65 -> 68 [ label="OUTPUT ONE-WAY\\nlog@Logger\\nstring" ];
  68 -> 69 [ label="INPUT RESPONSE\\npay@PaymentPort\\nbool" ];
}`,
      file: 'payment.dot',
      lang: 'DOT',
    },
  ],
  it: [
    {
      title: 'Il problema: la complessita\' dei microservizi',
      text: 'Nelle architetture a microservizi, i servizi comunicano attraverso una rete di messaggi — richieste, risposte e notifiche one-way. Al crescere del numero di servizi, comprendere il flusso di comunicazione diventa sempre piu\' difficile. JolieGraph risolve questo problema analizzando staticamente il codice sorgente Jolie e generando automaticamente grafi diretti (IDFA) che rappresentano ogni possibile percorso di comunicazione.',
      type: 'image',
      image: '/screenshots/joliegraph/tagliata_bene.png',
      alt: 'Rete di comunicazione tra microservizi',
    },
    {
      title: 'Esempio: NotifierService',
      text: 'Questo servizio Jolie riceve una richiesta notifyAll contenente una lista di destinatari, poi itera su di essi inviando una notifica one-way a ciascuno tramite un servizio esterno NotificationSender. JolieGraph analizza questo codice, attraversa l\'AST e costruisce l\'automa corrispondente — un grafo compatto che cattura il ciclo e tutte le primitive di comunicazione.',
      type: 'code',
      code: `service NotifierService {
  inputPort NotifierPort {
    RequestResponse:
      notifyAll(NotifyRequest)(void)
  }
  outputPort NotificationSender {
    OneWay:
      notify(NotificationRequest)
  }
  main {
    notifyAll(request)() {
      for (recipient in request.recipients) {
        notify@NotificationSender({
          .recipient = recipient,
          .message = request.message
        })
      }
    }
  }
}`,
      file: 'notifier.ol',
      lang: 'Jolie',
    },
    {
      title: 'Grafo generato: pattern con ciclo',
      text: 'L\'automa generato per NotifierService ha solo 2 stati: lo stato 1 riceve la richiesta in ingresso (INPUT REQUEST), transita allo stato 2, che invia notifiche in un self-loop (OUTPUT ONE-WAY). Dopo il ciclo, la risposta viene inviata (INPUT RESPONSE) e il servizio torna allo stato iniziale. I colori degli archi codificano la direzione: blu per input, rosso per output, verde per le diramazioni.',
      type: 'image',
      image: '/screenshots/joliegraph/for_colorato.png',
      alt: 'Automa NotifierService — pattern con ciclo',
    },
    {
      title: 'Esempio: PaymentService',
      text: 'Un servizio piu\' complesso: PaymentService riceve una richiesta di pagamento, delega il controllo del credito a un servizio esterno (RequestResponse), e si dirama — se il credito e\' sufficiente, conferma; altrimenti invia un alert e registra il fallimento. Questo dimostra come JolieGraph gestisce le diramazioni condizionali (if/else) e piu\' output port.',
      type: 'code',
      code: `service PaymentService {
  inputPort PaymentPort {
    RequestResponse: pay(PaymentRequest)(bool)
  }
  outputPort CreditChecker {
    RequestResponse: check(PaymentRequest)(bool)
  }
  outputPort Confirmer { OneWay: confirm(string) }
  outputPort AlertService { OneWay: alert(string) }
  outputPort Logger { OneWay: log(string) }

  main {
    pay(req)(res) {
      check@CreditChecker(req)(res)
      if (enoughCredit) {
        confirm@Confirmer(req.userId)
      } else {
        alert@AlertService(req.userId)
        log@Logger("Payment failed for " + req.userId)
      }
    }
  }
}`,
      file: 'payment.ol',
      lang: 'Jolie',
    },
    {
      title: 'Grafo generato: pattern con diramazione',
      text: 'L\'automa del PaymentService ha 6 stati. Dallo stato 1 (iniziale), riceve la richiesta pay e delega a CreditChecker. Lo stato 4 e\' il punto di diramazione: un arco va verso confirm (verde, raggiunge lo stato 6), un altro verso alert+log (il ramo else). Entrambi i percorsi convergono allo stato 5, che invia la risposta. Il grafo rende l\'architettura di comunicazione immediatamente visibile — qualcosa impossibile da cogliere solo dal codice in sistemi di grandi dimensioni.',
      type: 'image',
      image: '/screenshots/joliegraph/if_colorato.png',
      alt: 'Automa PaymentService — pattern con diramazione',
    },
    {
      title: 'Output in formato DOT',
      text: 'JolieGraph produce output in formato DOT standard (Graphviz), rendendolo facile da visualizzare, integrare o elaborare ulteriormente. Ogni nodo rappresenta uno stato dell\'automa, e ogni arco e\' etichettato con il tipo di comunicazione (INPUT/OUTPUT), la primitiva (REQUEST, RESPONSE, ONE-WAY), il nome dell\'operazione, la porta di destinazione e il tipo di dato. I grafi possono essere renderizzati con qualsiasi strumento compatibile con Graphviz.',
      type: 'code',
      code: `strict digraph G {
  69 [ label="1" ];
  64 [ label="2" ];
  67 [ label="3" ];
  66 [ label="4" ];
  65 [ label="5" ];
  68 [ label="6" ];
  69 -> 64 [ label="INPUT REQUEST\\npay@PaymentPort\\nPaymentRequest" ];
  64 -> 67 [ label="OUTPUT REQUEST\\ncheck@CreditChecker\\nPaymentRequest" ];
  67 -> 66 [ label="OUTPUT RESPONSE\\ncheck@CreditChecker\\nbool" ];
  66 -> 65 [ label="OUTPUT ONE-WAY\\nalert@AlertService\\nstring" ];
  66 -> 68 [ label="OUTPUT ONE-WAY\\nconfirm@Confirmer\\nstring" ];
  65 -> 68 [ label="OUTPUT ONE-WAY\\nlog@Logger\\nstring" ];
  68 -> 69 [ label="INPUT RESPONSE\\npay@PaymentPort\\nbool" ];
}`,
      file: 'payment.dot',
      lang: 'DOT',
    },
  ],
}

function CodeBlock({ code, file, lang }) {
  return (
    <div className="panda-code-wrapper">
      <div className="panda-code-header">
        <span className="panda-code-file">{file}</span>
        <span className="panda-code-lang">{lang}</span>
      </div>
      <pre className="panda-code"><code>{code}</code></pre>
    </div>
  )
}

export default function JolieGraphShowcase({ lang }) {
  const content = sections[lang] || sections.en

  return (
    <div className="panda-showcase">
      {content.map((section, i) => (
        <div key={i} className={`panda-section ${i % 2 === 1 ? 'panda-section--reverse' : ''}`}>
          <div className="panda-section-text">
            <h4 className="panda-section-title">{section.title}</h4>
            <p>{section.text}</p>
          </div>
          <div className="panda-section-visual">
            {section.type === 'image' && (
              <div className="joliegraph-image-wrapper">
                <img
                  src={section.image}
                  alt={section.alt}
                  className="joliegraph-image"
                />
              </div>
            )}
            {section.type === 'code' && (
              <CodeBlock code={section.code} file={section.file} lang={section.lang} />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
