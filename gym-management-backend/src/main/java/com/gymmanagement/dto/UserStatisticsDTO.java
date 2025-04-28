package com.gymmanagement.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class UserStatisticsDTO {
    private Long id;
    private Long userId;
    private Long enteredBy;
    private LocalDate entryDate;
    private Double weight;
    private Double bodyFat;
    private Double height;
    private String notes;
}
