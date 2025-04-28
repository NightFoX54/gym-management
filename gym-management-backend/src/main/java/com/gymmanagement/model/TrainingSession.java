package com.gymmanagement.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "training_sessions")
@Data
public class TrainingSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "trainer_id", nullable = false)
    private User trainer;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @Column(nullable = false)
    private LocalDate date;

    private String notes;

    @Column(nullable = false)
    private Integer duration; // in minutes

    @Column(nullable = false)
    private String status; // SCHEDULED, COMPLETED, CANCELLED

    @Column(name = "created_at", nullable = false)
    private LocalDate createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDate.now();
    }
} 