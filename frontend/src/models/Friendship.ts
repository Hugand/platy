import { User } from "@models/User";

export class Friendship {
    id = -1;

    friendshipDate: Date = new Date();

    user1: User = new User();

    user2: User = new User();
}
