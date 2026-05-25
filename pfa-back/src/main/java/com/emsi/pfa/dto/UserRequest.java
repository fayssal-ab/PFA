package com.emsi.pfa.dto;

import com.emsi.pfa.model.Role;

public class UserRequest {

    private String nom;
    private String prenom;
    private String email;
    private String password;

    private Role role;

    private Boolean disponible;
    private String departement;

    public String getNom() { 
        return nom; 
    }
    public void setNom(String nom) {
         this.nom = nom;
         }

    public String getPrenom() { 
        return prenom; 
    }
    public void setPrenom(String prenom) {
         this.prenom = prenom;
         }

    public String getEmail() { 
        return email;
     }
    public void setEmail(String email) { 
        this.email = email; 
    }

    public String getPassword() { 
        return password;
     }
    public void setPassword(String password) { 
        this.password = password; 
    }

    public Role getRole() {
         return role; 
        }
    public void setRole(Role role) { 
        this.role = role; 
    }

    public Boolean getDisponible() {
         return disponible;
         }
    public void setDisponible(Boolean disponible) { 
        this.disponible = disponible; 
    }

    public String getDepartement() {
         return departement; 
        }
    public void setDepartement(String departement) { 
        this.departement = departement;
     }
}