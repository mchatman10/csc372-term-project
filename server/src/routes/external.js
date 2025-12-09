import { Router } from 'express'
import fetch from 'node-fetch'
const router = Router()

router.get('/nutrition', async (req, res) => {
  try{
    const q = req.query.q || ''
    if(!q) return res.json({ items: [] })
    const apiKey = process.env.CALORIENINJAS_API_KEY
    const r = await fetch(`https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(q)}`, { headers: { 'X-Api-Key': apiKey } })
    const data = await r.json()
    res.json(data)
  } catch(e){
    console.error(e)
    res.status(500).json({ error: 'Nutrition API failed' })
  }
})

export default router
