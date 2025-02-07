import { Client, MessageReaction, PartialMessageReaction, PartialUser, User  } from "discord.js";

const onReactionAdd = ( client : Client, action: ( 

        reaction: MessageReaction | PartialMessageReaction,

        user:User | PartialUser 

    ) => void ) => {

    client.on("messageReactionAdd", action )

}

export default onReactionAdd