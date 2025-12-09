import { createContext, useContext, useEffect, useState } from "react"
import { API } from "../api"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    loadUser()
  }, [])

  async function loadUser() {
    try {
      const u = await API.get("/auth/me")
      setUser(u)
    } catch {
      setUser(null)
    }
  }

  async function login(email, password) {
    const u = await API.post("/auth/login", { email, password })
    setUser(u)
  }

  async function register(email, password, display_name) {
    const u = await API.post("/auth/register", {
      email,
      password,
      display_name
    })
    setUser(u)
  }

  async function logout() {
    await API.post("/auth/logout")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
