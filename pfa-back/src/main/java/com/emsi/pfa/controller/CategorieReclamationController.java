package com.emsi.pfa.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.emsi.pfa.model.CategorieReclamation;
import com.emsi.pfa.service.CategorieReclamationService;

@RestController
@RequestMapping("/categorie")
public class CategorieReclamationController {
    @Autowired
        private CategorieReclamationService service;

    @PostMapping("/create-categorie")
    public String createCategorie(@RequestBody CategorieReclamation categorie){
    service.CreateCategorie(categorie);
        return "categorie créé avec succès";

    }   
    @PutMapping("update-categorie/{id}")
    public String UpdateCategorie(@PathVariable Long id, @RequestBody CategorieReclamation categorie) {
        service.UpdateCategorie(id,categorie);
            return "categorie modifie avec succès";

    }

    @DeleteMapping("delete-categorie/{id}")
    public String DeleteCategorie(@PathVariable Long id){
        service.DeleteCategorie(id);
            return "categorie supprime avec succès";

    }
    @GetMapping("get-categorie")
    public List<CategorieReclamation> getAllCategorie() {
        return service.getAllCategorie();
    }
}
