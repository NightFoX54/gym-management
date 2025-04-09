package com.gymmanagement.controller;

import com.gymmanagement.dto.PasswordChangeRequest;
import com.gymmanagement.model.Membership;
import com.gymmanagement.model.MembershipPlan;
import com.gymmanagement.model.User;
import com.gymmanagement.repository.MembershipRepository;
import com.gymmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "*")
public class MemberController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MembershipRepository membershipRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/{memberId}/discount")
    public ResponseEntity<Map<String, Object>> getMemberDiscount(@PathVariable Long memberId) {
        try {
            System.out.println("Fetching discount for member ID: " + memberId);
            
            // Get the user by ID
            User user = userRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + memberId));
            
            System.out.println("Found user: " + user.getEmail() + " with role: " + user.getRole());
            
            // Get the user's active membership
            Optional<Membership> membershipOpt = membershipRepository.findByUser(user);
            
            if (membershipOpt.isEmpty()) {
                System.out.println("No membership found for user: " + memberId);
                throw new RuntimeException("No active membership found for user: " + memberId);
            }
            
            Membership membership = membershipOpt.get();
            System.out.println("Found membership with ID: " + membership.getId() + 
                              ", plan ID: " + membership.getPlan().getId());
            
            MembershipPlan plan = membership.getPlan();
            System.out.println("Plan details: " + plan.getPlanName() + 
                              ", market discount: " + plan.getMarketDiscount());
            
            Map<String, Object> response = new HashMap<>();
            response.put("marketDiscount", plan.getMarketDiscount());
            response.put("planName", plan.getPlanName());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error fetching discount: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch member discount");
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/{memberId}/profile")
    public ResponseEntity<Map<String, Object>> getMemberProfile(@PathVariable Long memberId) {
        try {
            // Get the user by ID
            User user = userRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + memberId));
            
            // Get the user's active membership
            Optional<Membership> membershipOpt = membershipRepository.findByUser(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("firstName", user.getFirstName());
            response.put("lastName", user.getLastName());
            response.put("email", user.getEmail());
            response.put("phoneNumber", user.getPhoneNumber());
            response.put("profilePhotoPath", user.getProfilePhotoPath());
            
            if (membershipOpt.isPresent()) {
                Membership membership = membershipOpt.get();
                MembershipPlan plan = membership.getPlan();
                
                response.put("membershipPlan", plan.getPlanName());
                response.put("membershipStatus", membership.getIsFrozen() ? "Frozen" : "Active");
                response.put("membershipStartDate", membership.getStartDate().toString());
                response.put("membershipEndDate", membership.getEndDate().toString());
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch member profile");
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("/{memberId}/update")
    public ResponseEntity<Map<String, Object>> updateMemberProfile(
            @PathVariable Long memberId,
            @RequestBody Map<String, String> updateData) {
        try {
            // Get the user by ID
            User user = userRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + memberId));
            
            // Update user fields
            if (updateData.containsKey("firstName")) {
                user.setFirstName(updateData.get("firstName"));
            }
            
            if (updateData.containsKey("lastName")) {
                user.setLastName(updateData.get("lastName"));
            }
            
            if (updateData.containsKey("email")) {
                // Check if email is already in use by another user
                if (!user.getEmail().equals(updateData.get("email")) && 
                    userRepository.existsByEmail(updateData.get("email"))) {
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("error", "Email already in use");
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
                }
                user.setEmail(updateData.get("email"));
            }
            
            if (updateData.containsKey("phoneNumber")) {
                user.setPhoneNumber(updateData.get("phoneNumber"));
            }
            
            // Save updated user
            userRepository.save(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Profile updated successfully");
            response.put("id", user.getId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to update member profile");
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/{memberId}/membership")
    public ResponseEntity<Map<String, Object>> getMembershipDetails(@PathVariable Long memberId) {
        try {
            // Get the user by ID
            User user = userRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + memberId));
            
            // Get the user's active membership
            Optional<Membership> membershipOpt = membershipRepository.findByUser(user);
            
            if (membershipOpt.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "No active membership found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            Membership membership = membershipOpt.get();
            MembershipPlan plan = membership.getPlan();
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", membership.getId());
            response.put("planName", plan.getPlanName());
            response.put("startDate", membership.getStartDate().toString());
            response.put("endDate", membership.getEndDate().toString());
            response.put("isFrozen", membership.getIsFrozen());
            response.put("price", plan.getPlanPrice());
            
            // Get benefits from the plan
            List<String> benefits = new ArrayList<>();
            /*if (plan.getHasUnlimitedAccess()) benefits.add("Unlimited Gym Access");
            if (plan.getHasPersonalTrainer()) benefits.add("Personal Trainer Sessions");
            if (plan.getHasGroupClasses()) benefits.add("Group Classes");
            if (plan.getHasLockerAccess()) benefits.add("Locker Access");
            if (plan.getHasSpaAccess()) benefits.add("Spa Access");*/
            
            response.put("benefits", benefits);
            
            // Payment status is not stored in the database, so we'll simulate it
            response.put("paymentStatus", "paid");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch membership details");
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/{memberId}/renew")
    public ResponseEntity<Map<String, Object>> renewMembership(
            @PathVariable Long memberId,
            @RequestBody Map<String, Object> renewalData) {
        try {
            // Get the user by ID
            User user = userRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + memberId));
            
            // Get the user's active membership
            Optional<Membership> membershipOpt = membershipRepository.findByUser(user);
            
            if (membershipOpt.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "No active membership found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            Membership membership = membershipOpt.get();
            MembershipPlan plan = membership.getPlan();
            
            // Get renewal duration from request
            Integer durationMonths = Integer.parseInt(renewalData.get("durationMonths").toString());
            
            // Calculate new end date
            LocalDate currentEndDate = membership.getEndDate();
            LocalDate newEndDate = currentEndDate.plusMonths(durationMonths);
            
            // Calculate discount based on duration
            BigDecimal basePrice = plan.getPlanPrice();
            BigDecimal totalPrice = basePrice.multiply(BigDecimal.valueOf(durationMonths));
            BigDecimal discountAmount = BigDecimal.ZERO;
            
            // Apply discount based on duration (same logic as in UserService)
            if (durationMonths == 3) {
                discountAmount = totalPrice.multiply(BigDecimal.valueOf(0.10)); // 10% discount
            } else if (durationMonths == 6) {
                discountAmount = totalPrice.multiply(BigDecimal.valueOf(0.20)); // 20% discount
            } else if (durationMonths == 12) {
                discountAmount = totalPrice.multiply(BigDecimal.valueOf(0.28)); // 28% discount
            }
            
            BigDecimal finalAmount = totalPrice.subtract(discountAmount);
            
            // Update membership
            membership.setEndDate(newEndDate);
            
            // Add to existing amounts
            membership.setDiscountAmount(membership.getDiscountAmount().add(discountAmount));
            membership.setPaidAmount(membership.getPaidAmount().add(finalAmount));
            
            // Save updated membership
            membershipRepository.save(membership);
            
            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("id", membership.getId());
            response.put("planName", plan.getPlanName());
            response.put("startDate", membership.getStartDate().toString());
            response.put("endDate", newEndDate.toString());
            response.put("isFrozen", membership.getIsFrozen());
            response.put("renewalMonths", durationMonths);
            response.put("discountAmount", discountAmount);
            response.put("paidAmount", finalAmount);
            response.put("totalDiscountAmount", membership.getDiscountAmount());
            response.put("totalPaidAmount", membership.getPaidAmount());
            response.put("message", "Membership renewed successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to renew membership");
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("/{id}/change-password")
    public ResponseEntity<?> changePassword(
            @PathVariable Long id,
            @RequestBody PasswordChangeRequest request) {
        
        try {
            // Check if the user exists
            Optional<User> userOpt = userRepository.findById(id);
            if (!userOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "User not found"));
            }
            
            User user = userOpt.get();
            
            // Verify old password
            if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Current password is incorrect"));
            }
            
            // Update password
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);
            
            return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to update password: " + e.getMessage()));
        }
    }
} 