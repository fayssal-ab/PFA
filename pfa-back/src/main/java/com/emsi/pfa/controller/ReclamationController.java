package com.emsi.pfa.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;

import com.emsi.pfa.model.Reclamation;
import com.emsi.pfa.model.User;

import com.emsi.pfa.service.ReclamationService;

import com.emsi.pfa.repository.UserRepository;
import org.springframework.security.core.Authentication;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/reclamations")
public class ReclamationController {
    @Autowired
    private ReclamationService service;
    @Autowired
    private UserRepository userRepository;
    

    @PostMapping("/add-reclamation")
    public Reclamation addReclamation(@RequestBody Reclamation reclamation){
        return service.addReclamation(reclamation);
    }

    @PutMapping("/update-reclamation/{id}")
    public String updateReclamation(@PathVariable Long id, @RequestBody Reclamation reclamation){
        service.updateReclamation(id,reclamation);
        return "reclamation modifié avec succées";
    }
    
    @DeleteMapping("/delete-reclamation/{id}")
    public String deleteReclamation(@PathVariable Long id){
        service.deleteReclamation(id);
        return "reclamation supprimé avec succées";
    }

    @GetMapping("/get-reclamation/{id}")
    public Reclamation getReclamation(@PathVariable Long id, Authentication authentication){

        return service.getReclamation(id, authentication);
    }
    @PutMapping("/reclamation/{id}/status/{statusId}")
    public String changeStatus(@PathVariable long id, @PathVariable Long statusId){
        service.changeStatus(id,statusId);
        return "status mis a jour avec succées";
    }

    @PutMapping("/reclamation/{id}/priority/{priorityId}")
    public String changePriority(@PathVariable long id, @PathVariable Long priorityId){
        service.changePriority(id, priorityId);
        return "priorité mise à jour";
    }

    @GetMapping("/get-reclamations")
    public Page<Reclamation> getAllReclamations(@RequestParam int page, @RequestParam int size) {
        return service.getAllReclamations(page, size);
    }

    @GetMapping("/mes-reclamations")
    public Page<Reclamation> getMesReclamations(Authentication authentication, @RequestParam int page, @RequestParam int size){
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        Long clientId = user.getClient().getId();
        return service.getReclamationByClient(clientId, page, size);
    }

    @GetMapping("/all-reclamations")
    public Page<Reclamation> filterReclamations(
        @RequestParam(required = false) Long statusId,
        @RequestParam(required = false) Long priorityId,
        @RequestParam(required = false) Long categorieId,
        @RequestParam int page,
        @RequestParam int size
    ) {
        return service.filterReclamations(statusId, priorityId, categorieId, page, size);
    }

    @GetMapping("/statistiques")
    public Map<String, Long> getStatistiques(){
        return service.getStatistiques();
    }

    @GetMapping("/statistiques/avancees")
    public Map<String, Object> getStatistiquesAvancees() {
        return service.getStatistiquesAvancees();
    }

    @GetMapping("/statistiques/evolution")
    public List<Map<String, Object>> getEvolution(
        @RequestParam(defaultValue = "day") String periode,
        @RequestParam(defaultValue = "7") int jours
    ) {
        return service.getEvolution(periode, jours);
    }

    @GetMapping("/statistiques/top-categories")
    public List<Map<String, Object>> getTopCategories(
        @RequestParam(defaultValue = "5") int limit
    ) {
        return service.getTopCategories(limit);
    }

    @GetMapping("/statistiques/temps-moyen-resolution")
    public Map<String, Object> getTempsMoyenResolution() {
        return service.getTempsMoyenResolution();
    }
}