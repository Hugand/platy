package com.ugomes.webchat.Controllers;

import com.ugomes.webchat.ApiResponses.UserData;
import com.ugomes.webchat.Utils.JwtTokenUtil;
import com.ugomes.webchat.models.User;
import com.ugomes.webchat.repositories.FriendsRepo;
import com.ugomes.webchat.repositories.FriendsRequestRepo;
import com.ugomes.webchat.repositories.UsersRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

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

    public User getUserFromToken(String token) {
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

    @GetMapping("/getUserData")
    public ResponseEntity<UserData> getUserData(@RequestHeader("Authorization") String token) {
        User user = this.getUserFromToken(token);
        int friendsCount = friendsRepo.countFriendsByUser1OrUser2(user, user);
        UserData userData = new UserData(user, friendsCount);

        return ResponseEntity.ok(userData);
    }
}
