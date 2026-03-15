import { useState, useRef, useEffect } from 'react'
import { t as translate } from '../i18n/index.js';

const SQUEALER_URL = import.meta.env.PUBLIC_SQUEALER_URL || '';

const VIEWS = [
  { key: 'user', path: '/', label: 'User' },
  { key: 'smm', path: '/smm/', label: 'SMM' },
  { key: 'mod', path: '/mod/', label: 'Mod Panel' },
]

export default function SquealerDemo({ lang }) {
  const [status, setStatus] = useState('idle')
  const [serviceReady, setServiceReady] = useState(false)
  const [activeView, setActiveView] = useState('user')
  const iframeRef = useRef(null)
  const wrapperRef = useRef(null)
  const t = (key) => translate(lang, key);

  useEffect(() => {
    if (!serviceReady) return
    setTimeout(() => {
      wrapperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 300)
  }, [serviceReady])

  async function start() {
    setStatus('loading')
    try {
      for (let i = 0; i < 30; i++) {
        try {
          const res = await fetch(`${SQUEALER_URL}/`, { signal: AbortSignal.timeout(3000) })
          if (res.ok) { setServiceReady(true); setStatus('ready'); return }
        } catch {}
        await new Promise(r => setTimeout(r, 2000))
      }
      throw new Error('timeout')
    } catch {
      setStatus('error')
    }
  }

  function getIframeSrc() {
    if (!serviceReady) return ''
    const view = VIEWS.find((v) => v.key === activeView)
    return `${SQUEALER_URL}${view.path}`
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
