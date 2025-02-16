import GuildEntity from "../Entities/GuildEntity"

class GuildsManager {
    public guilds: GuildEntity[] = []

    constructor( guilds: GuildEntity[] = [] ) {
        
        this.guilds = guilds

    }

    public findById( id:string ){

        return this.guilds.find( guild => guild.id === id )
        

    }

}

export default GuildsManager