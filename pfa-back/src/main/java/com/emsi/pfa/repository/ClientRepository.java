package com.emsi.pfa.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.emsi.pfa.model.Client;
import com.emsi.pfa.model.User;
import java.util.Optional;
public interface ClientRepository extends JpaRepository<Client, Long> {
         Optional<Client> findByUser(User user);

}
