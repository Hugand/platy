import { Chat } from "./Chat";

export type SendMessageData = {
    token: string
    newChat: Chat
    roomId: string
}