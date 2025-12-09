import 'dotenv/config'
import express from 'express'
import session from 'express-session'
import cors from 'cors'
import auth from './routes/auth.js'
import recipes from './routes/recipes.js'

const app = express()
const PORT = process.env.PORT || 3000

const allowed = [process.env.CLIENT_ORIGIN || 'http://localhost:5173']
app.use(cors({
  origin: (origin,cb)=> !origin || allowed.includes(origin) ? cb(null,true) : cb(new Error('Not allowed by CORS')),
  credentials:true, methods:['GET','POST','PUT','DELETE']
}))
app.use(express.json())

const secure = process.env.NODE_ENV === 'production'
app.set('trust proxy', 1)
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_secret',
  resave:false, saveUninitialized:false,
  cookie:{ httpOnly:true, secure, sameSite: secure?'none':'lax', maxAge: 1000*60*60*24*7 }
}))
app.use('/auth', auth)
app.use('/recipes', recipes)
app.get('/health', (_req,res)=> res.json({ok:true}))
app.listen(PORT, ()=> console.log('API listening on', PORT))
