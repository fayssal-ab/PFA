package com.emsi.pfa.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.emsi.pfa.model.Administrateur;
import com.emsi.pfa.model.User;
import java.util.Optional;

public interface AdministrateurRepository extends JpaRepository<Administrateur, Long> {
     Optional<Administrateur> findByUser(User user);
     void deleteByUser(User user);
}
