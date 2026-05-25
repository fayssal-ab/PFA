package com.emsi.pfa.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.emsi.pfa.model.Manager;
import com.emsi.pfa.model.User;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
public interface ManagerRepository extends JpaRepository<Manager, Long> {
    Optional<Manager> findByUser(User user);
    @Transactional
     void deleteByUser(User user);
     Page<Manager> findByUserNomContainingIgnoreCaseOrUserPrenomContainingIgnoreCaseOrUserEmailContainingIgnoreCase(
        String nom,
        String prenom,
        String email,
        Pageable pageable
    );
    long count();
}
