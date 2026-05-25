package com.emsi.pfa.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.emsi.pfa.model.Commentaire;
import java.util.List;
public interface CommentaireRepository extends JpaRepository<Commentaire, Long> {
    List<Commentaire> findAllByReclamationId(Long reclamationId);    
}
