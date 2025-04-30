package com.gymmanagement.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "chat_messages")
public class ChatMessage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;
    
    @Column(name = "chat_message", nullable = false, columnDefinition = "TEXT")
    private String message;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "replied_to")
    private ChatMessage repliedTo;
    
    @Column(name = "sent_at")
    private LocalDateTime sentAt = LocalDateTime.now();
    
    @Column(name = "isRead", columnDefinition = "TINYINT(1) DEFAULT 0")
    private boolean isRead = false;

    // Custom getters and setters if needed
    public void markAsRead() {
        this.isRead = true;
    }

    public boolean isFromUser(Long userId) {
        return this.sender != null && this.sender.getId().equals(userId);
    }

    public boolean isToUser(Long userId) {
        return this.receiver != null && this.receiver.getId().equals(userId);
    }
} 