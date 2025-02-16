/**
 * @author Zimsky_Davi
 */

import dotenv from "dotenv"
import { Readable } from "stream"
import path from "path"
import espeak from 'espeak'

dotenv.config()

import Discord, { Client, GatewayIntentBits, Message, Partials, PermissionsBitField } from "discord.js" 
import { createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel, VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice"



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
import Batch from "../commands/Batch"
import Commands from "../commands/Commands"
import StartAI from "../commands/StartAI"

//types
import CommandType from "../interfaces/Command.Type"
import ReactionEventParams from "../interfaces/ReactionEventParams.Type"

// assistent functions
import { getParamsAndLanguage, processMessageToSpeak } from "../utils/Utils"
import { accessDenied } from "../utils/Security"


// important
import DataManager from "../database/DataManager"
import AutoMod from "../classes/AutoMod"
import Log from "../config/Logger"
import GuildEntity from "../Entities/GuildEntity"
import RegisterConfig from "../commands/RegisterConfigMessage"

// Log.setConsoleLogs( true )
// Log.setdeleteLastLog( true )
// Log.setLogFile( true )

class ChernoBot {
    private client:Client

    private commands: CommandType[]

    private connection: VoiceConnection | undefined

    public autoMod?: AutoMod

    constructor(){

        this.client = this.createClient()

        this.commands = this.getCommands()

        this.addEvents()

        this.ignite()

    }

    private ignite(){
        Log.info('Main> Iniciando ChernoBot')

        this.client.login( process.env.TOKEN )
       
        Log.info('Main> ChernoBot online')

    }

    private ready(){

        this.setup()

        console.log("Pronto")
       
    }

    private checkGuilds () {

        const guilds = DataManager.GetGuilds()
        
        this.client.guilds.cache.forEach( guild => {
            
            const exist = guilds.find( guildDb => guildDb.id !== guild.id )

            if( !exist ){

                const guildEntity = new GuildEntity({ id: guild.id })

                DataManager.SetGuild( guildEntity )
                
                return
            }


            // checar mutes e outros

        })
        
    }

    private setup(){

        // this.checkConnection()

        this.checkGuilds()

        this.autoMod = new AutoMod( this )

    }

    private createClient(){
        Log.info('Main> Criando cliente...')

        function newClient(){
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

        const client = newClient()
        
        Log.info('Main> Cliente criado com sucesso.')

        return client
    }

    public getCommands(){
        Log.info('Main> Iniciando comandos...')

        const commands = [
            IA,
            DmMessage,
            Move,
            Join,
            Leave,
            Play,
            Test,
            Speak,
            ClearChat,
            Batch,
            Commands,
            StartAI,
            RegisterConfig
        ]

        Log.info(`Main> Comandos carregados: ${ commands.length + 1 } comandos.`)

        return commands
    }

    private addEvents(){
        Log.info('Main> Adicionando eventos...')

        onMessage( this.client, msg => this.messageSended( msg ) )

        onReady( this.client, () => this.ready() )

        onReactionAdd( this.client, (reaction, user) => this.reactionAdded({ reaction, user }) ) 
    
        onReactionRemove( this.client, (reaction, user) => this.reactionRemoved({ reaction, user}) ) 

        Log.info('Main> Eventos adicionados com sucesso.')

    }

    private reactionAdded( {reaction, user }: ReactionEventParams){
        
        // console.log( user )

    }

    private reactionRemoved( { reaction, user }: ReactionEventParams){
        
        // console.log( user )

    }

    private permissionConverter( permission: bigint | Readonly<PermissionsBitField> ){

        return new PermissionsBitField( permission )

    }

    private isAllowed( permissionsRequiredBigint?: bigint[], memberPermissionsBitField?: Readonly<PermissionsBitField>){
        
        let isAllowed = false

        if( !permissionsRequiredBigint ) return true

        if( !memberPermissionsBitField ) return false

        const memberPermissions = this.permissionConverter( memberPermissionsBitField )

        permissionsRequiredBigint.forEach( bigint => {
            
            const permissionRequired = this.permissionConverter( bigint )

            if( isAllowed ) return
            
            isAllowed = memberPermissions.has( permissionRequired )

        })

        return isAllowed

    }

    private async executeCommand( message: Message, command?: string ){
    
        const args = message.content.split(' ')

        const commandName = command ?? args[ 0 ].slice( 1 )

        args.shift()

        const commandObject = this.commands.find( commandObject => commandObject.name == commandName )
        
        if( commandObject && !commandObject.options?.disabled ) {

            const permissionsRequired = commandObject.options?.permissions

            const memberPermissions = message.member?.permissions

            const canUseCommand = this.isAllowed( permissionsRequired, memberPermissions  )

            const user = message.author

            const userName = user.globalName || user.displayName || user.displayName

            const userInfo = `[ Usuário: ${userName} ID: ${user.id} ]`

            if( !canUseCommand ){

                Log.info(`Main> ${userInfo} ] Não pode usar o comando ${commandName}`)
                
                accessDenied( message )
                
                return
            }


            Log.info(`Main> ${userInfo} -> ${commandName}`)

            commandObject.execute( { message, args, client : this.client, chernoBot: this } )
        }

    }

    private async messageSended( message: Message ){
        
        const content = message.content
        
        if( message.author.bot ) return


        if( !process.env.CLIENT_ID || !process.env.PREFIX ){

            const error = new Error('O ID do cliente ou seu prefixo não foram declarados')

            Log.fatal( error )

            throw error
        }
        
    
        if( content.includes( process.env.CLIENT_ID )){

            this.commandBridge('commands', message)

            return
        }


        if( content.startsWith( process.env.PREFIX ) ){

            this.executeCommand( message )

            return
        }


        if( this.autoMod?.getAutoModEnabled() ){

            this.autoMod.messageSended( message )
                        
        }

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

    public isInVoiceChannel(){
        return ( this.connection && this.connection.state.status !== VoiceConnectionStatus.Destroyed )
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

    public async playAudio( audio:Buffer<ArrayBufferLike> | string ){
        
        const player = createAudioPlayer()

        let audioStream:Readable | undefined
    
        if( audio instanceof Buffer ) audioStream = Readable.from( audio )

        const src = createAudioResource( audioStream ?? audio as string  ) 

        player.play( src )
        
        this.connection?.subscribe( player )

        return player
    }

    private prepareArgs( args: string[] ){

        const msg = processMessageToSpeak( args )

        const content = msg.args.join(' ')
    
        if( !content ) throw new Error('Sem conteúdo na mensagem')

        const { lang, params } = getParamsAndLanguage( msg.params )

        espeak.cmd = path.join( __dirname, '../speaker/command_line/espeak.exe');
        
        return {
            configs: [...lang, ...params],
            content
        }

    }

    public async speak( args: string[] ){
        
        const feedback = ( message : string, onError: boolean = true) => ({message, onError})
        try {

            const { configs, content } = this.prepareArgs( args )

            if( !content ){
                return feedback('Sem conteúdo na mensagem')
            }
        
            espeak.speak(content, configs, (err, wav) => {
                
                if( err ) {

                    console.log( err )

                    return feedback( "Algo deu errado." )
                }
    
                if( !this.isInVoiceChannel() ) return feedback( "Não esta em um canal de voz." )
                
                this.playAudio( wav.buffer )
    
            })
            
            return feedback("OK", false)
        } catch ( ex ) {

            console.error( ex )
        
            Log.error('Main> Erro no TTS', ex as Error)

            return feedback("Erro no speaker.")
        }


    }

    public async commandBridge ( command: string, message: Message ){

        await this.executeCommand( message, command )

    }

    public getClient(){
        return this.client
    }

}

const chernobot = new ChernoBot()

export default ChernoBot