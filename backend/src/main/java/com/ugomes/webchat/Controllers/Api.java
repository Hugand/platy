package com.ugomes.webchat.Controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Api {
    @GetMapping("/")
    public String hello() {
        return "hello world";
    }

    @GetMapping("/restricted")
    public String restricted() {
        return "Restricted hello world";
    }
}
