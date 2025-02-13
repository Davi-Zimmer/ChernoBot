import { Message } from "discord.js";
import ChernoBot from "../main/Main";
import DataManager from "../database/DataManager";

class AutoMod {
    private chernoBot

    private autoModEnabled

    constructor( chernoBot : ChernoBot, autoMod: boolean = false ){

        this.chernoBot = chernoBot

        this.autoModEnabled = autoMod

    }

    messageSended( message: Message ){

        const databaseGuilds = DataManager.GetItem('guilds')

        const clientGuilds = this.chernoBot.getClient().guilds.cache


        clientGuilds.forEach( guild => {
            
        })

    }

    getAutoModEnabled(){
        return this.autoModEnabled
    }

    setAutoMod( status : boolean ){
        this.autoModEnabled = status
    }

}

export default AutoMod