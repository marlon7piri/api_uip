import express from 'express'
import Routes from './routes/index.routes'
import cors from 'cors'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import { CORS_ORIGIN } from 'config'

const app = express()
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(helmet())

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    message:'Demasiadas peticiones, no lo intentes mas!',
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,handler(req,res){
        return res.status(209).json({error:'Bloqueado por rate limit'})

    }
})
app.use(limiter)
app.use(cors({
    origin:CORS_ORIGIN
}))

Routes(app)

export default app