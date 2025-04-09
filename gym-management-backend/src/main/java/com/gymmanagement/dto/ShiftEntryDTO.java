package com.gymmanagement.dto;

import lombok.Data;
import java.time.LocalTime;

@Data
public class ShiftEntryDTO {
    private Long id;
    private Integer dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private String task;
} 