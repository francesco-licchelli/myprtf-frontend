const layers = [
  {
    id: 'user',
    en: 'User',
    it: 'Utente',
    icon: '👤',
  },
  {
    id: 'cloudflare',
    en: 'Cloudflare',
    it: 'Cloudflare',
    icon: '🛡️',
    detail: { en: 'DNS + CDN + DDoS protection', it: 'DNS + CDN + Protezione DDoS' },
    accent: 'orange',
  },
  {
    id: 'swa',
    en: 'Azure Static Web Apps',
    it: 'Azure Static Web Apps',
    icon: '🌐',
    detail: { en: 'Astro + React (static)', it: 'Astro + React (statico)' },
    accent: 'cyan',
  },
  {
    id: 'containers',
    en: 'Azure Container Apps (scale-to-zero)',
    it: 'Azure Container Apps (scale-to-zero)',
    icon: '📦',
    accent: 'purple',
  },
]

const backends = [
  {
    name: 'SufferingDoge',
    tech: 'Java 17 + Spring Boot',
    icon: '⭕',
    desc: { en: 'MiniMax AI game engine', it: 'Engine AI con MiniMax' },
  },
  {
    name: 'SurviveX',
    tech: 'Node.js + C++ (node-pty)',
    icon: '🎮',
    desc: { en: 'Terminal game via WebSocket', it: 'Gioco terminale via WebSocket' },
  },
  {
    name: 'Squealer',
    tech: 'Node.js + MongoDB Atlas',
    icon: '💬',
    desc: { en: 'Social network with 3 frontends', it: 'Social network con 3 frontend' },
  },
  {
    name: 'ChessVerse',
    tech: 'Node.js + Python (WebSocket)',
    icon: '♞',
    desc: { en: 'Chess platform with async engine', it: 'Piattaforma scacchi con engine asincrono' },
  },
]

const sections = {
  en: [
    {
      title: 'Architecture overview',
      text: 'This portfolio site itself is one of the most technically interesting projects: a static Astro frontend served via Azure Static Web Apps and Cloudflare, with four completely heterogeneous backend services running as independent Azure Container Apps with scale-to-zero. Each backend uses a different tech stack — Java, Node.js+C++, Node.js+MongoDB, Node.js+Python — yet they are all orchestrated under a single unified frontend.',
      type: 'diagram',
    },
    {
      title: 'Heterogeneous backends',
      text: 'Each project demo runs on its own containerized backend with a completely different technology stack. SufferingDoge is a Java Spring Boot service exposing a REST API for a MiniMax game engine. SurviveX pairs Node.js with a compiled C++ binary, bridged through node-pty to stream terminal sessions over WebSocket. Squealer is a full Node.js app backed by MongoDB Atlas. ChessVerse combines a Node.js HTTP server with a Python WebSocket server for the async chess engine. All four are packaged as Docker images and deployed independently.',
      type: 'backends',
    },
    {
      title: 'Cloud infrastructure',
      text: 'Cloudflare sits in front as DNS resolver and CDN, providing caching, DDoS protection and TLS termination. The static frontend is deployed to Azure Static Web Apps (free tier), which serves the Astro-built pages from a global CDN. The four backend services run on Azure Container Apps with scale-to-zero enabled: when no one is using a demo, the container shuts down and costs nothing. On the first request, Azure cold-starts the container in 5-15 seconds. This keeps the monthly cost under 5 EUR while supporting the full interactive experience.',
      type: 'text',
    },
  ],
  it: [
    {
      title: "Panoramica dell'architettura",
      text: "Questo stesso sito portfolio è uno dei progetti tecnicamente più interessanti: un frontend statico Astro servito tramite Azure Static Web Apps e Cloudflare, con quattro servizi backend completamente eterogenei che girano come Azure Container Apps indipendenti con scale-to-zero. Ogni backend usa uno stack tecnologico diverso — Java, Node.js+C++, Node.js+MongoDB, Node.js+Python — eppure sono tutti orchestrati sotto un unico frontend unificato.",
      type: 'diagram',
    },
    {
      title: 'Backend eterogenei',
      text: "Ogni demo di progetto gira sul proprio backend containerizzato con uno stack tecnologico completamente diverso. SufferingDoge è un servizio Java Spring Boot che espone un'API REST per un engine di gioco MiniMax. SurviveX accoppia Node.js con un binario C++ compilato, collegati tramite node-pty per trasmettere sessioni terminale via WebSocket. Squealer è un'app Node.js completa con MongoDB Atlas. ChessVerse combina un server HTTP Node.js con un server WebSocket Python per l'engine di scacchi asincrono. Tutti e quattro sono impacchettati come immagini Docker e deployati indipendentemente.",
      type: 'backends',
    },
    {
      title: 'Infrastruttura cloud',
      text: "Cloudflare si posiziona come DNS resolver e CDN, fornendo caching, protezione DDoS e terminazione TLS. Il frontend statico è deployato su Azure Static Web Apps (tier gratuito), che serve le pagine generate da Astro tramite CDN globale. I quattro servizi backend girano su Azure Container Apps con scale-to-zero abilitato: quando nessuno sta usando una demo, il container si spegne e non costa nulla. Alla prima richiesta, Azure avvia il container a freddo in 5-15 secondi. Questo mantiene il costo mensile sotto i 5 EUR supportando l'intera esperienza interattiva.",
      type: 'text',
    },
  ],
}

function ArchDiagram({ lang }) {
  return (
    <div className="portfolio-arch">
      {layers.map((l, i) => (
        <div key={l.id}>
          <div className={`portfolio-arch-layer portfolio-arch-layer--${l.accent || 'default'}`}>
            <span className="portfolio-arch-icon">{l.icon}</span>
            <div className="portfolio-arch-layer-content">
              <span className="portfolio-arch-layer-name">{lang === 'it' ? l.it : l.en}</span>
              {l.detail && (
                <span className="portfolio-arch-layer-detail">{lang === 'it' ? l.detail.it : l.detail.en}</span>
              )}
            </div>
          </div>
          {i < layers.length - 1 && (
            <div className="portfolio-arch-arrow">↓</div>
          )}
        </div>
      ))}
    </div>
  )
}

function BackendGrid({ lang }) {
  return (
    <div className="portfolio-backends">
      {backends.map((b) => (
        <div key={b.name} className="portfolio-backend-card">
          <div className="portfolio-backend-header">
            <span className="portfolio-backend-icon">{b.icon}</span>
            <span className="portfolio-backend-name">{b.name}</span>
          </div>
          <span className="portfolio-backend-tech">{b.tech}</span>
          <span className="portfolio-backend-desc">{lang === 'it' ? b.desc.it : b.desc.en}</span>
        </div>
      ))}
    </div>
  )
}

export default function PortfolioShowcase({ lang }) {
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
            {section.type === 'diagram' && <ArchDiagram lang={lang} />}
            {section.type === 'backends' && <BackendGrid lang={lang} />}
          </div>
        </div>
      ))}
    </div>
  )
}
