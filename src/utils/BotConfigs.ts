import fs from 'fs'
import path from 'path'
import Dataset from '../interfaces/datasetEnum'

class Configs {
    private dataset:Record< string, boolean >

    private constructor () {

        const datasetPath = path.join( __dirname, '../config/dataset.json' )

        const jsonData = fs.readFileSync( datasetPath ).toString()
        
        this.dataset = JSON.parse( jsonData )

        // console.log( this.dataset )
    }

    private static Instance: Configs;


    public static GetInstance(){
        
        if( !this.Instance ){

            this.Instance = new Configs()
        
        }
        
        return this.Instance
    }

    public getConfig( name : Dataset ){
        return this.dataset[ name ]
    }


}

const BotConfigs = Configs.GetInstance()

export default BotConfigs