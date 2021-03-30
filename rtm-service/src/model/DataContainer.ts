import { User } from "./User"


export class DataContainer {
    users: Map<string, User> = new Map<string, User>()

    createUser(uid: string, socket: any) {
        const newUser: User = {
            socketSession: socket,
            uid,
            roomId: null
        }

        this.users.set(uid, newUser)
    }
}