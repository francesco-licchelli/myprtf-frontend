import { useState, useRef, useEffect } from 'react'
import { t as translate } from '../i18n/index.js';

const API_URL = import.meta.env.PUBLIC_GATEWAY_URL || '';

const VIEWS = [
  { key: 'user', path: '/', label: 'User' },
  { key: 'smm', path: '/smm/', label: 'SMM' },
  { key: 'mod', path: '/mod/', label: 'Mod Panel' },
]

export default function SquealerDemo({ lang }) {
  const [status, setStatus] = useState('idle')
  const [port, setPort] = useState(null)
  const [activeView, setActiveView] = useState('user')
  const iframeRef = useRef(null)
  const wrapperRef = useRef(null)
  const t = (key) => translate(lang, key);

  useEffect(() => {
    if (!port) return
    setStatus('ready')
    setTimeout(() => {
      wrapperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 300)
  }, [port])

  async function start() {
    setStatus('loading')
    try {
      const res = await fetch(`${API_URL}/ensure/squealer`)
      if (!res.ok) throw new Error('Failed to start')
      const data = await res.json()
      setPort(data.port)
    } catch {
      setStatus('error')
    }
  }

  function getIframeSrc() {
    if (!port) return ''
    const view = VIEWS.find((v) => v.key === activeView)
    return `http://${window.location.hostname}:${port}${view.path}`
  }

  if (status === 'idle') {
    return (
      <div className="tris-game">
        <p className="tris-config-hint">{t('squealer.credentials')}</p>
        <button className="tris-reset" onClick={start}>
          {t('squealer.launch')}
        </button>
      </div>
    )
  }

  if (status === 'loading') {
    return (
      <div className="tris-game">
        <div className="tris-status">
          <span className="tris-status-text">
            <span className="spinner" />
            {t('projectDetail.loading')}
          </span>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="tris-game">
        <p className="tris-config-hint">{t('squealer.error')}</p>
        <button className="tris-reset" onClick={start}>
          {t('squealer.retry')}
        </button>
      </div>
    )
  }

  return (
    <div ref={wrapperRef} className="squealer-demo">
      <div className="squealer-tabs">
        {VIEWS.map((view) => (
          <button
            key={view.key}
            className={`squealer-tab${activeView === view.key ? ' active' : ''}`}
            onClick={() => setActiveView(view.key)}
          >
            {view.label}
          </button>
        ))}
      </div>
      <iframe
        ref={iframeRef}
        src={getIframeSrc()}
        className="squealer-iframe"
        title="Squealer"
      />
    </div>
  )
}
