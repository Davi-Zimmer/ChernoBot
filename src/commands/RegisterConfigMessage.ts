import  DataManager from "../database/DataManager";
import GuildEntity from "../Entities/GuildEntity";
import createCommand from "../utils/CreateCommand";

import getForeGoundColors from "../classes/ForegroundColors";
import { PermissionsBitField } from "discord.js";

const gfc = getForeGoundColors()

const RegisterConfig = createCommand({
    name: 'registerConfig',
    execute: async ({ message, args }) => {
        
        let configMessageId = args.shift()

        const channel = message.channel

        message.delete()

        if( !configMessageId && channel.isSendable() ){

            const botMsg = await channel.send('Essa será a mensagem de configuração, não delete.')
            
            configMessageId = botMsg.id

        } else {

            message.reply('Houve um erro ao enviar a mensagem de configuração.')
            
            return
        }

        if( !message.guild ) {
            
            message.reply('Você deve executar o comando em um servidor.')

            return
        }

        const guild = new GuildEntity({
            id: message.guild.id,
            configMessageId
        }) 

        DataManager.SetGuild( guild )

    },
    description: gfc.Cyan('Define uma mensagem de configurações do servidor.'),

    options: {

        permissions: [

            PermissionsBitField.Flags.ManageGuild

        ]

    }

})

export default RegisterConfig