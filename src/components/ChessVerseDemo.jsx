import { useState, useEffect, useRef } from 'react'
import { t as translate } from '../i18n/index.js';

const CHESSVERSE_URL = import.meta.env.PUBLIC_CHESSVERSE_URL || '';

export default function ChessVerseDemo({ lang }) {
  const [status, setStatus] = useState('idle')
  const [serviceReady, setServiceReady] = useState(false)
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
          const res = await fetch(`${CHESSVERSE_URL}/`, { signal: AbortSignal.timeout(3000) })
          if (res.ok) { setServiceReady(true); setStatus('ready'); return }
        } catch {}
        await new Promise(r => setTimeout(r, 2000))
      }
      throw new Error('timeout')
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
        src={serviceReady ? `${CHESSVERSE_URL}/` : ''}
        className="squealer-iframe"
        title="ChessVerse"
      />
    </div>
  )
}
