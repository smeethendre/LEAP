import express from 'express'
import cors from 'cors'
import { blogRouter } from './routes/blog.routes.js'
import { teamRouter } from './routes/team.routes.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(cors({
  origin:      'http://localhost:3000',
  credentials: true,
}))
app.use(express.json({ limit: '256kb' }))
app.use(express.urlencoded({ extended: true }))

app.use('/api/blog', blogRouter)
app.use('/api/team', teamRouter)

app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.use(errorHandler)

export { app }