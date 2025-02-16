import fs from "fs"
import path from "path"
import Log from "../config/Logger"
import GuildEntity from "../Entities/GuildEntity"


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

            Log.error(  `${databaseErrorMsg}`, ex as Error  )

        }

    }

    private static Save( database : Object ){

        if( !this.Database ){

            Log.error('Datamanager> ', new Error( databaseErrorMsg ))

            return
        }

        const stringData = JSON.stringify( database, null, 4  )

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

    public static SetGuild( guild: GuildEntity ){

        let guilds = this.GetGuilds()

        const guildExists = guilds.find( dbGuild => dbGuild.id === guild.id )
        
        if( guildExists ){

            const index = guilds.indexOf( guildExists )

            guilds[ index ] = guild

        } else {

            guilds.push( guild )
        
        }


        this.SetItem( 'guilds', guilds )
    }

    public static GetGuilds( ){

        return (this.GetItem( 'guilds' ) ?? []) as GuildEntity[]

    }

}