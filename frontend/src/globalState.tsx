import { Chat } from "./models/Chat";
import { User } from "./models/User";
import { UserData } from "./models/UserData"
import { RecentChat } from "./models/RecentChat"

export type ChatData = {
    chatRooms: Map<string, ChatRoom>
    userToChat: User | null
    previewChat: Chat | null
    currRoomId: string
}

export class ChatRoom {
    chatsList: Array<Chat> = new Array<Chat>()
    previewChat: Chat | null = null
}

export class GlobalState {
    socket: any = null;
    userData: UserData = new UserData()
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
    switch(action.type) {
        case 'changeUser':
            return { ...state, userData: action.value }
        case 'changeSocket':
            return { ...state, socket: action.value }
        case 'changeChatData': {
            return { ...state, chatData: action.value }
        }
        case 'changeChatDataList': {
            const newState: GlobalState = { ...state }
            const chatRoom: ChatRoom = newState.chatData.chatRooms.get(newState.chatData.currRoomId) || new ChatRoom()
            chatRoom.chatsList = action.value
            newState.chatData.chatRooms.set(newState.chatData.currRoomId, chatRoom)

            return newState
        }
        case 'changeChatDataUser2Chat': {
            const newState: GlobalState = { ...state }
            newState.chatData.userToChat = action.value
            return newState
        }
        case 'changeChatDataPreviewChat': {
            const newState: GlobalState = { ...state }
            const chatRoom: ChatRoom = newState.chatData.chatRooms.get(action.value.roomId) || new ChatRoom()
            chatRoom.previewChat = action.value.previewChat
            newState.chatData.chatRooms.set(action.value.roomId, chatRoom)

            return newState
        }

        case 'changeChatDataCurrRoomId': {
            const newState: GlobalState = { ...state }
            newState.chatData.currRoomId = action.value
            return newState
        }
        case 'changeChatDataRooms': {
            const newState: GlobalState = { ...state }
            newState.chatData.currRoomId = action.value
            return newState
        }
        case 'addNewChatMessage': {
            const newState: GlobalState = { ...state }
            const roomId: string = newState.chatData.currRoomId
            const currChatRoom: ChatRoom | undefined = newState.chatData.chatRooms.get(roomId)
            if(currChatRoom !== undefined && !currChatRoom.chatsList.includes(action.value)) {
                currChatRoom.chatsList = [action.value, ...currChatRoom.chatsList]
                newState.chatData.chatRooms.set(roomId, currChatRoom)
            }

            return newState
        }
        
        case 'changeRecentChatsList':
            return {
                ...state,
                recentChatsList: action.value
            }

        default:
            return state
    }
}