import { Chat } from "@models/Chat";

export interface NewMessageData {
  message: Chat
  roomId: string
}
