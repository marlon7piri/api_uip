import express from 'express'
import { PORT } from './config.js'

const app = express()


app.get('/',(req,res)=>{
    res.send('Hola mundo')
})

app.listen(PORT,()=>{
    console.log('Server is running in port:',PORT)
})