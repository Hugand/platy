import { User } from "./User"

export class Room {
    users: Set<string> = new Set<string>()

    broadcast(event: string, msg: any, usersList: Map<string, User>) {
        this.users.forEach(user => {
            usersList.get(user)?.socketSession.emit(event, msg)
        })
    }

    addUser(user: string) {
        this.users.add(user)
    }
}