package com.emsi.pfa.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.emsi.pfa.model.User;
import com.emsi.pfa.repository.UserRepository;

@Component
public class CurrentUserService {

    private final UserRepository userRepository;

    public CurrentUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser() {

        Authentication authentication = SecurityContextHolder
                                        .getContext()
                                        .getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
            .orElseThrow(() ->
                new RuntimeException("Utilisateur introuvable")
            );
    }
}