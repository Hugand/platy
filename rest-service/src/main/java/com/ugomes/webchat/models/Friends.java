package com.ugomes.webchat.models;

import javax.persistence.*;
import java.time.Instant;
import java.util.Objects;

@Entity
@Table
public class Friends {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private Instant friendshipDate;

    @ManyToOne(cascade = CascadeType.PERSIST)
    private User user1;

    @ManyToOne(cascade = CascadeType.PERSIST)
    private User user2;

    public Friends() { }

    public Friends(Long id) {
        this.id = id;
    }

    public Friends(User user1, User user2, Instant friendshipDate) {
        this.user1 = user1;
        this.user2 = user2;
        this.friendshipDate = friendshipDate;
    }

    public Friends(Long id, User user1, User user2, Instant friendshipDate) {
        this.id = id;
        this.user1 = user1;
        this.user2 = user2;
        this.friendshipDate = friendshipDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getFriendshipDate() {
        return friendshipDate;
    }

    public void setFriendshipDate(Instant friendshipDate) {
        this.friendshipDate = friendshipDate;
    }

    public User getUser1() {
        return user1;
    }

    public void setUser1(User user1) {
        this.user1 = user1;
    }

    public User getUser2() {
        return user2;
    }

    public void setUser2(User user2) {
        this.user2 = user2;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Friends friends = (Friends) o;
        return id.equals(friends.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
