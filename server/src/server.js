import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";

import authRoutes from "./routes/auth.js";
import recipeRoutes from "./routes/recipes.js";
import externalRoutes from "./routes/external.js";


const app = express()
const PORT = process.env.PORT || 3000

const allowed = [process.env.CLIENT_ORIGIN]

app.use(cors({
  origin: (origin, cb) =>
    !origin || allowed.includes(origin)
      ? cb(null, true)
      : cb(new Error('CORS blocked')),
  credentials: true
}))

app.options('*', cors())
app.use(express.json())

const secure = process.env.NODE_ENV === 'production'
app.set('trust proxy', 1)
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure,
    sameSite: secure ? 'none' : 'lax',
    httpOnly: true,
    maxAge: 1000*60*60*24*7
  }
}))

app.use('/auth', auth)
app.use('/recipes', recipes)
app.use('/external', external)

app.get('/health', (req, res) => res.json({ ok: true }))

app.listen(PORT, () => console.log('API running on', PORT))
