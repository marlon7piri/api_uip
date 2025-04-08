import express from 'express'
import Routes from './routes/index.routes.js'
import cors from 'cors'
import bodyParser from 'body-parser'
import { CORS_ORIGIN } from './config.js'

const app = express()
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(cors({
    origin: CORS_ORIGIN
}
))

Routes(app)

export default app