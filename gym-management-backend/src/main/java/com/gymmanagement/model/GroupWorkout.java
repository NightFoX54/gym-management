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
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "capacity", nullable = false)
    private Integer capacity;
    
    @Column(name = "duration", nullable = false)
    private Integer duration;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "level_id")
    private GroupWorkoutLevel level;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "trainer_id")
    private User trainer;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private GroupWorkoutCategory category;
    
    @Column(name = "image_path")
    private String imagePath;
}