package com.gymmanagement.service;

import com.gymmanagement.dto.ChatMessageDTO;
import com.gymmanagement.model.ChatMessage;
import com.gymmanagement.model.User;
import com.gymmanagement.repository.ChatMessageRepository;
import com.gymmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public ChatMessageDTO sendMessage(Long senderId, Long receiverId, String message, Long repliedToId) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setSender(sender);
        chatMessage.setReceiver(receiver);
        chatMessage.setMessage(message);

        if (repliedToId != null) {
            ChatMessage repliedTo = chatMessageRepository.findById(repliedToId)
                    .orElseThrow(() -> new RuntimeException("Replied message not found"));
            chatMessage.setRepliedTo(repliedTo);
        }

        chatMessage = chatMessageRepository.save(chatMessage);
        return convertToDTO(chatMessage);
    }

    public List<ChatMessageDTO> getMessagesBetweenUsers(Long user1Id, Long user2Id) {
        List<ChatMessage> messages = chatMessageRepository.findMessagesBetweenUsers(user1Id, user2Id);
        return messages.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markMessagesAsRead(Long receiverId, Long senderId) {
        List<ChatMessage> unreadMessages = chatMessageRepository.findMessagesBetweenUsers(receiverId, senderId)
                .stream()
                .filter(m -> !m.isRead() && m.getReceiver().getId().equals(receiverId))
                .collect(Collectors.toList());

        unreadMessages.forEach(ChatMessage::markAsRead);
        chatMessageRepository.saveAll(unreadMessages);
    }

    public List<ChatMessageDTO> getChatList(Long userId) {
        // Get IDs of chat partners
        List<Long> chatPartnerIds = chatMessageRepository.findChatPartnerIds(userId);
        List<ChatMessageDTO> chatList = new ArrayList<>();

        for (Long partnerId : chatPartnerIds) {
            // Fetch the user by ID
            User partner = userRepository.findById(partnerId)
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + partnerId));
            
            List<ChatMessage> latestMessages = chatMessageRepository.findLatestMessagesBetweenUsers(userId, partnerId);
            if (!latestMessages.isEmpty()) {
                ChatMessage latestMessage = latestMessages.get(0);
                ChatMessageDTO dto = new ChatMessageDTO();
                dto.setSenderId(partner.getId());
                dto.setSenderName(partner.getFirstName() + " " + partner.getLastName());
                dto.setSenderPhoto(partner.getProfilePhotoPath());
                dto.setLastMessage(latestMessage.getMessage());
                dto.setLastMessageTime(latestMessage.getSentAt());
                
                // Get unread messages count
                Long unreadCount = chatMessageRepository.countUnreadMessagesFromUser(partner.getId(), userId);
                dto.setUnreadCount(unreadCount);
                
                // Get total messages count
                Long totalMessages = chatMessageRepository.countMessagesBetweenUsers(userId, partner.getId());
                dto.setTotalMessages(totalMessages);
                
                chatList.add(dto);
            }
        }

        return chatList;
    }

    public Long getUnreadMessageCount(Long userId) {
        return (long) chatMessageRepository.findByReceiverIdAndIsReadFalse(userId).size();
    }

    private ChatMessageDTO convertToDTO(ChatMessage message) {
        ChatMessageDTO dto = new ChatMessageDTO();
        dto.setId(message.getId());
        dto.setSenderId(message.getSender().getId());
        dto.setSenderName(message.getSender().getFirstName() + " " + message.getSender().getLastName());
        dto.setSenderPhoto(message.getSender().getProfilePhotoPath());
        dto.setReceiverId(message.getReceiver().getId());
        dto.setReceiverName(message.getReceiver().getFirstName() + " " + message.getReceiver().getLastName());
        dto.setReceiverPhoto(message.getReceiver().getProfilePhotoPath());
        dto.setMessage(message.getMessage());
        dto.setSentAt(message.getSentAt());
        dto.setRead(message.isRead());

        if (message.getRepliedTo() != null) {
            dto.setRepliedToId(message.getRepliedTo().getId());
            dto.setRepliedToMessage(message.getRepliedTo().getMessage());
        }

        return dto;
    }
} 