package com.ugomes.webchat;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ugomes.webchat.ApiResponses.SearchUserResponse;
import com.ugomes.webchat.ApiResponses.UserData;
import com.ugomes.webchat.Controllers.Rest.FriendsController;
import com.ugomes.webchat.Controllers.Rest.UsersController;
import com.ugomes.webchat.Utils.JwtTokenUtil;
import com.ugomes.webchat.models.User;
import com.ugomes.webchat.repositories.ChatsRepo;
import com.ugomes.webchat.repositories.FriendsRepo;
import com.ugomes.webchat.repositories.FriendsRequestRepo;
import com.ugomes.webchat.repositories.UsersRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@Service
public class UsersTests {
    private final UsersRepo usersRepo = Mockito.mock(UsersRepo.class);
    private final FriendsRequestRepo friendsRequestRepo = Mockito.mock(FriendsRequestRepo.class);
    private final FriendsRepo friendsRepo = Mockito.mock(FriendsRepo.class);
    private final ChatsRepo chatsRepo = Mockito.mock(ChatsRepo.class);

    private FriendsController friendsController;
    private UsersController usersController;

    @BeforeEach
    void initUseCase() {
        friendsController = new FriendsController(usersRepo, friendsRequestRepo, friendsRepo, chatsRepo);
        usersController = new UsersController(usersRepo, friendsRequestRepo, friendsRepo);
    }

    @Test
    void searchUsersBySubstring() {
        List<User> usersList = new ArrayList<>();
        usersList.add(new User(1L,"Hugo", "Gomes", "zezoca11"));
        usersList.add(new User(2L, "Ze", "Cotrim", "profjam3"));
        usersList.add(new User(3L, "Mano", "Zezoca>", "zenabo"));
        usersList.get(0).setUid("123456789111");
        usersList.get(1).setUid("223456789111");
        usersList.get(2).setUid("323456789111");
        String authUserToken = "Bearer " + JwtTokenUtil.generateToken(usersList.get(0));
        String searchTerm = "zez";

        when(usersRepo.findByUserOrName(searchTerm)).thenReturn(usersList);
        when(usersRepo.findByUid(usersList.get(0).getUid())).thenReturn(java.util.Optional.ofNullable(usersList.get(0)));

        List<User> expected = new ArrayList<>();
        expected.add(usersList.get(1));
        expected.add(usersList.get(2));

        ResponseEntity<SearchUserResponse> queryResult = usersController.searchUser(searchTerm, authUserToken);
        assertEquals(HttpStatus.OK, queryResult.getStatusCode());
        assertEquals(expected, Objects.requireNonNull(queryResult.getBody()).getSearchedUsers());
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

        ResponseEntity<SearchUserResponse> queryResult = usersController.searchUser(searchTerm, authUserToken);
        assertEquals(HttpStatus.OK, queryResult.getStatusCode());
        assertEquals(0, Objects.requireNonNull(queryResult.getBody()).getSearchedUsers().size());
    }

    @Test
    void getUserDataWithValidAuthToken() {
        User user = new User(1L,"Hugo", "Gomes", "zezoca11");
        user.setUid("123123123123");
        String authUserToken = "Bearer " + JwtTokenUtil.generateToken(user);

        when(usersRepo.findByUid(user.getUid())).thenReturn(java.util.Optional.of(user));
        when(friendsRepo.countFriendsByUser1OrUser2(user, user)).thenReturn(1);

        ResponseEntity<UserData> queryResult = usersController.getUserData(authUserToken);

        assertEquals(HttpStatus.OK, queryResult.getStatusCode());
        assertEquals(user, Objects.requireNonNull(queryResult.getBody()).getUser());
        assertEquals(1, queryResult.getBody().getFriendsCount());
    }

    @Test
    void dontGetUserDataWithInvalidAuthToken() {
        User user = new User(1L,"Hugo", "Gomes", "zezoca11");
        user.setUid("123123123123");
        String authUserToken = "Bearer " + JwtTokenUtil.generateToken(user) + "das";

        when(usersRepo.findByUid(user.getUid())).thenReturn(java.util.Optional.of(user));
        when(friendsRepo.countFriendsByUser1OrUser2(user, user)).thenReturn(1);

        ResponseEntity<UserData> queryResult = usersController.getUserData(authUserToken);

        assertEquals(HttpStatus.BAD_REQUEST, queryResult.getStatusCode());
        assertNull(Objects.requireNonNull(queryResult.getBody()).getUser());
        assertEquals(0, queryResult.getBody().getFriendsCount());
    }

    @Test
    void succeedUpdatingProfileWithImage() throws JsonProcessingException {
        User realUser = new User(1L,"Hugo", "Gomes", "zezoca11");
        realUser.setUid("123123123123");
        String authUserToken = "Bearer " + JwtTokenUtil.generateToken(realUser);
        User updatedUser = new User(1L, "Hugo", "Gomes", "ugomes11");
        realUser.setUid("123123123123");
        ObjectMapper objectMapper = new ObjectMapper();

        String encodedUser = objectMapper.writeValueAsString(updatedUser);
        MockMultipartFile file = new MockMultipartFile("file", "orig", null, "bar".getBytes());

        when(usersRepo.findByUid(realUser.getUid())).thenReturn(java.util.Optional.of(realUser));

        ResponseEntity<Boolean> queryResult = usersController.updateUser(authUserToken, file, encodedUser);

        assertEquals(HttpStatus.OK, queryResult.getStatusCode());
        assertTrue(queryResult.getBody());
    }

    @Test
    void succeedUpdatingProfileWithoutImage() throws JsonProcessingException {
        User realUser = new User(1L,"Hugo", "Gomes", "zezoca11");
        realUser.setUid("123123123123");
        String authUserToken = "Bearer " + JwtTokenUtil.generateToken(realUser);
        User updatedUser = new User(1L, "Hugo", "Gomes", "ugomes11");
        realUser.setUid("123123123123");
        ObjectMapper objectMapper = new ObjectMapper();

        String encodedUser = objectMapper.writeValueAsString(updatedUser);
        MockMultipartFile file = new MockMultipartFile("file", "orig", null, "".getBytes());

        when(usersRepo.findByUid(realUser.getUid())).thenReturn(java.util.Optional.of(realUser));

        ResponseEntity<Boolean> queryResult = usersController.updateUser(authUserToken, file, encodedUser);

        assertEquals(HttpStatus.OK, queryResult.getStatusCode());
        assertTrue(queryResult.getBody());
    }

    @Test
    void failUpdatingProfileByWrongJSONString() {
        User realUser = new User(1L,"Hugo", "Gomes", "zezoca11");
        realUser.setUid("123123123123");
        String authUserToken = "Bearer " + JwtTokenUtil.generateToken(realUser);
        User updatedUser = new User(1L, "Hugo", "Gomes", "ugomes11");
        realUser.setUid("123123123123");
        ObjectMapper objectMapper = new ObjectMapper();

        String encodedUser = null;
        try {
            encodedUser = objectMapper.writeValueAsString(updatedUser);
            encodedUser = encodedUser.substring(0, encodedUser.length() / 2);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        MockMultipartFile file = new MockMultipartFile("file", "orig", null, "".getBytes());

        when(usersRepo.findByUid(realUser.getUid())).thenReturn(java.util.Optional.of(realUser));

        ResponseEntity<Boolean> queryResult = usersController.updateUser(authUserToken, file, encodedUser);

        assertEquals(HttpStatus.BAD_REQUEST, queryResult.getStatusCode());
        assertFalse(queryResult.getBody());
    }

    @Test
    void failUpdatingProfileByWrongToken() {
        User realUser = new User(1L,"Hugo", "Gomes", "zezoca11");
        realUser.setUid("123123123123");
        String authUserToken = "Bearer " + JwtTokenUtil.generateToken(realUser) + "sdada";
        User updatedUser = new User(1L, "Hugo", "Gomes", "ugomes11");
        realUser.setUid("123123123123");
        ObjectMapper objectMapper = new ObjectMapper();

        String encodedUser = null;
        try {
            encodedUser = objectMapper.writeValueAsString(updatedUser);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        MockMultipartFile file = new MockMultipartFile("file", "orig", null, "".getBytes());

        when(usersRepo.findByUid(realUser.getUid())).thenReturn(java.util.Optional.of(realUser));
        ResponseEntity<Boolean> queryResult = usersController.updateUser(authUserToken, file, encodedUser);

        assertEquals(HttpStatus.BAD_REQUEST, queryResult.getStatusCode());
        assertFalse(queryResult.getBody());
    }



}
