package com.ugomes.webchat.ApiResponses;

import com.ugomes.webchat.models.User;

public class UserData {
    User user;
    int friendsCount;

    public UserData() { }
    public UserData(User user, int friendsCount) {
        this.user = user;
        this.friendsCount = friendsCount;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public int getFriendsCount() {
        return friendsCount;
    }

    public void setFriendsCount(int friendsCount) {
        this.friendsCount = friendsCount;
    }
}
