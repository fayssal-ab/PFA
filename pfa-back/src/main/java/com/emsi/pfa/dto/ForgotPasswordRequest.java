package com.emsi.pfa.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class ForgotPasswordRequest {

    @NotBlank(message = "L'email est requis")
    @Email(message = "Format email invalide")
    private String email;

    @NotBlank(message = "La réponse est requise")
    private String reponse;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getReponse() { return reponse; }
    public void setReponse(String reponse) { this.reponse = reponse; }
}
