
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
import ia from "../commands/ArtificalInteligence"
import CommandType from "../types/Command.Type"
import dmMessage from "../commands/SendTo"
import move from "../commands/Move"

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
            ia,
            dmMessage,
            move
        ]
    }

    private addEvents(){

        onMessage( this.client, msg => this.messageSended( msg ) )

        onReady( this.client, () => this.ready() )


    }

    private async executeCommand( message: Message ){
        
        const args = message.content.split(' ')

        const command = args[ 0 ].slice( 1 )

        args.shift()

        const commandObject = this.commands.find( commandObject => commandObject.name == command )

        if( commandObject ) commandObject.execute( { message, args, client : this.client } )

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