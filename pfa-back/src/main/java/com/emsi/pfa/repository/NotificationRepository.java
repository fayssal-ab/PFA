package com.emsi.pfa.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.emsi.pfa.model.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
        List<Notification> findByUserId(Long UserId);

}
