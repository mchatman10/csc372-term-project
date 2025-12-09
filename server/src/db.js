import 'dotenv/config'
import pkg from 'pg'
const { Pool } = pkg
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  deleteRecipe: (id) => request(`/recipes/${id}`, "DELETE"),
  ssl: process.env.DATABASE_URL?.includes('sslmode=require') ? true : { rejectUnauthorized: false }
  
})
export async function query(text, params) { const res = await pool.query(text, params); return res }

