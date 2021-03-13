package com.ugomes.webchat;

import com.ugomes.webchat.Controllers.FriendsController;
import com.ugomes.webchat.Utils.JwtTokenUtil;
import com.ugomes.webchat.models.FriendsRequests;
import com.ugomes.webchat.models.User;
import com.ugomes.webchat.repositories.FriendsRequestRepo;
import com.ugomes.webchat.repositories.UsersRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.AdditionalAnswers.returnsFirstArg;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@Service
public class FriendsTests {
    private final UsersRepo usersRepo = Mockito.mock(UsersRepo.class);
    private final FriendsRequestRepo friendsRequestRepo = Mockito.mock(FriendsRequestRepo.class);

    private FriendsController friendsController;

    @BeforeEach
    void initUseCase() {
        friendsController = new FriendsController(usersRepo, friendsRequestRepo);
    }

    @Test
    void sendNewFriendRequest() {
        User authenticatedUser = new User(1L, "Hugo", "Gomes", "ugomes");
        User userToBefriend = new User(2L, "Johny", "Bravo", "strong_blonde");
        authenticatedUser.setUid("123456789111");
        String authUserToken = "Bearer " + JwtTokenUtil.generateToken(authenticatedUser);

        when(usersRepo.findByUid(authenticatedUser.getUid())).thenReturn(Optional.of(authenticatedUser));
        when(usersRepo.findById(userToBefriend.getId())).thenReturn(Optional.of(userToBefriend));
        when(friendsRequestRepo.save(any(FriendsRequests.class))).then(returnsFirstArg());

        ResponseEntity<String> queryResult = friendsController.sendFriendRequest(authUserToken, userToBefriend.getId());

        assertEquals("success", queryResult.getBody());
    }

    @Test
    void sendAlreadyExistingFriendRequestBySameOriginUser() {
        User authenticatedUser = new User(1L, "Hugo", "Gomes", "ugomes");
        User userToBefriend = new User(2L, "Johny", "Bravo", "strong_blonde");
        authenticatedUser.setUid("123456789111");
        String authUserToken = "Bearer " + JwtTokenUtil.generateToken(authenticatedUser);

        FriendsRequests existentFriendRequest = new FriendsRequests(authenticatedUser, userToBefriend);

        when(usersRepo.findByUid(authenticatedUser.getUid())).thenReturn(Optional.of(authenticatedUser));
        when(usersRepo.findById(userToBefriend.getId())).thenReturn(Optional.of(userToBefriend));
        when(friendsRequestRepo.findByOriginOrDestinyId(userToBefriend.getId())).thenReturn(Optional.of(existentFriendRequest));
        when(friendsRequestRepo.save(any(FriendsRequests.class))).then(returnsFirstArg());

        ResponseEntity<String> queryResult = friendsController.sendFriendRequest(authUserToken, userToBefriend.getId());

        assertEquals("failed", queryResult.getBody());
    }

    @Test
    void sendFriendRequestByGivingWrongId() {
        User authenticatedUser = new User(1L, "Hugo", "Gomes", "ugomes");
        User userToBefriend = new User(2L, "Johny", "Bravo", "strong_blonde");
        authenticatedUser.setUid("123456789111");
        String authUserToken = "Bearer " + JwtTokenUtil.generateToken(authenticatedUser);

        when(usersRepo.findByUid(authenticatedUser.getUid())).thenReturn(Optional.of(authenticatedUser));
        when(usersRepo.findById(userToBefriend.getId())).thenReturn(java.util.Optional.of(userToBefriend));
        when(friendsRequestRepo.save(any(FriendsRequests.class))).then(returnsFirstArg());

        ResponseEntity<String> queryResult = friendsController.sendFriendRequest(authUserToken, 3L);

        assertEquals("failed__", queryResult.getBody());
    }

    @Test
    void sendFriendRequestByGivingWrongToken() {
        User authenticatedUser = new User(1L, "Hugo", "Gomes", "ugomes");
        User userToBefriend = new User(2L, "Johny", "Bravo", "strong_blonde");
        authenticatedUser.setUid("123456789111");
        userToBefriend.setUid("321654987123");
        String authUserToken = "Bearer " + JwtTokenUtil.generateToken(userToBefriend);

        when(usersRepo.findByUid(authenticatedUser.getUid())).thenReturn(Optional.of(authenticatedUser));
        when(usersRepo.findById(userToBefriend.getId())).thenReturn(java.util.Optional.of(userToBefriend));
        when(friendsRequestRepo.save(any(FriendsRequests.class))).then(returnsFirstArg());

        ResponseEntity<String> queryResult = friendsController.sendFriendRequest(authUserToken, userToBefriend.getId());

        assertEquals("failed", queryResult.getBody());
    }

}
