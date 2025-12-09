import React, { createContext, useContext, useEffect, useState } from 'react'
import { API } from '../util/api.js'
const Ctx = createContext()
export function AuthProvider({ children }){
  const [user,setUser] = useState(null)
  const [loading,setLoading] = useState(true)
  useEffect(()=>{ (async()=>{ try{ const me=await API.get('/auth/me'); setUser(me)}catch{setUser(null)} setLoading(false) })() },[])
  async function login(email,password){ const u = await API.login(email,password); setUser(u); return u }
  async function register(email,password,display_name){ const u=await API.register(email,password,display_name); setUser(u); return u }
  async function logout(){ await API.logout(); setUser(null) }
  return <Ctx.Provider value={{user,loading,login,register,logout,setUser}}>{children}</Ctx.Provider>
}
export function useAuth(){ return useContext(Ctx) }
