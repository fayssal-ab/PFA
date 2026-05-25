package com.emsi.pfa.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.emsi.pfa.model.Affectation;
import com.emsi.pfa.service.AffectationService;
import org.springframework.data.domain.Page;
import com.emsi.pfa.model.User;
import com.emsi.pfa.repository.UserRepository;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/affectations")
public class AffectationController {
    @Autowired
        private AffectationService service;
    @Autowired
    private UserRepository userRepository;
    @PostMapping("/create-affectation")
    public String createAffectation(@RequestBody Affectation affectation) {
        service.createAffectaion(affectation);
        return "affectation creer avec succées";
    }
    @PutMapping("/update-affectation/{id}")
    public String updateAffectaion(@PathVariable Long id, @RequestBody Affectation NewAffectation) {
        service.updateAffectaion(id, NewAffectation);
        return "affectation mis a jour avec succées";
    }
    
    @GetMapping("/mes-affectations")
    public Page<Affectation> getMesAffectations(
        Authentication authentication,
        @RequestParam int page,
        @RequestParam int size) {

    String email = authentication.getName();

    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("user introuvable"));

    Long agentId = user.getAgent().getId();

    return service.getAffectationByAgent(agentId, page, size);

    }
    @DeleteMapping("/delete-affectation/{id}")
      public String DeleteAffectaion(@PathVariable Long id) {
        service.deleteAffectation(id);
        return "affectation supprimé avec succées";
    }
    
}
