import { Message } from "discord.js";
import { rnd } from "./Utils";

const isBotOwner = ( message : Message ) => Number( message.author.id ) == Number( process.env.OWNER_ID )

const accessDenied = ( message : Message ) => {

    const links = [
        "https://tenor.com/view/nuh-uh-nuh-uh-starved-eggman-gif-26280682",
        "https://tenor.com/view/do-gif-26136854",
        "https://media.discordapp.net/attachments/862055721104703559/1138974403321933854/poop-no-poop_1.gif?ex=6595eb12&is=65837612&hm=b75f6c6b37047ed728e7727fcde221257072bc8ad1c471e3ebce6163032de0f3&"
    ]
    
    const link = links[ rnd( links.length ) ]

    message.reply( link )

    if( message.channel.isSendable() ){

        message.channel.send( "XD Você não tem permissão pra fazer isso." )

    }
    
}

export {
    isBotOwner as isOwner,
    accessDenied
}