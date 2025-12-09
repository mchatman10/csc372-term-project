import React, { useEffect, useState } from 'react'
import { API } from '../util/api.js'
import RecipeCard from '../components/RecipeCard.jsx'
export default function Home() {
  const [recipes, setRecipes] = useState([]); const [cats, setCats] = useState([]); const [cat, setCat] = useState('')
  useEffect(() => { (async () => setCats(await API.listCategories()))() }, [])
  useEffect(() => { (async () => setRecipes(await API.listRecipes(cat)))() }, [cat])
  return (<div className="container"><div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}><h2 style={{ marginRight: 'auto' }}>Recipes</h2><select className="input" style={{ maxWidth: 220 }} value={cat} onChange={e => setCat(e.target.value)}><option value="">All Categories</option>{cats.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select></div><div className="grid">{recipes.map(r => <RecipeCard key={r.id} r={r} />)}</div></div>)
}