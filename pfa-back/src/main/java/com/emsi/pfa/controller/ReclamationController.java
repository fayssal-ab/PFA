package com.emsi.pfa.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;

import com.emsi.pfa.model.Reclamation;
import com.emsi.pfa.model.User;

import com.emsi.pfa.service.ReclamationService;

import com.emsi.pfa.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

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
    public ResponseEntity<?> addReclamation(@RequestBody Reclamation reclamation, Authentication authentication) {
        try {
            Reclamation created = service.addReclamation(reclamation, authentication);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/update-reclamation/{id}")
    public ResponseEntity<?> updateReclamation(@PathVariable Long id, @RequestBody Reclamation reclamation) {
        try {
            service.updateReclamation(id, reclamation);
            return ResponseEntity.ok(Map.of("message", "réclamation modifiée avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/delete-reclamation/{id}")
    public ResponseEntity<?> deleteReclamation(@PathVariable Long id) {
        try {
            service.deleteReclamation(id);
            return ResponseEntity.ok(Map.of("message", "réclamation supprimée avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/get-reclamation/{id}")
    public ResponseEntity<?> getReclamation(@PathVariable Long id, Authentication authentication) {
        try {
            Reclamation reclamation = service.getReclamation(id, authentication);
            return ResponseEntity.ok(reclamation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/reclamation/{id}/status/{statusId}")
    public ResponseEntity<?> changeStatus(@PathVariable long id, @PathVariable Long statusId, Authentication authentication) {
        try {
            service.changeStatus(id, statusId, authentication);
            return ResponseEntity.ok(Map.of("message", "status mis à jour avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/reclamation/{id}/priority/{priorityId}")
    public ResponseEntity<?> changePriority(@PathVariable long id, @PathVariable Long priorityId) {
        try {
            service.changePriority(id, priorityId);
            return ResponseEntity.ok(Map.of("message", "priorité mise à jour"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/get-reclamations")
    public ResponseEntity<Page<Reclamation>> getAllReclamations(@RequestParam int page, @RequestParam int size) {
        return ResponseEntity.ok(service.getAllReclamations(page, size));
    }

    @GetMapping("/mes-reclamations")
    public ResponseEntity<?> getMesReclamations(
            Authentication authentication, 
            @RequestParam int page, 
            @RequestParam int size) {
        try {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
            
            if (user.getClient() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Aucun client associé à cet utilisateur. Veuillez contacter l'administrateur."));
            }
            
            Long clientId = user.getClient().getId();
            Page<Reclamation> result = service.getReclamationByClient(clientId, page, size);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
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

    @PutMapping("/reclamation/{id}/valider")
    public ResponseEntity<?> validerReclamation(@PathVariable Long id, Authentication authentication) {
        try {
            service.validerReclamation(id, authentication);
            return ResponseEntity.ok(Map.of("message", "Réclamation validée et envoyée au client"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/reclamation/{id}/confirmer")
    public ResponseEntity<?> confirmerReclamation(@PathVariable Long id, Authentication authentication) {
        try {
            service.confirmerReclamation(id, authentication);
            return ResponseEntity.ok(Map.of("message", "Résolution confirmée"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/reclamation/{id}/rejeter")
    public ResponseEntity<?> rejeterReclamation(@PathVariable Long id, @RequestBody Map<String, String> body, Authentication authentication) {
        try {
            String feedback = body.getOrDefault("feedback", "");
            service.rejeterReclamation(id, feedback, authentication);
            return ResponseEntity.ok(Map.of("message", "Réclamation renvoyée avec feedback"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
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
    public ResponseEntity<?> getTempsMoyenResolution(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Non authentifié"));
        }
        User user = userRepository.findByEmail(authentication.getName())
            .orElse(null);
        if (user == null || !"admin".equals(user.getRole().getName())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Accès refusé"));
        }
        return ResponseEntity.ok(service.getTempsMoyenResolution());
    }

    public class ReclamationRequestDTO {
    private String titre;
    private String description;
    private Long categorieId;
    private Long priorityId;
    
    // Getters et Setters
    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Long getCategorieId() { return categorieId; }
    public void setCategorieId(Long categorieId) { this.categorieId = categorieId; }
    public Long getPriorityId() { return priorityId; }
    public void setPriorityId(Long priorityId) { this.priorityId = priorityId; }
    }
}