import { Router } from 'express'
import { query } from '../db.js'
const r = Router()
r.get('/', async (req, res) => { const q = await query(`SELECT id,name FROM categories ORDER BY name ASC`); res.json(q.rows) })
export default r