import { User } from "./User";

export class SearchUserResponse {
    searchedUsers: Array<User> = [];
    friendRequestedUsersId: Array<Number> = [];
    friendUsersId: Array<Number> = [];
}