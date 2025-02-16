import path from 'path'
import fs, { stat } from 'fs'
import { privateDecrypt } from 'crypto'
import { time } from 'console'
import { debounce } from '../utils/Utils'

type EchoType =  'Info' | 'Debug' | 'Warning' | 'Error' | 'Critical'

class Logger {

    private static instance: Logger

    private constructor() {}

    private consoleLogsEnabled = false

    private logFileEnabled = true

    private deleteLastLogFile = true

    private currentLogFilePath = this.getLogFile()

    public setConsoleLogs( status: boolean ){

        this.consoleLogsEnabled = status

    }

    /*
    public setLogFile( status: boolean ){

        this.logFileEnabled = status

    }

    public setdeleteLastLog( status: boolean){
    
        this.deleteLastLogFile = status
    
    }

    */

    public static GetInstance(){

        if ( !Logger.instance ){

            Logger.instance = new Logger()

        }

        return Logger.instance
    }

    private createLogFolder( logPath :string ){

        fs.mkdirSync( logPath )
        
    }

    private checkLogFolder(){

        const logPath = path.join( __dirname, '../logs')

        if( !fs.existsSync(logPath) ){

            this.createLogFolder( logPath )

        }

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

    private getCurrentTime(): string {
        return new Intl.DateTimeFormat('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).format(new Date())
    }

    private getLogFile(){
        
        this.checkLogFolder()

        try {
            const timestap = Date.now()
            
            const logPath = path.join( __dirname, `../logs/latest.log`)

            const exists = fs.existsSync( logPath )
    
            if( exists && !this.deleteLastLogFile ) this.renameFile( logPath )
    
            if( !this.logFileEnabled ) return
    
            fs.writeFileSync( logPath, `{ ${ timestap } }\n` )
    
            this.currentLogFilePath = logPath

            return logPath

        } catch ( ex ) {

            console.error( ex )

        }

    }

    private logText = ''

    private saveLog = debounce( ( ) => {

        if( this.currentLogFilePath ){

            fs.appendFileSync( this.currentLogFilePath, this.logText )
            
            this.logText = ''

        }

    }, 500)

    private echo( echoType: EchoType, message: string ){
      
        try {

            const timestap = this.getCurrentTime()

            this.logText += `[ ${timestap} ][ ${echoType} ] : ${ message }\n`

            this.saveLog()
          
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

    public error( msg: string, error: Error ){
        
        this.echo( 'Error', `${msg} : ${error}` )

    }

    public fatal( msg: string | Error ){

        this.echo( 'Critical', msg.toString() )
        
    }

}

const Log = Logger.GetInstance()


export default Log