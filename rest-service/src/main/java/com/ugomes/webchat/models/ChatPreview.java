package com.ugomes.webchat.models;

import java.sql.Timestamp;

public class ChatPreview {
    private Long id;
    private Long userOrigin;
    private Long friendshipId;
    private String msg;
    private Timestamp timestamp;

    public ChatPreview() {}
    public ChatPreview(Long userOrigin, Long friendshipId, String msg, Timestamp timestamp) {
        this.userOrigin = userOrigin;
        this.friendshipId = friendshipId;
        this.msg = msg;
        this.timestamp = timestamp;
    }
    public ChatPreview(Long id, Long userOrigin, Long friendshipId, String msg, Timestamp timestamp) {
        this.id = id;
        this.userOrigin = userOrigin;
        this.friendshipId = friendshipId;
        this.msg = msg;
        this.timestamp = timestamp;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return this.id;
    }

    public void setUserOrigin(Long userOrigin) {
        this.userOrigin = userOrigin;
    }

    public void setFriendshipId(Long friendshipId) {
        this.friendshipId = friendshipId;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }

    public Long getUserOrigin() {
        return userOrigin;
    }

    public Long getFriendshipId() {
        return friendshipId;
    }

    public String getMsg() {
        return msg;
    }

    public Timestamp getTimestamp() {
        return timestamp;
    }
}
