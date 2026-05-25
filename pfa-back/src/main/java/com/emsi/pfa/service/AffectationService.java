package com.emsi.pfa.service;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.emsi.pfa.model.Affectation;

import com.emsi.pfa.repository.AffectationRepository;
import com.emsi.pfa.repository.AgentRepository;
import com.emsi.pfa.repository.NotificationRepository;
import com.emsi.pfa.repository.ReclamationRepository;
import com.emsi.pfa.repository.StatusRepository;

import com.emsi.pfa.model.Agent;
import com.emsi.pfa.model.Reclamation;
import com.emsi.pfa.model.Status;
import com.emsi.pfa.model.Notification;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Service
public class AffectationService {
    @Autowired
        private AffectationRepository repo;
    @Autowired
        private AgentRepository agentRepository;
    @Autowired
        private ReclamationRepository reclamationRepository;
    @Autowired
    private StatusRepository statusRepository;
    @Autowired
    private NotificationRepository notificationRepository;
    

    public void createAffectaion(Affectation affectation){

    Agent agent = agentRepository.findById(
        affectation.getAgent().getId()
    ).orElseThrow(() ->
        new RuntimeException("agent pas trouvé")
    );

    Reclamation reclamation =
        reclamationRepository.findById(
            affectation.getReclamation().getId()
        ).orElseThrow(() ->
            new RuntimeException("reclamation pas trouvé")
        );

    Affectation ancienneAffectation =
        repo.findByReclamationId(
            reclamation.getId()
        ).orElse(null);

    if (ancienneAffectation != null) {

    Notification ancienneNotification = new Notification();

    ancienneNotification.setUser(
        ancienneAffectation.getAgent().getUser()
    );

    ancienneNotification.setReclamation(reclamation);
    ancienneNotification.setDateEnvoi(LocalDateTime.now());
    ancienneNotification.setLue(false);
    ancienneNotification.setMessage(
        "La réclamation : "
        + reclamation.getTitre()
        + " a été réaffectée à un autre agent."
    );

    notificationRepository.save(ancienneNotification);

    repo.delete(ancienneAffectation);
    }

    Status status = statusRepository
        .findByStatus("en cours")
        .orElseThrow(() ->
            new RuntimeException("status pas trouvé")
        );

    reclamation.setStatus(status);

    reclamationRepository.save(reclamation);

    affectation.setAgent(agent);

    affectation.setReclamation(reclamation);

    affectation.setDateAffectation(
        LocalDateTime.now()
    );

    repo.save(affectation);

    Notification notification = new Notification();

    notification.setUser(agent.getUser());

    notification.setReclamation(reclamation);
    notification.setDateEnvoi(LocalDateTime.now());
    notification.setLue(false);
    notification.setMessage(
        "Une réclamation vous a été affectée : "
        + reclamation.getTitre()+" veuillez consulter votre réclamations"
    );
    
    notificationRepository.save(notification);
    }

    public void updateAffectaion(Long id, Affectation Newaffectation){

            Affectation affectation = repo.findById(id)
             .orElseThrow(()->new RuntimeException("affectaion pas trouvé"));
             Agent agent = agentRepository.findById(Newaffectation.getAgent().getId())
             .orElseThrow(()->new RuntimeException("agent pas trouvé"));
             Reclamation reclamation = reclamationRepository.findById(Newaffectation.getReclamation().getId())
             .orElseThrow(()->new RuntimeException("reclamation pas trouvé"));
             affectation.setDateAffectation(LocalDateTime.now());
             affectation.setCommentaire(Newaffectation.getCommentaire());
             affectation.setAgent(agent);
             affectation.setReclamation(reclamation);
             repo.save(affectation);
        }
        public void deleteAffectation(Long id){

            Affectation affectation = repo.findById(id)
             .orElseThrow(()->new RuntimeException("affectaion pas trouvé"));
             repo.delete(affectation);

        }
        public Page<Affectation> getAffectationByAgent(Long agentId, int page, int size){

                  Pageable pageable = PageRequest.of(
                    page,
                    size,
                    Sort.by("dateAffectation").descending() );
                    return repo.findByAgentId(agentId, pageable);
        }

}
