import { Room } from "./Room"
import { User } from "./User"


export class DataContainer {
    rooms: Map<string, Room> = new Map<string, Room>()
    users: Map<string, User> = new Map<string, User>()

    broadcastToRoom(event: string, msg: any, roomId: string) {
        this.rooms.get(roomId)!.broadcast(event, msg, this.users)
    }

    createRoom(roomId: string) {
        if(!this.rooms.has(roomId))
            this.rooms.set(roomId, new Room)
    }

    createUser(uid: string, socket: any) {
        const newUser: User = {
            socketSession: socket,
            uid,
            roomId: null
        }

        this.users.set(uid, newUser)
    }
}