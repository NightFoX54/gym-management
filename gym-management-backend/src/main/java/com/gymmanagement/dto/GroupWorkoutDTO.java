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
public class GroupWorkoutDTO {
    private Integer id;
    private String name;
    private String description;
    private Integer capacity;
    private Integer duration;
    private String level;
    private Long trainerId;
    private String trainerName;
    private String category;
    private String imagePath;
    private List<GroupWorkoutSessionDTO> sessions;
    private int enrollmentCount;
    private boolean isEnrolled;
    
    // Add these fields to match what's expected by the frontend
    private Integer level_id;
    private Integer category_id;
}