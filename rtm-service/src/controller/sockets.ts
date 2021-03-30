import { validateToken, getFriendshipChats, persistChat } from "./restServiceApi";
import { DataContainer } from "../model/DataContainer";
import { JoinRoomData } from "../model/JoinRoomData";
import { Chat } from "../model/Chat";

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

        // Assign user to room
        if(this.dc.users.get(data.uid)!.roomId !== null)
            socket.leave(this.dc.users.get(data.uid)!.roomId)

        socket.join(data.roomId)

        // Get friendship chats
        let friendshipId: number = parseInt(data.roomId.substring(1))
        try {
            console.log(data.token, friendshipId)
            let chatsList: Array<Chat> = await getFriendshipChats(data.token, friendshipId);
            console.log(chatsList)
            socket.emit('chat_data', JSON.stringify(chatsList))
        } catch (e) {
            socket.emit('error', 'fetch_chats')
        }

        console.log("->", this.dc.rooms)
    }

    async sendMessage(io: any, socket: any, data: any) {
        try {
            const persistedChat: Chat = await persistChat(data.token, data.newChat)
            console.log(persistedChat)
            io.to(data.roomId).emit('new_message', JSON.stringify(persistedChat))
        } catch (e) {
            console.log(e)
        }
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