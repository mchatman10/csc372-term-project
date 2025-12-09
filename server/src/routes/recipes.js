
import { Router } from 'express'
import { query } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', async (_req, res) => {
  const { rows } = await query(
    `SELECT id, title, description, ingredients, steps, image_url, created_at
     FROM recipes ORDER BY created_at DESC`
  )
  res.json(rows)
})

router.get('/:id', async (req, res) => {
  const { rows } = await query(
    `SELECT id, title, description, ingredients, steps, image_url, created_at
     FROM recipes WHERE id=$1`,
     [req.params.id]
  )
  if (!rows[0]) return res.status(404).json({ error:'Not found' })
  res.json(rows[0])
})

router.post('/', requireAuth, async (req,res)=>{
  const { title, description, ingredients, steps, image_url } = req.body || {}
  if(!title || !description) return res.status(400).json({ error:'Missing required fields' })
  const { rows } = await query(
    `INSERT INTO recipes (user_id, title, description, ingredients, steps, image_url)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
     [req.session.userId, title, description, ingredients||[], steps||[], image_url||null]
  )
  res.status(201).json({ id: rows[0].id })
})

export default router
