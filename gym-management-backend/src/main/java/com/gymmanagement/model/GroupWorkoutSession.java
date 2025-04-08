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
@Table(name = "group_workout_sessions")
public class GroupWorkoutSession {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "group_workout_id", nullable = false)
    private GroupWorkout groupWorkout;
    
    @Column(name = "date", nullable = false)
    private LocalDate date;
    
    @Column(name = "time", nullable = false)
    private LocalTime time;
    
    @Column(name = "notes")
    private String notes;
}