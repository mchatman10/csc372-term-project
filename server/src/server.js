import 'dotenv/config'
import express from 'express'
import session from 'express-session'
import cors from 'cors'
import { query } from './db.js'
import authRoutes from './routes/auth.js'
import recipeRoutes from './routes/recipes.js'
import categoryRoutes from './routes/categories.js'

const app = express()
app.use(express.json())

const ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
app.use(cors({ origin: ORIGIN, credentials: true }))

app.use(session({ secret: process.env.SESSION_SECRET || 'devsecret', resave: false, saveUninitialized: false }))

await query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`)
await query(`CREATE TABLE IF NOT EXISTS users(id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, display_name TEXT);`)
await query(`CREATE TABLE IF NOT EXISTS recipes(id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), title TEXT NOT NULL, description TEXT, image_url TEXT, ingredients TEXT[], steps TEXT[], category TEXT, created_at TIMESTAMPTZ DEFAULT now());`)
await query(`CREATE TABLE IF NOT EXISTS categories(id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), name TEXT UNIQUE NOT NULL);`)

app.use('/auth', authRoutes)
app.use('/recipes', recipeRoutes)
app.use('/categories', categoryRoutes)

const port = process.env.PORT || 8080
app.listen(port, () => console.log('API on :' + port))