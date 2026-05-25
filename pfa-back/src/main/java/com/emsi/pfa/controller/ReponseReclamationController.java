package com.emsi.pfa.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.emsi.pfa.model.ReponseReclamation;
import com.emsi.pfa.service.ReponseReclamationService;

import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/reponse-reclamations")
public class ReponseReclamationController {
    @Autowired
        private ReponseReclamationService service;

        @PostMapping("create-reponse")
        public String createReponse(@RequestBody ReponseReclamation reponseReclamation) {
            
            service.createReponse(reponseReclamation);
            return "reclamation créer avec succés";
        }

        @PutMapping("update-reclamation/{id}")
        public String updateReclamation(@PathVariable Long id, @RequestBody ReponseReclamation NewreponseReclamation) {
            service.updateReponse(id, NewreponseReclamation);
            return "reponse mis a jour avec succées";
        }

        @DeleteMapping("delete-reponse/{id}")
        public String deleteReponse(@PathVariable Long id){
            service.deleteReponse(id);
            return "reponse supprimé avec succée";
        }

        @GetMapping("get-reponse/{reclamationId}")
        public Page<ReponseReclamation> getReponseByReclamation(@PathVariable  Long reclamationId,@RequestParam int page, @RequestParam int size) {
            return service.getReponsesByReclamation(reclamationId, page, size);
        }
        
        
}
