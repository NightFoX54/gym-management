package com.gymmanagement.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "workouts")
public class Workout {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "is_trainer", nullable = false)
    private Boolean isTrainer;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "level_id", nullable = false)
    private WorkoutLevel level;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private WorkoutCategory category;
    
    @Column(name = "duration", nullable = false)
    private Integer duration;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "calories")
    private Integer calories;
    
    @Column(name = "equipment", columnDefinition = "TEXT")
    private String equipment;
    
    @Column(name = "target_muscles", columnDefinition = "TEXT")
    private String targetMuscles;
    
    @Column(name = "image_path")
    private String imagePath;
    
    // Fix for orphan deletion issue: Change cascade type and implement proper cleanup
    @OneToMany(mappedBy = "workout", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = false)
    private List<WorkoutExercise> exercises = new ArrayList<>();
    
    // Helper method to safely update exercises
    public void updateExercises(List<WorkoutExercise> newExercises) {
        this.exercises.clear();
        if (newExercises != null) {
            this.exercises.addAll(newExercises);
        }
    }
}
