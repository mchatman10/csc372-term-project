import React from 'react'
import { Link } from 'react-router-dom'
export default function RecipeCard({r}){
  const cover=r.image_url||'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=800&auto=format&fit=crop'
  return(<div className="card"><img className="cover" src={cover} alt={r.title}/><div style={{padding:12}}><h3 style={{margin:'8px 0'}}>{r.title}</h3><p style={{color:'var(--muted)',minHeight:40}}>{r.description}</p><Link className="btn" to={`/recipe/${r.id}`}>View</Link></div></div>)
}
