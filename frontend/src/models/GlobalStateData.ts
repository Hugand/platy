import { Chat } from "@models/Chat";
import { RecentChat } from "@models/RecentChat";
import { User } from "@models/User";
import { UserData } from "@models/UserData";

export interface ChatData {
  // chatRooms: Map<string, ChatRoom>
  userToChat: User | null;
  previewChat: Chat | null;
  currRoomId: string;
}

export class ChatRoom {
  chatsList: Array<Chat> = []
  previewChat: Chat | null = null
}

export class GlobalState {
  socket: any = null;
  userData: UserData = new UserData()
  friendsIds: Array<number> = []
  chatData: ChatData = {
      userToChat: null,
      previewChat: null,
      currRoomId: ''
  }
  chatRooms = new Map<string, ChatRoom>()
  recentChatsList = new Array<RecentChat>()
}

export class GlobalStateAction {
  type: string = ''
  value: any
}
