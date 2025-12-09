import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
export default function Login() {
    const { login, register } = useAuth(); const nav = useNavigate()
    const [tab, setTab] = useState('login'); const [form, setForm] = useState({ email: 'test@example.com', password: 'password123', display_name: 'Demo User' })
    function upd(k, v) { setForm(s => ({ ...s, [k]: v })) }
    async function submit(e) { e.preventDefault(); if (tab === 'login') await login(form.email, form.password); else await register(form.email, form.password, form.display_name); nav('/') }
    return (<div className="container" style={{ maxWidth: 420 }}><h2>{tab === 'login' ? 'Login' : 'Register'}</h2><div style={{ display: 'flex', gap: 8, marginBottom: 8 }}><button className="btn" onClick={() => setTab('login')}>Login</button><button className="btn" onClick={() => setTab('register')}>Register</button></div><form onSubmit={submit} className="form">{tab === 'register' && (<><label>Display name</label><input className="input" value={form.display_name} onChange={e => upd('display_name', e.target.value)} /></>)}<label>Email</label><input className="input" type="email" value={form.email} onChange={e => upd('email', e.target.value)} required /><label>Password</label><input className="input" type="password" value={form.password} onChange={e => upd('password', e.target.value)} required /><button className="btn" type="submit">{tab === 'login' ? 'Login' : 'Create Account'}</button></form></div>)
}