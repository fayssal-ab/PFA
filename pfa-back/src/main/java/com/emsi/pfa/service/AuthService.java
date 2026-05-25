package com.emsi.pfa.service;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import com.emsi.pfa.repository.UserRepository;
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

    public String login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email incorrect"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Mot de passe incorrect");
        }

        return jwtService.generateToken(user); 
    }
}