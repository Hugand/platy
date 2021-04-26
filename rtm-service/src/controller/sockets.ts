import { validateToken, persistChat } from "./restServiceApi";
import { DataContainer } from "../model/DataContainer";
import { JoinRoomData } from "../model/JoinRoomData";
import { Chat } from "../model/Chat";
import { SendMessageData } from "../model/SendMessageData";
import { Server, Socket } from "socket.io";
import { SKT_EVT } from "../model/SocketEventEnum";
import { NewMessageData } from "../model/NewMessageData";
import { StatusBoolResponse } from "../model/StatusResponse";

class SocketController {
    dc: DataContainer;

    constructor(dc: DataContainer) {
        this.dc = dc;
    }

    onConnect(io: Server, socket: Socket): void {
        console.log("[ CONNECT ]: ", socket.id)
    
        const uid: string = socket.handshake.query.uid + ''
        this.dc.createUser(uid, socket)
    
        socket.on(SKT_EVT.JOIN_ROOM, (d: JoinRoomData) => this.joinRoom(socket, d))
        socket.on(SKT_EVT.SEND_MESSAGE, (d: SendMessageData) => this.sendMessage(io, socket, d))
    
        socket.on('disconnect', () => this.disconnect(socket))
    }
    
    async joinRoom(socket: Socket, data: JoinRoomData): Promise<void> {
        console.log("[ JOIN ROOM ]: ", socket.id)

        const isTokenValid: boolean = await this.validateUserToken(data.token, data.uid)

        this.leaveRoomsBySocket(socket, data.uid);

        if(!isTokenValid) {
            socket.emit(SKT_EVT.ERROR, SKT_EVT.TOKEN_INVALID)
            return;
        }

        if (data.roomIds === undefined || data.roomIds === null) {
            socket.emit(SKT_EVT.ERROR, SKT_EVT.INVALID_ROOM_ID)
            return;
        }

        data.roomIds.forEach((roomId: string) => {
            socket.join(roomId)
        })

        console.log("SENDING VALIDATION")

        socket.emit(SKT_EVT.JOIN_ROOM_VALIDATE, true)
        return;
    }

    async sendMessage(io: Server, socket: Socket, data: SendMessageData): Promise<void> {
        console.log("[ SEND MSG ]: ", socket.id)
        try {
            const persistedChat: Chat = await persistChat(data.token, data.newChat)
            if (!io.sockets.adapter.rooms.has(data.roomId)) {
                socket.emit(SKT_EVT.ERROR, SKT_EVT.INVALID_ROOM_ID)
                return;
            }

            const newMessageData: NewMessageData = {
                message: persistedChat,
                roomId: data.roomId
            }

            io.to(data.roomId).emit(SKT_EVT.NEW_MESSAGE, JSON.stringify(newMessageData))
        } catch (e) {
            socket.emit(SKT_EVT.ERROR, SKT_EVT.TOKEN_INVALID)
        }
        return;
    }

    disconnect(socket: Socket): void {
        console.log("[ DISCONNECT ]: ", socket.id)
        return;
    }

    /*
        Helper methods
    */
    private async validateUserToken(token: string, uid: string): Promise<boolean> {
        try {
            const res: StatusBoolResponse = await validateToken(token, uid);
            return res.status
        } catch (e) {
            console.log(e)
            return false;
        }
    }

    private leaveRoomsBySocket(socket: Socket, uid: string): void {
        // Leave current rooms
        this.dc.users.get(uid)?.roomIds.forEach((roomId: string) => {
            socket.leave(roomId)
        })
    }
}



export default SocketController