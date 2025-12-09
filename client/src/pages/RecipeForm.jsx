import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API } from '../util/api.js'
export default function RecipeForm(){
  const nav = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [ingredients, setIngredients] = useState([''])
  const [steps, setSteps] = useState([''])
  const [image_url, setImage] = useState('')
  const [q, setQ] = useState('')
  function setAt(setter, i, v){ setter(a => a.map((x,idx)=> idx===i? v : x)) }
  async function submit(e){ e.preventDefault(); const payload={title,description,ingredients:ingredients.filter(Boolean),steps:steps.filter(Boolean),image_url}; const res=await API.createRecipe(payload); nav(`/recipe/${res.id}`) }
  async function fetchNutrition(){ const data=await API.nutrition(q||title); alert(`Calories (approx): ${data?.items?.[0]?.calories ?? 'N/A'}`) }
  return (
    <div className="card">
      <h2>New Recipe</h2>
      <form onSubmit={submit}>
        <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea className="textarea" rows="3" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
        <h4>Ingredients</h4>
        {ingredients.map((v,i)=>(<input key={i} className="input" value={v} placeholder="e.g., 1 cup rice" onChange={e=>setAt(setIngredients,i,e.target.value)} />))}
        <button className="btn secondary" type="button" onClick={()=>setIngredients(a=>[...a,''])}>+ Add Ingredient</button>
        <h4>Steps</h4>
        {steps.map((v,i)=>(<input key={i} className="input" value={v} placeholder={`Step ${i+1}`} onChange={e=>setAt(setSteps,i,e.target.value)} />))}
        <button className="btn secondary" type="button" onClick={()=>setSteps(a=>[...a,''])}>+ Add Step</button>
        <input className="input" placeholder="Image URL" value={image_url} onChange={e=>setImage(e.target.value)} />
        <div className="row">
          <input className="input" placeholder="Nutrition query (optional)" value={q} onChange={e=>setQ(e.target.value)} />
          <button className="btn secondary" type="button" onClick={fetchNutrition}>Analyze Nutrition</button>
          <button className="btn" type="submit">Save</button>
        </div>
      </form>
    </div>
  )
}
