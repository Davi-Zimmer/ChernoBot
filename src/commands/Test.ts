import CommandParams from "../interfaces/CommandParams.Type";
import createCommand from "../utils/CreateCommand";
import { accessDenied, isOwner } from "../utils/Security";
import getForeGoundColors from "../classes/AnsiText";
import { createCanvas } from 'canvas'
import { BitField, PermissionFlagsBits, PermissionsBitField } from "discord.js";

const Test = createCommand({
    name: 'test',
    execute: async ( { client, chernoBot, message, args } : CommandParams ) => {

        // message.reply('Uhum')
    

        console.log( )

       
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