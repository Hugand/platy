package com.ugomes.webchat.Controllers;

import com.ugomes.webchat.Utils.JwtTokenUtil;
import com.ugomes.webchat.models.FriendsRequests;
import com.ugomes.webchat.models.User;
import com.ugomes.webchat.repositories.FriendsRequestRepo;
import com.ugomes.webchat.repositories.UsersRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Clock;
import java.util.List;
import java.util.Locale;

@RestController
public class FriendsController {
    final UsersRepo usersRepo;
    final FriendsRequestRepo friendsRequestRepo;

    public FriendsController(UsersRepo usersRepo, FriendsRequestRepo friendsRequestRepo) {
        this.usersRepo = usersRepo;
        this.friendsRequestRepo = friendsRequestRepo;
    }

    @GetMapping("/searchUser")
    public ResponseEntity<List<User>> searchUser(@RequestParam String searchTerm) {
        List<User> users = searchTerm.isBlank() || searchTerm.isEmpty()
                ? usersRepo.findAll()
                : usersRepo.findByUserOrName(searchTerm.toLowerCase(Locale.ROOT));
        return ResponseEntity.ok(users);
    }

    @GetMapping("/sendFriendRequest")
    public ResponseEntity<String> sendFriendRequest(@RequestHeader("Authorization") String token,
                                    @RequestParam Long newFriendId) {
        JwtTokenUtil jwtTokenUtil = new JwtTokenUtil();
        token = token.replace("Bearer ", "");
        String authUserUid = jwtTokenUtil.getUidFromToken(token);

        User authUser = usersRepo.findByUid(authUserUid).orElse(null);
        User userToBefriend = usersRepo.findById(newFriendId).orElse(null);

        if(userToBefriend == null || authUser == null)
            return ResponseEntity.ok("failed");

        FriendsRequests alreadyCreatedFriendRequestToAuthUser = friendsRequestRepo
                .findByOriginOrDestinyId(authUser.getId()).orElse(null);
        FriendsRequests alreadyCreatedFriendRequestToBefriendUser = friendsRequestRepo
                .findByOriginOrDestinyId(userToBefriend.getId()).orElse(null);

        if(alreadyCreatedFriendRequestToAuthUser != null || alreadyCreatedFriendRequestToBefriendUser != null)
            return ResponseEntity.ok("failed");

        FriendsRequests newFriendRequest = new FriendsRequests(authUser, userToBefriend);
        newFriendRequest.setRequestDate(Clock.systemUTC().instant());

        return ResponseEntity.ok("success");
    }

    @GetMapping("/getUsers")
    public ResponseEntity<List<User>> getUsers() {
        List<User> users = usersRepo.findAll();
        System.out.println(users);
        return ResponseEntity.ok(users);
    }
}
