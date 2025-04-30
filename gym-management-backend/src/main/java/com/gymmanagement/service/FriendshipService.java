package com.gymmanagement.service;

import com.gymmanagement.model.FriendRequest;
import com.gymmanagement.model.Friends;
import com.gymmanagement.model.User;
import com.gymmanagement.model.Notification;
import com.gymmanagement.model.Notification.NotificationType;
import com.gymmanagement.repository.FriendRequestRepository;
import com.gymmanagement.repository.FriendsRepository;
import com.gymmanagement.repository.UserRepository;
import com.gymmanagement.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class FriendshipService {

    @Autowired
    private FriendsRepository friendsRepository;

    @Autowired
    private FriendRequestRepository friendRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    public List<Map<String, Object>> getFriendsList(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Friends> friendships = friendsRepository.findAllFriendsByUser(user);
        
        return friendships.stream()
                .map(friendship -> {
                    User friend = friendship.getUser1().getId().equals(userId) ? 
                            friendship.getUser2() : friendship.getUser1();
                    
                    Map<String, Object> friendMap = new HashMap<>();
                    friendMap.put("id", friend.getId());
                    friendMap.put("firstName", friend.getFirstName());
                    friendMap.put("lastName", friend.getLastName());
                    friendMap.put("email", friend.getEmail());
                    friendMap.put("profilePhotoPath", friend.getProfilePhotoPath());
                    return friendMap;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getFriendRequests(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<FriendRequest> requests = friendRequestRepository.findByReceiver(user);
        
        return requests.stream()
                .map(request -> {
                    Map<String, Object> requestMap = new HashMap<>();
                    requestMap.put("id", request.getId());
                    requestMap.put("senderId", request.getSender().getId());
                    requestMap.put("senderName", request.getSender().getFirstName() + " " + request.getSender().getLastName());
                    requestMap.put("senderPhoto", request.getSender().getProfilePhotoPath());
                    requestMap.put("date", request.getDate());
                    return requestMap;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> searchUsers(String query, Long currentUserId) {
        List<User> users = userRepository.findByFirstNameContainingOrLastNameContaining(query, query);
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        return users.stream()
                .filter(user -> !user.getId().equals(currentUserId))
                .map(user -> {
                    boolean areFriends = friendsRepository.areFriends(currentUser, user);
                    boolean hasRequest = friendRequestRepository.existsBetweenUsers(currentUser, user);
                    
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("id", user.getId());
                    userMap.put("firstName", user.getFirstName());
                    userMap.put("lastName", user.getLastName());
                    userMap.put("email", user.getEmail());
                    userMap.put("profilePhotoPath", user.getProfilePhotoPath());
                    userMap.put("areFriends", areFriends);
                    userMap.put("hasRequest", hasRequest);
                    userMap.put("role", user.getRole());
                    return userMap;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void sendFriendRequest(Long senderId, Long receiverId) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        if (friendsRepository.areFriends(sender, receiver)) {
            throw new RuntimeException("Users are already friends");
        }

        if (friendRequestRepository.existsBetweenUsers(sender, receiver)) {
            throw new RuntimeException("Friend request already exists");
        }

        FriendRequest request = new FriendRequest();
        request.setSender(sender);
        request.setReceiver(receiver);
        friendRequestRepository.save(request);
        Notification notification = new Notification();
        notification.setUser(receiver);
        notification.setNotificationType(NotificationType.friend_request);
        notification.setMessage("You have a new friend request from " + sender.getFirstName() + " " + sender.getLastName());
        notificationRepository.save(notification);
    }

    @Transactional
    public void cancelFriendRequest(Long senderId, Long receiverId) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        FriendRequest request = friendRequestRepository.findBySenderAndReceiver(sender, receiver);
        if (request != null) {
            friendRequestRepository.delete(request);
        }
    }

    @Transactional
    public void acceptFriendRequest(Long requestId, Long receiverId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Friend request not found"));

        if (!request.getReceiver().getId().equals(receiverId)) {
            throw new RuntimeException("Unauthorized to accept this request");
        }

        Friends friendship = new Friends();
        friendship.setUser1(request.getSender());
        friendship.setUser2(request.getReceiver());
        friendsRepository.save(friendship);

        friendRequestRepository.delete(request);
        Notification notification = new Notification();
        notification.setUser(request.getSender());
        notification.setNotificationType(NotificationType.friend_request);
        notification.setMessage("Your friend request to " + request.getReceiver().getFirstName() + " " + request.getReceiver().getLastName() + " has been accepted.");
        notificationRepository.save(notification);
    }

    @Transactional
    public void rejectFriendRequest(Long requestId, Long receiverId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Friend request not found"));

        if (!request.getReceiver().getId().equals(receiverId)) {
            throw new RuntimeException("Unauthorized to reject this request");
        }

        friendRequestRepository.delete(request);
        Notification notification = new Notification();
        notification.setUser(request.getSender());
        notification.setNotificationType(NotificationType.friend_request);
        notification.setMessage("Your friend request to " + request.getReceiver().getFirstName() + " " + request.getReceiver().getLastName() + " has been rejected.");
        notificationRepository.save(notification);
    }

    @Transactional
    public void removeFriend(Long userId, Long friendId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User friend = userRepository.findById(friendId)
                .orElseThrow(() -> new RuntimeException("Friend not found"));

        Friends friendship = friendsRepository.findFriendshipBetween(user, friend);
        if (friendship != null) {
            friendsRepository.delete(friendship);
        }
        Notification notification = new Notification();
        notification.setUser(friend);
        notification.setNotificationType(NotificationType.friend_request);
        notification.setMessage("You have been removed from " + user.getFirstName() + " " + user.getLastName() + "'s friends list.");
        notificationRepository.save(notification);
    }

    public List<Map<String, Object>> getOutgoingFriendRequests(Long userId) {
        List<FriendRequest> outgoingRequests = friendRequestRepository.findBySenderId(userId);
        return outgoingRequests.stream().map(request -> {
            Map<String, Object> requestInfo = new HashMap<>();
            User receiver = request.getReceiver();
            requestInfo.put("id", request.getId());
            requestInfo.put("userId", receiver.getId());
            requestInfo.put("firstName", receiver.getFirstName());
            requestInfo.put("lastName", receiver.getLastName());
            requestInfo.put("email", receiver.getEmail());
            requestInfo.put("profilePhotoPath", receiver.getProfilePhotoPath());
            return requestInfo;
        }).collect(Collectors.toList());
    }
} 