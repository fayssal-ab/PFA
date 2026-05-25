package com.emsi.pfa.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.emsi.pfa.model.ReponseReclamation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
public interface ReponseReclamationRepository extends JpaRepository<ReponseReclamation, Long> {
   Page<ReponseReclamation> findByReclamationId(Long reclamationId, Pageable pageable);
}
