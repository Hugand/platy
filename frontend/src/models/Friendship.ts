import { User } from "./User";

export class Friendship {
    id: number = 0;
    friendshipDate: Date = new Date();
    user1: User = new User();
    user2: User = new User();
}