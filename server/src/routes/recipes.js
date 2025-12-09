import { Router } from 'express'
import { query } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
const router = Router()
router.get('/', async (_req,res)=>{
  const sql = `SELECT r.id, r.title, r.description, r.image_url,
                      COALESCE(array_agg(c.name) FILTER (WHERE c.name IS NOT NULL), '{}') AS categories
               FROM recipes r
               LEFT JOIN recipe_categories rc ON rc.recipe_id=r.id
               LEFT JOIN categories c ON c.id=rc.category_id
               GROUP BY r.id
               ORDER BY r.created_at DESC`
  const { rows } = await query(sql); res.json(rows)
})
router.get('/:id', async (req,res)=>{
  const { rows } = await query(`SELECT r.id, r.title, r.description, r.ingredients, r.steps, r.image_url, r.created_at,
                                       COALESCE(array_agg(c.name) FILTER (WHERE c.name IS NOT NULL), '{}') AS categories
                                FROM recipes r
                                LEFT JOIN recipe_categories rc ON rc.recipe_id=r.id
                                LEFT JOIN categories c ON c.id=rc.category_id
                                WHERE r.id=$1 GROUP BY r.id`, [req.params.id])
  if(!rows[0]) return res.status(404).json({error:'Not found'})
  res.json(rows[0])
})
router.post('/', requireAuth, async (req,res)=>{
  const { title,description,ingredients=[],steps=[],image_url=null,categories=[] } = req.body || {}
  if(!title || !description) return res.status(400).json({error:'Missing required fields'})
  const ins = await query(`INSERT INTO recipes(user_id,title,description,ingredients,steps,image_url)
                           VALUES($1,$2,$3,$4,$5,$6) RETURNING id`,
                           [req.session.userId,title,description,ingredients,steps,image_url])
  const recipeId = ins.rows[0].id
  if(Array.isArray(categories) && categories.length){
    for(const name of categories){
      const c = await query(`INSERT INTO categories(name) VALUES ($1)
                              ON CONFLICT(name) DO UPDATE SET name=EXCLUDED.name RETURNING id`, [name])
      await query(`INSERT INTO recipe_categories(recipe_id,category_id) VALUES($1,$2) ON CONFLICT DO NOTHING`, [recipeId, c.rows[0].id])
    }
  }
  res.status(201).json({ id:recipeId })
})
export default router
