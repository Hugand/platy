package com.ugomes.webchat.models;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.Collection;

@Entity
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private User userOrigin;

    @ManyToOne(cascade = CascadeType.PERSIST)
    private Friends friendship;

    private String msg;
    private Timestamp timestamp;

    public Chat(User userOrigin, Friends friendship, String msg, Timestamp timestamp) {
        this.userOrigin = userOrigin;
        this.friendship = friendship;
        this.msg = msg;
        this.timestamp = timestamp;
    }

    public Chat() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserOrigin() {
        return userOrigin.getId();
    }

    public void setUserOrigin(User userOrigin) {
        this.userOrigin = userOrigin;
    }

    public Long getFriendship() {
        return friendship.getId();
    }

    public void setFriendship(Friends friendship) {
        this.friendship = friendship;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public Timestamp getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "Chat{" +
                "id=" + id +
                ", userOrigin=" + userOrigin +
                ", friendship=" + friendship +
                ", msg='" + msg + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }

}
