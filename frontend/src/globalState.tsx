import { Chat } from "./models/Chat";
import { User } from "./models/User";
import { UserData } from "./models/UserData"

export type ChatData = {
    chatList: Array<Chat>
    userToChat: User | null
    previewChat: Chat | null
}

export class GlobalState {
    socket: any = null;
    userData: UserData = new UserData()
    chatData: ChatData = {
        chatList: new Array<Chat>(),
        userToChat: null,
        previewChat: null
    }
}

export class GlobalStateAction {
    type: string = ""
    value: any
}

export const initialState = new GlobalState()

export const reducer = (state: GlobalState, action: GlobalStateAction) => {
    switch(action.type) {
        case 'changeUser':
            return {
                ...state,
                userData: action.value
            }
        case 'changeSocket':
            return {
                ...state,
                socket: action.value
            }
            case 'changeChatData': {
                return {
                    ...state,
                    chatData: action.value
                }
            }
            case 'changeChatDataList': {
                const newState: GlobalState = { ...state }
                newState.chatData.chatList = action.value
                return newState
            }
            case 'changeChatDataUser2Chat': {
                const newState: GlobalState = { ...state }
                newState.chatData.userToChat = action.value
                return newState
            }
            case 'changeChatDataPreviewChat': {
                const newState: GlobalState = { ...state }
                newState.chatData.previewChat = action.value
                return newState
            }
            case 'addNewChatMessage': {
                const newState: GlobalState = { ...state }
                if(!newState.chatData.chatList.includes(action.value)) {
                    newState.chatData.chatList = [action.value, ...newState.chatData.chatList]
                }
                return newState
            }

            default:
                return state
    }
}