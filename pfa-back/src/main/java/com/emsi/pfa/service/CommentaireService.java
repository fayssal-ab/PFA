package com.emsi.pfa.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.List;

import com.emsi.pfa.repository.AffectationRepository;
import com.emsi.pfa.repository.CommentaireRepository;
import com.emsi.pfa.repository.NotificationRepository;
import com.emsi.pfa.repository.ReclamationRepository;
import com.emsi.pfa.repository.UserRepository;
import com.emsi.pfa.model.Affectation;
import com.emsi.pfa.model.Commentaire;
import com.emsi.pfa.model.Reclamation;
import com.emsi.pfa.model.User;
import com.emsi.pfa.model.Notification;
@Service
public class CommentaireService {
    @Autowired
        private CommentaireRepository repo;
    @Autowired
        private AffectationRepository affectationRepository;
    @Autowired
        private NotificationRepository notificationRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReclamationRepository reclamationRepository;


    public void addCommentaire(Commentaire commentaire) {

    User auteur = userRepository.findById(commentaire.getUser().getId())
    .orElseThrow( () -> new RuntimeException("Utilisateur introuvable") );

    Reclamation reclamation = reclamationRepository.findById( commentaire.getReclamation().getId() )
    .orElseThrow(() -> new RuntimeException("Réclamation introuvable") );

    commentaire.setUser(auteur);

    commentaire.setReclamation(reclamation);

    repo.save(commentaire);

    Notification notification = new Notification();

    notification.setReclamation(reclamation);

    notification.setDateEnvoi(LocalDateTime.now());

    notification.setLue(false);

    if(auteur.getRole().getName().equals("agent")){

        notification.setUser( reclamation.getClient().getUser() );
        notification.setMessage(
            "Nouvelle réponse concernant votre réclamation : "
            + reclamation.getTitre()
        );
    }

    else if(
        auteur.getRole().getName().equals("client")
    ){

        Affectation affectation = affectationRepository.findByReclamationId(reclamation.getId()).orElse(null);

        if(affectation != null){

            notification.setUser( affectation.getAgent().getUser() );
            notification.setMessage(
                "Le client a ajouté un commentaire sur la réclamation : "
                + reclamation.getTitre()
            );
        }
    }
        notificationRepository.save(notification);
    }

        public List<Commentaire> getCommentairesByReclamation(Long id) {
             return repo.findAllByReclamationId(id);
        }
        public Commentaire getCommentaire(Long id){
            return repo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Commentaire non trouvé pour la réclamation id: " + id));

        }
        public void updateCommentaire(Long id, Commentaire commentaire) {
            Commentaire existingCommentaire = repo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Commentaire non trouvé pour la réclamation id: " + id));
            if (existingCommentaire != null) {
                existingCommentaire.setContenu(commentaire.getContenu());
                existingCommentaire.setDateCommentaire(commentaire.getDateCommentaire());
                repo.save(existingCommentaire);
            }
        
        }

        public void deleteCommentaire(Long id) {
            repo.deleteById(id);
        }


    }     


    
