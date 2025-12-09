import { Router } from 'express'
import bcrypt from 'bcrypt'
import { query } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/register', async (req, res) => {
  const { email, password, display_name } = req.body || {}

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password required' })

  const hash = await bcrypt.hash(password, 10)

  try {
    const { rows } = await query(
      `INSERT INTO users (email, password_hash, display_name)
       VALUES ($1,$2,$3)
       RETURNING id, email, display_name`,
      [email, hash, display_name || email.split('@')[0]]
    )

    req.session.userId = rows[0].id
    res.json(rows[0])
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Email already registered' })
    }
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {}

  const { rows } = await query(
    `SELECT id, email, display_name, password_hash
     FROM users WHERE email=$1`,
    [email]
  )

  const user = rows[0]
  if (!user) return res.status(401).json({ error: 'Invalid email or password' })

  const match = await bcrypt.compare(password, user.password_hash)
  if (!match) return res.status(401).json({ error: 'Invalid email or password' })

  req.session.userId = user.id
  res.json({
    id: user.id,
    email: user.email,
    display_name: user.display_name
  })
})

router.post('/logout', requireAuth, (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true })
  })
})

router.get('/me', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ user: null })
  }

  const { rows } = await query(
    `SELECT id, email, display_name
     FROM users WHERE id=$1`,
    [req.session.userId]
  )

  res.json(rows[0])
})

export default router
