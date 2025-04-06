package com.gymmanagement.dto;

import lombok.Data;

@Data
public class TrainingPlanDTO {
    private Long id;
    private Long userId;
    private Long workoutId;
    private String workoutName;
    private Integer dayOfWeek;
    private String workoutType;
    private Integer workoutDuration;
    private String workoutDifficulty;
} 