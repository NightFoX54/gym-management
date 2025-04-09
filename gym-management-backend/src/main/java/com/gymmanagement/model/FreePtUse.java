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
@Table(name = "free_pt_use")
public class FreePtUse {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "member_id", nullable = false)
    private User member;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "session_id")
    private TrainerSession session;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "session_request_id")
    private TrainerSessionRequest sessionRequest;
    
    @Column(name = "use_time", nullable = false)
    private LocalDateTime useTime;
} 