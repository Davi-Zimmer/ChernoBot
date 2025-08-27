import CommandParams from "../../interfaces/CommandParams.Type";
import createCommand from "../../utils/CreateCommand";
import { accessDenied, isOwner } from "../../utils/Security";
import getForeGoundColors from "../../classes/ForegroundColors";
import { createCanvas } from 'canvas'
import { BitField, GuildMember, GuildScheduledEvent, GuildScheduledEventManager, GuildScheduledEventStatus, PermissionFlagsBits, PermissionsBitField } from "discord.js";
import Log from "../../config/Logger";
import CryptoJS from 'crypto-js'
import path from "path";

import startSerever from '../../../site/main'

let evetnManager: GuildScheduledEvent<GuildScheduledEventStatus>

const Test = createCommand({
    name: 'test',
    execute: async ( { client, chernoBot, message, args } : CommandParams ) => {

        const channelId = args.shift()!   

        await chernoBot.commandBridge( message, 'join', [channelId] )

        await chernoBot.commandBridge( message, 'speak', args, 1000 )

        await chernoBot.commandBridge( message, 'leave', [] )
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
    
    ---------------------------------------------------------------

    
const Test = createCommand({
    name: 'test',
    execute: async ( { client, chernoBot, message, args } : CommandParams ) => {
        
        const guild = message.guild

        if( !guild ){
            
            return
        }

        try {

            if( evetnManager ){

                const usersSubscribes = await evetnManager.fetchSubscribers()
        
                const role = await guild.roles.create({
                    name: 'evento',
                    color: '#b31288',
                })
                
                const ids = usersSubscribes.map( user => user.user.id )

                for( const id of ids) {
                    
                    const user = await guild.members.fetch( id )

                    user.roles.add( role )
                }
                
                return
            }

            evetnManager = await guild.scheduledEvents.create({
                name: '<@565972325627985941>',
                scheduledStartTime: new Date(Date.now() + 3600000),
                scheduledEndTime:  new Date(Date.now() + 36000000),
                privacyLevel: 2,
                entityType: 3,
                description: "<@565972325627985941>",
                entityMetadata: { location: "planeta terra" },
                image: 'https://static.wikia.nocookie.net/viloes/images/4/4a/Humpty_Dumpty.webp/revision/latest?cb=20240422163803&path-prefix=pt-br',
                reason: '<@565972325627985941>'
            })

            
            Log.info(`Test> [ ${guild.name}: ${guild.id} ] Evento criado`)


        } catch ( ex ){

            Log.error(`Test> [ ${guild.name}: ${guild.id} ] erro ao criar evento:`, ex as Error)

        }

    },

    options: { 
        isHidden: true,
        permissions: [
            PermissionsBitField.Flags.Administrator
        ]
        
    }

})

*/