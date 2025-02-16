export interface GuildEntityTypes {
    id: string,
    configMessageId?: string
}

class GuildEntity {
    
    public id: string

    public configMessageId?: string
    
    constructor( { id, configMessageId }: GuildEntityTypes ){

        this.id = id

        this.configMessageId = configMessageId

    }
}

export default GuildEntity 