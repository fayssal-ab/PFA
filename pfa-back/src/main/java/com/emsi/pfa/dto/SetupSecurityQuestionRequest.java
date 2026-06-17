package com.emsi.pfa.dto;

import jakarta.validation.constraints.NotBlank;

public class SetupSecurityQuestionRequest {

    @NotBlank(message = "La question est requise")
    private String question;

    @NotBlank(message = "La réponse est requise")
    private String reponse;

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getReponse() { return reponse; }
    public void setReponse(String reponse) { this.reponse = reponse; }
}
