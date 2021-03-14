package com.ugomes.webchat.Controllers;

import com.ugomes.webchat.ApiResponses.SearchUserResponse;
import com.ugomes.webchat.Utils.JwtTokenUtil;
import com.ugomes.webchat.models.Friends;
import com.ugomes.webchat.models.FriendsRequests;
import com.ugomes.webchat.models.User;
import com.ugomes.webchat.repositories.FriendsRepo;
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
    final FriendsRepo friendsRepo;

    public FriendsController(UsersRepo usersRepo, FriendsRequestRepo friendsRequestRepo, FriendsRepo friendsRepo) {
        this.usersRepo = usersRepo;
        this.friendsRequestRepo = friendsRequestRepo;
        this.friendsRepo = friendsRepo;
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
    @CrossOrigin(origins = "http://localhost:3000")
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

    @GetMapping("/getFriendRequests")
    @CrossOrigin(origins = "http://localhost:3000")
    @Transactional
    public ResponseEntity<List<FriendsRequests>> getFriendsRequestsByDestinyUser(@RequestHeader("Authorization") String token) {
        List<FriendsRequests> friendsRequests = new ArrayList<>();
        User authenticatedUser = this.getUserFromToken(token);

        if(authenticatedUser != null)
            friendsRequests = friendsRequestRepo.findFriendsRequestsByRequestDestinyUser(authenticatedUser);

        return ResponseEntity.ok(friendsRequests);
    }

    @GetMapping("/acceptFriendRequest")
    @CrossOrigin(origins = "http://localhost:3000")
    @Transactional
    public ResponseEntity<Map<String, Object>> acceptFriendRequest(@RequestParam Long friendRequestId) {
        Map<String, Object> response = new HashMap<>();
        FriendsRequests currFriendsRequests = friendsRequestRepo.findById(friendRequestId).orElse(null);

        if(currFriendsRequests == null)
            response.put("status", "failed");
        else {
            Friends friends = new Friends(
                    currFriendsRequests.getRequestOriginUser(),
                    currFriendsRequests.getRequestDestinyUser(),
                    Clock.systemUTC().instant());

            friendsRequestRepo.delete(currFriendsRequests);

            Friends savedFriend = friendsRepo.save(friends);
            response.put("status", "success");
            response.put("savedFriend", savedFriend);
        }

        return ResponseEntity.ok(response);
    }
}
