import CommandParams from "../interfaces/CommandParams.Type";
import createCommand from "../utils/CreateCommand";
import { accessDenied, isOwner } from "../utils/Security";
import getForeGoundColors from "../classes/ForegroundColors";
import { createCanvas } from 'canvas'
import { BitField, GuildScheduledEventManager, PermissionFlagsBits, PermissionsBitField } from "discord.js";
import Log from "../config/Logger";
import CryptoJS from 'crypto-js'


const Test = createCommand({
    name: 'test',
    execute: async ( { client, chernoBot, message, args } : CommandParams ) => {

        // message.reply('Uhum')
        
        const type = args.shift()

        const content = args.join(' ')

        if( !content ){
            return
        }

        let a = 'E'

        if( type == 'dec'){

            const e = CryptoJS.AES.decrypt( content, process.env.CRYPTO_SECRET! )
            
            a = e.toString(CryptoJS.enc.Utf8)

        }
        
        else if( type =='enc'){

            a = CryptoJS.AES.encrypt( content, process.env.CRYPTO_SECRET! ).toString()


        }

    
        message.reply( a )
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