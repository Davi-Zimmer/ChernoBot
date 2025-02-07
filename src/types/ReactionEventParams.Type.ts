import { MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js"

export default interface ReactionEventParams {
    reaction: MessageReaction | PartialMessageReaction
    user: User | PartialUser
}