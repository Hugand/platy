import { GlobalState, GlobalStateAction, ChatRoom } from "../globalState"
import { Chat } from "../models/Chat"
import { RecentChat } from "../models/RecentChat"
import { User } from "../models/User"
import { getFriendFromFriendship, clearSession } from "./api"

class ReducerActions {
  changeUser = (state: GlobalState, action: GlobalStateAction) => {
    return { ...state, userData: action.value }
  }

  changeSocket = (state: GlobalState, action: GlobalStateAction) => {
    return { ...state, socket: action.value }
  }

  changeChatData = (state: GlobalState, action: GlobalStateAction) => {
    return { ...state, chatData: action.value }
  }

  changeChatDataList = (state: GlobalState, action: GlobalStateAction) => {
    const newState: GlobalState = { ...state }
    const chatRoom: ChatRoom = newState.chatData.chatRooms.get(newState.chatData.currRoomId) || new ChatRoom()
    chatRoom.chatsList = action.value
    newState.chatData.chatRooms.set(newState.chatData.currRoomId, chatRoom)

    return newState
  }

  changeChatDataUser2Chat = (state: GlobalState, action: GlobalStateAction) => {
    const newState: GlobalState = { ...state }
    newState.chatData.userToChat = action.value
    return newState
  }

  changeChatDataPreviewChat = (state: GlobalState, action: GlobalStateAction) => {
    const newState: GlobalState = { ...state }
    const { roomId, previewChat } = action.value
    const chatRoom: ChatRoom = newState.chatData.chatRooms.get(roomId) || new ChatRoom()
    chatRoom.previewChat = previewChat
    newState.chatData.chatRooms.set(roomId, chatRoom)

    return newState
  }
  changeChatDataCurrRoomId = (state: GlobalState, action: GlobalStateAction) => {
    const newState: GlobalState = { ...state }
    newState.chatData.currRoomId = action.value
    return newState
  }
  changeChatDataRooms = (state: GlobalState, action: GlobalStateAction) => {
    const newState: GlobalState = { ...state }
    newState.chatData.currRoomId = action.value
    return newState
  }

  addNewChatMessage = (state: GlobalState, action: GlobalStateAction) => {
    const newState: GlobalState = { ...state }
    const { roomId, message } = action.value
    const currChatRoom: ChatRoom = newState.chatData.chatRooms.get(roomId) || new ChatRoom()

    if (currChatRoom.chatsList.includes(action.value.message)) return newState
    
    currChatRoom.chatsList = [message, ...currChatRoom.chatsList]
    newState.chatData.chatRooms.set(roomId, currChatRoom)

    // Add recent chat to list and put it on top
    newState.recentChatsList = this.addRecentChatItemToList(newState, roomId, message)
      
    return newState
  }
      
  createChatRoom = (state: GlobalState, action: GlobalStateAction) => {
    const newChatRoomId: string = action.value
    const newState = { ...state }
    
    newState.chatData.chatRooms.set(newChatRoomId, new ChatRoom())
    return newState
  }

  changeRecentChatsList = (state: GlobalState, action: GlobalStateAction) => {
    return { ...state, recentChatsList: action.value }
  }

  changeFriendsIds = (state: GlobalState, action: GlobalStateAction) => {
    return { ...state, friendsIds: action.value }
  }

  addRecentChatItemToList = (state: GlobalState, roomId: string, message: Chat) => {
    const friendshipId: number = parseInt(roomId.substr(1))
    let tmpRecentChatsList = [...state.recentChatsList]

    for (let i = 0; i < tmpRecentChatsList.length; i++) {
      const recentChat = tmpRecentChatsList[i]
      if (recentChat.friendshipId === friendshipId) {
        recentChat.lastMessage = message.msg
        recentChat.chatTimestamp = message.timestamp

        // Put recent chat on the top of the list
        tmpRecentChatsList = [recentChat, ...tmpRecentChatsList]
        tmpRecentChatsList.splice(i + 1, 1)
        return tmpRecentChatsList
      }
    }

    const recentChat = new RecentChat(null, friendshipId, message.msg, message.timestamp)
    tmpRecentChatsList = [recentChat, ...tmpRecentChatsList]

    return tmpRecentChatsList
  }

  changeRecentChatItem = (state: GlobalState, action: GlobalStateAction) => {
    const newState = { ...state }
    const { friendshipId, recentChatItem } = action.value
    
    for (let i = 0; i < newState.recentChatsList.length; i++) {
      const recentChat = newState.recentChatsList[i]      

      if (recentChat.friendshipId === friendshipId) {
        newState.recentChatsList[i] = recentChatItem
        break;
      }
    }

    return newState
  }
}


const reducers: Map<string, (state: GlobalState, action: GlobalStateAction) => GlobalState>
  = new Map(Object.entries(new ReducerActions()))

export default reducers