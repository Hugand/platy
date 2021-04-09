package com.ugomes.webchat;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ugomes.webchat.Controllers.Rest.ChatsController;
import com.ugomes.webchat.Utils.JwtTokenUtil;
import com.ugomes.webchat.models.*;
import com.ugomes.webchat.repositories.ChatsRepo;
import com.ugomes.webchat.repositories.FriendsRepo;
import com.ugomes.webchat.repositories.FriendsRequestRepo;
import com.ugomes.webchat.repositories.UsersRepo;
import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.AdditionalAnswers.returnsFirstArg;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@Service
public class ChatsTests {
    private final UsersRepo usersRepo = Mockito.mock(UsersRepo.class);
    private final FriendsRequestRepo friendsRequestRepo = Mockito.mock(FriendsRequestRepo.class);
    private final FriendsRepo friendsRepo = Mockito.mock(FriendsRepo.class);
    private final ChatsRepo chatsRepo = Mockito.mock(ChatsRepo.class);

    private ChatsController chatsController;

    public ChatsTests() {
        chatsController = new ChatsController(usersRepo, friendsRequestRepo, friendsRepo, chatsRepo);
    }

    @Test
    public void getCorrectChatsFromFriendships() {
        User authenticatedUser = new User(1L, "Hugo", "Gomes", "ugomes");
        User friend = new User(2L, "Johny", "Bravo", "strong_blonde");
        authenticatedUser.setUid("123456789111");

        Friends friendship = new Friends(1L, authenticatedUser, friend, Instant.now());

        List<Chat> expectedChatsList = new ArrayList();
        expectedChatsList.add(new Chat(1L, authenticatedUser, friendship, "hello"));
        expectedChatsList.add(new Chat(2L, friend, friendship, "hello there"));
        expectedChatsList.add(new Chat(3L, authenticatedUser, friendship, "General Kenobi!"));

        when(usersRepo.findByUid(authenticatedUser.getUid())).thenReturn(Optional.of(authenticatedUser));
        when(chatsRepo.findByFriendshipOrderByTimestampDesc(friendship)).thenReturn(expectedChatsList);

        ResponseEntity<List<Chat>> queryResult = chatsController.getChatFromFriendship(friendship.getId());

        assertEquals(HttpStatus.OK, queryResult.getStatusCode());
        assertNotNull(queryResult.getBody());
        assertEquals(expectedChatsList, queryResult.getBody());
    }

    @Test
    public void failGettingChatsFromFriendshipByNegativeFriendshipId() {
        User authenticatedUser = new User(1L, "Hugo", "Gomes", "ugomes");
        User friend = new User(2L, "Johny", "Bravo", "strong_blonde");
        authenticatedUser.setUid("123456789111");

        Friends friendship = new Friends(1L, authenticatedUser, friend, Instant.now());

        List<Chat> expectedChatsList = new ArrayList();
        expectedChatsList.add(new Chat(1L, authenticatedUser, friendship, "hello"));
        expectedChatsList.add(new Chat(2L, friend, friendship, "hello there"));
        expectedChatsList.add(new Chat(3L, authenticatedUser, friendship, "General Kenobi!"));

        when(usersRepo.findByUid(authenticatedUser.getUid())).thenReturn(Optional.of(authenticatedUser));
        when(chatsRepo.findByFriendshipOrderByTimestampDesc(friendship)).thenReturn(expectedChatsList);

        ResponseEntity<List<Chat>> queryResult = chatsController.getChatFromFriendship(-1L);

        assertEquals(HttpStatus.BAD_REQUEST, queryResult.getStatusCode());
        assertNotNull(queryResult.getBody());
        assertEquals(0, queryResult.getBody().size());
    }

    @Test
    public void getEmptyChatsFromFriendshipsByInexistingFriendship() {
        User authenticatedUser = new User(1L, "Hugo", "Gomes", "ugomes");
        User friend = new User(2L, "Johny", "Bravo", "strong_blonde");
        authenticatedUser.setUid("123456789111");

        Friends friendship = new Friends(1L, authenticatedUser, friend, Instant.now());

        List<Chat> expectedChatsList = new ArrayList<>();
        expectedChatsList.add(new Chat(1L, authenticatedUser, friendship, "hello"));
        expectedChatsList.add(new Chat(2L, friend, friendship, "hello there"));
        expectedChatsList.add(new Chat(3L, authenticatedUser, friendship, "General Kenobi!"));

        when(usersRepo.findByUid(authenticatedUser.getUid())).thenReturn(Optional.of(authenticatedUser));
        when(chatsRepo.findByFriendshipOrderByTimestampDesc(friendship)).thenReturn(expectedChatsList);

        ResponseEntity<List<Chat>> queryResult = chatsController.getChatFromFriendship(3L);

        assertEquals(HttpStatus.OK, queryResult.getStatusCode());
        assertNotNull(queryResult.getBody());
        assertEquals(0, queryResult.getBody().size());
    }

    @Test
    public void successPersistingNewChat() throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        User originUser = new User(1L, "Hugo", "Gomes", "ugomes");
        User destinyUser = new User(2L, "Steve", "Rogers", "cap_im_erica");
        Friends friendship = new Friends(1L, originUser, destinyUser, Instant.now());

        ChatPreview chatPreview = new ChatPreview(
                originUser.getId(), friendship.getId(), "On your left", Timestamp.from(Instant.now()));
        Chat expectedChat = new Chat(originUser, friendship, "On your left", Timestamp.from(Instant.now()));

        String chatPreviewJsonString = objectMapper.writeValueAsString(chatPreview);

        when(usersRepo.findById(originUser.getId())).thenReturn(Optional.of(originUser));
        when(friendsRepo.findById(friendship.getId())).thenReturn(Optional.of(friendship));
        when(chatsRepo.save(any(Chat.class))).then(returnsFirstArg());

        ResponseEntity<Optional<Chat>> queryResult = chatsController.persistChat(chatPreviewJsonString);

        assertEquals(HttpStatus.OK, queryResult.getStatusCode());
        assertNotNull(queryResult.getBody());
        assertEquals(expectedChat.toString(), queryResult.getBody().get().toString());
    }

    @Test
    public void failPersistingNewChatByWrongUserOriginId() throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        User originUser = new User(1L, "Hugo", "Gomes", "ugomes");
        User destinyUser = new User(2L, "Steve", "Rogers", "cap_im_erica");
        Friends friendship = new Friends(1L, originUser, destinyUser, Instant.now());

        ChatPreview chatPreview = new ChatPreview(
                originUser.getId()+10L, friendship.getId(), "On your left", Timestamp.from(Instant.now()));

        String chatPreviewJsonString = objectMapper.writeValueAsString(chatPreview);

        when(usersRepo.findById(originUser.getId())).thenReturn(Optional.of(originUser));
        when(friendsRepo.findById(friendship.getId())).thenReturn(Optional.of(friendship));
        when(chatsRepo.save(any(Chat.class))).then(returnsFirstArg());

        ResponseEntity<Optional<Chat>> queryResult = chatsController.persistChat(chatPreviewJsonString);

        assertEquals(HttpStatus.BAD_REQUEST, queryResult.getStatusCode());
        assertNotNull(queryResult.getBody());
        assertTrue(queryResult.getBody().isEmpty());
    }

    @Test
    public void failPersistingNewChatByWrongUserDestinyId() throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        User originUser = new User(1L, "Hugo", "Gomes", "ugomes");
        User destinyUser = new User(2L, "Steve", "Rogers", "cap_im_erica");
        Friends friendship = new Friends(1L, originUser, destinyUser, Instant.now());

        ChatPreview chatPreview = new ChatPreview(
                originUser.getId(), friendship.getId()+10L, "On your left", Timestamp.from(Instant.now()));

        String chatPreviewJsonString = objectMapper.writeValueAsString(chatPreview);

        when(usersRepo.findById(originUser.getId())).thenReturn(Optional.of(originUser));
        when(friendsRepo.findById(friendship.getId())).thenReturn(Optional.of(friendship));
        when(chatsRepo.save(any(Chat.class))).then(returnsFirstArg());

        ResponseEntity<Optional<Chat>> queryResult = chatsController.persistChat(chatPreviewJsonString);

        assertEquals(HttpStatus.BAD_REQUEST, queryResult.getStatusCode());
        assertNotNull(queryResult.getBody());
        assertTrue(queryResult.getBody().isEmpty());
    }

    @Test
    public void failPersistingNewChatByWrongChatPreviewJSONString() throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        User originUser = new User(1L, "Hugo", "Gomes", "ugomes");
        User destinyUser = new User(2L, "Steve", "Rogers", "cap_im_erica");
        Friends friendship = new Friends(1L, originUser, destinyUser, Instant.now());

        ChatPreview chatPreview = new ChatPreview(
                originUser.getId(), friendship.getId(), "On your left", Timestamp.from(Instant.now()));

        String chatPreviewJsonString = objectMapper.writeValueAsString(chatPreview).substring(4);

        when(usersRepo.findById(originUser.getId())).thenReturn(Optional.of(originUser));
        when(friendsRepo.findById(friendship.getId())).thenReturn(Optional.of(friendship));
        when(chatsRepo.save(any(Chat.class))).then(returnsFirstArg());

        ResponseEntity<Optional<Chat>> queryResult = chatsController.persistChat(chatPreviewJsonString);

        assertEquals(HttpStatus.BAD_REQUEST, queryResult.getStatusCode());
        assertNotNull(queryResult.getBody());
        assertTrue(queryResult.getBody().isEmpty());
    }

    @Test
    public void getSuccessfulyRecentChatsList() {
        User authenticatedUser = new User(1L, "Hugo", "Gomes", "ugomes");
        authenticatedUser.setUid("123456789111");
        User friend = new User(2L, "Johny", "Bravo", "strong_blonde");
        User friend2 = new User(3L, "Steve", "Rogers", "cap_im_erica");
        String authUserToken = "Bearer " + JwtTokenUtil.generateToken(authenticatedUser);

        Friends friendship1 = new Friends(1L, authenticatedUser, friend, Instant.now());
        Friends friendship2 = new Friends(2L, friend2, authenticatedUser, Instant.now());

        List<Chat> recentChats = new ArrayList<>();
        recentChats.add(new Chat(4L, friend2, friendship2, "chat f23"));
        recentChats.add(new Chat(6L, authenticatedUser, friendship1, "chat f13"));

        List<RecentChatItem> expectedResult = new ArrayList<>();
        expectedResult.add(new RecentChatItem(friend2, friendship2.getId(), "chat f23", null));
        expectedResult.add(new RecentChatItem(friend, friendship1.getId(), "chat f13", null));

        when(usersRepo.findByUid(authenticatedUser.getUid())).thenReturn(Optional.of(authenticatedUser));
        when(chatsRepo.findChatByUserInFriendshipOrderByDesc(authenticatedUser)).thenReturn(recentChats);

        ResponseEntity<List<RecentChatItem>> queryResult = chatsController.getLatestChats(authUserToken);

        assertEquals(HttpStatus.OK, queryResult.getStatusCode());
        assertNotNull(queryResult.getBody());
        assertEquals(expectedResult, queryResult.getBody());
    }

    @Test
    public void failToGetRecentChatsListByWrongToken() {
        User authenticatedUser = new User(1L, "Hugo", "Gomes", "ugomes");
        authenticatedUser.setUid("123456789111");
        User friend = new User(2L, "Johny", "Bravo", "strong_blonde");
        User friend2 = new User(3L, "Steve", "Rogers", "cap_im_erica");
        String authUserToken = "Bearer " + JwtTokenUtil.generateToken(authenticatedUser) + "dasdias";

        Friends friendship1 = new Friends(1L, authenticatedUser, friend, Instant.now());
        Friends friendship2 = new Friends(2L, friend2, authenticatedUser, Instant.now());

        List<Chat> recentChats = new ArrayList<>();
        recentChats.add(new Chat(4L, friend2, friendship2, "chat f23"));
        recentChats.add(new Chat(6L, authenticatedUser, friendship1, "chat f13"));

        List<RecentChatItem> expectedResult = new ArrayList<>();
        expectedResult.add(new RecentChatItem(friend2, friendship2.getId(), "chat f23", null));
        expectedResult.add(new RecentChatItem(friend, friendship1.getId(), "chat f13", null));

        when(usersRepo.findByUid(authenticatedUser.getUid())).thenReturn(Optional.of(authenticatedUser));
        when(chatsRepo.findChatByUserInFriendshipOrderByDesc(authenticatedUser)).thenReturn(recentChats);

        ResponseEntity<List<RecentChatItem>> queryResult = chatsController.getLatestChats(authUserToken);

        assertEquals(HttpStatus.BAD_REQUEST, queryResult.getStatusCode());
        assertNotNull(queryResult.getBody());
        assertEquals(0, queryResult.getBody().size());
    }

    @Test
    public void getSuccessfulyEmptyRecentChatsList() {
        User authenticatedUser = new User(1L, "Hugo", "Gomes", "ugomes");
        authenticatedUser.setUid("123456789111");
        User friend = new User(2L, "Johny", "Bravo", "strong_blonde");
        User friend2 = new User(3L, "Steve", "Rogers", "cap_im_erica");
        String authUserToken = "Bearer " + JwtTokenUtil.generateToken(authenticatedUser);

        List<Chat> recentChats = new ArrayList<>();

        when(usersRepo.findByUid(authenticatedUser.getUid())).thenReturn(Optional.of(authenticatedUser));
        when(chatsRepo.findChatByUserInFriendshipOrderByDesc(authenticatedUser)).thenReturn(recentChats);

        ResponseEntity<List<RecentChatItem>> queryResult = chatsController.getLatestChats(authUserToken);

        assertEquals(HttpStatus.OK, queryResult.getStatusCode());
        assertNotNull(queryResult.getBody());
        assertEquals(0, queryResult.getBody().size());
    }
}
