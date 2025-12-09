import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import session from 'express-session'

import authGoogle from './routes/auth-google.js'
import recipes from './routes/recipes.js'
import external from './routes/external.js'

const app = express()
const PORT = process.env.PORT || 3000

const allowed = [
  process.env.CLIENT_ORIGIN || 'http://localhost:5173'
]

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowed.includes(origin)) {
      cb(null, true)
    } else {
      cb(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE']
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
    httpOnly: true,
    secure,
    sameSite: secure ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}))

app.use('/auth', authGoogle)
app.use('/recipes', recipes)
app.use('/external', external)

app.get('/health', (_req, res) => res.json({ ok: true }))

app.listen(PORT, () => console.log('API listening on', PORT))
