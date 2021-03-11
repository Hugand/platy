package com.ugomes.webchat.repositories;

import com.ugomes.webchat.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UsersRepo extends JpaRepository<User, Long> {
    List<User> findByUid(String uid);
}