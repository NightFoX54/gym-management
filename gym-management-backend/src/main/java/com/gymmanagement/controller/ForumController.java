package com.gymmanagement.controller;

import com.gymmanagement.dto.ForumPostDTO;
import com.gymmanagement.dto.ForumThreadDTO;
import com.gymmanagement.model.*;
import com.gymmanagement.repository.*;
import com.gymmanagement.model.Notification.NotificationType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/forum")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ForumController {

    @Autowired
    private ForumThreadRepository threadRepository;
    
    @Autowired
    private ForumPostRepository postRepository;
    
    @Autowired
    private ForumLikeRepository likeRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FriendsRepository friendsRepository;

    @Autowired
    private FriendRequestRepository friendRequestRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    // Get latest threads with pagination
    @GetMapping("/threads")
    public ResponseEntity<Page<ForumThreadDTO>> getLatestThreads(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long currentUserId) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ForumThread> threads = threadRepository.findAllOrderByLatestPost(pageable);
        
        Page<ForumThreadDTO> threadDTOs = threads.map(thread -> {
            ForumThreadDTO dto = convertToThreadDTO(thread);
            
            if (currentUserId != null) {
                User currentUser = userRepository.findById(currentUserId).orElse(null);
                User threadUser = thread.getUser();
                
                if (currentUser != null && threadUser != null) {
                    boolean areFriends = friendsRepository.areFriends(currentUser, threadUser);
                    boolean hasRequest = friendRequestRepository.existsBetweenUsers(currentUser, threadUser);
                    
                    dto.setAreFriends(areFriends);
                    dto.setHasRequest(hasRequest);
                    
                    if (hasRequest) {
                        FriendRequest request = friendRequestRepository.findBySenderAndReceiver(currentUser, threadUser);
                        if (request == null) {
                            request = friendRequestRepository.findBySenderAndReceiver(threadUser, currentUser);
                            if (request != null) {
                                dto.setReceivedRequest(true);
                                dto.setRequestId(request.getId());
                            }
                        }
                    }
                }
            }
            
            return dto;
        });
        
        return ResponseEntity.ok(threadDTOs);
    }

    // Get hot threads (most active in last week)
    @GetMapping("/hot-threads")
    public ResponseEntity<List<ForumThreadDTO>> getHotThreads() {
        LocalDateTime weekAgo = LocalDateTime.now().minusWeeks(1);
        List<ForumThread> hotThreads = threadRepository.findHotThreads(weekAgo, PageRequest.of(0, 5));
        
        return ResponseEntity.ok(hotThreads.stream()
                .map(this::convertToThreadDTO)
                .collect(Collectors.toList()));
    }

    // Get top contributors
    @GetMapping("/top-contributors")
    public ResponseEntity<List<Map<String, Object>>> getTopContributors(
            @RequestParam(required = false) Long currentUserId) {
        List<Object[]> contributors = postRepository.findTopContributors(PageRequest.of(0, 5));
        
        List<Map<String, Object>> result = contributors.stream()
                .map(arr -> {
                    User user = (User) arr[0];
                    Long postCount = (Long) arr[1];
                    Map<String, Object> map = new HashMap<>();
                    map.put("userId", user.getId());
                    map.put("userName", user.getName());
                    map.put("profilePhoto", user.getProfilePhotoPath());
                    map.put("postCount", postCount);

                    if (currentUserId != null) {
                        User currentUser = userRepository.findById(currentUserId).orElse(null);
                        if (currentUser != null && !currentUser.getId().equals(user.getId())) {
                            boolean areFriends = friendsRepository.areFriends(currentUser, user);
                            boolean hasRequest = friendRequestRepository.existsBetweenUsers(currentUser, user);
                            map.put("areFriends", areFriends);
                            map.put("hasRequest", hasRequest);
                            
                            if (hasRequest) {
                                FriendRequest request = friendRequestRepository.findBySenderAndReceiver(currentUser, user);
                                if (request == null) {
                                    request = friendRequestRepository.findBySenderAndReceiver(user, currentUser);
                                    if (request != null) {
                                        map.put("receivedRequest", true);
                                        map.put("requestId", request.getId());
                                    }
                                }
                            }
                        }
                    }
                    
                    return map;
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(result);
    }

    // Get posts for a thread with pagination
    @GetMapping("/threads/{threadId}/posts")
    public ResponseEntity<Page<ForumPostDTO>> getThreadPosts(
            @PathVariable Integer threadId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam Long currentUserId) {
        
        Optional<ForumThread> threadOpt = threadRepository.findById(threadId);
        if (!threadOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        ForumThread thread = threadOpt.get();
        Pageable pageable = PageRequest.of(page, size);
        Page<ForumPost> posts = postRepository.findByThreadOrderByCreatedAtAsc(thread, pageable);
        
        // Create a Page of ForumPostDTO with thread information
        Page<ForumPostDTO> postDTOs = posts.map(post -> {
            ForumPostDTO dto = convertToPostDTO(post, currentUserId);
            // Add thread information to the first post
            if (page == 0 && posts.getContent().indexOf(post) == 0) {
                dto.setThreadTitle(thread.getTitle());
                dto.setThreadDescription(thread.getDescription());
            }
            return dto;
        });
        
        return ResponseEntity.ok(postDTOs);
    }

    // Create new thread
    @PostMapping("/threads")
    public ResponseEntity<ForumThreadDTO> createThread(
            @RequestParam Long userId,
            @RequestParam String title,
            @RequestParam String description) {
        
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        
        ForumThread thread = new ForumThread();
        thread.setUser(userOpt.get());
        thread.setTitle(title);
        thread.setDescription(description);
        
        ForumThread savedThread = threadRepository.save(thread);
        return ResponseEntity.ok(convertToThreadDTO(savedThread));
    }

    // Create new post
    @PostMapping("/threads/{threadId}/posts")
    public ResponseEntity<ForumPostDTO> createPost(
            @PathVariable Integer threadId,
            @RequestParam Long userId,
            @RequestParam String content,
            @RequestParam(required = false) Integer quotedPostId) {
        
        Optional<ForumThread> threadOpt = threadRepository.findById(threadId);
        Optional<User> userOpt = userRepository.findById(userId);
        
        if (!threadOpt.isPresent() || !userOpt.isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        
        ForumPost post = new ForumPost();
        post.setThread(threadOpt.get());
        post.setUser(userOpt.get());
        post.setContent(content);
        
        if (quotedPostId != null) {
            Optional<ForumPost> quotedPostOpt = postRepository.findById(quotedPostId);
            quotedPostOpt.ifPresent(post::setQuotedPost);
            // Create a notification for the user who quoted the post
            Notification notification = new Notification();
            notification.setUser(quotedPostOpt.get().getUser());
            notification.setNotificationType(NotificationType.forum);
            notification.setMessage("You have been quoted in a forum post.");
            notification.setForumThreadId(post.getThread().getId());
            notificationRepository.save(notification);
        }
        
        ForumPost savedPost = postRepository.save(post);

        // Create a notification for the user who created the post
        Notification notification = new Notification();
        notification.setUser(threadOpt.get().getUser());
        notification.setNotificationType(NotificationType.forum);
        notification.setMessage("You have a new post in your forum thread.");
        notification.setForumThreadId(post.getThread().getId());
        notificationRepository.save(notification);
        return ResponseEntity.ok(convertToPostDTO(savedPost, userId));
    }

    // Toggle like on a post
    @Transactional
    @PostMapping("/posts/{postId}/toggle-like")
    public ResponseEntity<Map<String, Object>> toggleLike(
            @PathVariable Integer postId,
            @RequestParam Long userId) {
        
        Optional<ForumPost> postOpt = postRepository.findById(postId);
        Optional<User> userOpt = userRepository.findById(userId);
        
        if (!postOpt.isPresent() || !userOpt.isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        
        ForumPost post = postOpt.get();
        User user = userOpt.get();
        
        boolean wasLiked = likeRepository.existsByUserAndPost(user, post);

        // Create a notification for the user who liked the post
        

        if (wasLiked) {
            likeRepository.deleteByUserAndPost(user, post);
        } else {
            ForumLike like = new ForumLike();
            like.setPost(post);
            like.setUser(user);
            likeRepository.save(like);
            if(user != post.getUser()){
                List<Notification> notifications = notificationRepository.findByUserAndForumThreadId(post.getUser(), post.getThread().getId());
                if(notifications.isEmpty()){
                    Notification notification = new Notification();
                    notification.setUser(post.getUser());
                    notification.setNotificationType(NotificationType.forum);
                    notification.setMessage("You have new likes on your post in the forum.");
                    notification.setForumThreadId(post.getThread().getId());
                    notificationRepository.save(notification);
                }
            }
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("liked", !wasLiked);
        response.put("likesCount", likeRepository.countByPost(post));
        
        return ResponseEntity.ok(response);
    }

    // Edit post
    @PutMapping("/posts/{postId}")
    public ResponseEntity<ForumPostDTO> editPost(
            @PathVariable Integer postId,
            @RequestParam Long userId,
            @RequestParam String content) {
        
        Optional<ForumPost> postOpt = postRepository.findById(postId);
        if (!postOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        ForumPost post = postOpt.get();
        if (!post.getUser().getId().equals(userId)) {
            return ResponseEntity.badRequest().build();
        }
        
        post.setContent(content);
        ForumPost savedPost = postRepository.save(post);
        
        return ResponseEntity.ok(convertToPostDTO(savedPost, userId));
    }

    // Delete post
    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<?> deletePost(
            @PathVariable Integer postId,
            @RequestParam Long userId) {
        
        Optional<ForumPost> postOpt = postRepository.findById(postId);
        if (!postOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        ForumPost post = postOpt.get();
        if (!post.getUser().getId().equals(userId)) {
            return ResponseEntity.badRequest().build();
        }
        
        postRepository.delete(post);
        return ResponseEntity.ok().build();
    }

    // Get thread details
    @GetMapping("/threads/{threadId}")
    public ResponseEntity<ForumThreadDTO> getThreadDetails(
            @PathVariable Integer threadId,
            @RequestParam(required = false) Long currentUserId) {
        Optional<ForumThread> threadOpt = threadRepository.findById(threadId);
        if (!threadOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        ForumThread thread = threadOpt.get();
        ForumThreadDTO dto = convertToThreadDTO(thread);
        
        if (currentUserId != null) {
            User currentUser = userRepository.findById(currentUserId).orElse(null);
            User threadUser = thread.getUser();
            
            if (currentUser != null && threadUser != null) {
                boolean areFriends = friendsRepository.areFriends(currentUser, threadUser);
                boolean hasRequest = friendRequestRepository.existsBetweenUsers(currentUser, threadUser);
                
                dto.setAreFriends(areFriends);
                dto.setHasRequest(hasRequest);
                
                if (hasRequest) {
                    FriendRequest request = friendRequestRepository.findBySenderAndReceiver(currentUser, threadUser);
                    if (request == null) {
                        request = friendRequestRepository.findBySenderAndReceiver(threadUser, currentUser);
                        if (request != null) {
                            dto.setReceivedRequest(true);
                            dto.setRequestId(request.getId());
                        }
                    }
                }
            }
        }
        
        return ResponseEntity.ok(dto);
    }

    // Edit thread
    @PutMapping("/threads/{threadId}")
    public ResponseEntity<?> editThread(
            @PathVariable Integer threadId,
            @RequestParam Long userId,
            @RequestParam String title,
            @RequestParam String description) {
        
        Optional<ForumThread> threadOpt = threadRepository.findById(threadId);
        if (!threadOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        ForumThread thread = threadOpt.get();
        if (!thread.getUser().getId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only edit your own threads");
        }
        
        thread.setTitle(title);
        thread.setDescription(description);
        ForumThread savedThread = threadRepository.save(thread);
        
        return ResponseEntity.ok(convertToThreadDTO(savedThread));
    }

    // Delete thread
    @DeleteMapping("/threads/{threadId}")
    @Transactional
    public ResponseEntity<?> deleteThread(
            @PathVariable Integer threadId,
            @RequestParam Long userId) {
        
        Optional<ForumThread> threadOpt = threadRepository.findById(threadId);
        if (!threadOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        ForumThread thread = threadOpt.get();
        if (!thread.getUser().getId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only delete your own threads");
        }
        
        // Delete all posts and their likes
        List<ForumPost> posts = postRepository.findByThreadOrderByCreatedAtAsc(thread, Pageable.unpaged()).getContent();
        for (ForumPost post : posts) {
            // Delete likes for this post
            likeRepository.deleteAll(likeRepository.findByPost(post));
        }
        
        // Delete all posts for this thread
        postRepository.deleteAll(posts);
        
        // Finally delete the thread
        threadRepository.delete(thread);
        
        return ResponseEntity.ok().build();
    }

    // Helper methods to convert entities to DTOs
    private ForumThreadDTO convertToThreadDTO(ForumThread thread) {
        ForumThreadDTO dto = new ForumThreadDTO();
        dto.setId(thread.getId());
        dto.setUserId(thread.getUser().getId());
        dto.setUserName(thread.getUser().getName());
        dto.setUserProfilePhoto(thread.getUser().getProfilePhotoPath());
        dto.setTitle(thread.getTitle());
        dto.setDescription(thread.getDescription());
        dto.setCreatedAt(thread.getCreatedAt());
        
        // Get latest post date
        Optional<ForumPost> latestPost = postRepository.findByThreadOrderByCreatedAtAsc(thread, PageRequest.of(0, 1))
                .getContent()
                .stream()
                .findFirst();
        latestPost.ifPresent(post -> dto.setLastPostAt(post.getCreatedAt()));
        
        // Count total posts and likes
        Page<ForumPost> posts = postRepository.findByThreadOrderByCreatedAtAsc(thread, Pageable.unpaged());
        dto.setTotalPosts(posts.getNumberOfElements());
        
        int totalLikes = posts.getContent().stream()
                .mapToInt(post -> (int) likeRepository.countByPost(post))
                .sum();
        dto.setTotalLikes(totalLikes);
        
        return dto;
    }

    private ForumPostDTO convertToPostDTO(ForumPost post, Long currentUserId) {
        ForumPostDTO dto = new ForumPostDTO();
        dto.setId(post.getId());
        dto.setThreadId(post.getThread().getId());
        dto.setThreadTitle(post.getThread().getTitle());
        dto.setThreadDescription(post.getThread().getDescription());
        dto.setUserId(post.getUser().getId());
        dto.setUserName(post.getUser().getName());
        dto.setUserProfilePhoto(post.getUser().getProfilePhotoPath());
        dto.setContent(post.getContent());
        dto.setCreatedAt(post.getCreatedAt());
        
        if (post.getQuotedPost() != null) {
            dto.setQuotedPostId(post.getQuotedPost().getId());
            dto.setQuotedContent(post.getQuotedPost().getContent());
            dto.setQuotedUserName(post.getQuotedPost().getUser().getName());
        }
        
        dto.setLikesCount((int) likeRepository.countByPost(post));
        dto.setLikedByCurrentUser(likeRepository.existsByUserAndPost(
                userRepository.findById(currentUserId).orElse(null), 
                post));
        
        dto.setCanEdit(post.getUser().getId().equals(currentUserId));
        dto.setCanDelete(post.getUser().getId().equals(currentUserId));

        // Add friendship status
        User currentUser = userRepository.findById(currentUserId).orElse(null);
        User postUser = post.getUser();
        
        if (currentUser != null && postUser != null && !currentUser.getId().equals(postUser.getId())) {
            boolean areFriends = friendsRepository.areFriends(currentUser, postUser);
            boolean hasRequest = friendRequestRepository.existsBetweenUsers(currentUser, postUser);
            
            dto.setAreFriends(areFriends);
            dto.setHasRequest(hasRequest);
            
            if (hasRequest) {
                FriendRequest request = friendRequestRepository.findBySenderAndReceiver(currentUser, postUser);
                if (request == null) {
                    request = friendRequestRepository.findBySenderAndReceiver(postUser, currentUser);
                    if (request != null) {
                        dto.setReceivedRequest(true);
                        dto.setRequestId(request.getId());
                    }
                }
            }
        }
        
        return dto;
    }
} 