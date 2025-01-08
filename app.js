import express from 'express'
import Routes from './routes/index.routes.js'
import cors from 'cors'

const app = express()

Routes(app)
app.use(cors())
app.use(express.json())

export default app