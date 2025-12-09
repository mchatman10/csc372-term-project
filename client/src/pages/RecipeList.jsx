import React, { useEffect, useState } from 'react'
import { API } from '../util/api.js'
import RecipeCard from '../components/RecipeCard.jsx'
const CATEGORY_TABS = ['All','Breakfast','Lunch','Dinner']
export default function RecipeList(){
  const [items,setItems] = useState([])
  const [tab,setTab] = useState('All')
  useEffect(()=>{ (async()=> setItems(await API.get('/recipes')))() },[])
  const filtered = tab==='All' ? items : items.filter(r => (r.categories||[]).includes(tab))
  return (
    <div className="container">
      <div style={{display:'flex',gap:8,margin:'10px 0 16px'}}>
        {CATEGORY_TABS.map(t => <button key={t} onClick={()=> setTab(t)} className="btn secondary" style={{borderColor: tab===t?'var(--accent)':'rgba(255,255,255,.15)'}}>{t}</button>)}
      </div>
      <div className="grid">{filtered.map(r => <RecipeCard key={r.id} r={r} />)}</div>
    </div>
  )
}
