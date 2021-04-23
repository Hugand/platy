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
        console.log("[ JOIN ROOM ]: ", socket.id)
        const isTokenValid: boolean = await this.validateUserToken(data)

        if(!isTokenValid) {
            socket.emit('error', 'token_invalid')
            return;
        }

        if (data.roomIds === undefined || data.roomIds === null) {
            socket.emit('error', 'wrong_room_id')
            return;
        }

        // Leave current rooms
        this.dc.users.get(data.uid)?.roomIds.forEach((roomId: string) => {
            socket.leave(roomId)
        })

        data.roomIds.forEach((roomId: string) => {
            socket.join(roomId)
        })
    }

    // TODO: Might still need a little bit more work on error handling
    async sendMessage(io: any, socket: any, data: SendMessageData) {
        console.log("[ SEND MSG ]: ", socket.id)
        let persistedChat: Chat
        try {
            persistedChat = await persistChat(data.token, data.newChat)
            io.to(data.roomId).emit('new_message', JSON.stringify({ message: persistedChat, roomId: data.roomId }))
        } catch (e) {
            socket.emit('error', 'token_invalid')
        }

    }

    disconnect(socket: any) {
        console.log("[ DISCONNECT ]: ", socket.id)
    }

    /*
        Helper methods
    */
    private async validateUserToken(data: any): Promise<boolean> {
        try {
            const res: any = await validateToken(data)
            return res.status
        } catch (e) {
            console.log(e)
            return false;
        }
    }
}



export default SocketController