import React,{createContext,useContext,useEffect,useState} from 'react'
import { API } from '../util/api.js'
const Ctx=createContext(null)
export function AuthProvider({children}){
  const [user,setUser]=useState(null); const [loading,setLoading]=useState(true)
  useEffect(()=>{(async()=>{try{setUser(await API.me())}catch{setUser(null)}setLoading(false)})()},[])
  const login=async(e,p)=>{const u=await API.login(e,p);setUser(u);return u}
  const register=async(e,p,d)=>{const u=await API.register(e,p,d);setUser(u);return u}
  const logout=async()=>{await API.logout();setUser(null)}
  return <Ctx.Provider value={{user,loading,login,register,logout}}>{children}</Ctx.Provider>
}
export const useAuth=()=>useContext(Ctx)
