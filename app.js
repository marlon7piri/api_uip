import express from 'express'
import userRouter from './routes/v1/user.routes.js'
import equiposRouter from './routes/v1/equipos.routes.js'
import jugadorRouter from './routes/v1/jugador.routes.js'
import matcherRouter from './routes/v1/matcher.routes.js'
import ofertasRouter from './routes/v1/ofertas.routes.js'
import torneosRouter from './routes/v1/torneos.routes.js'
import cors from 'cors'

const app = express()

app.use(userRouter,equiposRouter,jugadorRouter,matcherRouter,ofertasRouter,torneosRouter)
app.use(cors())
app.use(express.json())

export default app