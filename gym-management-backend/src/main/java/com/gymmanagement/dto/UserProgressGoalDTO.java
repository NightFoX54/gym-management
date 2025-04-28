package com.gymmanagement.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class UserProgressGoalDTO {
    private Long id;
    private Long userId;
    private Long setBy;
    private LocalDate goalDate;
    private Double targetWeight;
    private Double targetBodyFat;
    private String notes;
}
