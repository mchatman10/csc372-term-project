import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import RecipeList from './pages/RecipeList.jsx'
import RecipeDetail from './pages/RecipeDetail.jsx'
import RecipeForm from './pages/RecipeForm.jsx'
import Login from './pages/Login.jsx'

export default function App(){
  return (
    <AuthProvider>
      <NavBar />
      <div className="container">
        <Routes>
          <Route path="/" element={<RecipeList />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/new" element={<RecipeForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}
