import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { API } from '../util/api.js'
export default function RecipeDetail(){
  const { id } = useParams()
  const [data,setData] = useState(null)
  useEffect(()=>{ (async()=> setData(await API.get(`/recipes/${id}`)))() },[id])
  if (!data) return null
  return (
    <div className="container">
      <img className="cover" src={data.image_url} alt={data.title} />
      <h1>{data.title}</h1>
      <div style={{color:'var(--muted)'}}>{data.description}</div>
      <h3>Ingredients</h3>
      <ul>{(data.ingredients||[]).map((x,i)=> <li key={i}>{x}</li>)}</ul>
      <h3>Steps</h3>
      <ol>{(data.steps||[]).map((x,i)=> <li key={i}>{x}</li>)}</ol>
    </div>
  )
}
