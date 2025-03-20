package com.gymmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainerSessionRequest {
    private Long clientId;
    private LocalDate sessionDate;
    private LocalTime sessionTime;
    private String sessionType;
    private String notes;
}
