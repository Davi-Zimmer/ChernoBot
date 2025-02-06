import fs from "fs"
import path from "path"


export default class DataManager {
    public static readonly dbPath = path.join( __dirname, './database.json') 

    public static getItem (){
        
        const rawData = fs.readFileSync( this.dbPath, 'utf-8')

        return JSON.parse( rawData )

    }

    private static save( database : Object ){

        const stringData = JSON.stringify( database, null, 2  )

        fs.writeFileSync( this.dbPath, stringData )

    }

    public static setItem( key:string, data: number | string | boolean ){
        
        const database = this.getItem()

        database[ key ] = data

        this.save( database )       


    }


    public static delete( key:string ){
       
        const database = this.getItem()
        
        delete database[ key ]

        this.save( database )

    }
}