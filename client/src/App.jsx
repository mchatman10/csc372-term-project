import React,{useEffect,useState} from 'react'
import {Routes,Route,Link,useNavigate} from 'react-router-dom'
import {AuthProvider,useAuth} from './context/AuthContext.jsx'
import Home from './pages/Home.jsx'
import RecipeDetail from './pages/RecipeDetail.jsx'
import EditRecipe from './pages/EditRecipe.jsx'
import CreateRecipe from './pages/CreateRecipe.jsx'
import Login from './pages/Login.jsx'
function ThemeToggle(){const [mode,setMode]=useState('dark');useEffect(()=>{if(mode==='light')document.documentElement.classList.add('light');else document.documentElement.classList.remove('light')},[mode]);return <button className="btn" onClick={()=>setMode(m=>m==='dark'?'light':'dark')}>{mode==='dark'?'Light Mode':'Dark Mode'}</button>}
function NavBar(){const {user,logout}=useAuth();const nav=useNavigate();async function doLogout(){await logout();nav('/login')}return(<nav className="nav"><div className="container" style={{display:'flex',gap:12,justifyContent:'space-between',alignItems:'center'}}><Link className="link" to="/">RecipeShare</Link><div style={{display:'flex',gap:10,alignItems:'center'}}><Link className="btn secondary" to="/new">Add Recipe</Link><ThemeToggle/>{user?(<><span style={{color:'var(--muted)'}}>{user.display_name||user.email}</span><button className="btn" onClick={doLogout}>Logout</button></>):<Link className="btn" to="/login">Login</Link>}</div></div></nav>)}
export default function App(){return(<AuthProvider><NavBar/><Routes><Route path="/" element={<Home/>}/><Route path="/login" element={<Login/>}/><Route path="/recipe/:id" element={<RecipeDetail/>}/><Route path="/recipe/:id/edit" element={<EditRecipe/>}/><Route path="/new" element={<CreateRecipe/>}/></Routes></AuthProvider>)}
