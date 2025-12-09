import React,{useEffect,useState} from 'react'
import { Link,useNavigate,useParams } from 'react-router-dom'
import { API } from '../util/api.js'
export default function RecipeDetail(){
  const {id}=useParams(); const nav=useNavigate(); const [data,setData]=useState(null)
  useEffect(()=>{(async()=> setData(await API.getRecipe(id)))()},[id]); if(!data) return null
  async function handleDelete(){ if(!confirm('Delete this recipe?'))return; await API.deleteRecipe(id); nav('/') }
  return(<div className="container"><img className="cover" src={data.image_url} alt={data.title}/><h1>{data.title}</h1><div style={{color:'var(--muted)'}}>{data.description}</div><h3>Ingredients</h3><ul>{(data.ingredients||[]).map((x,i)=><li key={i}>{x}</li>)}</ul><h3>Steps</h3><ol>{(data.steps||[]).map((x,i)=><li key={i}>{x}</li>)}</ol><div style={{display:'flex',gap:10}}><Link className="btn" to={`/recipe/${id}/edit`}>Edit</Link><button className="deleteBtn" onClick={handleDelete}>Delete</button></div></div>)
}
