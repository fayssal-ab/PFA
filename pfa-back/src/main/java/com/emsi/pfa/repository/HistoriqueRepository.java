package com.emsi.pfa.repository;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.emsi.pfa.model.Historique;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface HistoriqueRepository extends JpaRepository<Historique, Long> {
    long countByDateActionAfter(LocalDateTime date);
        @Query("""
        SELECT h
        FROM Historique h
        WHERE (:action IS NULL OR LOWER(h.action) LIKE LOWER(CONCAT('%', :action, '%')))
        AND (:userId IS NULL OR h.user.id = :userId)
        AND (:dateDebut IS NULL OR DATE(h.dateAction) >= :dateDebut)
        AND (:dateFin IS NULL OR DATE(h.dateAction) <= :dateFin)
    """)
    Page<Historique> filtrerHistorique(
            @Param("action") String action,
            @Param("userId") Long userId,
            @Param("dateDebut") LocalDate dateDebut,
            @Param("dateFin") LocalDate dateFin,
            Pageable pageable
    );
}
