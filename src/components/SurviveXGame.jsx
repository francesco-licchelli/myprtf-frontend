import { useRef, useEffect, useState, useCallback } from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'
import { t as translate } from '../i18n/index.js';

const SURVIVEX_URL = import.meta.env.PUBLIC_SURVIVEX_URL || '';

function isMobile() {
  return /Android|iPhone|iPad|iPod|webOS|BlackBerry|Opera Mini|IEMobile/i.test(navigator.userAgent)
    || (navigator.maxTouchPoints > 1 && !matchMedia('(pointer:fine)').matches)
}

export default function SurviveXGame({ lang }) {
  const termRef = useRef(null)
  const xtermRef = useRef(null)
  const wsRef = useRef(null)
  const resizeRef = useRef(null)
  const [status, setStatus] = useState('idle')
  const [connectId, setConnectId] = useState(0)
  const gameRef = useRef(null)
  const t = (key) => translate(lang, key);

  const cleanup = useCallback(() => {
    if (resizeRef.current) {
      window.removeEventListener('resize', resizeRef.current)
      resizeRef.current = null
    }
    if (xtermRef.current) {
      xtermRef.current.dispose()
      xtermRef.current = null
    }
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
  }, [])

  // Initialize terminal + WebSocket when connectId changes
  useEffect(() => {
    if (connectId === 0) return

    const term = new Terminal({
      theme: {
        background: '#0d0d14',
        foreground: '#a1a1aa',
        cursor: '#e4e4e7',
        cursorAccent: '#0d0d14',
        green: '#4ade80',
        cyan: '#06b6d4',
        magenta: '#7c3aed',
      },
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontSize: 14,
      cursorBlink: true,
      scrollback: 0,
    })

    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)
    term.open(termRef.current)
    fitAddon.fit()
    xtermRef.current = term

    const handleResize = () => {
      fitAddon.fit()
      if (wsRef.current?.readyState === 1) {
        wsRef.current.send(JSON.stringify({ type: 'resize', cols: term.cols, rows: term.rows }))
      }
    }
    window.addEventListener('resize', handleResize)
    resizeRef.current = handleResize

    const wsUrl = SURVIVEX_URL.replace(/^http/, 'ws')
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      setStatus('playing')
      fitAddon.fit()
      ws.send(JSON.stringify({ type: 'resize', cols: term.cols, rows: term.rows }))
      setTimeout(() => {
        gameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 300)
    }
    ws.onmessage = (e) => term.write(e.data)
    ws.onclose = () => {
      if (xtermRef.current) {
        xtermRef.current.dispose()
        xtermRef.current = null
      }
      setStatus('ended')
    }
    ws.onerror = () => setStatus('error')

    term.onData((data) => {
      if (ws.readyState === 1) ws.send(data)
    })

    return cleanup
  }, [connectId, cleanup])

  useEffect(() => cleanup, [cleanup])

  async function startGame() {
    cleanup()
    setStatus('connecting')
    // Wait for container to be ready
    for (let i = 0; i < 30; i++) {
      try {
        const res = await fetch(`${SURVIVEX_URL}/`, { signal: AbortSignal.timeout(3000) })
        if (res.ok) { setConnectId((c) => c + 1); return }
      } catch {}
      await new Promise(r => setTimeout(r, 2000))
    }
    setStatus('error')
  }

  if (isMobile()) {
    return (
      <div className="tris-game">
        <p className="tris-config-hint">{t('projectDetail.desktopOnly')}</p>
      </div>
    )
  }

  if (status === 'idle') {
    return (
      <div className="tris-game">
        <button className="tris-reset" onClick={startGame}>
          {t('trisGame.startGame')}
        </button>
      </div>
    )
  }

  return (
    <div ref={gameRef} className="survivex-game">
      {status === 'connecting' && (
        <div className="tris-status">
          <span className="tris-status-text">
            <span className="spinner" />
            {t('projectDetail.loading')}
          </span>
        </div>
      )}
      {status !== 'ended' && status !== 'error' && (
        <div className="terminal">
          <div className="terminal-bar">
            <div className="terminal-dots">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>
            <span className="terminal-title">SurviveX</span>
          </div>
          <div className="terminal-body survivex-body" ref={termRef} />
        </div>
      )}
      {(status === 'ended' || status === 'error') && (
        <div className="tris-actions">
          <button className="tris-reset" onClick={startGame}>
            {t('trisGame.newGame')}
          </button>
        </div>
      )}
    </div>
  )
}
