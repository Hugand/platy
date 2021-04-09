package com.ugomes.webchat.Controllers.Rest;

import com.ugomes.webchat.Utils.JwtTokenUtil;
import com.ugomes.webchat.models.User;
import com.ugomes.webchat.repositories.UsersRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import javax.websocket.server.PathParam;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

//@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public class Api {
    final UsersRepo usersRepo;

    public Api(UsersRepo usersRepo) {
        this.usersRepo = usersRepo;
    }

    @GetMapping("/")
    public ResponseEntity<User> hello() {
        List<User> users = usersRepo.findAll();
        return ResponseEntity.ok(users.get(0));
    }

    @GetMapping("/getAuthUser")
    public ResponseEntity<Optional<User>> getAuthUser(@RequestHeader("Authorization") String token) {
        Optional<User> user = UsersController.getUserFromToken(token, this.usersRepo);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/validateToken")
    public ResponseEntity<Map<String, Boolean>> validateToken(@PathParam("token") String token, @PathParam("uid") String uid) {
        JwtTokenUtil jwtTokenUtil = new JwtTokenUtil();
        boolean isValid = jwtTokenUtil.validateToken(token, uid);
        Map<String, Boolean> resp = new HashMap<>();
        resp.put("status", isValid);
        return ResponseEntity.ok(resp);
    }
}
