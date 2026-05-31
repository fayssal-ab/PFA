package com.emsi.pfa.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.emsi.pfa.repository.AdministrateurRepository;
import com.emsi.pfa.repository.AgentRepository;
import com.emsi.pfa.repository.ManagerRepository;
import com.emsi.pfa.repository.RoleRepository;
import com.emsi.pfa.repository.UserRepository;
import com.emsi.pfa.repository.ClientRepository;
import com.emsi.pfa.repository.HistoriqueRepository;
import com.emsi.pfa.dto.UserRequest;
import com.emsi.pfa.model.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private AdministrateurRepository administrateurRepository;

    @Autowired
    private AgentRepository agentRepository;

    @Autowired
    private ManagerRepository managerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private ClientRepository clientRepository;
    @Autowired
        private CurrentUserService currentUserService;
    @Autowired
        private HistoriqueRepository historiqueRepository;

    public void createUser(UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email deja utilise");
        }
        User user = new User();
        user.setNom(request.getNom());
        user.setPrenom(request.getPrenom());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        Role role = roleRepository.findById(request.getRole().getId())
                .orElseThrow(() -> new RuntimeException("Role pas trouve"));

            User currentUser = currentUserService.getCurrentUser();
            Historique historique = new Historique();

            historique.setAction(
            currentUser.getNom()+" "+currentUser.getPrenom()+" à ajouter un nouveau utilisateur " 
            + user.getNom()
            +" " +user.getPrenom()
            );

            historique.setUser(currentUser);
            historique.setDateAction(LocalDateTime.now());
            historiqueRepository.save(historique);
    
        user.setRole(role);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        String roleName = role.getName();

        switch (roleName) {
            case "admin":
                Administrateur admin = new Administrateur();
                admin.setUser(user);
                administrateurRepository.save(admin);
                break;
            case "agent":
                Agent agent = new Agent();
                agent.setUser(user);
                agent.setDisponible(request.getDisponible() != null ? request.getDisponible() : true);
                agentRepository.save(agent);
                break;
            case "manager":
                Manager manager = new Manager();
                manager.setUser(user);
                manager.setDepartement(request.getDepartement());
                managerRepository.save(manager);
                break;
            case "client":
                Client client = new Client();
                client.setUser(user);
                clientRepository.save(client);
                break;
        }
    }

    @Transactional
    public void updateUser(Long id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User pas trouver"));

        String oldRole = user.getRole().getName();
        Role newRole = roleRepository.findById(request.getRole().getId())
                .orElseThrow(() -> new RuntimeException("Role pas trouver"));

            User currentUser = currentUserService.getCurrentUser();
            Historique historique = new Historique();

            historique.setAction(
            currentUser.getNom()+" "+currentUser.getPrenom()+" à modifier les informations d' utilisateur " 
            + user.getNom()
            +" " +user.getPrenom()
            );

            historique.setUser(currentUser);
            historique.setDateAction(LocalDateTime.now());
            historiqueRepository.save(historique);
        String newRoleName = newRole.getName();

        user.setNom(request.getNom());
        user.setPrenom(request.getPrenom());
        user.setEmail(request.getEmail());
        user.setRole(newRole);
        
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                user.setPassword(passwordEncoder.encode(request.getPassword()));
            }
        }
        userRepository.save(user);

        if (oldRole.equals(newRoleName)) {
            switch (newRoleName) {
                case "agent":
                    Agent agent = agentRepository.findByUser(user)
                            .orElseThrow(() -> new RuntimeException("Agent pas trouvé"));
                    if (request.getDisponible() != null) {
                        agent.setDisponible(request.getDisponible());
                    }
                    agentRepository.save(agent);
                    break;
                case "manager":
                    Manager manager = managerRepository.findByUser(user)
                            .orElseThrow(() -> new RuntimeException("Manager pas trouvé"));
                    if (request.getDepartement() != null) {
                        manager.setDepartement(request.getDepartement());
                    }
                    managerRepository.save(manager);
                    break;
                case "admin":
                    break;
            }
        } else {
            user.setAgent(null);
            user.setManager(null);
            user.setAdministrateur(null);
            userRepository.save(user);
            administrateurRepository.deleteByUser(user);
            agentRepository.deleteByUser(user);
            managerRepository.deleteByUser(user);

            switch (newRoleName) {
                case "admin":
                    Administrateur admin = new Administrateur();
                    admin.setUser(user);
                    administrateurRepository.save(admin);
                    break;
                case "agent":
                    Agent agent = new Agent();
                    agent.setUser(user);
                    agent.setDisponible(request.getDisponible() != null ? request.getDisponible() : true);
                    agentRepository.save(agent);
                    break;
                case "manager":
                    Manager manager = new Manager();
                    manager.setUser(user);
                    manager.setDepartement(request.getDepartement());
                    managerRepository.save(manager);
                    break;
            }
        }
    }

    public void deleteUser(Long id){
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User pas trouver"));
                    User currentUser = currentUserService.getCurrentUser();
            Historique historique = new Historique();

            historique.setAction(
            currentUser.getNom()+" "+currentUser.getPrenom()+" à supprimer l''utilisateur " 
            + user.getNom()
            +" " +user.getPrenom()
            );

            historique.setUser(currentUser);
            historique.setDateAction(LocalDateTime.now());
            historiqueRepository.save(historique);
        userRepository.delete(user);
    }
    
    public List<User> getAllUsers() {    
        return userRepository.findByRole_NameNot("client");
    }
    
    public User getUserById(Long id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            Agent agent = agentRepository.findByUser(user).orElse(null);
            Manager manager = managerRepository.findByUser(user).orElse(null);
            Administrateur admin = administrateurRepository.findByUser(user).orElse(null);
            Client client = clientRepository.findByUser(user).orElse(null);
            if (agent != null) {
                user.setAgent(agent);
            }
            if (manager != null) {
                user.setManager(manager);
            }
            if (admin != null) {
                user.setAdministrateur(admin);
            }
            if (client != null) {
                user.setClient(client);
            }
            return user;
        } else {
            throw new RuntimeException("User pas trouver");
        }
    }

    public Map<String, Long> getStatistiques(){
        Map<String, Long> stats = new HashMap<>();
        stats.put("agentsDisponibles", agentRepository.countByDisponibleTrue());
        stats.put("agentsIndisponibles", agentRepository.countByDisponibleFalse());
        stats.put("managers", managerRepository.count());
        return stats;
    }
    
    public List<Map<String, Object>> getAgentsPerformance() {
        List<Object[]> results = agentRepository.getPerformanceStats();
        List<Map<String, Object>> performance = new ArrayList<>();
        
        for (Object[] row : results) {
            Map<String, Object> agent = new HashMap<>();
            agent.put("id", row[0]);
            agent.put("nom", row[1]);
            agent.put("prenom", row[2]);
            agent.put("reclamationsResolues", row[3] != null ? row[3] : 0L);
            agent.put("tempsMoyenResolution", row[4] != null ? row[4] : 0.0);
            performance.add(agent);
        }
        return performance;
    }
}