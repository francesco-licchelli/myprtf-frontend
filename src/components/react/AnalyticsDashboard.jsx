import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '../../context/AdminAuthContext'

const GATEWAY_URL = import.meta.env.PUBLIC_GATEWAY_URL || 'http://localhost:3004'

function formatDate(ts) {
  const d = new Date(ts)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

function BarChart({ data, label, color = 'var(--accent-cyan)' }) {
  if (!data || data.length === 0) return <p className="analytics-empty">No data yet</p>
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="analytics-chart">
      <div className="analytics-bars">
        {data.map((d, i) => (
          <div key={i} className="analytics-bar-col" title={`${d.label}: ${d.value}`}>
            <div className="analytics-bar" style={{ height: `${(d.value / max) * 100}%`, background: color }} />
            <span className="analytics-bar-label">{d.label}</span>
          </div>
        ))}
      </div>
      <span className="analytics-chart-title">{label}</span>
    </div>
  )
}

function TopList({ items, label }) {
  if (!items || items.length === 0) return null
  return (
    <div className="analytics-toplist">
      <h4 className="analytics-toplist-title">{label}</h4>
      {items.map((item, i) => (
        <div key={i} className="analytics-toplist-row">
          <span className="analytics-toplist-name">{item.name}</span>
          <span className="analytics-toplist-value">{item.count}</span>
        </div>
      ))}
    </div>
  )
}

export default function AnalyticsDashboard() {
  const { authHeaders, logout } = useAdminAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch(`${GATEWAY_URL}/admin/analytics`, {
        headers: authHeaders,
      })
      if (res.status === 401) { logout(); return }
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setData(await res.json())
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [authHeaders, logout])

  useEffect(() => {
    fetchAnalytics()
    const interval = setInterval(fetchAnalytics, 30000)
    return () => clearInterval(interval)
  }, [fetchAnalytics])

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <p className="admin-loading">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <div className="admin-error">
            <h2>Analytics Unavailable</h2>
            <p>{error}</p>
            <button className="gw-btn" onClick={fetchAnalytics}>Retry</button>
          </div>
        </div>
      </div>
    )
  }

  const { summary, daily, topPages, topReferrers, topBrowsers } = data

  return (
    <div className="admin-page">
      <div className="admin-container admin-container--wide">
        <h1 className="admin-title">Analytics</h1>

        {/* Summary cards */}
        <div className="analytics-summary">
          <div className="analytics-stat">
            <span className="analytics-stat-value">{summary.totalVisits}</span>
            <span className="analytics-stat-label">Total visits</span>
          </div>
          <div className="analytics-stat">
            <span className="analytics-stat-value">{summary.uniqueVisitors}</span>
            <span className="analytics-stat-label">Unique visitors</span>
          </div>
          <div className="analytics-stat">
            <span className="analytics-stat-value">{summary.totalPageviews}</span>
            <span className="analytics-stat-label">Pageviews</span>
          </div>
          <div className="analytics-stat">
            <span className="analytics-stat-value">{summary.todayVisits}</span>
            <span className="analytics-stat-label">Today</span>
          </div>
        </div>

        {/* Charts */}
        <div className="analytics-charts">
          <BarChart
            data={daily.map((d) => ({ label: formatDate(d.date), value: d.visits }))}
            label="Daily visits (last 30 days)"
          />
          <BarChart
            data={daily.map((d) => ({ label: formatDate(d.date), value: d.pageviews }))}
            label="Daily pageviews"
            color="var(--accent-purple)"
          />
        </div>

        {/* Top lists */}
        <div className="analytics-tops">
          <TopList items={topPages} label="Top pages" />
          <TopList items={topReferrers} label="Top referrers" />
          <TopList items={topBrowsers} label="Browsers" />
        </div>
      </div>
    </div>
  )
}
