import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import styles from './Login.module.css'
export default function Login(){
  const { login, register } = useAuth()
  const [isRegister,setRegister] = useState(false)
  const [form,setForm] = useState({ email:'', password:'', display_name:'' })
  const [err,setErr] = useState('')
  const nav = useNavigate()
  const loc = useLocation()
  function onChange(e){ setForm({ ...form, [e.target.name]: e.target.value }) }
  async function onSubmit(e){
    e.preventDefault(); setErr('')
    try{
      if (isRegister) await register(form.email,form.password,form.display_name)
      else await login(form.email,form.password)
      nav(loc.state?.from || '/', { replace:true })
    }catch(ex){ setErr(ex.message || 'Auth failed') }
  }
  return (
    <div className="container">
      <form className="form" onSubmit={onSubmit}>
        <h2 className={styles.title}>{isRegister?'Register':'Login'}</h2>
        {err && <div className="error">{err}</div>}
        {isRegister && <input className="input" name="display_name" placeholder="Display Name" value={form.display_name} onChange={onChange} />}
        <input className="input" type="email" name="email" placeholder="Email" value={form.email} onChange={onChange} />
        <input className="input" type="password" name="password" placeholder="Password" value={form.password} onChange={onChange} />
        <button className="btn" type="submit">{isRegister?'Create Account':'Login'}</button>
        <div style={{textAlign:'center'}}>{isRegister?'Have an account?':'No account?'} <button type="button" className="btn secondary" onClick={()=> setRegister(v=>!v)}>{isRegister?'Login':'Register'}</button></div>
      </form>
    </div>
  )
}
