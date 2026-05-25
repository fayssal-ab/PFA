package com.emsi.pfa.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.emsi.pfa.model.PieceJointe;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
public interface PieceJointeRepository extends JpaRepository<PieceJointe, Long> {
        Page<PieceJointe> findByReclamationId(Long reclamationId, Pageable pageable);
        Page<PieceJointe> findByReclamationIdAndUserRoleName(Long reclamationId, String roleName, Pageable pageable);
}
