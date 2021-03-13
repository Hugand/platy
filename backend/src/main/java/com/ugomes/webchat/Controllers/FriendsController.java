package com.ugomes.webchat.Controllers;

import com.ugomes.webchat.Utils.JwtTokenUtil;
import com.ugomes.webchat.models.FriendsRequests;
import com.ugomes.webchat.models.User;
import com.ugomes.webchat.repositories.FriendsRequestRepo;
import com.ugomes.webchat.repositories.UsersRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Clock;
import java.util.*;

@RestController
public class FriendsController {
    final UsersRepo usersRepo;
    final FriendsRequestRepo friendsRequestRepo;

    public FriendsController(UsersRepo usersRepo, FriendsRequestRepo friendsRequestRepo) {
        this.usersRepo = usersRepo;
        this.friendsRequestRepo = friendsRequestRepo;
    }

    @GetMapping("/searchUser")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<List<User>> searchUser(@RequestParam String searchTerm) {
        List<User> users = searchTerm.isBlank() || searchTerm.isEmpty()
                ? new ArrayList<>()
                : usersRepo.findByUserOrName(searchTerm.toLowerCase(Locale.ROOT));
        return ResponseEntity.ok(users);
    }

    @GetMapping("/sendFriendRequest")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<Map<String, String>> sendFriendRequest(@RequestHeader("Authorization") String token,
                                    @RequestParam Long newFriendId) {
        Map<String, String> resBody = new HashMap<>();
        JwtTokenUtil jwtTokenUtil = new JwtTokenUtil();
        token = token.replace("Bearer ", "");
        String authUserUid = jwtTokenUtil.getUidFromToken(token);

        User authUser = usersRepo.findByUid(authUserUid).orElse(null);
        User userToBefriend = usersRepo.findById(newFriendId).orElse(null);

        if(userToBefriend == null || authUser == null) {
            resBody.put("status", "failed");
            return ResponseEntity.ok(resBody);
        }

        FriendsRequests alreadyCreatedFriendRequestToAuthUser = friendsRequestRepo
                .findByOriginOrDestinyId(authUser.getId()).orElse(null);
        FriendsRequests alreadyCreatedFriendRequestToBefriendUser = friendsRequestRepo
                .findByOriginOrDestinyId(userToBefriend.getId()).orElse(null);

        if(alreadyCreatedFriendRequestToAuthUser != null || alreadyCreatedFriendRequestToBefriendUser != null) {
            resBody.put("status", "failed");
            return ResponseEntity.ok(resBody);
        }

        FriendsRequests newFriendRequest = new FriendsRequests(authUser, userToBefriend);
        newFriendRequest.setRequestDate(Clock.systemUTC().instant());

        friendsRequestRepo.save(newFriendRequest);

        resBody.put("status", "success");
        return ResponseEntity.ok(resBody);
    }

    @GetMapping("/getUsers")
    @CrossOrigin(origins = "http://localhost:3000")
        public ResponseEntity<List<User>> getUsers() {
        List<User> users = usersRepo.findAll();
        System.out.println(users);
        return ResponseEntity.ok(users);
    }
}
