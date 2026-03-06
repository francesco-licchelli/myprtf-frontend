import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'
  const activeSectionRef = useRef('')

  // Scroll state for navbar background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // IntersectionObserver for active section
  useEffect(() => {
    if (!isHome) return

    const sections = ['about', 'projects', 'skills', 'contact']
    const observers = []

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            activeSectionRef.current = id
            setActiveSection(id)
          }
        },
        { rootMargin: '-30% 0px -60% 0px' }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [isHome])

  const handleNavClick = (e, sectionId) => {
    e.preventDefault()
    setMenuOpen(false)
    if (isHome) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/', { state: { scrollTo: sectionId } })
    }
  }

  const handleLogoClick = (e) => {
    e.preventDefault()
    setMenuOpen(false)
    if (isHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/')
    }
  }

  const sections = ['about', 'projects', 'skills', 'contact']

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-container">
        <a href="/" className="nav-logo" onClick={handleLogoClick}>
          FL<span className="accent">.</span>
        </a>
        <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
          {sections.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`nav-link${activeSection === id ? ' active' : ''}`}
                onClick={(e) => handleNavClick(e, id)}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            </li>
          ))}
        </ul>
        <button
          className={`hamburger${menuOpen ? ' active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}
