import { Client, MessageReaction, PartialMessageReaction, PartialUser, User  } from "discord.js";

const onReactionRemove = ( client : Client, action: ( 

        reaction: MessageReaction | PartialMessageReaction,

        user:User | PartialUser 

    ) => void ) => {

    client.on("messageReactionRemove", action )

}

export default onReactionRemove