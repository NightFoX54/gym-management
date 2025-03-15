package com.gymmanagement.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "memberships")
public class Membership {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "plan_id", nullable = false)
    private MembershipPlan plan;
    
    @Column(name = "discount_amount")
    private BigDecimal discountAmount;
    
    @Column(name = "paid_amount", nullable = false)
    private BigDecimal paidAmount;
    
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;
    
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;
    
    @Column(name = "is_frozen", nullable = false)
    private Boolean isFrozen = false;
    
    @Column(name = "freeze_start_date")
    private LocalDate freezeStartDate;
    
    @Column(name = "freeze_end_date")
    private LocalDate freezeEndDate;
} 