package com.gymmanagement.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ChatMessageDTO {
    private Long id;
    private Long senderId;
    private String senderName;
    private String senderPhoto;
    private Long receiverId;
    private String receiverName;
    private String receiverPhoto;
    private String message;
    private Long repliedToId;
    private String repliedToMessage;
    private LocalDateTime sentAt;
    private boolean isRead;
    
    // Additional fields for chat list view
    private String lastMessage;
    private LocalDateTime lastMessageTime;
    private Long unreadCount;
    private Long totalMessages;
} 