package com.emsi.pfa.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.emsi.pfa.model.Affectation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

public interface AffectationRepository extends JpaRepository<Affectation, Long> {
        Page<Affectation> findByAgentId(Long agentId, Pageable pageable);
        boolean existsByReclamationId(Long reclamationId);
        Optional<Affectation> findByReclamationId(Long reclamationId);
        boolean existsByAgent_IdAndReclamation_Id(Long agentId,Long reclamationId);

    Page<Affectation> findByAgentIdAndReclamation_TitreContainingIgnoreCase(
            Long agentId,
            String titre,
            Pageable pageable);

    Page<Affectation> findByAgentIdAndReclamation_Status_Id(
            Long agentId,
            Long statusId,
            Pageable pageable);

    Page<Affectation> findByAgentIdAndReclamation_Priority_Id(
            Long agentId,
            Long priorityId,
            Pageable pageable);

    Page<Affectation> findByAgentIdAndReclamation_Categorie_Id(
            Long agentId,
            Long categorieId,
            Pageable pageable);

    Page<Affectation> findByAgentIdAndReclamation_TitreContainingIgnoreCaseAndReclamation_Status_Id(
            Long agentId,
            String titre,
            Long statusId,
            Pageable pageable);

    Page<Affectation> findByAgentIdAndReclamation_TitreContainingIgnoreCaseAndReclamation_Priority_Id(
            Long agentId,
            String titre,
            Long priorityId,
            Pageable pageable);

    Page<Affectation> findByAgentIdAndReclamation_TitreContainingIgnoreCaseAndReclamation_Categorie_Id(
            Long agentId,
            String titre,
            Long categorieId,
            Pageable pageable);

    Page<Affectation> findByAgentIdAndReclamation_Status_IdAndReclamation_Priority_Id(
            Long agentId,
            Long statusId,
            Long priorityId,
            Pageable pageable);

    Page<Affectation> findByAgentIdAndReclamation_Status_IdAndReclamation_Categorie_Id(
            Long agentId,
            Long statusId,
            Long categorieId,
            Pageable pageable);

    Page<Affectation> findByAgentIdAndReclamation_Priority_IdAndReclamation_Categorie_Id(
            Long agentId,
            Long priorityId,
            Long categorieId,
            Pageable pageable);

    Page<Affectation> findByAgentIdAndReclamation_TitreContainingIgnoreCaseAndReclamation_Status_IdAndReclamation_Priority_Id(
            Long agentId,
            String titre,
            Long statusId,
            Long priorityId,
            Pageable pageable);

    Page<Affectation> findByAgentIdAndReclamation_TitreContainingIgnoreCaseAndReclamation_Status_IdAndReclamation_Categorie_Id(
            Long agentId,
            String titre,
            Long statusId,
            Long categorieId,
            Pageable pageable);

    Page<Affectation> findByAgentIdAndReclamation_TitreContainingIgnoreCaseAndReclamation_Priority_IdAndReclamation_Categorie_Id(
            Long agentId,
            String titre,
            Long priorityId,
            Long categorieId,
            Pageable pageable);

    Page<Affectation> findByAgentIdAndReclamation_Status_IdAndReclamation_Priority_IdAndReclamation_Categorie_Id(
            Long agentId,
            Long statusId,
            Long priorityId,
            Long categorieId,
            Pageable pageable);

    Page<Affectation> findByAgentIdAndReclamation_TitreContainingIgnoreCaseAndReclamation_Status_IdAndReclamation_Priority_IdAndReclamation_Categorie_Id(
            Long agentId,
            String titre,
            Long statusId,
            Long priorityId,
            Long categorieId,
            Pageable pageable);
}

