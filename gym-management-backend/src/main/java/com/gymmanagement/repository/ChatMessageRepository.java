package com.gymmanagement.repository;

import com.gymmanagement.model.ChatMessage;
import com.gymmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    // Get all messages between two users
    @Query("SELECT m FROM ChatMessage m WHERE " +
           "(m.sender.id = :user1Id AND m.receiver.id = :user2Id) OR " +
           "(m.sender.id = :user2Id AND m.receiver.id = :user1Id) " +
           "ORDER BY m.sentAt DESC")
    List<ChatMessage> findMessagesBetweenUsers(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);
    
    // Get unread messages for a user
    List<ChatMessage> findByReceiverIdAndIsReadFalse(Long receiverId);
    
    // Get unread messages count from a specific sender
    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.sender.id = :senderId AND m.receiver.id = :receiverId AND m.isRead = false")
    Long countUnreadMessagesFromUser(@Param("senderId") Long senderId, @Param("receiverId") Long receiverId);
    
    // Get latest message between two users
    @Query("SELECT m FROM ChatMessage m WHERE " +
           "(m.sender.id = :user1Id AND m.receiver.id = :user2Id) OR " +
           "(m.sender.id = :user2Id AND m.receiver.id = :user1Id) " +
           "ORDER BY m.sentAt DESC")
    List<ChatMessage> findLatestMessagesBetweenUsers(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);
    
    // Get all chat partners for a user (modified to return IDs instead of entities)
    @Query("SELECT DISTINCT CASE " +
           "WHEN m.sender.id = :userId THEN m.receiver.id " +
           "ELSE m.sender.id END " +
           "FROM ChatMessage m " +
           "WHERE m.sender.id = :userId OR m.receiver.id = :userId")
    List<Long> findChatPartnerIds(@Param("userId") Long userId);
    
    // Get total messages count between users
    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE " +
           "(m.sender.id = :user1Id AND m.receiver.id = :user2Id) OR " +
           "(m.sender.id = :user2Id AND m.receiver.id = :user1Id)")
    Long countMessagesBetweenUsers(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);
} 