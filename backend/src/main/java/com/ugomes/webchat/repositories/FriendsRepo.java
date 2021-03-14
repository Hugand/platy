package com.ugomes.webchat.repositories;

import com.ugomes.webchat.models.Friends;
import com.ugomes.webchat.models.FriendsRequests;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FriendsRepo extends JpaRepository<Friends, Long> {

}