package com.gymmanagement.service;

import com.gymmanagement.dto.SignupRequest;
import com.gymmanagement.dto.SignupResponse;
import com.gymmanagement.model.Membership;
import com.gymmanagement.model.MembershipPlan;
import com.gymmanagement.model.User;
import com.gymmanagement.repository.MembershipPlanRepository;
import com.gymmanagement.repository.MembershipRepository;
import com.gymmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MembershipPlanRepository membershipPlanRepository;
    
    @Autowired
    private MembershipRepository membershipRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Transactional
    public SignupResponse registerUser(SignupRequest signupRequest) {
        // Check if email already exists
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            return SignupResponse.builder()
                    .success(false)
                    .message("Email is already in use")
                    .build();
        }
        
        // Create new user
        User user = new User();
        user.setFirstName(signupRequest.getFirstName());
        user.setLastName(signupRequest.getLastName());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setPhoneNumber(signupRequest.getPhoneNumber());
        user.setRole("MEMBER"); // Default role for signup
        user.setRegistrationDate(LocalDateTime.now());
        
        User savedUser = userRepository.save(user);
        
        // Create membership if plan ID is provided
        if (signupRequest.getPlanId() != null) {
            MembershipPlan plan = membershipPlanRepository.findById(signupRequest.getPlanId())
                    .orElseThrow(() -> new RuntimeException("Membership plan not found"));
            
            LocalDate startDate = signupRequest.getStartDate() != null ? 
                    signupRequest.getStartDate() : LocalDate.now();
            
            int durationMonths = signupRequest.getDurationMonths() != null ? 
                    signupRequest.getDurationMonths() : 1;
            
            LocalDate endDate = startDate.plusMonths(durationMonths);
            
            Membership membership = new Membership();
            membership.setUser(savedUser);
            membership.setPlan(plan);
            membership.setStartDate(startDate);
            membership.setEndDate(endDate);
            membership.setPaidAmount(plan.getPlanPrice().multiply(BigDecimal.valueOf(durationMonths)));
            membership.setIsFrozen(false);
            
            Membership savedMembership = membershipRepository.save(membership);
            
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            
            return SignupResponse.builder()
                    .userId(savedUser.getId())
                    .email(savedUser.getEmail())
                    .role(savedUser.getRole())
                    .success(true)
                    .message("User registered successfully with membership")
                    .membershipId(savedMembership.getId())
                    .membershipPlan(plan.getPlanName())
                    .membershipEndDate(endDate.format(formatter))
                    .build();
        }
        
        return SignupResponse.builder()
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .success(true)
                .message("User registered successfully")
                .build();
    }
} 