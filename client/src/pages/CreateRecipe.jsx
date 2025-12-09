import React,{useEffect,useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { API } from '../util/api.js'
export default function CreateRecipe(){
  const nav=useNavigate(); const [cats,setCats]=useState([]); useEffect(()=>{(async()=> setCats(await API.listCategories()))()},[])
  const [form,setForm]=useState({title:'',description:'',image_url:'',ingredients:'',steps:'',category:''})
  function upd(k,v){setForm(s=>({...s,[k]:v}))}
  async function submit(e){e.preventDefault(); const payload={title:form.title,description:form.description,image_url:form.image_url,category:form.category||null,ingredients:form.ingredients.split('\n').filter(Boolean),steps:form.steps.split('\n').filter(Boolean)}; const r=await API.createRecipe(payload); nav(`/recipe/${r.id}`)}
  return(<div className="container" style={{maxWidth:720}}><h2>New Recipe</h2><form onSubmit={submit} className="form"><label>Title</label><input className="input" value={form.title} onChange={e=>upd('title',e.target.value)} required/><label>Description</label><textarea className="textarea" rows="3" value={form.description} onChange={e=>upd('description',e.target.value)}/><label>Image URL</label><input className="input" value={form.image_url} onChange={e=>upd('image_url',e.target.value)}/><label>Category</label><select className="input" value={form.category} onChange={e=>upd('category',e.target.value)}><option value="">(none)</option>{cats.map(c=> <option key={c.id} value={c.name}>{c.name}</option>)}</select><label>Ingredients (one per line)</label><textarea className="textarea" rows="6" value={form.ingredients} onChange={e=>upd('ingredients',e.target.value)}/><label>Steps (one per line)</label><textarea className="textarea" rows="8" value={form.steps} onChange={e=>upd('steps',e.target.value)}/><button className="btn" type="submit">Create</button></form></div>)
}
