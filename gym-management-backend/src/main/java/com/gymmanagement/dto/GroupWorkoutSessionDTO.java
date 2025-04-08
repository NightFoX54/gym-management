package com.gymmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupWorkoutSessionDTO {
    private Integer id;
    private Integer groupWorkoutId;
    private LocalDate date;
    private LocalTime time;
    private int enrollmentCount;
    private int capacity;
    private boolean isFull;
}