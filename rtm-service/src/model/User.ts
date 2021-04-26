import { Socket } from "socket.io";

export interface User {
    socketSession: Socket
    uid: string
    roomIds: Array<string>
}