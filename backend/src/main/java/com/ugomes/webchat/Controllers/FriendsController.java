package com.ugomes.webchat.Controllers;

import com.ugomes.webchat.ApiResponses.SearchUserResponse;
import com.ugomes.webchat.Utils.JwtTokenUtil;
import com.ugomes.webchat.models.Friends;
import com.ugomes.webchat.models.FriendsRequests;
import com.ugomes.webchat.models.User;
import com.ugomes.webchat.repositories.FriendsRequestRepo;
import com.ugomes.webchat.repositories.UsersRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
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
    public ResponseEntity<SearchUserResponse> searchUser(@RequestParam String searchTerm,
                                                         @RequestHeader("Authorization") String token) {
        JwtTokenUtil jwtTokenUtil = new JwtTokenUtil();
        token = token.replace("Bearer ", "");
        String authUserUid = jwtTokenUtil.getUidFromToken(token);
        User authUser = usersRepo.findByUid(authUserUid).orElse(null);

        List<User> users = new ArrayList<>();
        List<Long> friendRequestsTargetUserId = new ArrayList<>();
        List<Long> friendUsersId = new ArrayList<>();

        if(authUser == null || searchTerm.isBlank() || searchTerm.isEmpty())
            return ResponseEntity.ok(new SearchUserResponse(users, friendRequestsTargetUserId, friendUsersId));

        users = usersRepo.findByUserOrName(searchTerm.toLowerCase(Locale.ROOT));

        users.removeIf(user -> (user != null && user.getUid().equals(authUserUid)));

        List<FriendsRequests> friendsRequestsByAuthUser = friendsRequestRepo.findByOriginOrDestinyId(authUser.getId());

        for(FriendsRequests fr : friendsRequestsByAuthUser) {
            if(fr.getRequestOriginUser().getId().equals(authUser.getId())) {
                friendRequestsTargetUserId.add(fr.getRequestDestinyUser().getId());
            } else {
                friendRequestsTargetUserId.add(fr.getRequestOriginUser().getId());
            }
        }

        return ResponseEntity.ok(new SearchUserResponse(users, friendRequestsTargetUserId, friendUsersId));

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

        List<FriendsRequests> alreadyCreatedFriendRequestToAuthUser = friendsRequestRepo
                .findByOriginOrDestinyId(authUser.getId());
        List<FriendsRequests> alreadyCreatedFriendRequestToBefriendUser = friendsRequestRepo
                .findByOriginOrDestinyId(userToBefriend.getId());

        if(alreadyCreatedFriendRequestToAuthUser.size() > 0|| alreadyCreatedFriendRequestToBefriendUser.size() > 0) {
            resBody.put("status", "failed");
            return ResponseEntity.ok(resBody);
        }

        FriendsRequests newFriendRequest = new FriendsRequests(authUser, userToBefriend);
        newFriendRequest.setRequestDate(Clock.systemUTC().instant());

        friendsRequestRepo.save(newFriendRequest);

        resBody.put("status", "success");
        return ResponseEntity.ok(resBody);
    }

    @GetMapping("/cancelFriendRequest")
    @Transactional
    public ResponseEntity<Map<String, String>> cancelFriendRequest(@RequestHeader("Authorization") String token,
                                                      @RequestParam Long destinyUserId) {
        Map<String, String> resp = new HashMap<>();

        JwtTokenUtil jwtTokenUtil = new JwtTokenUtil();
        token = token.replace("Bearer ", "");
        String authUserUid = jwtTokenUtil.getUidFromToken(token);

        User authUser = usersRepo.findByUid(authUserUid).orElse(null);

        if(authUser == null || Objects.equals(authUser.getId(), destinyUserId)) {
            resp.put("status", "failed");
            return ResponseEntity.ok(resp);
        }

        friendsRequestRepo.deleteFriendsRequestsByUsersId(authUser.getId(), destinyUserId);

        resp.put("status", "success");

        return ResponseEntity.ok(resp);
    }

    @GetMapping("/getUsers")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<List<User>> getUsers() {
        List<User> users = usersRepo.findAll();
        System.out.println(users);
        return ResponseEntity.ok(users);
    }
}
