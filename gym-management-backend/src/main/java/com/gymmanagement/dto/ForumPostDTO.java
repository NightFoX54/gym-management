package com.gymmanagement.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ForumPostDTO {
    private Integer id;
    private Integer threadId;
    private String threadTitle;
    private String threadDescription;
    private Long userId;
    private String userName;
    private String userProfilePhoto;
    private String content;
    private Integer quotedPostId;
    private String quotedContent;
    private String quotedUserName;
    private LocalDateTime createdAt;
    private Integer likesCount;
    private boolean isLikedByCurrentUser;
    private boolean canEdit;
    private boolean canDelete;
    private boolean areFriends;
    private boolean hasRequest;
    private boolean receivedRequest;
    private Long requestId;
} 