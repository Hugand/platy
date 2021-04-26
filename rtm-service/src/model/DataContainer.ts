import { Socket } from "socket.io"
import { User } from "./User"

export class DataContainer {
    users: Map<string, User> = new Map<string, User>()

    createUser(uid: string, socket: Socket): void {
        const newUser: User = {
            socketSession: socket,
            uid,
            roomIds: []
        }

        this.users.set(uid, newUser)
    }
}