package com.gymmanagement.service;

import com.gymmanagement.model.Notification;
import com.gymmanagement.repository.NotificationRepository;
import com.gymmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Get all notifications for a user
     */
    public List<Notification> getNotificationsForUser(Long userId) {
        return notificationRepository.findByUser(userRepository.findById(userId).orElse(null));
    }

    /**
     * Get count of notifications for a user
     */
    public Integer getUnreadNotificationCount(Long userId) {
        return notificationRepository.countByUserId(userId);
    }

    /**
     * Delete a notification (used when user reads/acts on a notification)
     */
    @Transactional
    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    public Notification getNotificationById(Long notificationId) {
        return notificationRepository.findById(notificationId).orElse(null);
    }
} 