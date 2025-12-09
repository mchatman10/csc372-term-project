import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import RecipeList from './pages/RecipeList'
import RecipeDetail from './pages/RecipeDetail'
import RecipeForm from './pages/RecipeForm'
import Login from './pages/Login'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
export default function App() { return (<BrowserRouter><ThemeProvider><AuthProvider><NavBar /><Routes><Route path='/' element={<RecipeList />} /><Route path='/login' element={<Login />} /><Route path='/new' element={<RecipeForm />} /><Route path='/recipe/:id' element={<RecipeDetail />} /></Routes></AuthProvider></ThemeProvider></BrowserRouter>) }