import { Chat } from "./models/Chat";
import { User } from "./models/User";
import { UserData } from "./models/UserData"
import { RecentChat } from "./models/RecentChat"
import { clearSession, getFriendFromFriendship } from "./helpers/api";
import reducers from "./helpers/globalStateReducers";

export type ChatData = {
    chatRooms: Map<string, ChatRoom>
    userToChat: User | null
    previewChat: Chat | null
    currRoomId: string
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
        chatRooms: new Map<string, ChatRoom>(), // implement the reducers and othe logic necessary
        userToChat: null,
        previewChat: null,
        currRoomId: ''
    }
    recentChatsList: Array<RecentChat> = new Array<RecentChat>()
}

export class GlobalStateAction {
    type: string = ""
    value: any
}

export const initialState = new GlobalState()

export const reducer = (state: GlobalState, action: GlobalStateAction) => {
    const actionFunction = reducers.get(action.type)
    if (actionFunction !== undefined) return actionFunction(state, action)
    else return state
}