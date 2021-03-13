package com.ugomes.webchat;

import com.ugomes.webchat.ApiResponses.SearchUserResponse;
import com.ugomes.webchat.Controllers.FriendsController;
import com.ugomes.webchat.Utils.JwtTokenUtil;
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
import java.util.Objects;

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
        usersList.add(new User(1L,"Hugo", "Gomes", "zezoca11"));
        usersList.add(new User(2L, "Ze", "Cotrim", "profjam3"));
        usersList.add(new User(3L, "Mano", "Zezoca>", "zenabo"));
        usersList.get(0).setUid("123456789111");
        String authUserToken = "Bearer " + JwtTokenUtil.generateToken(usersList.get(0));
        String searchTerm = "zez";

        when(usersRepo.findByUserOrName(searchTerm)).thenReturn(usersList);
        when(usersRepo.findByUid(usersList.get(0).getUid())).thenReturn(java.util.Optional.ofNullable(usersList.get(0)));

        ResponseEntity<SearchUserResponse> queryResult = friendsController.searchUser(searchTerm, authUserToken);
        assertEquals(usersList, queryResult.getBody().getSearchedUsers());
    }

    @Test
    void searchUsersByEmptySubstring() {
        List<User> usersList = new ArrayList<>();
        usersList.add(new User(1L,"Hugo", "Gomes", "zezoca11"));
        usersList.add(new User(2L, "Ze", "Cotrim", "profjam3"));
        usersList.add(new User(3L, "Mano", "Zezoca>", "zenabo"));
        usersList.get(0).setUid("123456789111");
        String authUserToken = "Bearer " + JwtTokenUtil.generateToken(usersList.get(0));

        String searchTerm = "";

        when(usersRepo.findByUserOrName(searchTerm)).thenReturn(usersList);
        when(usersRepo.findAll()).thenReturn(usersList);

        ResponseEntity<SearchUserResponse> queryResult = friendsController.searchUser(searchTerm, authUserToken);
        assertEquals(0, Objects.requireNonNull(queryResult.getBody()).getSearchedUsers().size());
    }

}
