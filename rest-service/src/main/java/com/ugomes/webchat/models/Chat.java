package com.ugomes.webchat.models;

import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.Collection;
import java.util.Objects;

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

    public Chat(Long id, User userOrigin, Friends friendship, String msg) {
        this.id = id;
        this.userOrigin = userOrigin;
        this.friendship = friendship;
        this.msg = msg;
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
                ", userOrigin=" + userOrigin.getId() +
                ", friendship=" + friendship.getId() +
                ", msg='" + msg + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Chat chat = (Chat) o;
        return Objects.equals(id, chat.id) && userOrigin.equals(chat.userOrigin) && friendship.equals(chat.friendship) && msg.equals(chat.msg);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, userOrigin, friendship, msg);
    }
}
