import fs from "fs"
import path from "path"
import GuildDatabase from "../interfaces/GuildsDatabase"
import Log from "../config/Logger"


const databaseErrorMsg = 'O arquivo "database.json" não existe'

export default class DataManager {
    public static readonly DbPath = path.join( __dirname, './database.json') 

    private static Database = this.LoadDatabase()

    private static CreateDatabaseFile(){

        fs.writeFileSync( this.DbPath, '{}')

    }

    private static LoadDatabase(){
    
        try {

            const exist = fs.existsSync( this.DbPath )

            if( !exist ) this.CreateDatabaseFile()
            
            const rawdata = fs.readFileSync( this.DbPath, 'utf-8')
    
            const jsonData = JSON.parse( rawdata )
    
            this.Database = jsonData
    
            return jsonData

        } catch ( ex ) {

            if( ex instanceof Error )

            Log.error(  `${databaseErrorMsg}`, ex as Error  )
        }

    }

    private static Save( database : Object ){

        if( !this.Database ){

            Log.error('Datamanager/', new Error( databaseErrorMsg ))

            return
        }

        const stringData = JSON.stringify( database, null, 2  )

        this.Database = database

        fs.writeFileSync( this.DbPath, stringData )

    }

    public static SetItem( key:string, data: number | string | boolean | Array< any > ){
        
        const database = this.LoadDatabase()

        if( !database ) return
        
        database[ key ] = data

        this.Save( database )

    }

    public static Delete( key:string ){
       
        const database = this.LoadDatabase()
        
        delete database[ key ]

        this.Save( database )

    }

    public static GetItem( key: string ){

        return this.Database[ key ]

    }

    public static AddGuild( guildId:string ){

        let guilds = this.GetItem('guilds')

        if( !guilds ){
            
            this.SetItem('guilds', [] )
            
            guilds = this.GetItem('guilds')
        }

        guilds.push({ id: guildId })

        this.SetItem('guilds', guilds)
    }

    public static GetGuilds( ){

        return (this.GetItem( 'guilds' ) ?? []) as GuildDatabase[]

    }
}