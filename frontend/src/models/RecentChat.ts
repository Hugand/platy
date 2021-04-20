import { User } from "@models/User";

export class RecentChat {
    friend: User | null
    friendshipId: number
    lastMessage: string
    chatTimestamp: Date

    constructor(friend: User | null = null, friendshipId: number, lastMessage: string, chatTimestamp: Date) {
        this.friend = friend
        this.friendshipId = friendshipId
        this.lastMessage = lastMessage
        this.chatTimestamp = chatTimestamp
    }
}