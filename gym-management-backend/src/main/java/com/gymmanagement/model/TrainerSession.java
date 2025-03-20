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
@Table(name = "trainer_sessions")
public class TrainerSession {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "trainer_id", nullable = false)
    private User trainer;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "client_id", nullable = false)
    private User client;
    
    @Column(name = "session_date", nullable = false)
    private LocalDate sessionDate;
    
    @Column(name = "session_time", nullable = false)
    private LocalTime sessionTime;
    
    @Column(name = "session_type", nullable = false)
    private String sessionType;
    
    @Column(name = "notes")
    private String notes;
}
