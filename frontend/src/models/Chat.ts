
export class Chat {
    id: number = 0
    userOrigin: number = 0
    friendshipId: number = 0
    msg: string = ''
    timestamp: Date = new Date()

    constructor(userOrigin: number, friendshipId: number, msg: string, timestamp: Date) {
        this.userOrigin = userOrigin
        this.friendshipId = friendshipId
        this.msg = msg
        this.timestamp = timestamp
    }
}