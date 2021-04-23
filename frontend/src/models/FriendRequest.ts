import { User } from "@models/User";

export class FriendRequest {
    id = -1;

    requestDate: Date = new Date();

    requestOriginUser: User = new User();

    requestDestinyUser: User = new User();
}
