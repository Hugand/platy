import { Chat } from "@/models/Chat";
import { User } from "@/models/User";

export interface ChatData {
  // chatRooms: Map<string, ChatRoom>
  userToChat: User | null;
  previewChat: Chat | null;
  currRoomId: string;
}
