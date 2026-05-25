package com.emsi.pfa.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.emsi.pfa.model.Historique;

public interface HistoriqueRepository extends JpaRepository<Historique, Long> {
    
}
