import { User } from "./User";

export class FriendRequest {
    id: number = 0;
    requestDate: Date = new Date();
    requestOriginUser: User = new User();
    requestDestinyUser: User = new User();
}