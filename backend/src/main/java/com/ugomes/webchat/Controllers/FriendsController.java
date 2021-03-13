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

    private User getUserFromToken(String token) {
        JwtTokenUtil jwtTokenUtil = new JwtTokenUtil();
        token = token.replace("Bearer ", "");
        try {
            String authUserUid = jwtTokenUtil.getUidFromToken(token);
            return usersRepo.findByUid(authUserUid).orElse(null);
        } catch(Exception e) {
            return null;
        }
    }

    @GetMapping("/searchUser")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<SearchUserResponse> searchUser(@RequestParam String searchTerm,
                                                         @RequestHeader("Authorization") String token) {
        User authUser = this.getUserFromToken(token);

        List<User> users = new ArrayList<>();
        List<Long> friendRequestsTargetUserId = new ArrayList<>();
        List<Long> friendUsersId = new ArrayList<>();

        if(authUser == null || searchTerm.isBlank() || searchTerm.isEmpty())
            return ResponseEntity.ok(new SearchUserResponse(users, friendRequestsTargetUserId, friendUsersId));

        users = usersRepo.findByUserOrName(searchTerm.toLowerCase(Locale.ROOT));

        users.removeIf(user -> (user != null && user.getUid().equals(authUser.getUid())));

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
        User authUser = this.getUserFromToken(token);
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
        User authUser = this.getUserFromToken(token);

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

    @GetMapping("/getFriendsRequests")
    public ResponseEntity<List<FriendsRequests>> getFriendsRequestsByDestinyUser(String token) {
        List<FriendsRequests> friendsRequests = new ArrayList<>();
        User authenticatedUser = this.getUserFromToken(token);

        if(authenticatedUser == null)
            return ResponseEntity.ok(friendsRequests);

        friendsRequests = friendsRequestRepo.findByRequestDestinyUser(authenticatedUser);

        return ResponseEntity.ok(friendsRequests);
    }
}
