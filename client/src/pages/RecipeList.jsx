import React, { useEffect, useState } from 'react'
import { API } from '../util/api.js'
import RecipeCard from '../components/RecipeCard.jsx'
export default function RecipeList(){
  const [items, setItems] = useState([])
  useEffect(()=>{ (async()=> setItems(await API.listRecipes()))() },[])
  return <div className="grid">{items.map(r=> <RecipeCard key={r.id} r={r} />)}</div>
}
