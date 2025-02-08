import { Client } from "discord.js";

const onReady = ( client : Client, action: () => void ) => {

    client.on("ready", action )

}

export default onReady