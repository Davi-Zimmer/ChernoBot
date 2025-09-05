import { GuildMember, TeamMemberMembershipState, User } from "discord.js";
import CommandParams from "../../interfaces/CommandParams.Type";
import createCommand from "../../utils/CreateCommand";
import DataManager from "../../database/DataManager";


let confirmation = false


const EndServer = createCommand({
    name: 'endServer',
    execute: async ( { message }: CommandParams ) => {

        const serverName = message.guild?.name

        const members = await message.guild?.members.fetch() // as User[] | undefined
        
        if( !members ) {
            message.reply(`O servidor não tem membros`)
            return
        }

        const a = members.map(member => member);

        if( !confirmation ){

            let data: Record< string, any > = {}            

            for( const member of a ){
                data[ member.id ] = {
                    username: member.user.tag,
                    roles: member.roles.cache.filter(r => {
                        if( r.id !== member.guild.id ){
                            return r.id
                        }
                    })
                }

            }

            DataManager.SetItem( serverName!, data  )
            
            confirmation = true

            message.reply(`Cargos salvos. digite o comando novamente para expulsar todos usuários.`)

            return
        }

        for( const member of a ){

            const canKick = member.kickable &&
                member.id !== process.env.CLIENT_ID &&
                member.id !== member.guild.ownerId

            if( canKick ) await member.kick()

        }

    },

    options: { 
        devOnly: true,
        ownerOnly: true
    }

})


export default EndServer


