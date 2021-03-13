package com.ugomes.webchat;

import com.ugomes.webchat.Controllers.FriendsController;
import com.ugomes.webchat.models.User;
import com.ugomes.webchat.repositories.FriendsRequestRepo;
import com.ugomes.webchat.repositories.UsersRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@Service
public class UsersTests {
    private final UsersRepo usersRepo = Mockito.mock(UsersRepo.class);
    private final FriendsRequestRepo friendsRequestRepo = Mockito.mock(FriendsRequestRepo.class);

    private FriendsController friendsController;

    @BeforeEach
    void initUseCase() {
        friendsController = new FriendsController(usersRepo, friendsRequestRepo);
    }

    @Test
    void searchUsersBySubstring() {
        List<User> usersList = new ArrayList<>();
        usersList.add(new User("Hugo", "Gomes", "zezoca11"));
        usersList.add(new User("Ze", "Cotrim", "profjam3"));
        usersList.add(new User("Mano", "Zezoca>", "zenabo"));

        String searchTerm = "zez";

        when(usersRepo.findByUserOrName(searchTerm)).thenReturn(usersList);
        ResponseEntity<List<User>> queryResult = friendsController.searchUser(searchTerm);
        assertEquals(usersList, queryResult.getBody());
    }

    @Test
    void searchUsersByEmptySubstring() {
        List<User> usersList = new ArrayList<>();
        usersList.add(new User("Hugo", "Gomes", "zezoca11"));
        usersList.add(new User("Ze", "Cotrim", "profjam3"));
        usersList.add(new User("Mano", "Zezoca>", "zenabo"));

        String searchTerm = "";

        when(usersRepo.findByUserOrName(searchTerm)).thenReturn(usersList);
        when(usersRepo.findAll()).thenReturn(usersList);

        ResponseEntity<List<User>> queryResult = friendsController.searchUser(searchTerm);
        assertEquals(usersList, queryResult.getBody());
    }

}
