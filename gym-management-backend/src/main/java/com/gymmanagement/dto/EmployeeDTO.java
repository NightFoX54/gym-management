package com.gymmanagement.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;

@Data
public class EmployeeDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String role; // Görevi belirtmek için rol alanı
    private LocalDateTime registrationDate;
    
    // Employee Info fields
    private BigDecimal salary;
    private Integer weeklyHours;
    
    // Add list of shift entries
    private List<ShiftEntryDTO> shiftEntries;
    // İleride maaş, çalışma saati gibi bilgiler eklenebilir
} 