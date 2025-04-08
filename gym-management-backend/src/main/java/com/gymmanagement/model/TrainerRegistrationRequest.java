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
@Table(name = "trainer_registration_requests")
public class TrainerRegistrationRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "trainer_id", nullable = false)
    private User trainer;
    
    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private User client;
    
    @Column(name = "request_message")
    private String requestMessage;
    
    @Column(name = "requested_meeting_date", nullable = false)
    private LocalDate requestedMeetingDate;
    
    @Column(name = "requested_meeting_time", nullable = false)
    private LocalTime requestedMeetingTime;
    
    @Column(name = "is_modified_by_trainer", nullable = false)
    private Boolean isModifiedByTrainer = false;
}
