import path from 'path'
import fs, { stat } from 'fs'

type EchoType =  'Info' | 'Debug' | 'Warning' | 'Error' | 'Critical'

class Logger {

    private static instance: Logger

    private constructor() {}

    private consoleLogsEnabled = false

    private logFileEnabled = false

    private currentLogFilePath = this.getLogFile()

    public setConsoleLogs( status: boolean ){

        this.consoleLogsEnabled = status

    }

    public setLogFile( status: boolean ){

        this.logFileEnabled = status

    }

    public static GetInstance(){

        if ( !Logger.instance ){

            Logger.instance = new Logger()

        }

        return Logger.instance
    }

    private renameFile( logPath: string ){

        try {

            const data = fs.readFileSync( logPath ).toString()

            const match = data.match(/\{(.*?)\}/)
    
            const timestap = match?.[ 1 ].replaceAll(' ', '') || new Date().toISOString()
    
            const newName = path.join( __dirname, `../logs/${timestap}.log`)
    
            fs.renameSync( logPath, newName )

        } catch ( ex ){
            console.error( ex )
        }

    }

    private getLogFile(){

        try {
            const timestap = Date.now()
            
            const logPath = path.join( __dirname, `../logs/latest.log`)

            const exists = fs.existsSync( logPath )
    
            if( exists ) this.renameFile( logPath )
    
            if( !this.logFileEnabled ) return
    
            fs.writeFileSync( logPath, `{ ${ timestap} }\n` )
    
            this.currentLogFilePath = logPath

            return logPath

        } catch ( ex ) {
            console.error( ex )
        }

    }

    private echo( echoType: EchoType, message: string ){

        try {

            const timestap = new Date().toISOString()

            const newdata = `[ ${timestap} ][ ${echoType} ] : ${ message }\n`
    
            if( this.currentLogFilePath ){
    
                fs.appendFileSync( this.currentLogFilePath, newdata )
    
            }
          
            if( this.consoleLogsEnabled ) console.log( message )

        } catch ( ex ){
            console.error( ex )
        } 
        

    }
 
    public debug( msg: string ){

        this.echo( 'Debug', msg )

    } 

    public info( msg: string ){

        this.echo( 'Info', msg )

    }

    public warn( msg: string ){

        this.echo( 'Info', msg )

    }

    public error( msg: string | Error ){
        
        this.echo( 'Error', msg.toString() )

    }

    public critical( msg: string | Error ){

        this.echo( 'Critical', msg.toString() )
        
    }

}

const Log = Logger.GetInstance()


export default Log