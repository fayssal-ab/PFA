package com.emsi.pfa.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.emsi.pfa.service.CommentaireService;
import com.emsi.pfa.model.Commentaire;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/commentaires")
public class CommentaireController {
    @Autowired
    private CommentaireService service;

    @PostMapping("/add-commentaire")
    public String addCommentaire(@RequestBody Commentaire commentaire) {
        service.addCommentaire(commentaire);
        return "Commentaire ajouté avec succès";
    }

    @PutMapping("/update-commentaire/{id}")
    public String updateCommentaire(@PathVariable Long id, @RequestBody Commentaire commentaire) {
        service.updateCommentaire(id, commentaire);
        return "Commentaire modifié avec succès";
    }

    @DeleteMapping("/delete-commentaire/{id}")
    public String deleteCommentaire(@PathVariable Long id) {
        service.deleteCommentaire(id);
        return "Commentaire supprimé avec succès";
    }

    @GetMapping("/get-commentaires/{id}")
    public List<Commentaire> getCommentairesByReclamation(@PathVariable Long id, Authentication authentication) {
        return service.getCommentairesByReclamation(id, authentication);
    }

    @GetMapping("/get-commentaire/{id}")
    public Commentaire getCommentaire(@PathVariable Long id) {
        return service.getCommentaire(id);
    }

    @PutMapping("/approuver/{id}")
    public ResponseEntity<?> approuverCommentaire(@PathVariable Long id, Authentication authentication) {
        try {
            service.approuverCommentaire(id, authentication);
            return ResponseEntity.ok(Map.of("message", "Commentaire approuvé"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
