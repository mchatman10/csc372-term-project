import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { query } from '../db.js'
const router = Router()
router.get('/me', async (req,res)=>{
  if(!req.session?.userId) return res.status(401).json({error:'Not authenticated'})
  const { rows } = await query('SELECT id,email,display_name FROM users WHERE id=$1',[req.session.userId])
  if(!rows[0]) return res.status(401).json({error:'Not authenticated'})
  res.json(rows[0])
})
router.post('/register', async (req,res)=>{
  const { email,password,display_name } = req.body || {}
  if(!email || !password) return res.status(400).json({error:'Email and password required'})
  const hash = await bcrypt.hash(password,10)
  const { rows } = await query(`INSERT INTO users(email,password_hash,display_name) VALUES($1,$2,$3)
                                ON CONFLICT(email) DO UPDATE SET email=EXCLUDED.email
                                RETURNING id,email,display_name`,[email,hash,display_name||null])
  req.session.userId = rows[0].id
  res.json(rows[0])
})
router.post('/login', async (req,res)=>{
  const { email,password } = req.body || {}
  const { rows } = await query('SELECT id,email,display_name,password_hash FROM users WHERE email=$1',[email])
  const u = rows[0]; if(!u) return res.status(401).json({error:'Invalid credentials'})
  const ok = await bcrypt.compare(password, u.password_hash||'')
  if(!ok) return res.status(401).json({error:'Invalid credentials'})
  req.session.userId = u.id; res.json({ id:u.id, email:u.email, display_name:u.display_name })
})
router.post('/logout', (req,res)=>{ req.session?.destroy(()=> res.json({ok:true})) })
export default router
