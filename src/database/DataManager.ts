import fs from "fs"
import path from "path"
import GuildDatabase from "../interfaces/GuildsDatabase"


export default class DataManager {
    public static readonly dbPath = path.join( __dirname, './database.json') 

    private static database = this.loadDatabase()

    private static loadDatabase(){

        const rawdata = fs.readFileSync( this.dbPath, 'utf-8')

        const jsonData = JSON.parse( rawdata )

        this.database = jsonData

        return jsonData

    }

    private static save( database : Object ){

        const stringData = JSON.stringify( database, null, 2  )

        this.database = database

        fs.writeFileSync( this.dbPath, stringData )

    }

    public static setItem( key:string, data: number | string | boolean | Array< any > ){
        
        const database = this.loadDatabase()

        database[ key ] = data

        this.save( database )

    }

    public static delete( key:string ){
       
        const database = this.loadDatabase()
        
        delete database[ key ]

        this.save( database )

    }

    public static getItem( key: string){

        return this.database[ key ]

    }

    public static addGuild( guildId:string ){

        let guilds = this.getItem('guilds')

        if( !guilds ){
            
            this.setItem('guilds', [] )
            
            guilds = this.getItem('guilds')
        }

        guilds.push({ id: guildId })

        this.setItem('guilds', guilds)
    }

    public static getGuilds( ){

        return (this.getItem( 'guilds' ) ?? []) as GuildDatabase[]

    }
}