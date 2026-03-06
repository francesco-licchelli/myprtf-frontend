const projects = [
  {
    slug: 'squealer',
    title: 'Squealer',
    icon: '\u{1F4AC}',
    description: 'Social Network completo con sistema di post, messaggistica real-time, e dashboard di moderazione. Architettura full-stack con tre frontend distinti.',
    longDescription: `Squealer è un social network completo sviluppato come progetto universitario. L'architettura prevede un backend Node.js con MongoDB come database, e tre frontend distinti: un'app utente in React, un pannello di moderazione in Vue.js, e un client pubblico.

Il sistema supporta post con diversi tipi di contenuto (testo, immagini, geolocalizzazione), un sistema di canali tematici, messaggistica tra utenti, e una dashboard di moderazione completa per la gestione dei contenuti.

La sfida principale è stata la gestione della comunicazione real-time tra i tre frontend e il backend, risolta con WebSocket e un sistema di eventi centralizzato.`,
    tags: ['Node.js', 'React', 'Vue.js', 'MongoDB', 'JavaScript'],
    filterTags: ['javascript'],
    github: 'https://github.com/francescolicchelli',
    type: 'showcase',
  },
  {
    slug: 'chessverse',
    title: 'ChessVerse',
    icon: '\u{265E}',
    description: 'Piattaforma chess online con matchmaking, analisi partite, e deployment cloud. Backend Django con frontend React e containerizzazione Docker.',
    longDescription: `ChessVerse è una piattaforma di scacchi online che permette a due giocatori di sfidarsi in partite real-time. Il backend è sviluppato in Django con Django Channels per la comunicazione WebSocket, mentre il frontend è in React.

L'applicazione include un sistema di matchmaking, storico partite, e un viewer per rivedere le mosse. Il tutto è containerizzato con Docker e deployato su Azure.

La sfida tecnica più interessante è stata l'implementazione del protocollo di comunicazione per sincronizzare lo stato della scacchiera tra i due giocatori in tempo reale, gestendo edge cases come disconnessioni e riconnessioni.`,
    tags: ['React', 'Django', 'Docker', 'Azure'],
    filterTags: ['python', 'javascript'],
    github: 'https://github.com/francescolicchelli',
    type: 'showcase',
  },
  {
    slug: 'panda-plus',
    title: 'Panda+',
    icon: '\u{1F43C}',
    description: 'Kernel UNIX-like con gestione processi, memoria virtuale, syscall, e device driver. Progetto low-level che dimostra competenze di sistemi operativi.',
    longDescription: `Panda+ è un kernel UNIX-like sviluppato in C come progetto per il corso di Sistemi Operativi. Implementa le funzionalità fondamentali di un sistema operativo moderno.

Il kernel include gestione dei processi con scheduling round-robin, memoria virtuale con paginazione, system call per I/O e gestione processi, device driver per terminale e disco, e un semplice file system.

Questo progetto mi ha dato una comprensione profonda di come funzionano i sistemi operativi a basso livello, dalla gestione degli interrupt alla context switch tra processi.`,
    tags: ['C', 'UNIX', 'Kernel Dev'],
    filterTags: ['c'],
    github: 'https://github.com/francescolicchelli',
    type: 'showcase',
  },
  {
    slug: 'sufferingdoge',
    title: 'SufferingDoge',
    icon: '\u{1F3B2}',
    description: 'Game AI con algoritmo MiniMax e alpha-beta pruning. Engine intelligente per giochi da tavolo con ottimizzazione delle strategie.',
    longDescription: `SufferingDoge è un engine AI sviluppato per scegliere mosse ideali all'interno di un MNK-game.
    Un MNK-game è una versione generalizzata del Tris (Tic-Tac-Toe) in cui la griglia di gioco è composta da M righe, N colonne e per vincere bisogna allineare K simboli. Il classico Tris corrisponde ad MNK(3, 3, 3).
    SufferingDoge utilizza l'algoritmo MiniMax, coadiuvato dalla potatura AlphaBeta per l'ottimizzazione della visita dell'albero di gioco. Questo permette di esplorare l'albero di gioco in maniera piu profonda rispetto a quanto si potrebbe fare con il solo MiniMax.
    Nelle board piu' complesse anche la potatura tramite AlphaBeta diventa inefficace, per tale motivo sono state introdotte due euristiche per la valutazione delle configurazioni. Combinate esse danno una valutazione locale rispetto alla singola mossa da fare e globale rispetto all'intera situazione di gioco.
    In questo modo SufferingDoge riesce ad analizzare piu' in profondita' l'albero di gioco, limitandosi ad osservare le situazioni a lui favorevoli, risparmiando tempo.

    Sfida SufferingDoge nella tua configurazione MNK preferita e prova a batterlo!
`,
    tags: ['Java', 'MiniMax', 'AI'],
    filterTags: ['java'],
    github: 'https://github.com/francesco-licchelli/SufferingDoge',
    report: '/reports/SufferingDoge.pdf',
    type: 'interactive',
  },
  {
    slug: 'ycilt',
    title: 'YCILT',
    icon: '\u{1F4F1}',
    description: 'App Android moderna con UI declarativa Jetpack Compose. Architettura MVVM, Material Design 3, e integrazione con API REST.',
    longDescription: `YCILT è un'applicazione Android sviluppata in Kotlin utilizzando Jetpack Compose per l'interfaccia utente declarativa. L'architettura segue il pattern MVVM (Model-View-ViewModel) con repository pattern per la separazione dei concern.

L'app implementa Material Design 3, navigazione con Compose Navigation, gestione dello stato con StateFlow, e comunicazione con API REST tramite Retrofit. Il tutto con dependency injection tramite Hilt.

Questo progetto mi ha permesso di approfondire lo sviluppo mobile moderno e le best practice Android.`,
    tags: ['Kotlin', 'Jetpack Compose', 'Android'],
    filterTags: ['kotlin'],
    github: 'https://github.com/francescolicchelli',
    type: 'showcase',
  },
  {
    slug: 'joliegraph',
    title: 'JolieGraph',
    icon: '\u{1F4CA}',
    description: 'Tesi di laurea: tool per l\'analisi e visualizzazione delle comunicazioni nel linguaggio di programmazione Jolie. Generazione automatica di grafi.',
    longDescription: `JolieGraph è il progetto della mia tesi di laurea, un tool per l'analisi statica e la visualizzazione delle comunicazioni nei programmi scritti in Jolie, un linguaggio di programmazione orientato ai microservizi.

Il tool analizza il codice sorgente Jolie, estrae le interfacce di comunicazione tra i servizi, e genera automaticamente grafi che rappresentano le interazioni. Questo permette agli sviluppatori di visualizzare e comprendere l'architettura di comunicazione di sistemi a microservizi complessi.

Il progetto combina parsing del codice, analisi statica, e generazione di visualizzazioni, applicando concetti di teoria dei grafi a problemi pratici di ingegneria del software.`,
    tags: ['Java', 'Jolie', 'Graph Analysis'],
    filterTags: ['java'],
    github: 'https://github.com/francescolicchelli',
    type: 'showcase',
  },
]

export default projects
