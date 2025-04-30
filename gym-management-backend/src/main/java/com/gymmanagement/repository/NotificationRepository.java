package com.gymmanagement.repository;

import com.gymmanagement.model.Notification;
import com.gymmanagement.model.Notification.NotificationType;
import com.gymmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    // Find all notifications for a specific user
    List<Notification> findByUser(User user);
    
    // Find all notifications for a user ID
    List<Notification> findByUserId(Long userId);

    
    // Count notifications for a user
    Integer countByUserId(Long userId);
    
    // Find notifications by type
    List<Notification> findByNotificationType(NotificationType notificationType);
    
    // Find notifications by user and type
    List<Notification> findByUserAndNotificationType(User user, NotificationType notificationType);
    
    // Find notifications by user ID and type
    List<Notification> findByUserIdAndNotificationType(Long userId, NotificationType notificationType);
    
    // Find notifications related to a specific forum thread
    List<Notification> findByForumThreadId(Long forumThreadId);
    
    // Find notifications created after a certain date
    List<Notification> findByCreatedAtAfter(LocalDateTime dateTime);

    List<Notification> findByUserAndForumThreadId(User user, Integer forumThreadId);
} 