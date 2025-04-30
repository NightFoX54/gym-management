package com.gymmanagement.controller;

import com.gymmanagement.service.FriendshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/friends")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE})
public class FriendshipController {

    @Autowired
    private FriendshipService friendshipService;

    @GetMapping("/list/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getFriendsList(@PathVariable Long userId) {
        return ResponseEntity.ok(friendshipService.getFriendsList(userId));
    }

    @GetMapping("/requests/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getFriendRequests(@PathVariable Long userId) {
        return ResponseEntity.ok(friendshipService.getFriendRequests(userId));
    }

    @GetMapping("/requests/sent/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getOutgoingFriendRequests(@PathVariable Long userId) {
        return ResponseEntity.ok(friendshipService.getOutgoingFriendRequests(userId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Map<String, Object>>> searchUsers(
            @RequestParam String query,
            @RequestParam Long currentUserId) {
        return ResponseEntity.ok(friendshipService.searchUsers(query, currentUserId));
    }

    @PostMapping("/request")
    public ResponseEntity<?> sendFriendRequest(
            @RequestParam Long senderId,
            @RequestParam Long receiverId) {
        try {
            friendshipService.sendFriendRequest(senderId, receiverId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/request/cancel")
    public ResponseEntity<?> cancelFriendRequest(
            @RequestParam Long senderId,
            @RequestParam Long receiverId) {
        try {
            friendshipService.cancelFriendRequest(senderId, receiverId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/request/{requestId}/accept")
    public ResponseEntity<?> acceptFriendRequest(
            @PathVariable Long requestId,
            @RequestParam Long receiverId) {
        try {
            friendshipService.acceptFriendRequest(requestId, receiverId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/request/{requestId}/reject")
    public ResponseEntity<?> rejectFriendRequest(
            @PathVariable Long requestId,
            @RequestParam Long receiverId) {
        try {
            friendshipService.rejectFriendRequest(requestId, receiverId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{userId}/remove/{friendId}")
    public ResponseEntity<?> removeFriend(
            @PathVariable Long userId,
            @PathVariable Long friendId) {
        try {
            friendshipService.removeFriend(userId, friendId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 