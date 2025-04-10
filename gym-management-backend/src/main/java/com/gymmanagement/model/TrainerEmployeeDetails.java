package com.gymmanagement.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "trainer_employee_details")
public class TrainerEmployeeDetails {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "weekly_hours", nullable = false)
    private Integer weeklyHours;
    
    @Column(name = "salary", nullable = false, precision = 10, scale = 2)
    private BigDecimal salary;
} 