package com.gymmanagement.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class CustomerDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private LocalDateTime registrationDate;
    private String membershipPlanName;
    private LocalDate membershipStartDate;
    private LocalDate membershipEndDate;
    private Boolean isMembershipActive;
    private Boolean isMembershipFrozen;
} 