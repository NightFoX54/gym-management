package com.gymmanagement.dto;

import lombok.Data;
import lombok.Builder;
import java.util.List;

@Data
@Builder
public class GoalProgressDTO {
    private List<GoalEntry> goals;
    private double overallProgress;

    @Data
    @Builder
    public static class GoalEntry {
        private String goalType;  // Weight, Strength, Cardio, etc.
        private double currentValue;
        private double targetValue;
        private double progressPercentage;
        private String status;  // "On Track", "Behind", "Ahead"
    }
} 