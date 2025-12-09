import { Router } from 'express'
import { query } from '../db.js'
const r = Router()
r.get('/', async (req,res)=>{
  const {category}=req.query; let q
  if(category) q = await query(`SELECT * FROM recipes WHERE category=$1 ORDER BY created_at DESC`,[category])
  else q = await query(`SELECT * FROM recipes ORDER BY created_at DESC`)
  res.json(q.rows)
})
r.get('/:id', async (req,res)=>{ const q = await query(`SELECT * FROM recipes WHERE id=$1`,[req.params.id]); res.json(q.rows[0]||null) })
r.post('/', async (req,res)=>{
  const {title,description,image_url,ingredients,steps,category}=req.body
  const q = await query(`INSERT INTO recipes(title,description,image_url,ingredients,steps,category) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,[title,description,image_url,ingredients,steps,category])
  res.json(q.rows[0])
})
r.put('/:id', async (req,res)=>{
  const {title,description,image_url,ingredients,steps,category}=req.body
  const q = await query(`UPDATE recipes SET title=$2,description=$3,image_url=$4,ingredients=$5,steps=$6,category=$7 WHERE id=$1 RETURNING *`,[req.params.id,title,description,image_url,ingredients,steps,category])
  res.json(q.rows[0])
})
r.delete('/:id', async (req,res)=>{ await query(`DELETE FROM recipes WHERE id=$1`,[req.params.id]); res.json({ok:true}) })
export default r
