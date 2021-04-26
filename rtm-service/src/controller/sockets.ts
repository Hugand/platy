import { validateToken, persistChat } from "./restServiceApi";
import { DataContainer } from "../model/DataContainer";
import { JoinRoomData } from "../model/JoinRoomData";
import { Chat } from "../model/Chat";
import { SendMessageData } from "../model/SendMessageData";
import { Socket } from "socket.io";
import { SKT_EVT } from "../model/SocketEventEnum";
import { NewMessageData } from "../model/NewMessageData";

class SocketController {
    dc: DataContainer;

    constructor(dc: DataContainer) {
        this.dc = dc;
    }

    onConnect(io: any, socket: Socket) {
        console.log("[ CONNECT ]: ", socket.id)
    
        const uid: string = socket.handshake.query.uid + ''
        this.dc.createUser(uid, socket)
    
        socket.on(SKT_EVT.JOIN_ROOM, (d: JoinRoomData) => this.joinRoom(socket, d))
        socket.on(SKT_EVT.SEND_MESSAGE, (d: SendMessageData) => this.sendMessage(io, socket, d))
    
        socket.on('disconnect', () => this.disconnect(socket))
    }
    
    async joinRoom(socket: any, data: JoinRoomData) {
        console.log("[ JOIN ROOM ]: ", socket.id)

        const isTokenValid: boolean = await this.validateUserToken(data)

        this.leaveRoomsBySocket(socket, data.uid);

        if(!isTokenValid) {
            socket.emit('error', 'token_invalid')
            return;
        }

        if (data.roomIds === undefined || data.roomIds === null) {
            socket.emit('error', 'invalid_room_id')
            return;
        }

        data.roomIds.forEach((roomId: string) => {
            socket.join(roomId)
        })

        console.log("SENDING VALIDATION")

        socket.emit('join_room_validate', true)
        return;
    }

    async sendMessage(io: any, socket: any, data: SendMessageData) {
        console.log("[ SEND MSG ]: ", socket.id)
        try {
            let persistedChat: Chat = await persistChat(data.token, data.newChat)
            if (!io.sockets.adapter.rooms.has(data.roomId)) {
                socket.emit('error', 'invalid_room_id')
                return;
            }

            const newMessageData: NewMessageData = {
                message: persistedChat,
                roomId: data.roomId
            }

            io.to(data.roomId).emit('new_message', JSON.stringify(newMessageData))
        } catch (e) {
            socket.emit('error', 'token_invalid')
        }
        return;
    }

    disconnect(socket: any) {
        console.log("[ DISCONNECT ]: ", socket.id)
        return;
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

    private leaveRoomsBySocket(socket: Socket, uid: string) {
        // Leave current rooms
        this.dc.users.get(uid)?.roomIds.forEach((roomId: string) => {
            socket.leave(roomId)
        })
    }
}



export default SocketController