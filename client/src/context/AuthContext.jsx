import React, { createContext, useContext, useEffect, useState } from 'react'
import { API } from '../util/api.js'

const Ctx = createContext(null)
export function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(()=>{ (async()=>{ try{ setUser(await API.me()) }catch{} setLoading(false) })() },[])
  async function logout(){ await API.logout(); setUser(null) }
  return <Ctx.Provider value={{ user, setUser, logout, loading }}>{children}</Ctx.Provider>
}
export function useAuth(){ return useContext(Ctx) }
