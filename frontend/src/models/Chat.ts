
export class Chat {
    id = 0;

    userOrigin = 0;

    friendshipId = 0;

    msg = '';

    timestamp: Date = new Date();

    constructor(userOrigin: number, friendshipId: number, msg: string, timestamp: Date) {
        this.userOrigin = userOrigin;
        this.friendshipId = friendshipId;
        this.msg = msg;
        this.timestamp = timestamp;
    }
}
