import { User } from "@models/User";

export class SearchUserResponse {
    searchedUsers: Array<User> = [];

    friendRequestedUsersId: Array<number> = [];

    friendUsersId: Array<number> = [];
}
