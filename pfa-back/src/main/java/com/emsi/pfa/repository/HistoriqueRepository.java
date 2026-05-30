package com.emsi.pfa.repository;
import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import com.emsi.pfa.model.Historique;

public interface HistoriqueRepository extends JpaRepository<Historique, Long> {
    long countByDateActionAfter(LocalDateTime date);

}
