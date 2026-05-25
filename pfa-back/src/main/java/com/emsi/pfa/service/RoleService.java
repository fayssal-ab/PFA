package com.emsi.pfa.service;
import org.springframework.stereotype.Service;

import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import com.emsi.pfa.model.Role;
import com.emsi.pfa.repository.RoleRepository;

@Service
public class RoleService {
    @Autowired
    private RoleRepository repo;
  
    public Role getRole(String name){
      return repo.findByName(name).orElse(null);
    }

    public void createRole(Role role){

      if(repo.existsByName(role.getName())){
      throw new RuntimeException("Role deja exist");
    }
       repo.save(role);
    }

    public void UpdateRole(Long id ,Role newRole){
      Role role = repo.findById(id)
           .orElseThrow(() -> new RuntimeException("Role non trouver"));
      role.setName(newRole.getName()); 
      repo.save(role);  
    }
    
    public void DeleteRole(Long id ){
      Role role = repo.findById(id)
           .orElseThrow(() -> new RuntimeException("Role non trouver"));
      repo.delete(role);
    }
    public List<Role> getAllRole(){
      return repo.findAll();
    }
}
