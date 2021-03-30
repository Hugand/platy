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

    private User getUserFromToken(String token) {
        JwtTokenUtil jwtTokenUtil = new JwtTokenUtil();
        token = token.replace("Bearer ", "");
        String authUserUid;
        try {
            authUserUid = jwtTokenUtil.getUidFromToken(token);
            if(authUserUid != null && !authUserUid.isBlank())
                return usersRepo.findByUid(authUserUid).orElse(null);
        } catch (Exception e) {
            return null;
        }
        return null;
    }

    @GetMapping("/getChatsFromFriendship")
    public ResponseEntity<List<Chat>> getChatFromFriendship(@RequestParam Long friendshipId) {
        List<Chat> chatsList =  new ArrayList<>(chatsRepo.findByFriendshipOrderByTimestampDesc(new Friends(friendshipId)));
        System.out.println(chatsList);
        return ResponseEntity.ok(chatsList);
    }

    @PostMapping("/persistChat")
    public ResponseEntity<Chat> persistChat(@RequestBody String chatPreviewStringified) {
        ObjectMapper objectMapper = new ObjectMapper();
        ChatPreview chatPreview;
        System.out.println(chatPreviewStringified);
        try {
            chatPreview = objectMapper.readValue(chatPreviewStringified, ChatPreview.class);
        } catch (JsonProcessingException e) {
            return ResponseEntity.ok(null);
        }
        User originUser = usersRepo.findById(chatPreview.getUserOrigin()).orElse(null);
        Friends friendship = friendsRepo.findById(chatPreview.getFriendshipId()).orElse(null);

        if(originUser == null || friendship == null)
            ResponseEntity.ok(null);

        Chat chatObj = new Chat(
                originUser,
                friendship,
                chatPreview.getMsg(),
                chatPreview.getTimestamp());

        Chat savedChat = chatsRepo.save(chatObj);

        return ResponseEntity.ok(savedChat);
    }
}
