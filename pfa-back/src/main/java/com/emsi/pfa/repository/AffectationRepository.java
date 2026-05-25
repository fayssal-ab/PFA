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

}
