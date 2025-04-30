package com.gymmanagement.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ForumThreadDTO {
    private Integer id;
    private Long userId;
    private String userName;
    private String userProfilePhoto;
    private String title;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime lastPostAt;
    private Integer totalPosts;
    private Integer totalLikes;
    private boolean areFriends;
    private boolean hasRequest;
    private boolean receivedRequest;
    private Long requestId;
} 