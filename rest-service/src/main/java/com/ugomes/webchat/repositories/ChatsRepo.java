package com.ugomes.webchat.repositories;

import com.ugomes.webchat.models.Chat;
import com.ugomes.webchat.models.Friends;
import com.ugomes.webchat.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ChatsRepo extends JpaRepository<Chat, Long>  {
    @Query("FROM Chat WHERE userOrigin = :userO AND userDestiny = :userD OR " +
            "userOrigin = :userD AND userDestiny = :userO ORDER BY timestamp ASC")
    List<Chat> findChatsByUserOriginAndUserDestiny(User userO, User userD);

    @Query("FROM Chat WHERE friendship = :friendship ORDER BY timestamp DESC")
    List<Chat> findByFriendshipOrderByTimestampDesc(Friends friendship);
}