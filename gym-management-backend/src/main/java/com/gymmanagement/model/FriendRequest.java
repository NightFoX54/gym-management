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
@Table(name = "friend_requests")
public class FriendRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;
    
    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;
    
    @Column(name = "date")
    private LocalDateTime date = LocalDateTime.now();
} 