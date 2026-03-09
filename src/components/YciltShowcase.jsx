
const sections = {
  en: [
    {
      title: 'Explore the map',
      text: 'The heart of YCILT is an interactive Google Maps view. Each marker represents a public audio recording uploaded by users in the area. Markers refresh every 5 seconds to keep the map up to date. Tap any marker to see detailed info about that recording.',
      images: ['/screenshots/ycilt/MainActivity.jpg'],
    },
    {
      title: 'Record and share',
      text: 'Capture the sounds around you with the built-in recorder. Once saved, the audio is queued for upload via a background Worker that waits for a Wi-Fi connection — so you never waste mobile data. A notification keeps you informed about the upload status.',
      images: ['/screenshots/ycilt/AudioRecording.jpg'],
    },
    {
      title: 'Manage your audio',
      text: 'Access your personal library from the drawer. Each recording shows its filename, date, and duration. Tap one to play it back, see where it was recorded (via reverse geocoding), toggle its privacy between public and private, or delete it.',
      images: ['/screenshots/ycilt/MyAudio.jpg', '/screenshots/ycilt/MyAudioInfo.jpg'],
    },
    {
      title: 'Music analysis',
      text: 'The backend analyzes every uploaded recording, extracting rich metadata: BPM, danceability, loudness, plus the top 5 most likely mood, genre, and instruments. This turns a simple audio file into a detailed music fingerprint.',
      images: ['/screenshots/ycilt/AudioInfo.jpg'],
    },
    {
      title: 'Authentication & navigation',
      text: 'Users sign up and log in with a clean, minimal interface. The auth token is persisted in SharedPreferences so you stay logged in across sessions. A side drawer provides quick access to your uploads, logout, and account deletion.',
      images: ['/screenshots/ycilt/login.jpg', '/screenshots/ycilt/Signup.jpg'],
    },
  ],
  it: [
    {
      title: 'Esplora la mappa',
      text: "Il cuore di YCILT e' una mappa interattiva Google Maps. Ogni marker rappresenta una registrazione audio pubblica caricata dagli utenti nella zona. I marker si aggiornano ogni 5 secondi per mantenere la mappa sempre attuale. Tocca un marker per visualizzare le informazioni dettagliate sulla registrazione.",
      images: ['/screenshots/ycilt/MainActivity.jpg'],
    },
    {
      title: 'Registra e condividi',
      text: "Cattura i suoni intorno a te con il registratore integrato. Una volta salvato, l'audio viene messo in coda per l'upload tramite un Worker in background che attende una connessione Wi-Fi — cosi' non sprechi dati mobili. Una notifica ti tiene informato sullo stato dell'upload.",
      images: ['/screenshots/ycilt/AudioRecording.jpg'],
    },
    {
      title: 'Gestisci i tuoi audio',
      text: "Accedi alla tua libreria personale dal drawer laterale. Ogni registrazione mostra nome file, data e durata. Toccane una per riprodurla, vedere dove e' stata registrata (tramite geocoding inverso), cambiarne la privacy tra pubblica e privata, o eliminarla.",
      images: ['/screenshots/ycilt/MyAudio.jpg', '/screenshots/ycilt/MyAudioInfo.jpg'],
    },
    {
      title: 'Analisi musicale',
      text: "Il backend analizza ogni registrazione caricata, estraendo metadati dettagliati: BPM, danceability, loudness, piu' le 5 opzioni piu' probabili per mood, genere e strumenti. Questo trasforma un semplice file audio in un'impronta musicale completa.",
      images: ['/screenshots/ycilt/AudioInfo.jpg'],
    },
    {
      title: 'Autenticazione e navigazione',
      text: "Gli utenti si registrano e accedono con un'interfaccia pulita e minimale. Il token di autenticazione e' salvato nelle SharedPreferences, cosi' resti loggato tra una sessione e l'altra. Un drawer laterale offre accesso rapido ai tuoi upload, logout e cancellazione dell'account.",
      images: ['/screenshots/ycilt/login.jpg', '/screenshots/ycilt/Signup.jpg'],
    },
  ],
}

export default function YciltShowcase({ lang }) {
  const content = sections[lang] || sections.en

  return (
    <div className="ycilt-showcase">
      {content.map((section, i) => (
        <div key={i} className={`ycilt-section ${i % 2 === 1 ? 'ycilt-section--reverse' : ''}`}>
          <div className="ycilt-section-text">
            <h4 className="ycilt-section-title">{section.title}</h4>
            <p>{section.text}</p>
          </div>
          <div className={`ycilt-section-images ${section.images.length > 1 ? 'ycilt-section-images--duo' : ''}`}>
            {section.images.map((src, j) => (
              <div key={j} className="ycilt-phone-frame">
                <img src={src} alt={section.title} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
