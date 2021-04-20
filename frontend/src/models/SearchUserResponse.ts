import { User } from "@models/User";

export class SearchUserResponse {
    searchedUsers: Array<User> = [];
    friendRequestedUsersId: Array<Number> = [];
    friendUsersId: Array<Number> = [];
}