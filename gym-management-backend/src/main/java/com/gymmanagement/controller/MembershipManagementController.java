package com.gymmanagement.controller;

import com.gymmanagement.model.GeneralPrice;
import com.gymmanagement.model.MembershipPlan;
import com.gymmanagement.repository.GeneralPriceRepository;
import com.gymmanagement.repository.MembershipPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/membership-management")
public class MembershipManagementController {

    @Autowired
    private MembershipPlanRepository membershipPlanRepository;
    
    @Autowired
    private GeneralPriceRepository generalPriceRepository;
    
    // Get all membership plans
    @GetMapping("/plans")
    public List<MembershipPlan> getAllMembershipPlans() {
        return membershipPlanRepository.findAll();
    }
    
    // Update a membership plan
    @PutMapping("/plans/{id}")
    public ResponseEntity<MembershipPlan> updateMembershipPlan(@PathVariable Long id, @RequestBody MembershipPlan planDetails) {
        Optional<MembershipPlan> optionalPlan = membershipPlanRepository.findById(id);
        
        if (optionalPlan.isPresent()) {
            MembershipPlan plan = optionalPlan.get();
            plan.setPlanPrice(planDetails.getPlanPrice());
            plan.setGuestPassCount(planDetails.getGuestPassCount());
            plan.setMonthlyPtSessions(planDetails.getMonthlyPtSessions());
            plan.setGroupClassCount(planDetails.getGroupClassCount());
            plan.setMarketDiscount(planDetails.getMarketDiscount());
            
            return ResponseEntity.ok(membershipPlanRepository.save(plan));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Get all general prices
    @GetMapping("/general-prices")
    public List<GeneralPrice> getAllGeneralPrices() {
        return generalPriceRepository.findAll();
    }
    
    // Get a specific general price by ID
    @GetMapping("/general-prices/{id}")
    public ResponseEntity<GeneralPrice> getGeneralPriceById(@PathVariable Integer id) {
        Optional<GeneralPrice> optionalPrice = generalPriceRepository.findById(id);
        
        if (optionalPrice.isPresent()) {
            return ResponseEntity.ok(optionalPrice.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Update a general price
    @PutMapping("/general-prices/{id}")
    public ResponseEntity<GeneralPrice> updateGeneralPrice(@PathVariable Integer id, @RequestBody GeneralPrice priceDetails) {
        Optional<GeneralPrice> optionalPrice = generalPriceRepository.findById(id);
        
        if (optionalPrice.isPresent()) {
            GeneralPrice price = optionalPrice.get();
            price.setPrice(priceDetails.getPrice());
            
            return ResponseEntity.ok(generalPriceRepository.save(price));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Add a new endpoint for the frontend to access
    @GetMapping("/api/general-prices/{id}")
    public ResponseEntity<GeneralPrice> getGeneralPrice(@PathVariable Integer id) {
        Optional<GeneralPrice> optionalPrice = generalPriceRepository.findById(id);
        
        if (optionalPrice.isPresent()) {
            return ResponseEntity.ok(optionalPrice.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
} 