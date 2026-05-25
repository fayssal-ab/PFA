package com.emsi.pfa.service;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.emsi.pfa.model.CategorieReclamation;
import com.emsi.pfa.repository.CategorieReclamationRepository;
import java.util.List;

@Service
public class CategorieReclamationService {
    @Autowired
        private CategorieReclamationRepository repo;

    public void CreateCategorie(CategorieReclamation categoriereclamation){
    if(repo.existsByCategorie(categoriereclamation.getCategorie())){
        throw new RuntimeException("Categorie deja exist");
    }
        repo.save(categoriereclamation);
    }
  public void UpdateCategorie(Long id , CategorieReclamation Newcategoriereclamation){
    CategorieReclamation categoriereclamation = repo.findById(id)
                          .orElseThrow(() -> new RuntimeException("Categorie non trouver"));
    categoriereclamation.setCategorie(Newcategoriereclamation.getCategorie());
    repo.save(categoriereclamation);
  }
  public void DeleteCategorie(Long id){
    CategorieReclamation categoriereclamation = repo.findById(id)
           .orElseThrow(() -> new RuntimeException("Categorie non trouver"));

    repo.delete(categoriereclamation);

  }
  public List<CategorieReclamation> getAllCategorie(){
    return repo.findAll();
  }
}
