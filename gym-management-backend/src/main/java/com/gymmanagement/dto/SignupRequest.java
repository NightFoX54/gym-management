package com.gymmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phoneNumber;
    private Long planId;        // Membership plan ID
    private Integer durationMonths; // Membership duration in months
    private LocalDate startDate;    // When the membership should start
    private String paymentMethod;   // Payment method information
    private String cardNumber;      // Last 4 digits for reference
    private String cardHolderName;  // Name on card
    private String expiryDate;      // Expiry date of the card
    private Integer cvv;           // CVV of the card
} 