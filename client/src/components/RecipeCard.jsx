import React from 'react'
import { Link } from 'react-router-dom'
import styles from './RecipeCard.module.css'
export default function RecipeCard({ r }){
  if (!r) return null
  const cover = r.image_url || 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1200&auto=format&fit=crop'
  return (
    <div className={`card ${styles.card}`}>
      <img className="cover" src={cover} alt={r.title} />
      <div className="card-body">
        <h3>{r.title}</h3>
        <p>{r.description}</p>
        <div className="badges">{(r.categories||[]).map(c=> <span key={c} className="badge">{c}</span>)}</div>
        <Link className="btn secondary" to={`/recipe/${r.id}`}>View</Link>
      </div>
    </div>
  )
}
