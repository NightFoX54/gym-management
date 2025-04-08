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
    
    @ManyToOne
    @JoinColumn(name = "group_workout_id")
    private GroupWorkout groupWorkout;
    
    private LocalDate date;
    
    private LocalTime time;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
} 