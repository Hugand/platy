package com.ugomes.webchat;

import com.ugomes.webchat.Controllers.Rest.FriendsController;
import com.ugomes.webchat.Utils.JwtTokenUtil;
import com.ugomes.webchat.models.Friends;
import com.ugomes.webchat.models.FriendsRequests;
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
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.Instant;
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
    private final ChatsRepo chatsRepo = Mockito.mock(ChatsRepo.class);

    private FriendsController friendsController;

    @BeforeEach
    void initUseCase() {
        friendsController = new FriendsController(usersRepo, friendsRequestRepo, friendsRepo, chatsRepo);
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

        assertEquals(HttpStatus.OK, queryResult.getStatusCode());
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

        assertEquals(HttpStatus.BAD_REQUEST, queryResult.getStatusCode());
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

        assertEquals(HttpStatus.BAD_REQUEST, queryResult.getStatusCode());
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

        assertEquals(HttpStatus.BAD_REQUEST, queryResult.getStatusCode());
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
        assertEquals(HttpStatus.OK, res.getStatusCode());
        assertEquals("success", Objects.requireNonNull(res.getBody()).get("status"));
    }

    @Test
    void cancelExistingFriendRequestByAuthUserId() {
        User authenticatedUser = new User(1L, "Hugo", "Gomes", "ugomes");
        authenticatedUser.setUid("123456789111");
        String authUserToken = "Bearer " + JwtTokenUtil.generateToken(authenticatedUser);

        when(usersRepo.findByUid(authenticatedUser.getUid())).thenReturn(Optional.of(authenticatedUser));
        ResponseEntity<Map<String, String>> res = friendsController.cancelFriendRequest(authUserToken, authenticatedUser.getId());

        assertEquals(HttpStatus.BAD_REQUEST, res.getStatusCode());
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

        assertEquals(HttpStatus.OK, queryResponse.getStatusCode());
        assertEquals(friendsRequests, queryResponse.getBody());
    }

    @Test
    void failToGetFriendRequestsByDestinyUserWithWrongToken() {
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

        assertEquals(HttpStatus.BAD_REQUEST, queryResponse.getStatusCode());
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

        assertEquals(HttpStatus.OK, resp.getStatusCode());
        assertEquals("success", Objects.requireNonNull(resp.getBody()).get("status"));
        assertTrue(resp.getBody().containsKey("savedFriend"));
    }

    @Test
    void dontAcceptNonExistingFriendRequest() {
        User authenticatedUser = new User(1L, "Hugo", "Gomes", "ugomes");
        authenticatedUser.setUid("123456789111");

        ResponseEntity<Map<String, Object>> resp = friendsController.acceptFriendRequest(2L);

        assertEquals(HttpStatus.BAD_REQUEST, resp.getStatusCode());
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

        assertEquals(HttpStatus.BAD_REQUEST, resp.getStatusCode());
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

        assertEquals(HttpStatus.BAD_REQUEST, queryResult.getStatusCode());
        assertEquals("failed", Objects.requireNonNull(queryResult.getBody()).get("status"));
    }

    @Test
    void succeedToGetFriendsList() {
        User authenticatedUser = new User(1L, "Hugo", "Gomes", "ugomes");
        authenticatedUser.setUid("123456789111");
        User user2 = new User(2L, "Johny", "Bravo", "strong_blonde");
        User user3 = new User(3L, "Mano", "Zezoca", "zenabo");
        User user4 = new User(4L, "Mano", "Bro", "manobro_drenado");
        String authUserToken = "Bearer " + JwtTokenUtil.generateToken(authenticatedUser);
        List<Friends> friendsList = new ArrayList<>();
        friendsList.add(new Friends(1L, authenticatedUser, user2, Clock.systemUTC().instant()));
        friendsList.add(new Friends(2L, user3, authenticatedUser, Clock.systemUTC().instant()));
        friendsList.add(new Friends(3L, user4, authenticatedUser, Clock.systemUTC().instant()));

        List<User> friendsUserList = new ArrayList<>();
        friendsUserList.add(user2);
        friendsUserList.add(user3);
        friendsUserList.add(user4);


        when(usersRepo.findByUid(authenticatedUser.getUid())).thenReturn(Optional.of(authenticatedUser));
        when(friendsRepo.findFriendsByUser(authenticatedUser)).thenReturn(friendsList);

        ResponseEntity<List<User>> queryResult = friendsController.getFriendsList(authUserToken);

        assertEquals(HttpStatus.OK, queryResult.getStatusCode());
        assertEquals(friendsUserList.size(), Objects.requireNonNull(queryResult.getBody()).size());
        assertEquals(friendsUserList, Objects.requireNonNull(queryResult.getBody()));
    }

    @Test
    void failToGetFriendsListByWrongToken() {
        User authenticatedUser = new User(1L, "Hugo", "Gomes", "ugomes");
        authenticatedUser.setUid("123456789111");
        User user2 = new User(2L, "Johny", "Bravo", "strong_blonde");
        User user3 = new User(3L, "Mano", "Zezoca", "zenabo");
        User user4 = new User(4L, "Mano", "Bro", "manobro_drenado");
        String authUserToken = "Bearer " + JwtTokenUtil.generateToken(authenticatedUser) + "dsada";
        List<Friends> friendsList = new ArrayList<>();
        friendsList.add(new Friends(1L, authenticatedUser, user2, Clock.systemUTC().instant()));
        friendsList.add(new Friends(2L, user3, authenticatedUser, Clock.systemUTC().instant()));
        friendsList.add(new Friends(3L, user4, authenticatedUser, Clock.systemUTC().instant()));

        List<User> friendsUserList = new ArrayList<>();

        when(usersRepo.findByUid(authenticatedUser.getUid())).thenReturn(Optional.of(authenticatedUser));
        when(friendsRepo.findFriendsByUser(authenticatedUser)).thenReturn(friendsList);

        ResponseEntity<List<User>> queryResult = friendsController.getFriendsList(authUserToken);

        assertEquals(HttpStatus.BAD_REQUEST, queryResult.getStatusCode());
        assertEquals(0, Objects.requireNonNull(queryResult.getBody()).size());
        assertEquals(friendsUserList, Objects.requireNonNull(queryResult.getBody()));
    }

    @Test
    void getCorrectFriendship() {
        User authenticatedUser = new User(1L, "Hugo", "Gomes", "ugomes");
        authenticatedUser.setUid("123456789111");
        User user2 = new User(2L, "Johny", "Bravo", "strong_blonde");
        String authUserToken = "Bearer " + JwtTokenUtil.generateToken(authenticatedUser);
        Friends friendship = new Friends(1L, authenticatedUser, user2, Instant.now());

        when(usersRepo.findByUid(authenticatedUser.getUid())).thenReturn(Optional.of(authenticatedUser));
        when(usersRepo.findById(2L)).thenReturn(Optional.of(user2));
        when(friendsRepo.findFriendsByUser1AndUser2(authenticatedUser, user2)).thenReturn(Optional.of(friendship));

        ResponseEntity<Optional<Friends>> queryResult = friendsController.getFriendship(authUserToken, 2L);

        assertEquals(HttpStatus.OK, queryResult.getStatusCode());
        assertTrue(Objects.requireNonNull(queryResult.getBody()).isPresent());
        assertEquals(friendship, queryResult.getBody().get());
    }

    @Test
    void failToGetFriendshipByWrongToken() {
        User authenticatedUser = new User(1L, "Hugo", "Gomes", "ugomes");
        authenticatedUser.setUid("123456789111");
        User user2 = new User(2L, "Johny", "Bravo", "strong_blonde");
        String authUserToken = "Bearer " + JwtTokenUtil.generateToken(authenticatedUser) + "daishdias";
        Friends friendship = new Friends(1L, authenticatedUser, user2, Instant.now());

        when(usersRepo.findByUid(authenticatedUser.getUid())).thenReturn(Optional.of(authenticatedUser));
        when(usersRepo.findById(2L)).thenReturn(Optional.of(user2));
        when(friendsRepo.findFriendsByUser1AndUser2(authenticatedUser, user2)).thenReturn(Optional.of(friendship));

        ResponseEntity<Optional<Friends>> queryResult = friendsController.getFriendship(authUserToken, 2L);

        assertEquals(HttpStatus.BAD_REQUEST, queryResult.getStatusCode());
        assertTrue(Objects.requireNonNull(queryResult.getBody()).isEmpty());
    }

    @Test
    void failToGetFriendshipByWrongFriendId() {
        User authenticatedUser = new User(1L, "Hugo", "Gomes", "ugomes");
        authenticatedUser.setUid("123456789111");
        User user2 = new User(2L, "Johny", "Bravo", "strong_blonde");
        String authUserToken = "Bearer " + JwtTokenUtil.generateToken(authenticatedUser);
        Friends friendship = new Friends(1L, authenticatedUser, user2, Instant.now());

        when(usersRepo.findByUid(authenticatedUser.getUid())).thenReturn(Optional.of(authenticatedUser));
        when(usersRepo.findById(2L)).thenReturn(Optional.of(user2));
        when(friendsRepo.findFriendsByUser1AndUser2(authenticatedUser, user2)).thenReturn(Optional.of(friendship));

        ResponseEntity<Optional<Friends>> queryResult = friendsController.getFriendship(authUserToken, 3L);

        assertEquals(HttpStatus.BAD_REQUEST, queryResult.getStatusCode());
        assertTrue(Objects.requireNonNull(queryResult.getBody()).isEmpty());
    }

    @Test
    void getCorrectSearchFriends() {
        User authenticatedUser = new User(1L, "Hugo", "Gomes", "ugomes");
        authenticatedUser.setUid("123456789111");
        User user2 = new User(2L, "Johny", "Bravo", "strong_blonde");
        User user3 = new User(3L, "Mano", "Zezoca", "zenabo");
        User user4 = new User(4L, "Mano", "Bro", "manobro_drenado");
        String authUserToken = "Bearer " + JwtTokenUtil.generateToken(authenticatedUser);
        List<Friends> friendshipList = new ArrayList<>();
        friendshipList.add(new Friends(1L, authenticatedUser, user2, Instant.now()));
        friendshipList.add(new Friends(1L, authenticatedUser, user3, Instant.now()));
        friendshipList.add(new Friends(1L, authenticatedUser, user4, Instant.now()));

        List<User> expectedResult = new ArrayList<>();
        expectedResult.add(user3);
        expectedResult.add(user4);

        when(usersRepo.findByUid(authenticatedUser.getUid())).thenReturn(Optional.of(authenticatedUser));
        when(friendsRepo.findFriendsByUser(authenticatedUser)).thenReturn(friendshipList);

        ResponseEntity<List<User>> queryResult = friendsController.searchFriends(authUserToken, "na");

        assertEquals(HttpStatus.OK, queryResult.getStatusCode());
        assertEquals(expectedResult, queryResult.getBody());
    }

    @Test
    void failSearchingFriendsByWrongToken() {
        User authenticatedUser = new User(1L, "Hugo", "Gomes", "ugomes");
        authenticatedUser.setUid("123456789111");
        User user2 = new User(2L, "Johny", "Bravo", "strong_blonde");
        User user3 = new User(3L, "Mano", "Zezoca", "zenabo");
        User user4 = new User(4L, "Mano", "Bro", "manobro_drenado");
        String authUserToken = "Bearer " + JwtTokenUtil.generateToken(authenticatedUser) + "dasd";
        List<Friends> friendshipList = new ArrayList<>();
        friendshipList.add(new Friends(1L, authenticatedUser, user2, Instant.now()));
        friendshipList.add(new Friends(1L, authenticatedUser, user3, Instant.now()));
        friendshipList.add(new Friends(1L, authenticatedUser, user4, Instant.now()));

        when(usersRepo.findByUid(authenticatedUser.getUid())).thenReturn(Optional.of(authenticatedUser));
        when(friendsRepo.findFriendsByUser(authenticatedUser)).thenReturn(friendshipList);

        ResponseEntity<List<User>> queryResult = friendsController.searchFriends(authUserToken, "na");

        assertEquals(HttpStatus.BAD_REQUEST, queryResult.getStatusCode());
        assertTrue(Objects.requireNonNull(queryResult.getBody()).isEmpty());
    }

    @Test
    void getSearchFriendsByEmptySearchTerm() {
        User authenticatedUser = new User(1L, "Hugo", "Gomes", "ugomes");
        authenticatedUser.setUid("123456789111");
        User user2 = new User(2L, "Johny", "Bravo", "strong_blonde");
        User user3 = new User(3L, "Mano", "Zezoca", "zenabo");
        User user4 = new User(4L, "Mano", "Bro", "manobro_drenado");
        String authUserToken = "Bearer " + JwtTokenUtil.generateToken(authenticatedUser);
        List<Friends> friendshipList = new ArrayList<>();
        friendshipList.add(new Friends(1L, authenticatedUser, user2, Instant.now()));
        friendshipList.add(new Friends(1L, authenticatedUser, user3, Instant.now()));
        friendshipList.add(new Friends(1L, authenticatedUser, user4, Instant.now()));

        when(usersRepo.findByUid(authenticatedUser.getUid())).thenReturn(Optional.of(authenticatedUser));
        when(friendsRepo.findFriendsByUser(authenticatedUser)).thenReturn(friendshipList);

        ResponseEntity<List<User>> queryResult = friendsController.searchFriends(authUserToken, "");

        assertEquals(HttpStatus.OK, queryResult.getStatusCode());
        assertEquals(friendshipList.size(), Objects.requireNonNull(queryResult.getBody()).size());
    }

}
