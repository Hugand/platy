package com.ugomes.webchat.ApiResponses;

import com.ugomes.webchat.models.User;

import java.util.List;

public class SearchUserResponse {
    List<User> searchedUsers;
    List<Long> friendRequestedUsersId;
    List<Long> friendUsersId;

    public SearchUserResponse(List<User> searchedUserList, List<Long> friendRequestedUsersId,
                              List<Long> friendUsersId) {
        this.searchedUsers = searchedUserList;
        this.friendRequestedUsersId = friendRequestedUsersId;
        this.friendUsersId = friendUsersId;
    }

    public List<User> getSearchedUsers() {
        return searchedUsers;
    }

    public List<Long> getFriendRequestedUsersId() {
        return friendRequestedUsersId;
    }

    public List<Long> getFriendUsersId() {
        return friendUsersId;
    }
}
