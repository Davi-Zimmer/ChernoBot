/**
 * @author Zimsky_Davi
 */

import dotenv, { config } from "dotenv"
import { Readable } from "stream"
import path from "path"
import espeak from 'espeak'

dotenv.config()

import Discord, { Client, GatewayIntentBits, GuildMember, Message, Partials, PermissionsBitField, User } from "discord.js" 
import { AudioPlayer, AudioPlayerStatus, createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel, VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice"


// events
import onMessage from "../events/OnMessage.Event"
import onReady from "../events/OnReady.Event"
import onReactionAdd from "../events/OnReactionAdd.Event"
import onReactionRemove from "../events/OnReactionRemove.Event"

// commands
import IA, { processResponse } from "../commands/ai/ArtificalInteligence"
import DmMessage from "../commands/utilities/SendTo"
import Move from "../commands/moderation/Move"
import Join from "../commands/audio/Join"
import Leave from "../commands/audio/Leave"
import Play from "../commands/audio/Play"
import Test from "../commands/dev/Test"
import Speak from "../commands/fun/Speak"
import ClearChat from "../commands/moderation/ClearChat"
import Batch from "../commands/utilities/Batch"
import Commands from "../commands/utilities/Commands"
import StartAI, { startProcess } from "../commands/ai/Neural"

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
import RegisterConfig from "../commands/moderation/RegisterConfigMessage"
import startServer from "../../site/main"
import { ChildProcessWithoutNullStreams } from "child_process"
import { response } from "express"
import fs from 'fs'
import BotConfigs from "../utils/BotConfigs"
import Dataset from "../interfaces/datasetEnum"
import { rejects } from "assert"


Log.setConsoleLogs( true )
// Log.setdeleteLastLog( true )
// Log.setLogFile( true )

class ChernoBot {
    private client:Client

    private commands: CommandType[]

    private connection: VoiceConnection | undefined

    private static instance: ChernoBot

    public autoMod?: AutoMod

    private constructor(){
        
        this.client = this.createClient()

        this.commands = this.getCommands()

        this.addEvents()

        this.ignite()
    }

    public static getInstance(){

        if( !ChernoBot.instance ){

            ChernoBot.instance = new ChernoBot()
        
        }
    
        return ChernoBot.instance
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

        onMessage( this.client, msg => this.onMessageReceived( msg ) )

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

    private getCommandByName( commandName:string ){
        return this.commands.find( command => command.name === commandName )
    }

    private hasPermission( command: CommandType, member?: GuildMember ){
        const required = command.options?.permissions
        const memberPermissions = member?.permissions
        return this.isAllowed( required, memberPermissions )
    }

    private logCommandExecution( user: User, commandName:string, isAllowed:boolean ){
        const userName = user.globalName || user.displayName || user.username
        const userInfo = `[ Usuario: ${ userName } ID: ${user.id} ]`

        if ( !isAllowed ) {
            Log.info(`Main> ${userInfo} Não pode usar o comando ${commandName}`)
        } else {
            Log.info(`Main> ${userInfo} -> ${commandName}`)
        }
    }

    private logCommandAutoExecution( commandName:string, isAllowed:boolean ){

        const chernoData = `[ ChernoBot: SelfCall ]`

        if( !isAllowed ){
            Log.info(`Main> ${chernoData}: Sem permissão para executar "${commandName}"`)
            return
        }

        Log.info(`Main> ${chernoData} -> ${commandName}`)
    }

    private executeCommand( message: Message, commandName: string, args: string[], isAutoCall:boolean=false ){

        return new Promise( async ( resolve, reject ) => {
            const command = this.getCommandByName( commandName )

            if( !command || command.options?.disabled) {
                reject('O comando não existe ou esta desativado. ')
                return
            }
            
            const isAllowed = this.hasPermission( command, message.member! )

            if( !isAutoCall ) this.logCommandExecution( message.author, commandName, isAllowed )
            else this.logCommandAutoExecution( commandName, isAllowed )
           
            if( !isAllowed ) {
                accessDenied( message )
                reject('Sem permissão.')
                return
            }

            const data = await command.execute({ client:this.client, args, chernoBot:this, message })
            
            resolve( data )

        })
     
    }

    private async removeCommandFlag( message: Message, command?: string ){
        
        const args = message.content.split(' ')

        const commandName = command ?? args.shift()!.replace(process.env.PREFIX!, '')

        await this.executeCommand( message, commandName, args )
    }

    private executeIA() {

        const terminal = startProcess()

        const send = async ( message:Message ) => {

            const msg = message.content

            const author = message.author

            const sender = author.globalName

            const request = await sendRequest( `sender:"${sender} ${msg}` ) as Response
            
            const aIResponse = await processResponse( request )

            message.reply( `<@${author.id}> ${ aIResponse}` )

        }

        return send

    }

    private sendMessageForAI = this.executeIA()

    private shouldUseCommand( message: Message ){

        const usePrefix = BotConfigs.getConfig( Dataset.usePrefix )

        const prefix = process.env.PREFIX

        if( usePrefix && !prefix ){

            const error = new Error('O prefixo do cliente não foi declarado')

            Log.fatal( error )

            throw error
        }

        if ( !usePrefix ) return true

        return message.content.startsWith( prefix! )

    }
    
    private async onMessageReceived( message: Message ){
        
        const content = message.content

        const ignoreBotMessages = BotConfigs.getConfig(Dataset.ignoreBotMessages)

        if (message.author.bot && !ignoreBotMessages) return

        const ignoreDM = BotConfigs.getConfig(Dataset.ignoreDM)

        if (ignoreDM && message.channel.isDMBased()) {
            Log.info("Main> Ignoring DM Message")
            return
        }

        if (!process.env.CLIENT_ID) {
            const error = new Error('O ID do cliente não foi declarado')
            Log.fatal(error)
            throw error
        }

        /*
            if (content.includes(process.env.CLIENT_ID)) {
                this.commandBridge('commands', message)
                return
            }
        */

        if (this.shouldUseCommand(message)) {
            this.removeCommandFlag(message)
            return
        }

        if (this.autoMod?.getAutoModEnabled()) {
            this.autoMod.messageSended(message)
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

    public async playAudio( audio:Buffer<ArrayBufferLike> | string, callback?:Function  ){
        
        return new Promise( resolve => {

            const player = createAudioPlayer()

            let audioStream:Readable | undefined
        
            if( audio instanceof Buffer ) audioStream = Readable.from( audio )

            const src = createAudioResource( audioStream ?? audio as string  ) 

            player.play( src )

            this.connection?.subscribe( player )

            player.once( AudioPlayerStatus.Idle, () => {
                resolve( undefined )
                callback?.()
            })

        })

    }

    public argsToSpeak( args: string[] ){

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

    public createAudio( content:string, configs: string[] ): Promise<Buffer<ArrayBufferLike>>{

        return new Promise( ( resolve, rejects ) => {

            if( !content ) return rejects('Sem conteúdo na mensagem')
        
            espeak.speak(content, configs, (err, wav) => {

                fs.writeFileSync("./src/audio/test.wav", wav.buffer)

                if( err ) {

                    console.log( err )

                    return rejects('Algo deu errado.')
                }

                if( !this.isInVoiceChannel() ) return rejects('Não esta em um canal de voz.')
                
                resolve( wav.buffer )

            })
        })        

    }

    public async commandBridge ( message: Message, command: string, args: string[], delay=0 ){
    
        return new Promise( resolve => {
             
            setTimeout(() => {
                
                resolve(
                    this.executeCommand( message, command, args, true )
                )

            }, delay)

        } )

    }

    public getClient(){
        return this.client
    }

    public getConnection(){
        return this.connection
    }

}

const chernoBot = ChernoBot.getInstance()

// const server = startServer()

export { ChernoBot, chernoBot }