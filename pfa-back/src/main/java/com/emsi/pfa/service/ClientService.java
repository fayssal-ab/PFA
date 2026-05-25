package com.emsi.pfa.service;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.emsi.pfa.model.Client;
import com.emsi.pfa.repository.ClientRepository;
import com.emsi.pfa.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.emsi.pfa.model.User;

@Service
public class ClientService {
     @Autowired
        private UserRepository repo;
     @Autowired
        private ClientRepository clientRepository;
    @Autowired
    private RoleService services;

    @Autowired
    private PasswordEncoder passwordEncoder;

   

public Client register(Client client) {
    User user = client.getUser();

    if (repo.existsByEmail(user.getEmail())) {
        throw new RuntimeException("Erreur : Cet email est déjà utilisé.");
    }

    user.setPassword(passwordEncoder.encode(user.getPassword()));
    user.setRole(services.getRole("client"));
    
    User savedUser = repo.save(user);
    client.setUser(savedUser);

    return clientRepository.save(client);
}
}
