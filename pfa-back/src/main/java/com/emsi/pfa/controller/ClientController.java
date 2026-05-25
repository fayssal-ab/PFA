package com.emsi.pfa.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.emsi.pfa.model.Client;
import com.emsi.pfa.model.Reclamation;
import com.emsi.pfa.model.ReponseReclamation;
import com.emsi.pfa.service.ClientService;
import com.emsi.pfa.service.ReponseReclamationService;
import com.emsi.pfa.model.User;
import com.emsi.pfa.repository.ClientRepository;
import com.emsi.pfa.repository.ReclamationRepository;
import com.emsi.pfa.repository.UserRepository;

import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import java.util.Map;

@RestController
@RequestMapping("/clients")
public class ClientController {
    @Autowired
    private ClientService service;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ReclamationRepository reclamationRepository;
    @Autowired
    private ReponseReclamationService reponseReclamationService;
    @Autowired
    private ClientRepository clientRepository;
        
    @PostMapping("/register-client")
    public Client register(@RequestBody Client client) {
        return service.register(client);
    }

    @GetMapping("/mes-reponses/{reclamationId}")
    public Page<ReponseReclamation> getMesReponsesReclamation(
            @PathVariable Long reclamationId, 
            @RequestParam int page, 
            @RequestParam int size, 
            Authentication authentication) {

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        Reclamation reclamation = reclamationRepository.findById(reclamationId)
            .orElseThrow(() -> new RuntimeException("Réclamation introuvable"));

        if(!reclamation.getClient().getId().equals(user.getClient().getId())){
            throw new RuntimeException("Accès interdit");
        }
        return reponseReclamationService.getReponsesByReclamation(reclamationId, page, size);
    }

    // ============ NOUVEAUX ENDPOINTS POUR LE PROFIL CLIENT ============

    @GetMapping("/profile")
    public Client getProfile(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        Client client = user.getClient();
        if (client == null) {
            throw new RuntimeException("Client introuvable");
        }
        return client;
    }

    @PutMapping("/update-profile")
    public Client updateProfile(@RequestBody Map<String, String> data, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        Client client = user.getClient();
        if (client == null) {
            throw new RuntimeException("Client introuvable");
        }
        
        if (data.containsKey("telephone")) {
            client.setTelephone(data.get("telephone"));
        }
        if (data.containsKey("adresse")) {
            client.setAdresse(data.get("adresse"));
        }
        
        return clientRepository.save(client);
    }

    @GetMapping("/stats")
    public Map<String, Object> getClientStats(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        Client client = user.getClient();
        if (client == null) {
            throw new RuntimeException("Client introuvable");
        }
        
        long totalReclamations = reclamationRepository.countByClientId(client.getId());
        long enCours = reclamationRepository.countByClientIdAndStatusStatus(client.getId(), "en cours");
        long resolues = reclamationRepository.countByClientIdAndStatusStatus(client.getId(), "résolu");
        long enAttente = reclamationRepository.countByClientIdAndStatusStatus(client.getId(), "en attente");
        
        return Map.of(
            "total", totalReclamations,
            "enCours", enCours,
            "resolues", resolues,
            "enAttente", enAttente
        );
    }
}