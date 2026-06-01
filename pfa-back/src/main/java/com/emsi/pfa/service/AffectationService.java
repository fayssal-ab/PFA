package com.emsi.pfa.service;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.emsi.pfa.model.Affectation;

import com.emsi.pfa.repository.AffectationRepository;
import com.emsi.pfa.repository.AgentRepository;
import com.emsi.pfa.repository.HistoriqueRepository;
import com.emsi.pfa.repository.NotificationRepository;
import com.emsi.pfa.repository.ReclamationRepository;
import com.emsi.pfa.repository.StatusRepository;

import com.emsi.pfa.model.Agent;
import com.emsi.pfa.model.Historique;
import com.emsi.pfa.model.Reclamation;
import com.emsi.pfa.model.Status;
import com.emsi.pfa.model.User;
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
    @Autowired
        private CurrentUserService currentUserService;
    @Autowired
        private HistoriqueRepository historiqueRepository;

public void createAffectaion(Affectation affectation) {

    Agent agent = agentRepository.findById(
        affectation.getAgent().getId()
    ).orElseThrow(() ->
        new RuntimeException("Agent non trouvé")
    );

    Reclamation reclamation = reclamationRepository.findById(
        affectation.getReclamation().getId()
    ).orElseThrow(() ->
        new RuntimeException("Réclamation non trouvée")
    );

    User currentUser = currentUserService.getCurrentUser();

    Affectation ancienneAffectation =
        repo.findByReclamationId(
            reclamation.getId()
        ).orElse(null);

    if (ancienneAffectation != null) {

        Historique historique = new Historique();

        historique.setAction(
            "Réaffectation de "
            + ancienneAffectation.getAgent().getUser().getNom()
            + " "
            + ancienneAffectation.getAgent().getUser().getPrenom()
            + " vers "
            + agent.getUser().getNom()
            + " "
            + agent.getUser().getPrenom()
        );

        historique.setReclamation(reclamation);
        historique.setUser(currentUser);
        historique.setDateAction(LocalDateTime.now());
        historiqueRepository.save(historique);

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

        notificationRepository.save(
            ancienneNotification
        );

        repo.delete(ancienneAffectation);

    } else {
        Historique historique = new Historique();

        historique.setAction(
            "Affectation à l'agent "
            + agent.getUser().getNom()
            + " "
            + agent.getUser().getPrenom()
        );

        historique.setReclamation(reclamation);
        historique.setUser(currentUser);
        historique.setDateAction(LocalDateTime.now());
        historiqueRepository.save(historique);
    }

    Status status = statusRepository
        .findByStatus("en cours")
        .orElseThrow(() ->
            new RuntimeException("Status non trouvé")
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

    notification.setUser(
        agent.getUser()
    );

    notification.setReclamation(
        reclamation
    );

    notification.setDateEnvoi(
        LocalDateTime.now()
    );

    notification.setLue(false);

    notification.setMessage(
        "Une réclamation vous a été affectée : "
        + reclamation.getTitre()
        + ". Veuillez consulter vos réclamations."
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
        public Page<Affectation> getAffectationByAgent(
        Long agentId,
        String titre,
        Long statusId,
        Long priorityId,
        Long categorieId,
        int page,
        int size) {

        Pageable pageable = PageRequest.of(
            page,
            size,
            Sort.by("dateAffectation").descending());

        if (titre != null && !titre.trim().isEmpty()) {

        if (statusId != null && priorityId != null && categorieId != null) {
            return repo.findByAgentIdAndReclamation_TitreContainingIgnoreCaseAndReclamation_Status_IdAndReclamation_Priority_IdAndReclamation_Categorie_Id(
                    agentId, titre, statusId, priorityId, categorieId, pageable);
        }

        if (statusId != null && priorityId != null) {
            return repo.findByAgentIdAndReclamation_TitreContainingIgnoreCaseAndReclamation_Status_IdAndReclamation_Priority_Id(
                    agentId, titre, statusId, priorityId, pageable);
        }

        if (statusId != null && categorieId != null) {
            return repo.findByAgentIdAndReclamation_TitreContainingIgnoreCaseAndReclamation_Status_IdAndReclamation_Categorie_Id(
                    agentId, titre, statusId, categorieId, pageable);
        }

        if (priorityId != null && categorieId != null) {
            return repo.findByAgentIdAndReclamation_TitreContainingIgnoreCaseAndReclamation_Priority_IdAndReclamation_Categorie_Id(
                    agentId, titre, priorityId, categorieId, pageable);
        }

        if (statusId != null) {
            return repo.findByAgentIdAndReclamation_TitreContainingIgnoreCaseAndReclamation_Status_Id(
                    agentId, titre, statusId, pageable);
        }

        if (priorityId != null) {
            return repo.findByAgentIdAndReclamation_TitreContainingIgnoreCaseAndReclamation_Priority_Id(
                    agentId, titre, priorityId, pageable);
        }

        if (categorieId != null) {
            return repo.findByAgentIdAndReclamation_TitreContainingIgnoreCaseAndReclamation_Categorie_Id(
                    agentId, titre, categorieId, pageable);
        }

        return repo.findByAgentIdAndReclamation_TitreContainingIgnoreCase(
                agentId, titre, pageable);
    }

    if (statusId != null && priorityId != null && categorieId != null) {
        return repo.findByAgentIdAndReclamation_Status_IdAndReclamation_Priority_IdAndReclamation_Categorie_Id(
                agentId, statusId, priorityId, categorieId, pageable);
    }

    if (statusId != null && priorityId != null) {
        return repo.findByAgentIdAndReclamation_Status_IdAndReclamation_Priority_Id(
                agentId, statusId, priorityId, pageable);
    }

    if (statusId != null && categorieId != null) {
        return repo.findByAgentIdAndReclamation_Status_IdAndReclamation_Categorie_Id(
                agentId, statusId, categorieId, pageable);
    }

    if (priorityId != null && categorieId != null) {
        return repo.findByAgentIdAndReclamation_Priority_IdAndReclamation_Categorie_Id(
                agentId, priorityId, categorieId, pageable);
    }

    if (statusId != null) {
        return repo.findByAgentIdAndReclamation_Status_Id(
                agentId, statusId, pageable);
    }

    if (priorityId != null) {
        return repo.findByAgentIdAndReclamation_Priority_Id(
                agentId, priorityId, pageable);
    }

    if (categorieId != null) {
        return repo.findByAgentIdAndReclamation_Categorie_Id(
                agentId, categorieId, pageable);
    }

    return repo.findByAgentId(agentId, pageable);
}

}
