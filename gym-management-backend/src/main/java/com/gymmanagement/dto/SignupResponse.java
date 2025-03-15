package com.gymmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignupResponse {
    private Long userId;
    private String email;
    private String role;
    private boolean success;
    private String message;
    private Long membershipId;
    private String membershipPlan;
    private String membershipEndDate;
} 