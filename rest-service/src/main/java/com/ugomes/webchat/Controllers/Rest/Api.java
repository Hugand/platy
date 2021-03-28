package com.ugomes.webchat.Controllers.Rest;

import com.ugomes.webchat.Utils.JwtTokenUtil;
import com.ugomes.webchat.models.User;
import com.ugomes.webchat.repositories.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.websocket.server.PathParam;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

//@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public class Api {
    final UsersRepo usersRepo;

    public Api(UsersRepo usersRepo) {
        this.usersRepo = usersRepo;
    }

    @GetMapping("/")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<User> hello() {
        List<User> users = usersRepo.findAll();
        return ResponseEntity.ok(users.get(0));
    }

    @GetMapping("/getAuthUser")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<User> getAuthUser(@RequestHeader("Authorization") String token) {
        JwtTokenUtil jwtTokenUtil = new JwtTokenUtil();
        token = token.replace("Bearer ", "");
        String uid = jwtTokenUtil.getUidFromToken(token);

        User user = usersRepo.findByUid(uid).orElse(null);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/validateToken")
    @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
    public ResponseEntity<Map<String, Boolean>> validateToken(@PathParam("token") String token, @PathParam("uid") String uid) {
        JwtTokenUtil jwtTokenUtil = new JwtTokenUtil();
        boolean isValid = jwtTokenUtil.validateToken(token, uid);
        Map<String, Boolean> resp = new HashMap<>();
        resp.put("status", isValid);
        return ResponseEntity.ok(resp);
    }
}
