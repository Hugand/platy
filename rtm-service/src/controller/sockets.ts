import { validateToken, getFriendshipChats, persistChat } from "./restServiceApi";
import { DataContainer } from "../model/DataContainer";
import { JoinRoomData } from "../model/JoinRoomData";
import { Chat } from "../model/Chat";
import { SendMessageData } from "../model/SendMessageData";

class SocketController {
    dc: DataContainer

    constructor(dc: DataContainer) {
        this.dc = dc
    }

    async joinRoom(socket: any, data: JoinRoomData) {
        const isTokenValid: boolean = await this.validateUserToken(data)

        if(!isTokenValid) {
            socket.emit('error', 'token_invalid')
            return;
        }

        if (data.roomId === undefined || data.roomId === null ||
            data.roomId === '' || data.roomId.includes('-1')) {
                socket.emit('error', 'wrong_room_id')
                return;
        }

        // Assign user to room
        if(this.dc.users.get(data.uid)!.roomId !== null)
            socket.leave(this.dc.users.get(data.uid)!.roomId)

        socket.join(data.roomId)

        // Get friendship chats
        let friendshipId: number = parseInt(data.roomId.substring(1))
        let chatsList: Array<Chat>;
        try {
            chatsList = await getFriendshipChats(data.token, friendshipId);
        } catch (e) {
            socket.emit('error', 'fetch_chats')
            return
        }

        socket.emit('chat_data', JSON.stringify({ roomId: data.roomId, chatsList }))
    }

    // TODO: Might still need a little bit more work on error handling
    async sendMessage(io: any, socket: any, data: SendMessageData) {
        let persistedChat: Chat
        try {
            persistedChat = await persistChat(data.token, data.newChat)
        } catch (e) {
            socket.emit('error', 'token_invalid')
            return
        }
        io.to(data.roomId).emit('new_message', JSON.stringify({ message: persistedChat, roomId: data.roomId}))
    }

    /*
        Helper methods
    */
    private async validateUserToken(data: any): Promise<boolean> {
        try {
            const res: any = await validateToken(data)
            return res.status
        } catch(e) {
            return false;
        }
    }
}



export default SocketController