import { User } from "@models/User";

export class RecentChat {
    friend: User | null;

    friendshipId: number;

    lastMessage: string;

    chatTimestamp: Date;

    constructor(friendshipId: number, lastMessage: string, chatTimestamp: Date, friend: User | null = null) {
        this.friend = friend;
        this.friendshipId = friendshipId;
        this.lastMessage = lastMessage;
        this.chatTimestamp = chatTimestamp;
    }
}
