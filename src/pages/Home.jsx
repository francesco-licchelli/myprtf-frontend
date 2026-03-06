import { useEffect, lazy, Suspense } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Terminal = lazy(() => import('../components/Terminal'))
import AnimatedCounter from '../components/AnimatedCounter'
import useScrollAnimation from '../hooks/useScrollAnimation'
import projects from '../data/projects'

const skills = {
  Backend: [
    { icon: '\u2615', name: 'Java' },
    { icon: '\u{1F33F}', name: 'Spring Boot' },
    { icon: '\u{1F40D}', name: 'Python' },
    { icon: '\u{1F527}', name: 'Django' },
  ],
  Frontend: [
    { icon: '\u269B', name: 'React' },
    { icon: '\u{1F49A}', name: 'Vue.js' },
    { icon: '\u{1F3A8}', name: 'HTML/CSS' },
    { icon: '\u26A1', name: 'JavaScript' },
  ],
  'Systems & DevOps': [
    { icon: '\u{1F427}', name: 'GNU/Linux' },
    { icon: '\u{1F4DC}', name: 'Bash' },
    { icon: '\u{1F433}', name: 'Docker' },
    { icon: '\u{2699}', name: 'Ansible' },
  ],
  'Tools & More': [
    { icon: '\u{1F431}', name: 'Git' },
    { icon: '\u{1F5C2}', name: 'MongoDB' },
    { icon: '\u{1F4BB}', name: 'C' },
    { icon: '\u{1F4F1}', name: 'Kotlin' },
  ],
}

export default function Home() {
  const location = useLocation()
  const navigate = useNavigate()

  useScrollAnimation()

  // Handle scroll-to from project detail page
  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        document.getElementById(location.state.scrollTo)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [location.state])

  return (
    <>
      {/* Hero */}
      <section className="hero" id="hero">
        <div className="hero-content">
          <Suspense fallback={null}><Terminal /></Suspense>
          <p className="hero-hint">
            Type <code>help</code> to see available commands
          </p>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-arrow" />
        </div>
      </section>

      {/* About */}
      <section className="section about" id="about">
        <div className="container">
          <h2 className="section-title">
            <span className="title-decoration">//</span> About Me
          </h2>
          <div className="about-grid">
            <div className="about-text">
              <p className="about-bio">
                Software Developer con una solida base in <span className="highlight">Java</span> e <span className="highlight">Python</span>,
                con esperienza nel settore bancario e una passione per la creazione di soluzioni software eleganti e performanti.
                Laurea in Informatica all'Alma Mater di Bologna, dove ho sviluppato competenze che spaziano dal
                backend enterprise al full-stack development.
              </p>
              <p className="about-bio">
                Mi distinguo per la capacit&agrave; di affrontare problemi complessi con approccio pragmatico,
                dal development di kernel UNIX-like alla progettazione di piattaforme web scalabili.
              </p>
            </div>
            <div className="about-stats">
              <div className="stat-card">
                <AnimatedCounter target={6} /><span className="stat-suffix">+</span>
                <span className="stat-label">Projects Completed</span>
              </div>
              <div className="stat-card">
                <AnimatedCounter target={10} /><span className="stat-suffix">+</span>
                <span className="stat-label">Technologies</span>
              </div>
              <div className="stat-card">
                <AnimatedCounter target={3} /><span className="stat-suffix">+</span>
                <span className="stat-label">Years Coding</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="timeline">
            <h3 className="timeline-heading">Experience &amp; Education</h3>
            <div className="timeline-track">
              <div className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <span className="timeline-date">05/2025 - ONGOING</span>
                  <h4>Software Developer - Banking Sector</h4>
                  <p>Sviluppo backend Java per applicazioni bancarie enterprise. Focus su sicurezza, performance e integrazione sistemi.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <span className="timeline-date">09/2021 - 03/2025 (105/110)</span>
                  <h4>Laurea in Informatica - Universit&agrave; di Bologna</h4>
                  <p>Alma Mater Studiorum. Tesi su scanner linguaggio Jolie per creazione di coreografie (JolieGraph).</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <span className="timeline-date">10/2024 - 11/2024 (105/110)</span>
                  <h4>Tirocinio curriculare - Universit&agrave; di Bologna</h4>
                  <p>Implementazione di script per l'OS detection (Python, Scapy). Utilizzo di tecniche passive (stealth mode) e attive (precision mode).</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <span className="timeline-date">09/2016 - 06/2021 (100/100)</span>
                  <h4>Progetti Universitari &amp; Open Source</h4>
                  <p>Sviluppo di social network, piattaforme chess, kernel OS, game AI, e app Android durante il percorso accademico.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="section projects" id="projects">
        <div className="container">
          <h2 className="section-title">
            <span className="title-decoration">//</span> Projects
          </h2>
          <div className="timeline">
            <div className="timeline-track">
              {projects.map((project) => (
                <div
                  key={project.slug}
                  className="timeline-item timeline-item-clickable"
                  onClick={() => navigate(`/projects/${project.slug}`)}
                >
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <div className="timeline-project-header">
                      <span className="timeline-project-icon">{project.icon}</span>
                      <div>
                        <h4>{project.title}</h4>
                        <div className="project-tags">
                          {project.tags.map((tag) => (
                            <span key={tag} className="tag">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p>{project.description}</p>
                    <span className="project-link">View details &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="section skills" id="skills">
        <div className="container">
          <h2 className="section-title">
            <span className="title-decoration">//</span> Tech Stack
          </h2>
          <div className="skills-grid">
            {Object.entries(skills).map(([category, items]) => (
              <div key={category} className="skill-category">
                <h3 className="skill-category-title">{category}</h3>
                <div className="skill-icons">
                  {items.map((skill) => (
                    <div key={skill.name} className="skill-item">
                      <div className="skill-icon-wrapper">
                        <span className="skill-icon">{skill.icon}</span>
                      </div>
                      <span className="skill-name">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section contact" id="contact">
        <div className="container">
          <h2 className="section-title">
            <span className="title-decoration">//</span> Get in Touch
          </h2>
          <p className="contact-text">
            Sono sempre aperto a nuove opportunit&agrave; e collaborazioni interessanti.<br />
            Non esitare a contattarmi!
          </p>
          <div className="contact-links">
            <a href="mailto:francesco.licchelli@example.com" className="contact-btn">
              <span className="contact-icon">&#9993;</span> Email
            </a>
            <a href="https://github.com/francescolicchelli" target="_blank" rel="noopener noreferrer" className="contact-btn">
              <span className="contact-icon">{'\u{1F4BB}'}</span> GitHub
            </a>
            <a href="https://linkedin.com/in/francescolicchelli" target="_blank" rel="noopener noreferrer" className="contact-btn">
              <span className="contact-icon">{'\u{1F465}'}</span> LinkedIn
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
