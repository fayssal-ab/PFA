package com.emsi.pfa.service;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import com.emsi.pfa.repository.NotificationRepository;
import com.emsi.pfa.model.Notification;
@Service
public class NotificationService {
    @Autowired
        private NotificationRepository repo;

        public void addNotification(Notification notification) {
            repo.save(notification);
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
            return repo.findByUserId(clientId);
        }
        public void markAsRead(Long id) {
            Notification notification = repo.findById(id).orElse(null);
            if (notification != null) {
                notification.setLue(true);
                repo.save(notification);
            }
        }
}
