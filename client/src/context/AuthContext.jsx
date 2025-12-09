import { createContext, useContext, useEffect, useState } from 'react'
import { API } from '../util/api.js'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  async function load() {
    try {
      const u = await API.me()
      setUser(u)
    } catch {
      setUser(null)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function login(email, password) {
    const u = await API.login(email, password)
    setUser(u)
    return u
  }

  async function register(email, password, display_name) {
    const u = await API.register(email, password, display_name)
    setUser(u)
    return u
  }

  async function logout() {
    await API.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, register, setUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
