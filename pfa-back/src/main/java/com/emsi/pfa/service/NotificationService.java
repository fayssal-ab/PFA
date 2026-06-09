package com.emsi.pfa.service;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.List;

import com.emsi.pfa.repository.HistoriqueRepository;
import com.emsi.pfa.repository.NotificationRepository;
import com.emsi.pfa.repository.ReclamationRepository;
import com.emsi.pfa.model.Historique;
import com.emsi.pfa.model.Notification;
import com.emsi.pfa.model.Reclamation;
import com.emsi.pfa.model.User;
@Service
public class NotificationService {
    @Autowired
        private NotificationRepository repo;
    @Autowired
        private CurrentUserService currentUserService;
    @Autowired
        private HistoriqueRepository historiqueRepository;
    @Autowired
    private ReclamationRepository reclamationRepository;

        public void addNotification(Notification notification) {
            Reclamation reclamation = reclamationRepository
            .findById(notification.getReclamation().getId())
            .orElseThrow(() -> new RuntimeException("Réclamation introuvable"));
            Notification not = new Notification();
            not.setMessage(notification.getMessage());
            not.setUser(reclamation.getClient().getUser());
            not.setReclamation(reclamation);
            repo.save(not);
        }
        public void updateNotification(Long id, Notification notification) {
            Notification existingNotification = repo.findById(id).orElse(null);
            if (existingNotification != null) {
                existingNotification.setMessage(notification.getMessage());
                existingNotification.setDateEnvoi(notification.getDateEnvoi());
                repo.save(existingNotification);
            }
        }
        public void deleteNotification(Long id) {
            repo.deleteById(id);
        }
        public Notification getNotification(Long id) {
            return repo.findById(id).orElse(null);
        }
        public List<Notification> getNotificationsByClient(Long clientId) {
            return repo.findByUserIdOrderByDateEnvoiDesc(clientId);
        }
        public void markAsRead(Long id) {
            Notification notification = repo.findById(id).orElse(null);
            if (notification != null) {
            User currentUser = currentUserService.getCurrentUser();
            Historique historique = new Historique();

            historique.setAction(
            currentUser.getNom()+" "+currentUser.getPrenom()+" a lu la notification #" + notification.getId()
            );

            historique.setReclamation(notification.getReclamation());
            historique.setUser(currentUser);
            historique.setDateAction(LocalDateTime.now());
            historiqueRepository.save(historique);
        }
                notification.setLue(true);
                repo.save(notification);
        }
        

        public long getUnreadNotificationsCount(Long userId) {
            return repo.countByUserIdAndLueFalse(userId);
        }
}
