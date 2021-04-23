import { ChatData } from "@/models/globalStateData/ChatData";
import { ChatRoom } from "@/models/globalStateData/ChatRoomData";
import { RecentChat } from "@models/RecentChat";
import { UserData } from "@models/UserData";

export class GlobalState {
  socket: any = null;

  userData: UserData = new UserData();

  friendsIds: Array<number> = [];

  chatData: ChatData = {
      userToChat: null,
      previewChat: null,
      currRoomId: ''
  };

  chatRooms = new Map<string, ChatRoom>();

  recentChatsList: Array<RecentChat> = [];
}
