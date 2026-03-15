import { useState, useEffect, useRef } from 'react'
import { t as translate } from '../i18n/index.js';

const API_URL = import.meta.env.PUBLIC_GATEWAY_URL || '';

export default function ChessVerseDemo({ lang }) {
  const [status, setStatus] = useState('idle')
  const [port, setPort] = useState(null)
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
      const res = await fetch(`${API_URL}/ensure/chessverse`)
      if (!res.ok) throw new Error('Failed to start')
      const data = await res.json()
      setPort(data.port)
    } catch {
      setStatus('error')
    }
  }

  if (status === 'idle') {
    return (
      <div className="tris-game">
        <button className="tris-reset" onClick={start}>
          {t('chessverse.launch')}
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
        <p className="tris-config-hint">{t('chessverse.error')}</p>
        <button className="tris-reset" onClick={start}>
          {t('chessverse.retry')}
        </button>
      </div>
    )
  }

  return (
    <div ref={wrapperRef} className="squealer-demo">
      <iframe
        src={`http://${window.location.hostname}:${port}/`}
        className="squealer-iframe"
        title="ChessVerse"
      />
    </div>
  )
}
