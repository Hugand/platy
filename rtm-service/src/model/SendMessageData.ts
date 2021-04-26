import { Chat } from "./Chat";

export interface SendMessageData {
    token: string
    newChat: Chat
    roomId: string
}