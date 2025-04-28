package com.gymmanagement.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "exercise_progress_goals")
public class ExerciseProgressGoals {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "exercise_name", nullable = false)
    private String exerciseName;

    @Column(name = "set_by", nullable = false)
    private Long setBy;

    @Column(name = "goal_date", nullable = false)
    private LocalDate goalDate;

    @Column(name = "target_weight")
    private Double targetWeight;

    @Column(name = "target_reps")
    private Integer targetReps;

    @Column(name = "target_duration")
    private Integer targetDuration;

    @Column(name = "target_distance")
    private Double targetDistance;

    @Column(name = "notes")
    private String notes;
}
