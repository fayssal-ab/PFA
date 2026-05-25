package com.emsi.pfa.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.emsi.pfa.service.RoleService;
import com.emsi.pfa.model.Role;
import java.util.List;


@RestController
@RequestMapping("/roles")
public class RoleController {
    @Autowired
        private RoleService service;
       
@PostMapping("/create-role")
public void createRole(@RequestBody Role role){
    service.createRole(role);
}
@PutMapping("update-role/{id}")
public void UpdateRole(@PathVariable Long id, @RequestBody Role role) {
    service.UpdateRole(id, role);
    
}
@DeleteMapping("delete-role/{id}")
public void  DeleteRole(@PathVariable Long id){
    service.DeleteRole(id);
}
 @GetMapping("get-roles")
 public List<Role> getAllRole(){
    return service.getAllRole();
 }
}
