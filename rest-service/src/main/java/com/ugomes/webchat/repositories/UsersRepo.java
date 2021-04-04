package com.ugomes.webchat.repositories;

import com.ugomes.webchat.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UsersRepo extends JpaRepository<User, Long> {
    Optional<User> findByUid(String uid);

    @Query("FROM User WHERE lower(username) LIKE %:searchTerm% or lower(nome_proprio) LIKE %:searchTerm% or lower(apelido) LIKE %:searchTerm% ")
    List<User> findByUserOrName(String searchTerm);
}