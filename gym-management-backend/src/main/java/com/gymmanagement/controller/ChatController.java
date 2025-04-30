package com.gymmanagement.controller;

import com.gymmanagement.dto.ChatMessageDTO;
import com.gymmanagement.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping("/send")
    public ResponseEntity<ChatMessageDTO> sendMessage(
            @RequestParam Long senderId,
            @RequestParam Long receiverId,
            @RequestParam String message,
            @RequestParam(required = false) Long repliedToId) {
        return ResponseEntity.ok(chatService.sendMessage(senderId, receiverId, message, repliedToId));
    }

    @GetMapping("/messages")
    public ResponseEntity<List<ChatMessageDTO>> getMessages(
            @RequestParam Long user1Id,
            @RequestParam Long user2Id) {
        return ResponseEntity.ok(chatService.getMessagesBetweenUsers(user1Id, user2Id));
    }

    @PostMapping("/mark-read")
    public ResponseEntity<?> markMessagesAsRead(
            @RequestParam Long receiverId,
            @RequestParam Long senderId) {
        chatService.markMessagesAsRead(receiverId, senderId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/list/{userId}")
    public ResponseEntity<List<ChatMessageDTO>> getChatList(@PathVariable Long userId) {
        return ResponseEntity.ok(chatService.getChatList(userId));
    }

    @GetMapping("/unread-count/{userId}")
    public ResponseEntity<Long> getUnreadMessageCount(@PathVariable Long userId) {
        return ResponseEntity.ok(chatService.getUnreadMessageCount(userId));
    }
} 