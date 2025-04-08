package com.gymmanagement.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "group_workout_enrolls")
public class GroupWorkoutEnroll {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @ManyToOne
    @JoinColumn(name = "session_id")
    private GroupWorkoutSession session;
    
    @ManyToOne
    @JoinColumn(name = "member_id")
    private User member;
} 