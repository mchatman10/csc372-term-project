import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { API } from '../util/api.js'
export default function EditRecipe() {
    const { id } = useParams(); const nav = useNavigate()
    const [form, setForm] = useState({ title: '', description: '', image_url: '', ingredients: '', steps: '' })
    useEffect(() => { (async () => { const r = await API.getRecipe(id); setForm({ title: r.title || '', description: r.description || '', image_url: r.image_url || '', ingredients: (r.ingredients || []).join('\n'), steps: (r.steps || []).join('\n') }) })() }, [id])
    function upd(k, v) { setForm(s => ({ ...s, [k]: v })) }
    async function submit(e) { e.preventDefault(); const payload = { title: form.title, description: form.description, image_url: form.image_url, ingredients: form.ingredients.split('\n').filter(Boolean), steps: form.steps.split('\n').filter(Boolean) }; await API.updateRecipe(id, payload); nav(`/recipe/${id}`) }
    return (<div className="container" style={{ maxWidth: 720 }}><h2>Edit Recipe</h2><form onSubmit={submit} className="form"><label>Title</label><input className="input" value={form.title} onChange={e => upd('title', e.target.value)} required /><label>Description</label><textarea className="textarea" rows="3" value={form.description} onChange={e => upd('description', e.target.value)} /><label>Image URL</label><input className="input" value={form.image_url} onChange={e => upd('image_url', e.target.value)} /><label>Ingredients (one per line)</label><textarea className="textarea" rows="6" value={form.ingredients} onChange={e => upd('ingredients', e.target.value)} /><label>Steps (one per line)</label><textarea className="textarea" rows="8" value={form.steps} onChange={e => upd('steps', e.target.value)} /><button className="btn" type="submit">Save</button></form></div>)
}