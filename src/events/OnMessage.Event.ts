import { Client, Message } from "discord.js";

const onMessage = ( client:Client, action: ( message:Message ) => void ) => {
    
    client.on('messageCreate', action ) 

}

export default onMessage