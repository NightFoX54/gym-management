package com.gymmanagement.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ExerciseProgressDTO {
    private Long id;
    private Long userId;
    private String exerciseName;
    private LocalDate entryDate;
    private Double weight;
    private Integer reps;
    private Integer duration;
    private Double distance;
    private String notes;
    private Long enteredBy;
} 