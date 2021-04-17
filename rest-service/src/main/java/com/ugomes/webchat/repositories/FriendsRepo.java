package com.ugomes.webchat.repositories;

import com.ugomes.webchat.models.Friends;
import com.ugomes.webchat.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface FriendsRepo extends JpaRepository<Friends, Long> {
    @Query("FROM Friends WHERE user1 = :user1 AND user2 = :user2 OR user1 = :user2 AND user2 = :user1")
    Optional<Friends> findFriendsByUser1AndUser2(User user1, User user2);

    @Query("FROM Friends WHERE user1 = :user OR user2 = :user")
    List<Friends> findFriendsByUser(User user);

    @Query("SELECT id FROM Friends WHERE user1 = :user OR user2 = :user")
    List<Long> findFriendsIdsByUser(User user);

    Integer countFriendsByUser1OrUser2(User user1, User user2);
}