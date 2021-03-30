package com.ugomes.webchat.Controllers.Rest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ugomes.webchat.ApiResponses.UserData;
import com.ugomes.webchat.Utils.JwtTokenUtil;
import com.ugomes.webchat.models.User;
import com.ugomes.webchat.repositories.FriendsRepo;
import com.ugomes.webchat.repositories.FriendsRequestRepo;
import com.ugomes.webchat.repositories.UsersRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@RestController
public class UsersController {
    final UsersRepo usersRepo;
    final FriendsRequestRepo friendsRequestRepo;
    final FriendsRepo friendsRepo;

    public UsersController(UsersRepo usersRepo, FriendsRequestRepo friendsRequestRepo, FriendsRepo friendsRepo) {
        this.usersRepo = usersRepo;
        this.friendsRequestRepo = friendsRequestRepo;
        this.friendsRepo = friendsRepo;
    }

    public static Optional<User> getUserFromToken(String token, UsersRepo usersRepo) {
        JwtTokenUtil jwtTokenUtil = new JwtTokenUtil();
        token = token.replace("Bearer ", "");
        String authUserUid;
        try {
            authUserUid = jwtTokenUtil.getUidFromToken(token);
            if(authUserUid != null && !authUserUid.isBlank())
                return usersRepo.findByUid(authUserUid);
        } catch (Exception e) {
            return Optional.empty();
        }
        return Optional.empty();
    }

    @GetMapping("/getUserData")
    public ResponseEntity<UserData> getUserData(@RequestHeader("Authorization") String token) {
        Optional<User> user = getUserFromToken(token, this.usersRepo);
        UserData userData = new UserData();

        if(user.isPresent()) {
            int friendsCount = friendsRepo.countFriendsByUser1OrUser2(user.get(), user.get());
            userData.setUser(user.get());
            userData.setFriendsCount(friendsCount);
        }

        return ResponseEntity.ok(userData);
    }
    @PutMapping("/updateUser")
    public ResponseEntity<Boolean> updateUser(@RequestHeader("Authorization") String token,
                                                 @RequestParam MultipartFile file,
                                                 @RequestParam("user") String userStringified) {
        ObjectMapper objectMapper = new ObjectMapper();
        User updatedUser;
        try {
            updatedUser = objectMapper.readValue(userStringified, User.class);
        } catch (JsonProcessingException e) {
            return ResponseEntity.ok(false);
        }
        Optional<User> userOptional = getUserFromToken(token, usersRepo);
        User user;

        if(userOptional.isPresent() && updatedUser != null) {
            user = userOptional.get();
            user.setNomeProprio(updatedUser.getNomeProprio());
            user.setApelido(updatedUser.getApelido());
            user.setUsername(updatedUser.getUsername());

            if(file != null) {
                try {
                    byte[] bytes = file.getBytes();
                    if (bytes.length > 0)
                        user.setProfilePic(bytes);
                } catch (IOException throwables) {
                    throwables.printStackTrace();
                    return ResponseEntity.ok(false);
                }
            }
        } else
            return ResponseEntity.ok(false);

        usersRepo.save(user);
        return ResponseEntity.ok(true);
    }
}
