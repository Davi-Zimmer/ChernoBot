
/**
 * @author Zimsky 
 */

import dotenv from "dotenv"

dotenv.config()

import Discord, { Client, GatewayIntentBits, Message, Partials } from "discord.js" 

import DataManager from "../database/DataManager"

// events
import onMessage from "../events/OnMessage.Event"
import onReady from "../events/OnReady.Event"


// commands
import ia from "../commands/ia"
import CommandType from "../types/Command.Type"

class ChernoBot {
    private client:Client

    private commands: CommandType[]

    constructor(){

        this.client = this.createClient()

        this.commands = this.getCommands()

        this.addEvents()

        this.ignite()

    }

    private ignite(){
        this.client.login( process.env.TOKEN )
    }

    private ready(){

        this.setup()

        console.log("Pronto")
        /*
            DataManager.setItem('ratao', true)

            console.log( DataManager.getItem() )

            DataManager.delete('ratao')
            console.log( DataManager.getItem() )

        */
    }

    private createClient(){
        return new Discord.Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.GuildVoiceStates
            ],
            partials: [
                Partials.Message,
                Partials.Channel,
                Partials.Reaction,
                Partials.User
            ]
        })
    }

    private getCommands(){
        return [
            ia
        ]
    }

    private addEvents(){

        onMessage( this.client, msg => this.messageSended( msg ) )

        onReady( this.client, () => this.ready() )


    }

    private async executeCommand( message: Message ){
        
        const args = message.content.split(' ')[ 0 ]

        const command = args.slice( 1 )

        const commandObject = this.commands.find( commandObject => commandObject.name == command )

        if( commandObject ) commandObject.execute( message )

    }

    private async messageSended( message: Message ){

        const content = message.content
        
        if( message.author.bot ) return

        if( content.startsWith( process.env.PREFIX! ) ){

            this.executeCommand( message )

            return
        }

        // outro tratamento

    }

    private setup(){

    }

}

const chernobot = new ChernoBot()