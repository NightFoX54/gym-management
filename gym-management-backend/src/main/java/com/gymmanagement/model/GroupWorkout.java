package com.gymmanagement.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "group_workouts")
public class GroupWorkout {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private Integer capacity;
    
    @Column(nullable = false)
    private Integer duration;
    
    @ManyToOne
    @JoinColumn(name = "level_id")
    private GroupWorkoutLevel level;
    
    @ManyToOne
    @JoinColumn(name = "trainer_id")
    private User trainer;
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    private GroupWorkoutCategory category;
    
    @Column(name = "image_path")
    private String imagePath;
} 