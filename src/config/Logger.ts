import path from 'path'
import fs from 'fs'

type EchoType =  'Info' | 'Debug' | 'Warning' | 'Error' | 'Critical'

class Logger {

    private static ConsoleLogsDisabled = false

    private static LogFileDisabled = true

    private static CurrentLogFilePath = this.GetLogFile()

    private static RenameFile( logPath: string ){

        const data = fs.readFileSync( logPath ).toString()

        const match = data.match(/\{(.*?)\}/)

        const timestap = match?.[ 1 ].replaceAll(' ', '') || new Date().toISOString()

        const newName = path.join( __dirname, `../logs/${timestap}.log`)

        fs.renameSync( logPath, newName )

    }

    private static GetLogFile(){

        const timestap = Date.now()
        
        const logPath = path.join( __dirname, `../logs/latest.log`)

        const exists = fs.existsSync( logPath )

        if( exists ) this.RenameFile( logPath )

        if( this.LogFileDisabled ) return

        fs.writeFileSync( logPath, `{ ${ timestap} }\n` )

        this.CurrentLogFilePath = logPath

        return logPath

    }

    private static Echo( echoType: EchoType, message: string ){

        const timestap = new Date().toISOString()

        const newdata = `[ ${timestap} ][ ${echoType} ] : ${ message }\n`

        if( this.CurrentLogFilePath ){

            fs.appendFileSync( this.CurrentLogFilePath, newdata )

        }
      
        if( !this.ConsoleLogsDisabled ) console.log( message )
        

    }
 
    public static Debug( msg: string ){

        this.Echo( 'Debug', msg )

    } 

    public static Info( msg: string ){

        this.Echo( 'Info', msg )

    }

    public static Warning( msg: string ){

        this.Echo( 'Info', msg )

    }

    public static Error( msg: string | Error ){
        
        this.Echo( 'Error', msg.toString() )

    }

    public static Critical( msg: string | Error ){

        this.Echo( 'Critical', msg.toString() )
        
    }

}

export default Logger