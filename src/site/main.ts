import path from 'path'
import express from 'express'
import Log from '../config/Logger'

const app = express()

app.use( express.json() )

const indexPage = path.join( __dirname, './pages/index.html')

app.get( '/', (_, res) => res.sendFile( indexPage ) )

function startServer(){

    const host = process.env.SERVER_HOST || 'localhost'

    const port = Number( process.env.SERVER_PORT || '5000' )

    return app.listen( port, host, () => {

        Log.info(`http://${host}:${port}`)
    
    })
    
}

export default startServer