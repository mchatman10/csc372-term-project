import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import NavBar from './components/NavBar.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import Login from './pages/Login.jsx'
import RecipeList from './pages/RecipeList.jsx'
import RecipeDetail from './pages/RecipeDetail.jsx'
import RecipeForm from './pages/RecipeForm.jsx'
import './App.css'

function RequireAuth({ children }){
  const { user, loading } = useAuth()
  const loc = useLocation()
  if (loading) return null
  if (!user) return <Navigate to="/login" state={{from: loc.pathname}} replace />
  return children
}

function AppInner(){
  useEffect(()=>{ document.documentElement.setAttribute('data-theme','dark') },[])
  return (
    <div className="app-shell">
      <NavBar />
      <ThemeToggle />
      <main className="container">
        <Routes>
          <Route path="/" element={<RecipeList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/new" element={<RequireAuth><RecipeForm /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App(){
  return <AuthProvider><AppInner /></AuthProvider>
}
