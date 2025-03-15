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
@Table(name = "membership_plans")
public class MembershipPlan {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "plan_name", nullable = false)
    private String planName;
    
    @Column(name = "plan_price", nullable = false)
    private BigDecimal planPrice;
    
    @Column(name = "guest_pass_count", nullable = false)
    private Integer guestPassCount;
    
    @Column(name = "monthly_pt_sessions", nullable = false)
    private Integer monthlyPtSessions;
    
    @Column(name = "group_class_count", nullable = false)
    private Integer groupClassCount;
    
    @Column(name = "market_discount", nullable = false)
    private Integer marketDiscount;
} 