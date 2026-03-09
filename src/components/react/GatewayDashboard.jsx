import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '../../context/AdminAuthContext'

const GATEWAY_URL = import.meta.env.PUBLIC_GATEWAY_URL || 'http://localhost:3004'

function formatBytes(bytes) {
  if (!bytes) return '--'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function formatUptime(lastActivity) {
  if (!lastActivity) return '--'
  const ms = Date.now() - lastActivity
  const s = Math.floor(ms / 1000)
  if (s < 60) return s + 's'
  const m = Math.floor(s / 60)
  if (m < 60) return m + 'm ' + (s % 60) + 's'
  const h = Math.floor(m / 60)
  return h + 'h ' + (m % 60) + 'm'
}

function StatusDot({ status }) {
  const colors = { running: '#4ade80', starting: '#facc15', stopped: '#71717a' }
  return (
    <span
      className="gw-status-dot"
      style={{ background: colors[status] || '#71717a' }}
      title={status}
    />
  )
}

/* ── SVG mini chart ── */
function MemoryChart({ history, slug }) {
  const W = 320
  const H = 100
  const PAD = 24

  // Extract data points for this service
  const points = history
    .map((snap) => ({
      t: snap.t,
      mem: snap.services[slug]?.memory || 0,
      running: snap.services[slug]?.status === 'running',
    }))

  if (points.length < 2) {
    return (
      <div className="gw-chart-empty">
        <span>Collecting data...</span>
      </div>
    )
  }

  const maxMem = Math.max(...points.map((p) => p.mem), 1)
  const tMin = points[0].t
  const tMax = points[points.length - 1].t
  const tRange = tMax - tMin || 1

  const toX = (t) => PAD + ((t - tMin) / tRange) * (W - PAD * 2)
  const toY = (mem) => H - PAD - (mem / maxMem) * (H - PAD * 2)

  // Build polyline
  let pathD = ''
  let areaD = ''
  const validPoints = points.filter((p) => p.mem > 0)

  if (validPoints.length >= 2) {
    pathD = validPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(p.t).toFixed(1)},${toY(p.mem).toFixed(1)}`).join(' ')
    areaD = pathD + ` L${toX(validPoints[validPoints.length - 1].t).toFixed(1)},${(H - PAD).toFixed(1)} L${toX(validPoints[0].t).toFixed(1)},${(H - PAD).toFixed(1)} Z`
  }

  // Y axis labels
  const yLabels = [0, maxMem / 2, maxMem]

  // Time labels
  const elapsed = (tMax - tMin) / 1000
  const timeLabel = elapsed < 120 ? `${Math.round(elapsed)}s` : `${Math.round(elapsed / 60)}m`

  return (
    <svg className="gw-chart-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      {/* Grid lines */}
      {yLabels.map((v, i) => (
        <g key={i}>
          <line
            x1={PAD} y1={toY(v)} x2={W - PAD} y2={toY(v)}
            stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="3,3"
          />
          <text x={PAD - 4} y={toY(v) + 3} textAnchor="end" className="gw-chart-label">
            {formatBytes(v).replace(' ', '')}
          </text>
        </g>
      ))}
      {/* Time axis */}
      <text x={W - PAD} y={H - 4} textAnchor="end" className="gw-chart-label">
        -{timeLabel}
      </text>
      <text x={PAD} y={H - 4} textAnchor="start" className="gw-chart-label">
        now
      </text>
      {/* Area fill */}
      {areaD && (
        <path d={areaD} fill="url(#memGradient)" opacity="0.3" />
      )}
      {/* Line */}
      {pathD && (
        <path d={pathD} fill="none" stroke="var(--accent-cyan)" strokeWidth="1.5" />
      )}
      {/* Running/stopped background bands */}
      <defs>
        <linearGradient id="memGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/* ── Status timeline (running/stopped over time) ── */
function StatusTimeline({ history, slug }) {
  const W = 320
  const H = 16

  if (history.length < 2) return null

  const tMin = history[0].t
  const tMax = history[history.length - 1].t
  const tRange = tMax - tMin || 1

  const segments = []
  let segStart = 0
  let segStatus = history[0].services[slug]?.status || 'stopped'

  for (let i = 1; i < history.length; i++) {
    const st = history[i].services[slug]?.status || 'stopped'
    if (st !== segStatus) {
      segments.push({ x: ((history[segStart].t - tMin) / tRange) * W, w: ((history[i].t - history[segStart].t) / tRange) * W, status: segStatus })
      segStart = i
      segStatus = st
    }
  }
  segments.push({ x: ((history[segStart].t - tMin) / tRange) * W, w: ((history[history.length - 1].t - history[segStart].t) / tRange) * W, status: segStatus })

  const colors = { running: 'var(--terminal-green)', starting: '#facc15', stopped: 'var(--bg-tertiary)' }

  return (
    <svg className="gw-timeline-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      {segments.map((seg, i) => (
        <rect key={i} x={seg.x} y={2} width={Math.max(seg.w, 1)} height={H - 4} rx={3} fill={colors[seg.status] || colors.stopped} opacity={seg.status === 'stopped' ? 0.3 : 0.7} />
      ))}
    </svg>
  )
}

export default function GatewayDashboard() {
  const { authHeaders, logout } = useAdminAuth()
  const [data, setData] = useState(null)
  const [history, setHistory] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)

  const authFetch = useCallback(async (url, opts = {}) => {
    const res = await fetch(url, { ...opts, headers: { ...opts.headers, ...authHeaders } })
    if (res.status === 401) { logout(); throw new Error('Session expired') }
    return res
  }, [authHeaders, logout])

  const fetchAll = useCallback(async () => {
    try {
      const [statusRes, historyRes] = await Promise.all([
        authFetch(`${GATEWAY_URL}/admin/status`),
        authFetch(`${GATEWAY_URL}/admin/history`),
      ])
      if (!statusRes.ok) throw new Error(`HTTP ${statusRes.status}`)
      setData(await statusRes.json())
      if (historyRes.ok) setHistory(await historyRes.json())
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [authFetch])

  useEffect(() => {
    fetchAll()
    const interval = setInterval(fetchAll, 5000)
    return () => clearInterval(interval)
  }, [fetchAll])

  const setMaxConcurrent = async (value) => {
    try {
      await authFetch(`${GATEWAY_URL}/admin/max-concurrent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      })
      fetchAll()
    } catch {}
  }

  const toggleService = async (slug, currentStatus) => {
    setActionLoading(slug)
    try {
      const endpoint = currentStatus === 'running' ? 'stop' : 'start'
      await authFetch(`${GATEWAY_URL}/admin/${endpoint}/${slug}`, { method: 'POST' })
      await fetchAll()
    } catch {} finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <p className="admin-loading">Connecting to gateway...</p>
        </div>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <div className="admin-error">
            <h2>Gateway Unreachable</h2>
            <p>{error}</p>
            <button className="gw-btn" onClick={fetchAll}>Retry</button>
          </div>
        </div>
      </div>
    )
  }

  const runningCount = data.services.filter((s) => s.status === 'running').length

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1 className="admin-title">Gateway Dashboard</h1>

        {/* Capacity control */}
        <div className="gw-capacity">
          <div className="gw-capacity-info">
            <span className="gw-capacity-label">Max Concurrent</span>
            <span className="gw-capacity-value">{data.maxConcurrent}</span>
          </div>
          <div className="gw-capacity-bar">
            <div
              className="gw-capacity-fill"
              style={{ width: `${(runningCount / Math.max(data.maxConcurrent, 1)) * 100}%` }}
            />
          </div>
          <div className="gw-capacity-meta">
            <span>{runningCount} / {data.maxConcurrent} slots used</span>
          </div>
          <div className="gw-capacity-controls">
            <button className="gw-btn gw-btn--sm" onClick={() => setMaxConcurrent(data.maxConcurrent - 1)} disabled={data.maxConcurrent <= 1}>-</button>
            <button className="gw-btn gw-btn--sm" onClick={() => setMaxConcurrent(data.maxConcurrent + 1)}>+</button>
          </div>
          {error && <span className="gw-error-hint">{error}</span>}
        </div>

        {/* Services grid */}
        <div className="gw-services">
          {data.services.map((svc) => (
            <div key={svc.slug} className={`gw-card gw-card--${svc.status}`}>
              <div className="gw-card-header">
                <StatusDot status={svc.status} />
                <h3 className="gw-card-name">{svc.slug}</h3>
                <span className="gw-card-status">{svc.status}</span>
              </div>

              {/* Status timeline */}
              <StatusTimeline history={history} slug={svc.slug} />

              {/* Memory chart */}
              <div className="gw-chart-wrapper">
                <MemoryChart history={history} slug={svc.slug} />
              </div>

              <div className="gw-card-details">
                <div className="gw-card-row">
                  <span className="gw-card-label">Port</span>
                  <span className="gw-card-value">{svc.port}</span>
                </div>
                <div className="gw-card-row">
                  <span className="gw-card-label">PID</span>
                  <span className="gw-card-value">{svc.pid || '--'}</span>
                </div>
                <div className="gw-card-row">
                  <span className="gw-card-label">Memory</span>
                  <span className="gw-card-value">{formatBytes(svc.memory)}</span>
                </div>
                <div className="gw-card-row">
                  <span className="gw-card-label">Active</span>
                  <span className="gw-card-value">{formatUptime(svc.lastActivity)}</span>
                </div>
                {svc.idleTimeout && (
                  <div className="gw-card-row">
                    <span className="gw-card-label">Idle timeout</span>
                    <span className="gw-card-value">{Math.round(svc.idleTimeout / 60000)}m</span>
                  </div>
                )}
              </div>

              <button
                className={`gw-btn gw-btn--full ${svc.status === 'running' ? 'gw-btn--danger' : 'gw-btn--go'}`}
                onClick={() => toggleService(svc.slug, svc.status)}
                disabled={svc.status === 'starting' || actionLoading === svc.slug}
              >
                {actionLoading === svc.slug ? '...' : svc.status === 'running' ? 'Stop' : svc.status === 'starting' ? 'Starting...' : 'Start'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
