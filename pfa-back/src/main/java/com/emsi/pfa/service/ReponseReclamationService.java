package com.emsi.pfa.service;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;

import com.emsi.pfa.model.Historique;
import com.emsi.pfa.model.Notification;
import com.emsi.pfa.model.Reclamation;
import com.emsi.pfa.model.User;
import com.emsi.pfa.model.ReponseReclamation;

import com.emsi.pfa.repository.HistoriqueRepository;
import com.emsi.pfa.repository.NotificationRepository;
import com.emsi.pfa.repository.ReclamationRepository;
import com.emsi.pfa.repository.ReponseReclamationRepository;
import com.emsi.pfa.repository.UserRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import java.util.List;

@Service
public class ReponseReclamationService {
    @Autowired
        private ReponseReclamationRepository repo;
    @Autowired
        private ReclamationRepository reclamationRepository ;
    @Autowired
        private UserRepository userRepository;
    @Autowired 
        private NotificationRepository notificationRepository;
    @Autowired
        private HistoriqueRepository historiqueRepository;
    @Autowired
        private CurrentUserService currentUserService;

        public void createReponse(ReponseReclamation reponseReclamation){
            Reclamation reclamation = reclamationRepository.findById(reponseReclamation.getReclamation().getId())
            .orElseThrow(()->new RuntimeException("reclamation pas trouvé"));
            reponseReclamation.setReclamation(reclamation);
            // pour client concerné
            Notification notification_client = new Notification();
            notification_client.setDateEnvoi(LocalDateTime.now());
            notification_client.setMessage("nouveau réponse a votre reclamation"+ reclamation.getTitre());
            notification_client.setUser(reclamation.getClient().getUser());
            notification_client.setReclamation(reclamation);
            notificationRepository.save(notification_client);
            // pour manager
            List<User> managers = userRepository.findByRole_Name("manager");
            for(User manager : managers){
                Notification notification = new Notification();
                notification.setUser(manager);
                notification.setReclamation(reclamation);
                notification.setMessage("nouveau reponse pour : " + reclamation.getTitre());
                notificationRepository.save(notification);
            }
             User currentUser = currentUserService.getCurrentUser();

            Historique historique = new Historique();

             historique.setAction(
            "création de reponse pour reclamation # "
            + reclamation.getId()
             );
      

            historique.setReclamation(reclamation);
            historique.setUser(currentUser);
            historique.setDateAction(LocalDateTime.now());
            historiqueRepository.save(historique);
            repo.save(reponseReclamation);
        }

        public void updateReponse(Long id, ReponseReclamation NewreponseReclamation){
            ReponseReclamation reponseReclamation = repo.findById(id)
             .orElseThrow(()-> new RuntimeException("reponse pas trouvé"));

            reponseReclamation.setReponse(NewreponseReclamation.getReponse());
            repo.save(reponseReclamation);
        }
        public void deleteReponse(Long id){
            ReponseReclamation reponseReclamation = repo.findById(id)
             .orElseThrow(()-> new RuntimeException("reponse pas trouvé"));
             repo.delete(reponseReclamation);
        }
        public Page<ReponseReclamation> getReponsesByReclamation(Long reclamationId, int page, int size){

             Pageable pageable = PageRequest.of(
                    page,
                    size
        );
        return repo.findByReclamationId(reclamationId, pageable);
        }
}
