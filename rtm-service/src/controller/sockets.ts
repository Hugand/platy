import { validateToken, getFriendshipChats, persistChat } from "./restServiceApi";
import { DataContainer } from "../model/DataContainer";
import { JoinRoomData } from "../model/JoinRoomData";
import { Chat } from "../model/Chat";
import { SendMessageData } from "../model/SendMessageData";
import { createNoSubstitutionTemplateLiteral } from "typescript";

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

        if (data.roomIds === undefined || data.roomIds === null) {
                socket.emit('error', 'wrong_room_id')
                return;
        }

        // Assign user to room
        // if(this.dc.users.get(data.uid)!.roomIds !== null)
        //     socket.leave(this.dc.users.get(data.uid)!.roomId)
        
        // Leave current rooms
        this.dc.users.get(data.uid)?.roomIds.forEach((roomId: string) => {
            socket.leave(roomId)
        })

        // socket.join(data.roomIds)

        
        data.roomIds.forEach((roomId: string) => {
            socket.join(roomId)
            console.log("JOINING ROOM", roomId)
            // Get friendship chats
            // let friendshipId: number = parseInt(data.roomIds.substring(1))
            // let chatsList: Array<Chat>;
            // try {
            //     chatsList = await getFriendshipChats(data.token, friendshipId);
            // } catch (e) {
            //     socket.emit('error', 'fetch_chats')
            //     return
            // }
        })

        console.log(socket.rooms)

        // socket.emit('chat_data', JSON.stringify({ roomId: data.roomIds, chatsList }))
    }

    // TODO: Might still need a little bit more work on error handling
    async sendMessage(io: any, socket: any, data: SendMessageData) {
        console.log(io.sockets.adapter.rooms)
        // console.log(io.rooms.adapter.rooms['F76'])
        // console.log(io.rooms.adapter.rooms['F139'])
        // console.log(io.rooms.adapter.rooms['F163'])
        let persistedChat: Chat
        try {
            persistedChat = await persistChat(data.token, data.newChat)
            // console.log(io.sockets.clients(data.roomId))
            io.to(data.roomId).emit('new_message', JSON.stringify({ message: persistedChat, roomId: data.roomId }))
        } catch (e) {
            socket.emit('error', 'token_invalid')
        }

    }

    disconnect(socket: any) {
        console.log("User disconnected", socket.id)
        // socket.rooms.forEach((room: any) => {
        //     console.log("DISCONNECTING FROM", room)
        //     socket.leave(room)
        // });
        // this.dc.users.get(data.uid)?.roomIds.forEach((roomId: string) => {
        //     socket.leave(roomId)
        // })
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