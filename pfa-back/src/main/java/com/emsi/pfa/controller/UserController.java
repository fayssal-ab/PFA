package com.emsi.pfa.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import com.emsi.pfa.dto.UserRequest;
import com.emsi.pfa.service.UserService;
import com.emsi.pfa.model.User;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService service;
    
    @PostMapping("/create-user")
    public String createUser(@RequestBody UserRequest user){
        service.createUser(user);
        return "user creer avec succèe";
    }
    
    @PutMapping("/update-user/{id}")
    public String updateUser(@PathVariable Long id, @RequestBody UserRequest request) {
        service.updateUser(id, request);
        return "User modifié avec succès";
    }

    @DeleteMapping("/delete-user/{id}")
    public String deleteUser(@PathVariable Long id) {
        service.deleteUser(id);
        return "User supprimé avec succès";
    }
    
    @GetMapping("/get-user")
    public List<User> getAllUsers() {
        return service.getAllUsers();
    }
    
    @GetMapping("/get-user/{id}")
    public User getUserById(@PathVariable Long id) {
        return service.getUserById(id);
    }

    @GetMapping("/statistiques")
    public Map<String, Long> getStatistiques(){
        return service.getStatistiques();
    }
    
    @GetMapping("/statistiques/agents-performance")
    public List<Map<String, Object>> getAgentsPerformance() {
        return service.getAgentsPerformance();
    }
}