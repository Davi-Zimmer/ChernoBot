import fs from "fs"
import path from "path"


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

    public static setItem( key:string, data: number | string | boolean ){
        
        const database = this.loadDatabase()

        database[ key ] = data

        this.save( database )

    }

    public static delete( key:string ){
       
        const database = this.loadDatabase()
        
        delete database[ key ]

        this.save( database )

    }
}