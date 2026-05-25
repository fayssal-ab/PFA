package com.emsi.pfa.service;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.emsi.pfa.model.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final String SECRET_KEY =
            "pfa_projet_2026_spring_recaezrdghdjhdvjnidfnjhndfjhnfijdhuihqsjkjdilsqjiohqskjbdhjdhhjdbhjdfjf";

    private SecretKey getSignInKey() {

        return Keys.hmacShaKeyFor(
                SECRET_KEY.getBytes(StandardCharsets.UTF_8)
        );
    }

    public String generateToken(User user) {

        return Jwts.builder()
                .subject(user.getEmail())
                 .claim("userId", user.getId())

                .claim("clientId",
                user.getClient() != null
                        ? user.getClient().getId()
                        : null)

                .claim("agentId",
                user.getAgent() != null
                        ? user.getAgent().getId()
                        : null)

               .claim("managerId",
                user.getManager() != null
                        ? user.getManager().getId()
                        : null)
                .claim("email", user.getEmail())
                .claim("nom", user.getNom())
                .claim("prenom", user.getPrenom())
                .claim("role", user.getRole().getName())
                .issuedAt(new Date())
                .expiration(
                        new Date(System.currentTimeMillis() + 1000 * 60 * 60)
                )
                .signWith(getSignInKey())
                .compact();
    }

    public String extractUsername(String token) {

        return extractAllClaims(token).getSubject();
    }

    public boolean isTokenValid(
            String token,
            UserDetails userDetails
    ) {

        final String username = extractUsername(token);

        return username.equals(userDetails.getUsername())
                && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {

        return extractAllClaims(token)
                .getExpiration()
                .before(new Date());
    }

    private Claims extractAllClaims(String token) {

        return Jwts
                .parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}