package com.gymmanagement.controller;

import com.gymmanagement.model.FreePtUse;
import com.gymmanagement.model.Membership;
import com.gymmanagement.model.MembershipPlan;
import com.gymmanagement.model.User;
import com.gymmanagement.repository.FreePtUseRepository;
import com.gymmanagement.repository.MembershipRepository;
import com.gymmanagement.repository.UserRepository;
import com.gymmanagement.repository.TrainerSessionRepository;
import com.gymmanagement.repository.TrainerSessionRequestRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/free-pt")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST})
public class FreePtController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MembershipRepository membershipRepository;
    
    @Autowired
    private FreePtUseRepository freePtUseRepository;
    
    @Autowired
    private TrainerSessionRepository sessionRepository;
    
    @Autowired
    private TrainerSessionRequestRepository sessionRequestRepository;
    
    @GetMapping("/remaining/{memberId}")
    public ResponseEntity<?> getRemainingFreeSessions(@PathVariable Long memberId) {
        try {
            // Get the user
            User user = userRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + memberId));
            
            // Get user's membership
            Optional<Membership> membershipOpt = membershipRepository.findByUser(user);
            
            if (membershipOpt.isEmpty()) {
                return ResponseEntity.ok(Map.of(
                    "remaining", 0,
                    "total", 0,
                    "message", "No active membership found"
                ));
            }
            
            Membership membership = membershipOpt.get();
            MembershipPlan plan = membership.getPlan();
            
            // Get total monthly PT sessions allowed by the plan
            int totalMonthlySessions = plan.getMonthlyPtSessions();
            
            // Calculate the start and end of the current month
            LocalDate today = LocalDate.now();
            LocalDate firstDayOfMonth = today.withDayOfMonth(1);
            LocalDate lastDayOfMonth = today.withDayOfMonth(today.lengthOfMonth());
            
            LocalDateTime startOfMonth = LocalDateTime.of(firstDayOfMonth, LocalTime.MIN);
            LocalDateTime endOfMonth = LocalDateTime.of(lastDayOfMonth, LocalTime.MAX);
            
            // Count how many sessions used this month
            int usedSessions = freePtUseRepository.countByMemberIdAndUseTimeBetween(
                memberId, startOfMonth, endOfMonth);
            
            // Calculate remaining sessions
            int remainingSessions = Math.max(0, totalMonthlySessions - usedSessions);
            
            Map<String, Object> response = new HashMap<>();
            response.put("remaining", remainingSessions);
            response.put("total", totalMonthlySessions);
            response.put("used", usedSessions);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of("error", "Failed to get remaining sessions: " + e.getMessage()));
        }
    }
    
    @PostMapping("/use")
    public ResponseEntity<?> recordFreeSessionUse(@RequestBody Map<String, Object> requestData) {
        try {
            Long memberId = Long.parseLong(requestData.get("memberId").toString());
            Long sessionId = requestData.containsKey("sessionId") ? 
                Long.parseLong(requestData.get("sessionId").toString()) : null;
            Integer sessionRequestId = requestData.containsKey("sessionRequestId") ? 
                Integer.parseInt(requestData.get("sessionRequestId").toString()) : null;
            
            // Find the user
            User member = userRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
            
            // Create new free PT use record
            FreePtUse freePtUse = new FreePtUse();
            freePtUse.setMember(member);
            freePtUse.setUseTime(LocalDateTime.now());
            
            // Set related entities if IDs are provided
            if (sessionId != null) {
                freePtUse.setSession(sessionRepository.findById(sessionId)
                    .orElseThrow(() -> new RuntimeException("Session not found")));
            }
            
            if (sessionRequestId != null) {
                freePtUse.setSessionRequest(sessionRequestRepository.findById(sessionRequestId)
                    .orElseThrow(() -> new RuntimeException("Session request not found")));
            }
            
            FreePtUse savedUse = freePtUseRepository.save(freePtUse);
            
            return ResponseEntity.ok(Map.of(
                "id", savedUse.getId(),
                "message", "Free PT session use recorded successfully"
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of("error", "Failed to record free PT use: " + e.getMessage()));
        }
    }
} 