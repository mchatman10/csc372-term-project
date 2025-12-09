import 'dotenv/config'
import fetch from 'node-fetch'
import { query } from '../db.js'
async function ensureCategory(name){ await query(`INSERT INTO categories(name) VALUES($1) ON CONFLICT (name) DO NOTHING`,[name]) }
async function importCategory(name){
  console.log('Importing',name); await ensureCategory(name)
  const listR = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(name)}`)
  const list = (await listR.json()).meals || []
  for(const m of list.slice(0,8)){
    const fullR = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${m.idMeal}`)
    const d = (await fullR.json()).meals?.[0]; if(!d) continue
    const ingredients = Object.keys(d).filter(k=>k.startsWith('strIngredient') && d[k]).map(k=> d[k])
    const steps = d.strInstructions? d.strInstructions.split('\n').filter(Boolean):[]
    await query(`INSERT INTO recipes(title,description,image_url,ingredients,steps,category) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING`,[d.strMeal,d.strCategory,d.strMealThumb,ingredients,steps,name])
  }
}
async function main(){ for(const c of ['Breakfast','Lunch','Dinner']) await importCategory(c); console.log('Import complete.'); process.exit(0) }
main().catch(e=>{console.error(e);process.exit(1)})
