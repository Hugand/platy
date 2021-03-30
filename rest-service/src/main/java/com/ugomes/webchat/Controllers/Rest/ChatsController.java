package com.ugomes.webchat.Controllers.Rest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ugomes.webchat.Utils.JwtTokenUtil;
import com.ugomes.webchat.models.Chat;
import com.ugomes.webchat.models.ChatPreview;
import com.ugomes.webchat.models.Friends;
import com.ugomes.webchat.models.User;
import com.ugomes.webchat.repositories.ChatsRepo;
import com.ugomes.webchat.repositories.FriendsRepo;
import com.ugomes.webchat.repositories.FriendsRequestRepo;
import com.ugomes.webchat.repositories.UsersRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
public class ChatsController {
    final UsersRepo usersRepo;
    final FriendsRequestRepo friendsRequestRepo;
    final FriendsRepo friendsRepo;
    final ChatsRepo chatsRepo;

    public ChatsController(UsersRepo usersRepo, FriendsRequestRepo friendsRequestRepo, FriendsRepo friendsRepo, ChatsRepo chatsRepo) {
        this.usersRepo = usersRepo;
        this.friendsRequestRepo = friendsRequestRepo;
        this.friendsRepo = friendsRepo;
        this.chatsRepo = chatsRepo;
    }

    @GetMapping("/getChatsFromFriendship")
    public ResponseEntity<List<Chat>> getChatFromFriendship(@RequestParam Long friendshipId) {
        List<Chat> chatsList =  new ArrayList<>(chatsRepo.findByFriendshipOrderByTimestampDesc(new Friends(friendshipId)));
        return ResponseEntity.ok(chatsList);
    }

    @PostMapping("/persistChat")
    public ResponseEntity<Optional<Chat>> persistChat(@RequestBody String chatPreviewStringified) {
        ObjectMapper objectMapper = new ObjectMapper();
        ChatPreview chatPreview;

        try {
            chatPreview = objectMapper.readValue(chatPreviewStringified, ChatPreview.class);
        } catch (JsonProcessingException e) {
            return ResponseEntity.badRequest().body(Optional.empty());
        }

        Optional<User> originUser = usersRepo.findById(chatPreview.getUserOrigin());
        Optional<Friends> friendship = friendsRepo.findById(chatPreview.getFriendshipId());

        if(originUser.isEmpty() || friendship.isEmpty())
            return ResponseEntity.badRequest().body(Optional.empty());

        Chat chatObj = new Chat(
                originUser.get(),
                friendship.get(),
                chatPreview.getMsg(),
                chatPreview.getTimestamp());
        Chat savedChat = chatsRepo.save(chatObj);

        return ResponseEntity.ok(Optional.of(savedChat));
    }
}
