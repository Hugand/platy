package com.ugomes.webchat;

import com.ugomes.webchat.Controllers.FriendsController;
import com.ugomes.webchat.Utils.JwtTokenUtil;
import com.ugomes.webchat.models.Friends;
import com.ugomes.webchat.models.FriendsRequests;
import com.ugomes.webchat.models.User;
import com.ugomes.webchat.repositories.FriendsRepo;
import com.ugomes.webchat.repositories.FriendsRequestRepo;
import com.ugomes.webchat.repositories.UsersRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.AdditionalAnswers.returnsFirstArg;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@Service
public class FriendsTests {
    private final UsersRepo usersRepo = Mockito.mock(UsersRepo.class);
    private final FriendsRequestRepo friendsRequestRepo = Mockito.mock(FriendsRequestRepo.class);
    private final FriendsRepo friendsRepo = Mockito.mock(FriendsRepo.class);

    private FriendsController friendsController;

    @BeforeEach
    void initUseCase() {
        friendsController = new FriendsController(usersRepo, friendsRequestRepo, friendsRepo);
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

        assertEquals("success", Objects.requireNonNull(queryResult.getBody()).get("status"));
    }

    @Test
    void dontSendAlreadyExistingFriendRequestBySameOriginUser() {
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

        assertEquals("failed", Objects.requireNonNull(queryResult.getBody()).get("status"));
    }

    @Test
    void dontSendFriendRequestByGivingWrongId() {
        User authenticatedUser = new User(1L, "Hugo", "Gomes", "ugomes");
        User userToBefriend = new User(2L, "Johny", "Bravo", "strong_blonde");
        authenticatedUser.setUid("123456789111");
        String authUserToken = "Bearer " + JwtTokenUtil.generateToken(authenticatedUser);

        when(usersRepo.findByUid(authenticatedUser.getUid())).thenReturn(Optional.of(authenticatedUser));
        when(usersRepo.findById(userToBefriend.getId())).thenReturn(java.util.Optional.of(userToBefriend));
        when(friendsRequestRepo.save(any(FriendsRequests.class))).then(returnsFirstArg());

        ResponseEntity<Map<String, String>> queryResult = friendsController.sendFriendRequest(authUserToken, 3L);

        assertEquals("failed", Objects.requireNonNull(queryResult.getBody()).get("status"));
    }

    @Test
    void dontSendFriendRequestByGivingWrongToken() {
        User authenticatedUser = new User(1L, "Hugo", "Gomes", "ugomes");
        User userToBefriend = new User(2L, "Johny", "Bravo", "strong_blonde");
        authenticatedUser.setUid("123456789111");
        userToBefriend.setUid("321654987123");
        String authUserToken = "Bearer " + JwtTokenUtil.generateToken(userToBefriend);

        when(usersRepo.findByUid(authenticatedUser.getUid())).thenReturn(Optional.of(authenticatedUser));
        when(usersRepo.findById(userToBefriend.getId())).thenReturn(java.util.Optional.of(userToBefriend));
        when(friendsRequestRepo.save(any(FriendsRequests.class))).then(returnsFirstArg());

        ResponseEntity<Map<String, String>> queryResult = friendsController.sendFriendRequest(authUserToken, userToBefriend.getId());

        assertEquals("failed", Objects.requireNonNull(queryResult.getBody()).get("status"));
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
        User user4 = new User(4L, "Mano", "Bro", "manobro_drenado");
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
        User user4 = new User(4L, "Mano", "Bro", "manobro_drenado");
        authenticatedUser.setUid("123456789111");
        String authUserToken = "Bearer " + JwtTokenUtil.generateToken(authenticatedUser) + "a12b";

        List<FriendsRequests> friendsRequests = new ArrayList<>();
        friendsRequests.add(new FriendsRequests(1L, user2, authenticatedUser));
        friendsRequests.add(new FriendsRequests(2L, user3, authenticatedUser));
        friendsRequests.add(new FriendsRequests(3L, user4, authenticatedUser));

        when(friendsRequestRepo.findFriendsRequestsByRequestDestinyUser(authenticatedUser)).thenReturn(friendsRequests);
        when(usersRepo.findByUid(authenticatedUser.getUid())).thenReturn(Optional.of(authenticatedUser));

        ResponseEntity<List<FriendsRequests>> queryResponse = friendsController.getFriendsRequestsByDestinyUser(authUserToken);

        assertEquals(0, Objects.requireNonNull(queryResponse.getBody()).size());
    }

    @Test
    void acceptExistingFriendRequest() {
        User authenticatedUser = new User(1L, "Hugo", "Gomes", "ugomes");
        User user2 = new User(2L, "Johny", "Bravo", "strong_blonde");
        authenticatedUser.setUid("123456789111");
        FriendsRequests friendsRequests = new FriendsRequests(1L, user2, authenticatedUser);

        when(friendsRequestRepo.findById(1L)).thenReturn(Optional.of(friendsRequests));

        ResponseEntity<Map<String, Object>> resp = friendsController.acceptFriendRequest(1L);

        assertEquals("success", Objects.requireNonNull(resp.getBody()).get("status"));
        assertTrue(resp.getBody().containsKey("savedFriend"));
    }

    @Test
    void dontAcceptNonExistingFriendRequest() {
        User authenticatedUser = new User(1L, "Hugo", "Gomes", "ugomes");
        authenticatedUser.setUid("123456789111");

        ResponseEntity<Map<String, Object>> resp = friendsController.acceptFriendRequest(2L);

        assertEquals("failed", Objects.requireNonNull(resp.getBody()).get("status"));
        assertFalse(resp.getBody().containsKey("savedFriend"));
    }

    @Test
    void dontAcceptFriendRequestIfFriendshipExists() {
        User authenticatedUser = new User(1L, "Hugo", "Gomes", "ugomes");
        authenticatedUser.setUid("123456789111");
        User user2 = new User(2L, "Johny", "Bravo", "strong_blonde");
        FriendsRequests friendsRequests = new FriendsRequests(1L, user2, authenticatedUser);
        Friends existingFriendship = new Friends(authenticatedUser, user2, Clock.systemUTC().instant());

        when(friendsRepo.findFriendsByUser1AndUser2(any(User.class), any(User.class))).thenReturn(Optional.of(existingFriendship));
        when(friendsRequestRepo.findById(1L)).thenReturn(Optional.of(friendsRequests));

        ResponseEntity<Map<String, Object>> resp = friendsController.acceptFriendRequest(1L);

        assertEquals("failed", Objects.requireNonNull(resp.getBody()).get("status"));
        assertFalse(resp.getBody().containsKey("savedFriend"));
    }

    @Test
    void failToSendFriendRequestIfFriendshipExists() {
        User authenticatedUser = new User(1L, "Hugo", "Gomes", "ugomes");
        User userToBefriend = new User(2L, "Johny", "Bravo", "strong_blonde");
        authenticatedUser.setUid("123456789111");
        String authUserToken = "Bearer " + JwtTokenUtil.generateToken(authenticatedUser);
        Friends existingFriendship = new Friends(authenticatedUser, userToBefriend, Clock.systemUTC().instant());

        when(friendsRepo.findFriendsByUser1AndUser2(any(User.class), any(User.class))).thenReturn(Optional.of(existingFriendship));
        when(usersRepo.findByUid(authenticatedUser.getUid())).thenReturn(Optional.of(authenticatedUser));
        when(usersRepo.findById(userToBefriend.getId())).thenReturn(Optional.of(userToBefriend));
        when(friendsRequestRepo.save(any(FriendsRequests.class))).then(returnsFirstArg());

        ResponseEntity<Map<String, String>> queryResult = friendsController.sendFriendRequest(authUserToken, userToBefriend.getId());

        assertEquals("failed", Objects.requireNonNull(queryResult.getBody()).get("status"));
    }
}
