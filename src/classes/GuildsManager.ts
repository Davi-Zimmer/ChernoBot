import GuildDatabase from "../interfaces/GuildsDatabase";

class GuildsManager {
    public guilds: GuildDatabase[] = []

    constructor( guilds: GuildDatabase[] = [] ) {
        
        this.guilds = guilds

    }

    public findById( id:string ){

        return this.guilds.find( guild => guild.id === id )
        

    }

}

export default GuildsManager