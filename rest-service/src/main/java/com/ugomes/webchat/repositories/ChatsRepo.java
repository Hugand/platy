package com.ugomes.webchat.repositories;

import com.ugomes.webchat.models.Chat;
import com.ugomes.webchat.models.Friends;
import com.ugomes.webchat.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatsRepo extends JpaRepository<Chat, Long>  {
    @Query("FROM Chat WHERE friendship.user1 = :userO AND friendship.user2 = :userD OR " +
            "friendship.user1 = :userD AND friendship.user2 = :userO ORDER BY timestamp ASC")
    List<Chat> findChatsByUserOriginAndUserDestiny(User userO, User userD);

    @Query("FROM Chat WHERE friendship = :friendship ORDER BY timestamp DESC")
    List<Chat> findByFriendshipOrderByTimestampDesc(Friends friendship);

    @Query("FROM Chat as c WHERE (c.friendship.user1 = :user OR c.friendship.user2 = :user) " +
            "AND c.timestamp = (SELECT MAX(c2.timestamp) FROM Chat as c2 WHERE c2.friendship = c.friendship) " +
            "ORDER BY c.timestamp DESC")
    List<Chat> findChatByUserInFriendshipOrderByDesc(User user);
}