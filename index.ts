
import app from './app.js'
import { PORT } from './config.js'
import { ConnectDb } from './database'


const main = async () => {

    await ConnectDb()
    app.listen(PORT, () => {
        console.log('Server is running in port:', PORT)
    })
   
   
}

main()