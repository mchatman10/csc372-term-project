import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { API } from '../util/api.js'
export default function Login(){
  const { setUser } = useAuth()
  const nav = useNavigate()
  useEffect(()=>{
    const id = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if(!id || !window.google) return
    window.google.accounts.id.initialize({
      client_id: id,
      callback: async (resp)=>{
        try{ const user = await API.googleLogin(resp.credential); setUser(user); nav('/') }
        catch(e){ alert('Google login failed'); console.error(e) }
      }
    })
    window.google.accounts.id.renderButton(document.getElementById('gbtn'),{ theme:'outline', size:'large' })
  },[])
  return (<div className="card"><h2>Sign in</h2><div id="gbtn"></div></div>)
}
