package com.emsi.pfa.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;

import com.emsi.pfa.model.Agent;
import com.emsi.pfa.model.Reclamation;
import com.emsi.pfa.model.ReponseReclamation;
import com.emsi.pfa.model.User;

import com.emsi.pfa.repository.ReclamationRepository;
import com.emsi.pfa.repository.ReponseReclamationRepository;
import com.emsi.pfa.repository.UserRepository;

import com.emsi.pfa.service.ReponseReclamationService;
import com.emsi.pfa.service.AgentService;
import org.springframework.security.core.Authentication;
import java.util.List;


@RestController
@RequestMapping("/agents")
public class AgentController {
    @Autowired
        private AgentService service;
    @Autowired
    private ReponseReclamationService reponseReclamationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReclamationRepository reclamationRepository;
    @Autowired
    private ReponseReclamationRepository reponseReclamationRepository;


    @GetMapping("/get-agents")
    public Page<Agent> getAllAgent(@RequestParam int page, @RequestParam int size, @RequestParam(required = false) String keyword){

    return service.getAllAgents(page, size, keyword);
    }

    @GetMapping("/mesreponses/{reclamationId}")
    public Page<ReponseReclamation> getReponsesAgent(
            @PathVariable Long reclamationId,
            @RequestParam int page,
            @RequestParam int size,
            Authentication authentication){

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        Reclamation reclamation = reclamationRepository.findById(reclamationId)
            .orElseThrow(() -> new RuntimeException("Réclamation introuvable"));
        ReponseReclamation reponseReclamation = reponseReclamationRepository.findById(reclamation.getId())
        .orElseThrow(() -> new RuntimeException("Reponse introuvable"));

        if(!reponseReclamation.getAgent().getId().equals(user.getAgent().getId())){
            throw new RuntimeException("Accès interdit");
        }

        return reponseReclamationService.getReponsesByReclamation(reclamationId, page, size);
    }

    @GetMapping
    public List<Agent> getAllAgents(){

    return service.getAllAgents();
    }
    @PutMapping("update-disponibilte/{id}")
    public String updateDisponibilite(@PathVariable Long id, @RequestBody boolean disponible) {
        service.updateDiponibilite(id,disponible);
        return "mis a jour avec succée";
    }
}

