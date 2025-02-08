/**
 * @author Zimsky_Davi
 */

import dotenv from "dotenv"

dotenv.config()

import Discord, { Client, GatewayIntentBits, Message, Partials } from "discord.js" 

import DataManager from "../database/DataManager"

// events
import onMessage from "../events/OnMessage.Event"
import onReady from "../events/OnReady.Event"
import onReactionAdd from "../events/OnReactionAdd.Event"
import onReactionRemove from "../events/OnReactionRemove.Event"

// commands
import IA from "../commands/ArtificalInteligence"
import DmMessage from "../commands/SendTo"
import Move from "../commands/Move"
import Join from "../commands/Join"
import Leave from "../commands/Leave"
import Play from "../commands/Play"
import Test from "../commands/Test"
import Speak from "../commands/Speak"   
import ClearChat from "../commands/ClearChat"

//
import { createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel, VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice"
import CommandType from "../interfaces/Command.Type"
import ReactionEventParams from "../interfaces/ReactionEventParams.Type"
import { Readable } from "stream"


class ChernoBot {
    private client:Client

    private commands: CommandType[]

    private connection: VoiceConnection | undefined

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
            IA,
            DmMessage,
            Move,
            Join,
            Leave,
            Play,
            Test,
            Speak,
            ClearChat
        ]
    }

    private addEvents(){

        onMessage( this.client, msg => this.messageSended( msg ) )

        onReady( this.client, () => this.ready() )

        onReactionAdd( this.client, (reaction, user) => this.reactionAdded({ reaction, user }) ) 
    
        onReactionRemove( this.client, (reaction, user) => this.reactionRemoved({ reaction, user}) ) 

    }

    private reactionAdded( {reaction, user }: ReactionEventParams){
        
        // console.log( user )

    }

    private reactionRemoved( {reaction, user }: ReactionEventParams){
        
        // console.log( user )

    }

    private async executeCommand( message: Message ){
        
        const args = message.content.split(' ')

        const command = args[ 0 ].slice( 1 )

        args.shift()

        const commandObject = this.commands.find( commandObject => commandObject.name == command )

        if( commandObject && !commandObject.options?.disabled ) {
            commandObject.execute( { message, args, client : this.client, chernoBot: this } )
        }

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

        this.checkConnection()

    }

    public checkConnection(){


        this.connection?.on(VoiceConnectionStatus.Disconnected, () => {
            console.log('sim')

        })

        return
        this.client.guilds.cache.forEach( guild => {
            const existentConnection = getVoiceConnection( guild.id )
            

            console.log( getVoiceConnection( guild.id ) )

            if( existentConnection ){

                const channelId = existentConnection.joinConfig.channelId;

                if( channelId ) this.joinInVoiceChannel( channelId )
            }
        })

    }

    public getConnection(){
        return this.connection
    }

    public setConnection( connection: VoiceConnection){
        this.connection = connection
    }

    public async joinInVoiceChannel( channelId: string ){
        try {

            const channel = await this.client.channels.fetch( channelId )

            if( !channel || !channel.isVoiceBased()) return
            
            const connection = joinVoiceChannel({
                channelId,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator
            })
    
            this.setConnection( connection )
    
        } catch {}
    }

    public isInVoiceChannel(){
        return ( this.connection && this.connection.state.status !== VoiceConnectionStatus.Destroyed )
    }

    public playAudio( audio:Buffer<ArrayBufferLike> | string ){
        
        const player = createAudioPlayer()

        let audioStream:Readable | undefined
    
        if( audio instanceof Buffer ) audioStream = Readable.from( audio )

        const src = createAudioResource( audioStream ?? audio as string  ) 

        player.play( src )
    
        this.connection?.subscribe( player )

        return player
    }

}

const chernobot = new ChernoBot()

export default ChernoBot