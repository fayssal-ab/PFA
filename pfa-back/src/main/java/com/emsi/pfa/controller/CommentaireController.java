package com.emsi.pfa.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.emsi.pfa.service.CommentaireService;
import com.emsi.pfa.model.Commentaire;
import java.util.List;

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
        public List<Commentaire> getCommentairesByReclamation(@PathVariable Long id) {
            return service.getCommentairesByReclamation(id);
        }
        @GetMapping("/get-commentaire/{id}")
        public Commentaire getCommentaire(@PathVariable Long id) {
            return service.getCommentaire(id);
        }
        

}
