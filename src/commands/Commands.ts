import { EmbedBuilder } from "discord.js";
import CommandParams from "../interfaces/CommandParams.Type";
import createCommand from "../utils/CreateCommand";
import getForeGoundColors from "../classes/ForegroundColors";

const fgc = getForeGoundColors()

const Commands = createCommand({
    name: 'commands',
    execute: ( { chernoBot, message, client } ) => {
       
        const visibleCommands = chernoBot.getCommands().filter( command => !command.options?.isHidden )
        
        const sortedCommands = visibleCommands.sort( (a, b) => a.name.localeCompare( b.name ) )

        const ansiCommand = sortedCommands.map( command => ` \`\`\`ansi\n ${fgc.Pink(command.name)}: ${command.description} \`\`\``)
        
        const iconURL = client.user?.displayAvatarURL({
            size: 1024,
            extension: 'png',
            forceStatic: true
        })
        
        if( !iconURL ){
            return
        }

        const embed = new EmbedBuilder()

        .setColor( '#93FF00' )
        .setTitle("☢️ Comandos do Chernobot")
        .setURL("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
        .setDescription(
        `Olá, **${message.author}**! Aqui estão os comandos disponíveis no Chernobot. Use o prefixo \`${process.env.PREFIX}\` antes de cada comando.\n\`-command\`\n`
        )
        .addFields(
        { 
            name: "🔧 **Comandos de Administração**", 
            value: `${ansiCommand.join('')}`,
        },
        /*
            { 
                name: "\n\n\n💬 **Comandos para Membros**", 
                value: 'EEEEEEEE'
            }
        */
        )
        .setFooter({ 
        text: `Desenvolvedor Zim/Davi`, 
        iconURL: iconURL 
        })
    
        if( message.channel.isSendable() ){

            message.channel.send({ embeds: [embed] });

        }
    },
    options: {
        isHidden: true
    }
})

export default Commands