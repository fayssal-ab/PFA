package com.emsi.pfa.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.emsi.pfa.service.AuthService;
import com.emsi.pfa.model.User;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired  
        private AuthService service;

@PostMapping("/login")
public String login(@RequestBody User user) {

return service.login(user.getEmail(), user.getPassword());

}

}
