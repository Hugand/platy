package com.ugomes.webchat.Controllers;

import com.ugomes.webchat.Utils.JwtTokenUtil;
import com.ugomes.webchat.models.User;
import com.ugomes.webchat.repositories.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
