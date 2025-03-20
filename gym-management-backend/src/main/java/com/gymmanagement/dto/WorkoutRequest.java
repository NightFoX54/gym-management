package com.gymmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutRequest {
    private String name;
    private String type;
    private String difficulty;
    private Integer duration;
    private Integer calories;
    private String description;
    private List<String> equipment;
    private List<String> targetMuscles;
    private List<WorkoutExerciseDTO> exercises;
}
