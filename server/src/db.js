import pg from 'pg'
import dotenv from 'dotenv'
dotenv.config()
const { Pool } = pg
const isProd = process.env.NODE_ENV === 'production'
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProd ? { rejectUnauthorized: false } : undefined
})
export async function query(text, params){ return pool.query(text, params) }
