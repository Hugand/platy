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

import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.AdditionalAnswers.returnsFirstArg;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
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

        ResponseEntity<Map<String, String>> queryResult = friendsController.sendFriendRequest(authUserToken, userToBefriend.getId());

        assertEquals("success", queryResult.getBody().get("status"));
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
        when(friendsRequestRepo.findByOriginOrDestinyId(userToBefriend.getId())).thenReturn(Collections.singletonList(existentFriendRequest));
        when(friendsRequestRepo.save(any(FriendsRequests.class))).then(returnsFirstArg());

        ResponseEntity<Map<String, String>> queryResult = friendsController.sendFriendRequest(authUserToken, userToBefriend.getId());

        assertEquals("failed", queryResult.getBody().get("status"));
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

        ResponseEntity<Map<String, String>> queryResult = friendsController.sendFriendRequest(authUserToken, 3L);

        assertEquals("failed", queryResult.getBody().get("status"));
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

        ResponseEntity<Map<String, String>> queryResult = friendsController.sendFriendRequest(authUserToken, userToBefriend.getId());

        assertEquals("failed", queryResult.getBody().get("status"));
    }

    @Test
    void cancelExistingFriendRequest() {
        User authenticatedUser = new User(1L, "Hugo", "Gomes", "ugomes");
        User userToBefriend = new User(2L, "Johny", "Bravo", "strong_blonde");
        authenticatedUser.setUid("123456789111");
        String authUserToken = "Bearer " + JwtTokenUtil.generateToken(authenticatedUser);

        when(usersRepo.findByUid(authenticatedUser.getUid())).thenReturn(Optional.of(authenticatedUser));
        ResponseEntity<Map<String, String>> res = friendsController.cancelFriendRequest(authUserToken, userToBefriend.getId());

        verify(friendsRequestRepo).deleteFriendsRequestsByUsersId(authenticatedUser.getId(), userToBefriend.getId());
        assertEquals("success", Objects.requireNonNull(res.getBody()).get("status"));
    }

    @Test
    void cancelExistingFriendRequestByDestinyUserId() {
        User authenticatedUser = new User(1L, "Hugo", "Gomes", "ugomes");
        User userToBefriend = new User(2L, "Johny", "Bravo", "strong_blonde");
        authenticatedUser.setUid("123456789111");
        String authUserToken = "Bearer " + JwtTokenUtil.generateToken(authenticatedUser);

        when(usersRepo.findByUid(authenticatedUser.getUid())).thenReturn(Optional.of(authenticatedUser));
        ResponseEntity<Map<String, String>> res = friendsController.cancelFriendRequest(authUserToken, authenticatedUser.getId());

        assertEquals("failed", Objects.requireNonNull(res.getBody()).get("status"));
    }

    @Test
    void getFriendRequestsByDestinyUser() {
        User authenticatedUser = new User(1L, "Hugo", "Gomes", "ugomes");
        User user2 = new User(2L, "Johny", "Bravo", "strong_blonde");
        User user3 = new User(3L, "Mano", "Zezoca", "zenabo");
        User user4 = new User(3L, "Mano", "Bro", "manobro_drenado");
        authenticatedUser.setUid("123456789111");
        String authUserToken = "Bearer " + JwtTokenUtil.generateToken(authenticatedUser);

        List<FriendsRequests> friendsRequests = new ArrayList<>();
        friendsRequests.add(new FriendsRequests(1L, user2, authenticatedUser));
        friendsRequests.add(new FriendsRequests(2L, user3, authenticatedUser));
        friendsRequests.add(new FriendsRequests(3L, user4, authenticatedUser));

        when(friendsRequestRepo.findFriendsRequestsByRequestDestinyUser(authenticatedUser)).thenReturn(friendsRequests);
        when(usersRepo.findByUid(authenticatedUser.getUid())).thenReturn(Optional.of(authenticatedUser));

        ResponseEntity<List<FriendsRequests>> queryResponse = friendsController.getFriendsRequestsByDestinyUser(authUserToken);

        assertEquals(friendsRequests, queryResponse.getBody());
    }

    @Test
    void getFriendRequestsByDestinyUserWithWrongToken() {
        User authenticatedUser = new User(1L, "Hugo", "Gomes", "ugomes");
        User user2 = new User(2L, "Johny", "Bravo", "strong_blonde");
        User user3 = new User(3L, "Mano", "Zezoca", "zenabo");
        User user4 = new User(3L, "Mano", "Bro", "manobro_drenado");
        authenticatedUser.setUid("123456789111");
        String authUserToken = "Bearer " + JwtTokenUtil.generateToken(authenticatedUser) + "a12b";

        List<FriendsRequests> friendsRequests = new ArrayList<>();
        friendsRequests.add(new FriendsRequests(1L, user2, authenticatedUser));
        friendsRequests.add(new FriendsRequests(2L, user3, authenticatedUser));
        friendsRequests.add(new FriendsRequests(3L, user4, authenticatedUser));

        when(friendsRequestRepo.findFriendsRequestsByRequestDestinyUser(authenticatedUser)).thenReturn(friendsRequests);
        when(usersRepo.findByUid(authenticatedUser.getUid())).thenReturn(Optional.of(authenticatedUser));

        ResponseEntity<List<FriendsRequests>> queryResponse = friendsController.getFriendsRequestsByDestinyUser(authUserToken);

        assertEquals(0, queryResponse.getBody().size());
    }
}
