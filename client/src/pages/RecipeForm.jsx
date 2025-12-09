import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API } from '../util/api.js'
export default function RecipeForm() {
  const nav = useNavigate()
  const [form, setForm] = useState({ title: '', description: '', image_url: '', ingredients: '', steps: '', categories: [] })
  const [err, setErr] = useState('')
  function onChange(e) { setForm({ ...form, [e.target.name]: e.target.value }) }
  function toggleCat(c) { setForm(f => ({ ...f, categories: f.categories.includes(c) ? f.categories.filter(x => x !== c) : [...f.categories, c] })) }
  async function onSubmit(e) {
    e.preventDefault(); setErr('')
    try {
      const payload = { ...form, ingredients: form.ingredients.split('\n').filter(Boolean), steps: form.steps.split('\n').filter(Boolean) }
      const res = await API.createRecipe(payload)
      nav(`/recipe/${res.id}`)
    } catch (ex) { setErr(ex.message || 'Failed') }
  }
  return (
    <form className="form" onSubmit={onSubmit}>
      <h2 style={{ margin: 0 }}>Add Recipe</h2>
      {err && <div className="error">{err}</div>}
      <input className="input" name="title" placeholder="Title" value={form.title} onChange={onChange} />
      <input className="input" name="image_url" placeholder="Image URL" value={form.image_url} onChange={onChange} />
      <textarea className="input" rows="3" name="description" placeholder="Short description" value={form.description} onChange={onChange} />
      <textarea className="input" rows="5" name="ingredients" placeholder="One ingredient per line" value={form.ingredients} onChange={onChange} />
      <textarea className="input" rows="5" name="steps" placeholder="One step per line" value={form.steps} onChange={onChange} />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['Breakfast', 'Lunch', 'Dinner'].map(c => (
          <label key={c} style={{ display: 'flex', gap: 6, alignItems: 'center', border: '1px solid rgba(255,255,255,.12)', padding: '.4rem .6rem', borderRadius: 8 }}>
            <input type="checkbox" checked={form.categories.includes(c)} onChange={() => toggleCat(c)} /> {c}
          </label>
        ))}
      </div>
      <button className="btn" type="submit">Save</button>
    </form>
  )
}
