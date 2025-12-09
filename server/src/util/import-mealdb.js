import 'dotenv/config'
import fetch from 'node-fetch'
import { query } from '../db.js'
async function ensureCategory(name) {
    const { rows } = await query(`INSERT INTO categories(name) VALUES($1)
                                ON CONFLICT(name) DO UPDATE SET name=EXCLUDED.name RETURNING id`, [name])
    return rows[0].id
}
async function importCategory(name) {
    console.log('Importing', name)
    const catId = await ensureCategory(name)
    const r = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(name)}`)
    const data = await r.json(); const meals = data.meals || []
    for (const m of meals.slice(0, 12)) {
        try {
            const full = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${m.idMeal}`)
            const d = (await full.json()).meals[0]
            const ingredients = Object.keys(d).filter(k => k.startsWith('strIngredient') && d[k]).map(k => d[k])
            const steps = d.strInstructions ? d.strInstructions.split('\n').filter(Boolean) : []
            const ins = await query(`INSERT INTO recipes(user_id,title,description,ingredients,steps,image_url)
                               VALUES (NULL,$1,$2,$3,$4,$5) RETURNING id`,
                [d.strMeal, d.strInstructions?.slice(0, 160) || 'Sample recipe from TheMealDB.', ingredients, steps, d.strMealThumb])
            const recipeId = ins.rows[0].id
            await query(`INSERT INTO recipe_categories(recipe_id,category_id) VALUES($1,$2) ON CONFLICT DO NOTHING`, [recipeId, catId])
            console.log('Added:', d.strMeal)
        } catch (ex) { console.error('Import error', ex.message) }
    }
}
async function main() { for (const n of ['Breakfast', 'Lunch', 'Dinner']) await importCategory(n); console.log('Import done'); process.exit(0) }
main()
