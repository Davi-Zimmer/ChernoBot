import CommandParams from "../interfaces/CommandParams.Type";
import createCommand from "../utils/CreateCommand";
import { accessDenied, isOwner } from "../utils/Security";
import getForeGoundColors from "../classes/AnsiText";
import { createCanvas } from 'canvas'
import { BitField, GuildScheduledEventManager, PermissionFlagsBits, PermissionsBitField } from "discord.js";
import Log from "../config/Logger";

const Test = createCommand({
    name: 'test',
    execute: async ( { client, chernoBot, message, args } : CommandParams ) => {

        // message.reply('Uhum')
        const guild = message.guild

        if( !guild ){
            
            return
        }

        const evetnManager = guild.scheduledEvents.create({
            name: '<@565972325627985941>',
            scheduledStartTime: new Date(Date.now() + 3600000),
            scheduledEndTime:  new Date(Date.now() + 36000000),
            privacyLevel: 2, // Guild only
            entityType: 3, // External event
            description: "<@565972325627985941>",
            entityMetadata: { location: "planeta terra" },
            image: 'https://static.wikia.nocookie.net/viloes/images/4/4a/Humpty_Dumpty.webp/revision/latest?cb=20240422163803&path-prefix=pt-br',
            reason: '<@565972325627985941>'
        })

        .then( event => {
            Log.info(`[ ${guild.name}: ${guild.id} ] Evento criado`)
            console.log( event )
        })

        .catch( err => {
            Log.error(`[ ${guild.name}: ${guild.id} ] erro ao criar evento:`, err)
        })
    },

    options: { 
        isHidden: true,
        permissions: [
            PermissionsBitField.Flags.Administrator
        ]
        
    }

})


export default Test



/*
    if( !message.channel.isSendable() ){
        return
    }

    const canvas = createCanvas(500, 300)

    const ctx = canvas.getContext('2d')

    ctx.fillStyle = 'black'

    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = 'red';

    ctx.font = '20px Arial';

    ctx.fillText(`mensagem: ${args.join(' ')}`, 50, 100);


    const imgBuffer = canvas.toBuffer()

    const attachment = new AttachmentBuilder( imgBuffer )

    const sentMessage = await message.channel.send({ files: [attachment] });


    // chernoBot.commandBridge( message, 'join' )
    

*/