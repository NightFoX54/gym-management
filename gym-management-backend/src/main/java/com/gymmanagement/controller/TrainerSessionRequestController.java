package com.gymmanagement.controller;

import com.gymmanagement.model.TrainerSessionRequest;
import com.gymmanagement.model.User;
import com.gymmanagement.repository.TrainerSessionRequestRepository;
import com.gymmanagement.repository.UserRepository;
import com.gymmanagement.model.FreePtUse;
import com.gymmanagement.repository.FreePtUseRepository;
import com.gymmanagement.model.Membership;
import com.gymmanagement.repository.MembershipRepository;
import com.gymmanagement.model.MembershipPlan;
import com.gymmanagement.repository.MembershipPlanRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/trainer-session-requests")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class TrainerSessionRequestController {

    @Autowired
    private TrainerSessionRequestRepository requestRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FreePtUseRepository freePtUseRepository;

    @Autowired
    private MembershipRepository membershipRepository;

    @Autowired
    private MembershipPlanRepository membershipPlanRepository;

    @PostMapping
    public ResponseEntity<?> createSessionRequest(@RequestBody Map<String, Object> requestData) {
        try {
            Long trainerId = Long.parseLong(requestData.get("trainerId").toString());
            Long clientId = Long.parseLong(requestData.get("clientId").toString());
            String requestMessage = (String) requestData.get("requestMessage");
            LocalDate meetingDate = LocalDate.parse(requestData.get("requestedMeetingDate").toString());
            LocalTime meetingTime = LocalTime.parse(requestData.get("requestedMeetingTime").toString());
            
            User trainer = userRepository.findById(trainerId)
                    .orElseThrow(() -> new RuntimeException("Trainer not found"));
            
            User client = userRepository.findById(clientId)
                    .orElseThrow(() -> new RuntimeException("Client not found"));
            
            // Create new request
            TrainerSessionRequest sessionRequest = new TrainerSessionRequest();
            sessionRequest.setTrainer(trainer);
            sessionRequest.setClient(client);
            sessionRequest.setRequestMessage(requestMessage);
            sessionRequest.setRequestedMeetingDate(meetingDate);
            sessionRequest.setRequestedMeetingTime(meetingTime);
            
            TrainerSessionRequest savedRequest = requestRepository.save(sessionRequest);
            
            // Check if the user has free PT sessions available
            // Get user's active membership
            Optional<Membership> membershipOpt = membershipRepository.findByUser(client);
            if (membershipOpt.isPresent()) {
                Membership membership = membershipOpt.get();
                MembershipPlan plan = membership.getPlan();
                
                // Get starting and ending date for the current month
                LocalDate today = LocalDate.now();
                LocalDate startOfMonth = today.withDayOfMonth(1);
                LocalDate endOfMonth = today.withDayOfMonth(today.lengthOfMonth());
                
                // Convert to LocalDateTime for the query
                LocalDateTime startDateTime = startOfMonth.atStartOfDay();
                LocalDateTime endDateTime = endOfMonth.atTime(23, 59, 59);
                
                // Count used free PT sessions this month
                int usedSessions = freePtUseRepository.countByMemberIdAndUseTimeBetween(
                        clientId, startDateTime, endDateTime);
                
                // Total monthly sessions from the membership plan
                int totalMonthlySessions = plan.getMonthlyPtSessions();
                
                // Calculate remaining sessions
                int remainingSessions = totalMonthlySessions - usedSessions;
                
                // If there are free sessions remaining, record the use
                if (remainingSessions > 0) {
                    FreePtUse freePtUse = new FreePtUse();
                    freePtUse.setMember(client);
                    freePtUse.setSessionRequest(savedRequest);
                    freePtUse.setUseTime(LocalDateTime.now());
                    
                    freePtUseRepository.save(freePtUse);
                }
            }
            
            return ResponseEntity.ok(Map.of(
                "id", savedRequest.getId(),
                "message", "Session request created successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
} 