import { User } from "./User";

export interface RecentChat {
    friend: User
    friendshipId: number
    lastMessage: string
    chatTimestamp: Date
}