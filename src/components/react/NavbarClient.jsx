import { useState, useEffect } from 'react';

export default function NavbarClient({ lang, otherLang, currentPath, labels }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const isHome = currentPath === `/${lang}/` || currentPath === `/${lang}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return;

    const sectionIds = ['about', 'projects', 'skills', 'contact'];

    const onScroll = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
      if (atBottom) {
        setActiveSection('contact');
        return;
      }

      const target = window.innerHeight * 0.3;
      let current = '';

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= target && rect.bottom > target) {
          current = id;
        }
      }

      setActiveSection(current);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    setMenuOpen(false);
    if (isHome) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = `/${lang}/#${sectionId}`;
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    if (isHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.href = `/${lang}/`;
    }
  };

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  const sections = ['about', 'projects', 'skills', 'contact'];
  const langSwitchUrl = currentPath.replace(`/${lang}`, `/${otherLang}`);

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-container">
        <a href={`/${lang}/`} className="nav-logo" onClick={handleLogoClick}>
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
                {labels[id]}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleTheme}>
            {'\u{1F313}'}
          </button>

          <a href={langSwitchUrl} className="lang-toggle">
            {lang === 'it' ? '\u{1F1EC}\u{1F1E7}' : '\u{1F1EE}\u{1F1F9}'}
          </a>

          <button
            className={`hamburger${menuOpen ? ' active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  );
}
