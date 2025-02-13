import fs from "fs"
import path from "path"
import GuildDatabase from "../interfaces/GuildsDatabase"


export default class DataManager {
    public static readonly DbPath = path.join( __dirname, './database.json') 

    private static Database = this.LoadDatabase()

    private static LoadDatabase(){

        const rawdata = fs.readFileSync( this.DbPath, 'utf-8')

        const jsonData = JSON.parse( rawdata )

        this.Database = jsonData

        return jsonData

    }

    private static Save( database : Object ){

        const stringData = JSON.stringify( database, null, 2  )

        this.Database = database

        fs.writeFileSync( this.DbPath, stringData )

    }

    public static SetItem( key:string, data: number | string | boolean | Array< any > ){
        
        const database = this.LoadDatabase()

        database[ key ] = data

        this.Save( database )

    }

    public static Delete( key:string ){
       
        const database = this.LoadDatabase()
        
        delete database[ key ]

        this.Save( database )

    }

    public static GetItem( key: string){

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