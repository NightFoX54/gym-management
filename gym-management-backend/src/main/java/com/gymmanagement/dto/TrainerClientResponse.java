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
public class TrainerClientResponse {
    private Long id;
    private Long clientId;
    private String name;
    private String email;
    private String phone;
    private String profilePhoto;
    private LocalDateTime registrationDate;
    private Integer remainingSessions;
    private String status;
}
