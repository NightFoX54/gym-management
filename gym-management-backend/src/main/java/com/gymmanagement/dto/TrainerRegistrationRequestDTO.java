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
public class TrainerRegistrationRequestDTO {
    private Long id;
    private Long trainerId;
    private String trainerName;
    private Long clientId;
    private String clientName;
    private String clientEmail;
    private String clientPhone;
    private String requestMessage;
    private LocalDate requestedMeetingDate;
    private LocalTime requestedMeetingTime;
    private Boolean isModifiedByTrainer;
}
