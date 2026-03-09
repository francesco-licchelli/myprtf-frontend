import { useState } from 'react'
import { useAdminAuth } from '../context/AdminAuthContext'

export default function AdminGuard({ children }) {
  const { token, login, logout } = useAdminAuth()
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (token) {
    return (
      <>
        <div className="admin-topbar">
          <span className="admin-topbar-label">Admin</span>
          <div className="admin-topbar-links">
            <a href="/admin/gateway" className="admin-topbar-link">Gateway</a>
            <a href="/admin/analytics" className="admin-topbar-link">Analytics</a>
          </div>
          <button className="gw-btn gw-btn--sm" onClick={logout}>Logout</button>
        </div>
        {children}
      </>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(input)
    } catch {
      setError('Invalid token')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-login">
          <h2>Admin Access</h2>
          <form onSubmit={handleSubmit} className="admin-login-form">
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter admin token"
              className="admin-login-input"
              autoFocus
            />
            <button type="submit" className="gw-btn" disabled={loading || !input}>
              {loading ? '...' : 'Login'}
            </button>
          </form>
          {error && <p className="admin-login-error">{error}</p>}
        </div>
      </div>
    </div>
  )
}
