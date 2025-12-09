import { Router } from 'express'
import { query } from '../db.js'
import bcrypt from 'bcryptjs'
const r = Router()
r.get('/me', (req, res) => res.json(req.session.user || null))
r.post('/register', async (req, res) => {
    const { email, password, display_name } = req.body
    const hash = await bcrypt.hash(password, 10)
    const q = await query(`INSERT INTO users(email,password_hash,display_name) VALUES($1,$2,$3) ON CONFLICT (email) DO UPDATE SET display_name=EXCLUDED.display_name RETURNING id,email,display_name`, [email, hash, display_name])
    const user = q.rows[0]; req.session.user = user; res.json(user)
})
r.post('/login', async (req, res) => {
    const { email, password } = req.body
    const q = await query(`SELECT id,email,display_name,password_hash FROM users WHERE email=$1`, [email])
    const u = q.rows[0]; if (!u) return res.status(400).send('Invalid credentials')
    const ok = await bcrypt.compare(password, u.password_hash); if (!ok) return res.status(400).send('Invalid credentials')
    delete u.password_hash; req.session.user = u; res.json(u)
})
r.post('/logout', (req, res) => req.session.destroy(() => res.json({ ok: true })))
export default r