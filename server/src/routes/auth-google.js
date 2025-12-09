import { Router } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { query } from '../db.js'

const router = Router()
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

router.get('/me', async (req, res) => {
  if(!req.session?.userId) return res.status(401).json({ error: 'Not authenticated' })
  const { rows } = await query('SELECT id, email, display_name, avatar FROM users WHERE id=$1', [req.session.userId])
  if(!rows[0]) return res.status(401).json({ error: 'Not authenticated' })
  res.json(rows[0])
})

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }))
})

router.post('/google', async (req, res) => {
  try{
    const { credential } = req.body || {}
    if(!credential) return res.status(400).json({ error: 'Missing credential' })
    const ticket = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID })
    const payload = ticket.getPayload()
    const { sub, email, name, picture } = payload
    let { rows } = await query('SELECT id, email, display_name, avatar FROM users WHERE google_sub=$1', [sub])
    if(!rows[0]){
      ({ rows } = await query(
        `INSERT INTO users (google_sub, email, display_name, avatar)
         VALUES ($1,$2,$3,$4)
         RETURNING id, email, display_name, avatar`,
        [sub, email, name, picture]
      ))
    }
    const user = rows[0]
    req.session.userId = user.id
    res.json(user)
  } catch(e){
    console.error('Google auth error', e)
    res.status(401).json({ error: 'Invalid Google credential' })
  }
})

export default router
