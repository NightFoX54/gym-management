package com.gymmanagement.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ExerciseProgressGoalDTO {
    private Long id;
    private Long userId;
    private String exerciseName;
    private Long setBy;
    private LocalDate goalDate;
    private Double targetWeight;
    private Integer targetReps;
    private Integer targetDuration;
    private Double targetDistance;
    private String notes;
} 