import { Chat } from "@/models/Chat";

export class ChatRoom {
  chatsList: Array<Chat> = [];

  previewChat: Chat | null = null;
}
