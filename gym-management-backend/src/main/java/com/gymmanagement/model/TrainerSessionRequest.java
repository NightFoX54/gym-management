package com.gymmanagement.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "trainer_session_requests")
public class TrainerSessionRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "trainer_id", nullable = false)
    private User trainer;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "client_id", nullable = false)
    private User client;
    
    @Column(name = "request_message", columnDefinition = "TEXT")
    private String requestMessage;
    
    @Column(name = "requested_meeting_date")
    private LocalDate requestedMeetingDate;
    
    @Column(name = "requested_meeting_time")
    private LocalTime requestedMeetingTime;
} 