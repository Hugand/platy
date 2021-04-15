package com.ugomes.webchat.Controllers.Rest;

import com.ugomes.webchat.Comparators.UserFirstNameComparator;
import com.ugomes.webchat.models.Friends;
import com.ugomes.webchat.models.FriendsRequests;
import com.ugomes.webchat.models.User;
import com.ugomes.webchat.repositories.ChatsRepo;
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
    final ChatsRepo chatsRepo;

    public FriendsController(UsersRepo usersRepo, FriendsRequestRepo friendsRequestRepo, FriendsRepo friendsRepo, ChatsRepo chatsRepo) {
        this.usersRepo = usersRepo;
        this.friendsRequestRepo = friendsRequestRepo;
        this.friendsRepo = friendsRepo;
        this.chatsRepo = chatsRepo;
    }

    @GetMapping("/sendFriendRequest")
    public ResponseEntity<Map<String, String>> sendFriendRequest(@RequestHeader("Authorization") String token,
                                    @RequestParam Long newFriendId) {
        Map<String, String> resBody = new HashMap<>();
        Optional<User> authUser = UsersController.getUserFromToken(token, this.usersRepo);
        Optional<User> userToBefriend = usersRepo.findById(newFriendId);

        if(userToBefriend.isEmpty() || authUser.isEmpty()) {
            resBody.put("status", "failed");
            return ResponseEntity.badRequest().body(resBody);
        }

        Optional<Friends> existingFriendship = friendsRepo.findFriendsByUser1AndUser2(authUser.get(), userToBefriend.get());

        if(existingFriendship.isPresent()) {
            resBody.put("status", "failed");
            return ResponseEntity.badRequest().body(resBody);
        }

        List<FriendsRequests> alreadyCreatedFriendRequestToAuthUser = friendsRequestRepo
                .findByOriginOrDestinyId(authUser.get().getId());
        List<FriendsRequests> alreadyCreatedFriendRequestToBefriendUser = friendsRequestRepo
                .findByOriginOrDestinyId(userToBefriend.get().getId());

        if(alreadyCreatedFriendRequestToAuthUser.size() > 0 || alreadyCreatedFriendRequestToBefriendUser.size() > 0) {
            resBody.put("status", "failed");
            return ResponseEntity.badRequest().body(resBody);
        }

        FriendsRequests newFriendRequest = new FriendsRequests(authUser.get(), userToBefriend.get());
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
        Optional<User> authUser = UsersController.getUserFromToken(token, this.usersRepo);

        if(authUser.isEmpty() || Objects.equals(authUser.get().getId(), destinyUserId)) {
            resp.put("status", "failed");
            return ResponseEntity.badRequest().body(resp);
        }

        friendsRequestRepo.deleteFriendsRequestsByUsersId(authUser.get().getId(), destinyUserId);

        resp.put("status", "success");
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/getUsers")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<List<User>> getUsers() {
        List<User> users = usersRepo.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/getFriendRequests")
    @CrossOrigin(origins = "http://localhost:3000")
    @Transactional
    public ResponseEntity<List<FriendsRequests>> getFriendsRequestsByDestinyUser(@RequestHeader("Authorization") String token) {
        List<FriendsRequests> friendsRequests = new ArrayList<>();
        Optional<User> authenticatedUser = UsersController.getUserFromToken(token, this.usersRepo);

        if(authenticatedUser.isEmpty())
            return ResponseEntity.badRequest().body(friendsRequests);

        friendsRequests = friendsRequestRepo.findFriendsRequestsByRequestDestinyUser(authenticatedUser.get());

        return ResponseEntity.ok(friendsRequests);
    }

    @GetMapping("/acceptFriendRequest")
    @CrossOrigin(origins = "http://localhost:3000")
    @Transactional
    public ResponseEntity<Map<String, Object>> acceptFriendRequest(@RequestParam Long friendRequestId) {
        Map<String, Object> response = new HashMap<>();
        Optional<FriendsRequests> currFriendsRequests = friendsRequestRepo.findById(friendRequestId);

        if(currFriendsRequests.isEmpty()) {
            response.put("status", "failed");
            return ResponseEntity.badRequest().body(response);
        }

        User userOrigin = currFriendsRequests.get().getRequestOriginUser();
        User userDestiny = currFriendsRequests.get().getRequestDestinyUser();
        Optional<Friends> existingFriendship = friendsRepo.findFriendsByUser1AndUser2(userOrigin, userDestiny);

        if(existingFriendship.isEmpty()) {
            Friends friendship = new Friends(userOrigin, userDestiny, Clock.systemUTC().instant());
            Friends savedFriend = friendsRepo.save(friendship);

            friendsRequestRepo.delete(currFriendsRequests.get());
            response.put("status", "success");
            response.put("savedFriend", savedFriend);
            return ResponseEntity.ok(response);
        }

        response.put("status", "failed");
        return ResponseEntity.badRequest().body(response);
    }

    @GetMapping("/getFriendsList")
    public ResponseEntity<List<User>> getFriendsList(@RequestHeader("Authorization") String token) {
        List<User> friendsList = new ArrayList<>();
        Optional<User> authenticatedUser = UsersController.getUserFromToken(token, this.usersRepo);

        if(authenticatedUser.isEmpty())
            return ResponseEntity.badRequest().body(friendsList);

        List<Friends> friendsObjList = friendsRepo.findFriendsByUser(authenticatedUser.get());

        for(Friends friendship : friendsObjList) {
            if(friendship.getUser1().equals(authenticatedUser.get()))
                friendsList.add(friendship.getUser2());
            else if(friendship.getUser2().equals(authenticatedUser.get()))
                friendsList.add(friendship.getUser1());
        }

        return ResponseEntity.ok(friendsList);
    }

    @GetMapping("/getFriendship")
    public ResponseEntity<Optional<Friends>> getFriendship(@RequestHeader("Authorization") String token,
                                                 @RequestParam Long friendId) {
        Optional<User> authenticatedUser = UsersController.getUserFromToken(token, this.usersRepo);
        Optional<User> friendUser = usersRepo.findById(friendId);

        if(authenticatedUser.isEmpty() || friendUser.isEmpty())
            return ResponseEntity.badRequest().body(Optional.empty());

        Optional<Friends> friendship = friendsRepo.findFriendsByUser1AndUser2(authenticatedUser.get(), friendUser.get());

        return ResponseEntity.ok(friendship);
    }

    @GetMapping("/searchFriends")
    public ResponseEntity<List<User>> searchFriends(@RequestHeader("Authorization") String token,
                                                    @RequestParam String searchTerm) {
        Optional<User> authenticatedUser = UsersController.getUserFromToken(token, this.usersRepo);
        List<User> friendsList = new ArrayList<>();

        if(authenticatedUser.isEmpty())
            return ResponseEntity.badRequest().body(friendsList);

        List<Friends> friendshipList = friendsRepo.findFriendsByUser(authenticatedUser.get());

        for(Friends friendship : friendshipList) {
            User buffUser;
            if(friendship.getUser1().equals(authenticatedUser.get()))
                buffUser = friendship.getUser2();
            else
                buffUser = friendship.getUser1();

            System.out.println(friendship);
            System.out.println(buffUser);

            if(buffUser.getUsername().contains(searchTerm) || buffUser.getNomeProprio().contains(searchTerm) ||
                buffUser.getApelido().contains(searchTerm) || searchTerm.isBlank())
                    friendsList.add(buffUser);
        }

        UserFirstNameComparator userFirstNameComparator = new UserFirstNameComparator();
        friendsList.sort(userFirstNameComparator);

        return ResponseEntity.ok(friendsList);
    }
}
