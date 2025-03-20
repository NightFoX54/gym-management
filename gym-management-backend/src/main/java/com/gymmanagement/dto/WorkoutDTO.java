package com.gymmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutDTO {
    private Long id;
    private String name;
    private String type; // Category name
    private String difficulty; // Level name
    private Integer duration;
    private Integer calories;
    private String description;
    private List<String> equipment;
    private List<String> targetMuscles;
    private Integer exercises; // Number of exercises
    private Integer completion; // Completion percentage (for UI)
    private List<WorkoutExerciseDTO> exerciseList;
}
