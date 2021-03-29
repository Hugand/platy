import { validateToken, getFriendshipChats } from "./restServiceApi";
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

        // this.dc.createRoom(data.roomId)

        // this.dc.rooms.get(data.roomId)!.addUser(data.uid)
        // this.dc.users.get(data.uid)!.roomId = data.roomId

        // Get friendship chats
        let friendshipId: number = parseInt(data.roomId.substring(1))
        try {
            let chatsList: Array<Chat> = await getFriendshipChats(data.token, friendshipId);
            socket.emit('chat_data', JSON.stringify(chatsList))
        } catch (e) {
            socket.emit('error', 'fetch_chats')
        }

        console.log("->", this.dc.rooms)
    }

    sendMessage(socket: any, data: any) {
        socket.to(data.roomId).emit('msg', data.msg)
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