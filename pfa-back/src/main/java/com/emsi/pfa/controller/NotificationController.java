package com.emsi.pfa.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.emsi.pfa.service.NotificationService;
import com.emsi.pfa.model.Notification;
import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {
    @Autowired
        private NotificationService service;

        @PostMapping("/add-notification")
        public String addNotification(@RequestBody Notification notification) {
            service.addNotification(notification);
            return "Notification ajoutée avec succès";
        }
        @PutMapping("/update-notification/{id}")
        public String updateNotification(@PathVariable Long id, @RequestBody Notification notification) {
            service.updateNotification(id, notification);
            return "Notification modifiée avec succès";
        }
        @GetMapping("/get-notification/{id}")   
        public Notification getNotification(@PathVariable Long id) {
            return service.getNotification(id);
        }
        @GetMapping("/get-notifications-by-client/{clientId}")
        public List<Notification> getNotificationsByClient(@PathVariable Long clientId) {
            return service.getNotificationsByClient(clientId);
        }
        @DeleteMapping("/delete-notification/{id}")
        public String deleteNotification(@PathVariable Long id) {
            service.deleteNotification(id);
            return "notification supprimée avec succées";
        }
        @PostMapping("/mark-as-read/{id}")
        public String markAsRead(@PathVariable Long id) {
            service.markAsRead(id);
            return "Notification marquée comme lue avec succès";
        }
}
