package com.emsi.pfa.service;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import com.emsi.pfa.repository.HistoriqueRepository;
import com.emsi.pfa.repository.UserRepository;
import com.emsi.pfa.model.Historique;
import com.emsi.pfa.model.User;
import org.springframework.security.crypto.password.PasswordEncoder;
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;
   
    @Autowired
        private HistoriqueRepository historiqueRepository;

    public String login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email incorrect"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Mot de passe incorrect");
        }
         Historique historique = new Historique();

        historique.setAction(
        user.getNom() + " " + user.getPrenom() + " s'est connecté au système"
        );

        historique.setUser(user);
        historique.setDateAction(LocalDateTime.now());
        historiqueRepository.save(historique);
        return jwtService.generateToken(user); 
    }
}