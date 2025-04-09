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
@Table(name = "trainer_session_reschedule_request")
public class TrainerSessionRescheduleRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "session_id", nullable = false)
    private TrainerSession session;
    
    @Column(name = "new_session_date", nullable = false)
    private LocalDate newSessionDate;
    
    @Column(name = "new_session_time", nullable = false)
    private LocalTime newSessionTime;
} 