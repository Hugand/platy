package com.ugomes.webchat.models;

import java.sql.Timestamp;
import java.util.Objects;

public class RecentChatItem {
    User friend;
    Long friendshipId;
    String lastMessage;
    Timestamp chatTimestamp;

    public RecentChatItem() { }
    public RecentChatItem(User friend, Long friendshipId, String lastMessage, Timestamp chatTimestamp) {
        this.friend = friend;
        this.friendshipId = friendshipId;
        this.lastMessage = lastMessage;
        this.chatTimestamp = chatTimestamp;
    }

    public User getFriend() {
        return friend;
    }

    public void setFriend(User friend) {
        this.friend = friend;
    }

    public Long getFriendshipId() {
        return friendshipId;
    }

    public void setFriendshipId(Long friendshipId) {
        this.friendshipId = friendshipId;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }

    public Timestamp getChatTimestamp() {
        return chatTimestamp;
    }

    public void setChatTimestamp(Timestamp chatTimestamp) {
        this.chatTimestamp = chatTimestamp;
    }

    @Override
    public String toString() {
        return "RecentChatItem{" +
                "friend=" + friend +
                ", friendshipId=" + friendshipId +
                ", lastMessage='" + lastMessage + '\'' +
                ", chatTimestamp=" + chatTimestamp +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RecentChatItem that = (RecentChatItem) o;
        return friend.equals(that.friend) && friendshipId.equals(that.friendshipId) && lastMessage.equals(that.lastMessage) && Objects.equals(chatTimestamp, that.chatTimestamp);
    }

    @Override
    public int hashCode() {
        return Objects.hash(friendshipId, lastMessage, chatTimestamp);
    }
}
