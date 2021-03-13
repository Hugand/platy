package com.ugomes.webchat.repositories;

import com.ugomes.webchat.models.FriendsRequests;
import com.ugomes.webchat.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FriendsRequestRepo extends JpaRepository<FriendsRequests, Long> {

    default List<FriendsRequests> findByOriginOrDestinyId(Long userId) {
        return findFriendsRequestsByRequestOriginUserIdOrRequestDestinyUserId(userId, userId);
    }

    List<FriendsRequests> findFriendsRequestsByRequestOriginUserIdOrRequestDestinyUserId(Long requestOriginUser_id, Long requestDestinyUser_id);

    @Modifying
    @Query("delete from FriendsRequests fr where fr.requestOriginUser.id = :userOriginId and fr.requestDestinyUser.id = :userDestinyId")
    void deleteFriendsRequestsByUsersId(@Param("userOriginId") Long userOriginId, @Param("userDestinyId") Long userDestinyId);
}