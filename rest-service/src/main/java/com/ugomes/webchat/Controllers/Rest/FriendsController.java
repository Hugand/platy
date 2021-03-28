package com.ugomes.webchat.Controllers.Rest;

import com.ugomes.webchat.ApiResponses.SearchUserResponse;
import com.ugomes.webchat.Utils.JwtTokenUtil;
import com.ugomes.webchat.models.Chat;
import com.ugomes.webchat.models.Friends;
import com.ugomes.webchat.models.FriendsRequests;
import com.ugomes.webchat.models.User;
import com.ugomes.webchat.repositories.ChatsRepo;
import com.ugomes.webchat.repositories.FriendsRepo;
import com.ugomes.webchat.repositories.FriendsRequestRepo;
import com.ugomes.webchat.repositories.UsersRepo;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.websocket.server.PathParam;
import java.time.Clock;
import java.util.*;

@RestController
public class FriendsController {
    final UsersRepo usersRepo;
    final FriendsRequestRepo friendsRequestRepo;
    final FriendsRepo friendsRepo;
    final ChatsRepo chatsRepo;

    public FriendsController(UsersRepo usersRepo, FriendsRequestRepo friendsRequestRepo, FriendsRepo friendsRepo, ChatsRepo chatsRepo) {
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
        List<Friends> friendsList = friendsRepo.findFriendsByUser(authUser);

        for(FriendsRequests fr : friendsRequestsByAuthUser) {
            if(fr.getRequestOriginUser().getId().equals(authUser.getId()))
                friendRequestsTargetUserId.add(fr.getRequestDestinyUser().getId());
            else
                friendRequestsTargetUserId.add(fr.getRequestOriginUser().getId());
        }

        for(Friends f : friendsList) {
            if(f.getUser1().getId().equals(authUser.getId()))
                friendUsersId.add(f.getUser2().getId());
            else if(f.getUser2().getId().equals(authUser.getId()))
                friendUsersId.add(f.getUser1().getId());
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
        Friends existingFriendship = friendsRepo.findFriendsByUser1AndUser2(authUser, userToBefriend).orElse(null);


        if(userToBefriend == null || authUser == null || existingFriendship != null) {
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
            User userOrigin = currFriendsRequests.getRequestOriginUser();
            User userDestiny = currFriendsRequests.getRequestDestinyUser();

            Friends existingFriendship = friendsRepo.findFriendsByUser1AndUser2(userOrigin, userDestiny).orElse(null);

            if(existingFriendship == null) {
                Friends friends = new Friends(userOrigin, userDestiny, Clock.systemUTC().instant());
                friendsRequestRepo.delete(currFriendsRequests);

                Friends savedFriend = friendsRepo.save(friends);
                response.put("status", "success");
                response.put("savedFriend", savedFriend);
            } else
                response.put("status", "failed");
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/getFriendsList")
    public ResponseEntity<List<User>> getFriendsList(@RequestHeader("Authorization") String token) {
        List<User> friendsList = new ArrayList<>();
        User authenticatedUser = this.getUserFromToken(token);

        if(authenticatedUser == null)
            return ResponseEntity.ok(friendsList);

        List<Friends> friendsObjList = friendsRepo.findFriendsByUser(authenticatedUser);

        if(friendsObjList == null)
            return ResponseEntity.ok(friendsList);

        for(Friends friendship : friendsObjList) {
            if(friendship.getUser1().equals(authenticatedUser))
                friendsList.add(friendship.getUser2());
            else if(friendship.getUser2().equals(authenticatedUser))
                friendsList.add(friendship.getUser1());
        }

        return ResponseEntity.ok(friendsList);
    }

    @GetMapping("/getFriendship")
    public ResponseEntity<Friends> getFriendship(@RequestHeader("Authorization") String token,
                                                 @RequestParam Long friendId) {
        User authenticatedUser = this.getUserFromToken(token);
        User friendUser = usersRepo.findById(friendId).orElse(null);

        if(authenticatedUser == null || friendUser == null)
            return ResponseEntity.ok(null);

        Friends friendship = friendsRepo.findFriendsByUser1AndUser2(authenticatedUser, friendUser).orElse(null);

        return ResponseEntity.ok(friendship);
    }

    @GetMapping("/getChatFromFriendship")
    public ResponseEntity<List<Chat>> getChatFromFriendship(@RequestParam Long friendshipId) {
        List<Chat> chatsList =  new ArrayList<>(chatsRepo.findByFriendshipOrderByTimestampDesc(new Friends(friendshipId)));
        System.out.println(chatsList);
        return ResponseEntity.ok(chatsList);
    }
}
