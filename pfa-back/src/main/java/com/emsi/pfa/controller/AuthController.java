package com.emsi.pfa.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.emsi.pfa.dto.ForgotPasswordRequest;
import com.emsi.pfa.dto.LoginRequest;
import com.emsi.pfa.dto.RefreshTokenRequest;
import com.emsi.pfa.dto.ResetPasswordRequest;
import com.emsi.pfa.dto.SetupSecurityQuestionRequest;
import com.emsi.pfa.service.AuthService;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService service;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            return ResponseEntity.ok(service.login(request.getEmail(), request.getPassword()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        try {
            return ResponseEntity.ok(service.refresh(request.getRefreshToken()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            String resetToken = service.forgotPassword(request.getEmail(), request.getReponse());
            return ResponseEntity.ok(Map.of("resetToken", resetToken));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            service.resetPassword(request.getResetToken(), request.getNewPassword());
            return ResponseEntity.ok(Map.of("message", "Mot de passe réinitialisé avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/setup-security-question")
    public ResponseEntity<?> setupSecurityQuestion(
            @Valid @RequestBody SetupSecurityQuestionRequest request,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            service.setupSecurityQuestion(email, request.getQuestion(), request.getReponse());
            return ResponseEntity.ok(Map.of("message", "Question de sécurité configurée"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
