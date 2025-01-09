import express from 'express'
import Routes from './routes/index.routes.js'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express()
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true,limit:'3mb' }));
app.use(bodyParser.json({limit:'3mb'}));
app.use(cors())

Routes(app)

export default app