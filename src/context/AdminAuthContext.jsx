import { createContext, useContext, useState, useCallback } from 'react'

const GATEWAY_URL = import.meta.env.PUBLIC_GATEWAY_URL || 'http://localhost:3004'
const AdminAuthContext = createContext()

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem('adminToken') || '')

  const login = useCallback(async (inputToken) => {
    const res = await fetch(`${GATEWAY_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: inputToken }),
    })
    if (!res.ok) throw new Error('Invalid token')
    sessionStorage.setItem('adminToken', inputToken)
    setToken(inputToken)
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem('adminToken')
    setToken('')
  }, [])

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

  return (
    <AdminAuthContext.Provider value={{ token, login, logout, authHeaders }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  return useContext(AdminAuthContext)
}
