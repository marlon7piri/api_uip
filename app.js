import express from 'express'
import Routes from './routes/index.routes.js'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors())

Routes(app)

export default app