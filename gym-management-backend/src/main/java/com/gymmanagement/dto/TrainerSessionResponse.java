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
public class TrainerSessionResponse {
    private Long id;
    private Long clientId;
    private String clientName;
    private LocalDate sessionDate;
    private LocalTime sessionTime;
    private String sessionType;
    private String notes;
}
