import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import projects from '../data/projects'
import TrisGame from '../components/TrisGame'

export default function ProjectDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const project = projects.find((p) => p.slug === slug)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!project) {
    return (
      <section className="section project-detail">
        <div className="container">
          <h2 className="section-title">Project not found</h2>
          <button className="back-btn" onClick={() => navigate('/', { state: { scrollTo: 'projects' } })}>
            &larr; Back to projects
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="section project-detail">
      <div className="container">
        <button
          className="back-btn"
          onClick={() => navigate('/', { state: { scrollTo: 'projects' } })}
        >
          &larr; Back to projects
        </button>

        <div className="project-detail-header">
          <span className="project-detail-icon">{project.icon}</span>
          <div>
            <h1 className="project-detail-title">{project.title}</h1>
            <div className="project-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="project-detail-body">
          <div className="project-detail-description">
            {project.longDescription.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {project.type === 'interactive' && project.slug === 'sufferingdoge' && (
            <div className="project-detail-interactive">
              <h3>Play against the AI</h3>
              <TrisGame />
            </div>
          )}

          {project.type === 'showcase' && (
            <div className="project-detail-gallery">
              <div className="gallery-placeholder">
                <span className="gallery-placeholder-icon">{'\u{1F4F7}'}</span>
                <p>Screenshots coming soon</p>
              </div>
            </div>
          )}
        </div>

        <div className="project-detail-footer">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-btn"
          >
            <span className="contact-icon">{'\u{1F4BB}'}</span> View on GitHub
          </a>
          {project.report && (
            <a
              href={project.report}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-btn"
            >
              <span className="contact-icon">{'\u{1F4C4}'}</span> Download Report
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
