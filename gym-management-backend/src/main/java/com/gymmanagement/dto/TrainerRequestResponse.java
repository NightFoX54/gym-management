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
public class TrainerRequestResponse {
    private Long id;
    private Long clientId;
    private String name;
    private String email;
    private String phone;
    private String program;
    private String message;
    private LocalDate meetingDate;
    private LocalTime meetingTime;
}
