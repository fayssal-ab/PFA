package com.emsi.pfa.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.emsi.pfa.model.Agent;
import com.emsi.pfa.model.User;
import java.util.List;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AgentRepository extends JpaRepository<Agent, Long> {
    Optional<Agent> findByUser(User user);
    @Transactional
    void deleteByUser(User user);

    Page<Agent> findByUserNomContainingIgnoreCaseOrUserPrenomContainingIgnoreCaseOrUserEmailContainingIgnoreCase(
        String nom,
        String prenom,
        String email,
        Pageable pageable
    );

    long countByDisponibleTrue();
    long countByDisponibleFalse();
    
    @Query("SELECT a.id, u.nom, u.prenom, COUNT(rc.id), AVG(TIMESTAMPDIFF(HOUR, rc.dateDepot, rc.dateModification)) " +
           "FROM Agent a JOIN a.user u LEFT JOIN Affectation af ON af.agent = a " +
           "LEFT JOIN Reclamation rc ON af.reclamation = rc AND rc.status.status = 'résolu' " +
           "GROUP BY a.id, u.nom, u.prenom")
    List<Object[]> getPerformanceStats();
}