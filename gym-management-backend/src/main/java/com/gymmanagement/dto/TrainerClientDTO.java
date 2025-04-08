package com.gymmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrainerClientDTO {
    private Long id;
    private Long trainerId;
    private String trainerName;
    private Long clientId;
    private String clientName;
    private String clientEmail;
    private String clientPhone;
    private LocalDateTime registrationDate;
    private Integer remainingSessions;
}
