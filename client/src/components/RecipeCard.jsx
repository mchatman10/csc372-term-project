import React from 'react'
import { Link } from 'react-router-dom'

export default function RecipeCard({ r }){
  const cover = r.image_url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop'
  return (
    <div className="card">
      <img className="cover" src={cover} alt={r.title} />
      <h3>{r.title}</h3>
      <p style={{color:'#a7acb6'}}>{r.description}</p>
      <div className="row" style={{justifyContent:'space-between'}}>
        <div>{(r.categories||[]).map(c=><span key={c} className="badge">{c}</span>)}</div>
        <Link className="btn secondary" to={`/recipe/${r.id}`}>View</Link>
      </div>
    </div>
  )
}
