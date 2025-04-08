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
@Table(name = "trainer_clients")
public class TrainerClient {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "trainer_id", nullable = false)
    private User trainer;
    
    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private User client;
    
    @Column(name = "registration_date")
    private LocalDateTime registrationDate;
    
    @Column(name = "remaining_sessions", nullable = false)
    private Integer remainingSessions;
}
