package com.gymmanagement.controller;

import com.gymmanagement.model.TrainerClient;
import com.gymmanagement.model.TrainerSession;
import com.gymmanagement.model.PersonalTrainingRating;
import com.gymmanagement.model.User;
import com.gymmanagement.model.TrainerSessionRescheduleRequest;
import com.gymmanagement.repository.TrainerClientRepository;
import com.gymmanagement.repository.TrainerSessionRepository;
import com.gymmanagement.repository.PersonalTrainingRatingRepository;
import com.gymmanagement.repository.UserRepository;
import com.gymmanagement.repository.TrainerSessionRescheduleRequestRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/member-trainers")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class MemberTrainerController {

    @Autowired
    private TrainerClientRepository trainerClientRepository;
    
    @Autowired
    private TrainerSessionRepository sessionRepository;
    
    @Autowired
    private PersonalTrainingRatingRepository ratingRepository;

    @Autowired
    private TrainerSessionRescheduleRequestRepository rescheduleRequestRepository;

    @GetMapping("/{memberId}")
    public ResponseEntity<?> getMemberTrainers(@PathVariable Long memberId) {
        try {
            List<TrainerClient> trainerClients = trainerClientRepository.findByClientId(memberId);
            List<Map<String, Object>> result = new ArrayList<>();
            
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
            LocalDate today = LocalDate.now();
            
            for (TrainerClient relationship : trainerClients) {
                User trainer = relationship.getTrainer();
                
                // Get sessions with this trainer
                List<TrainerSession> allSessions = sessionRepository.findByTrainerIdAndClientId(trainer.getId(), memberId);
                
                // Split into past and future sessions
                List<Map<String, Object>> pastSessions = new ArrayList<>();
                List<Map<String, Object>> upcomingSessions = new ArrayList<>();
                
                for (TrainerSession session : allSessions) {
                    Map<String, Object> sessionMap = new HashMap<>();
                    sessionMap.put("id", session.getId());
                    sessionMap.put("date", session.getSessionDate().format(dateFormatter));
                    sessionMap.put("time", session.getSessionTime().format(timeFormatter));
                    sessionMap.put("type", session.getSessionType());
                    sessionMap.put("notes", session.getNotes());
                    
                    // Check if session has a rating
                    Optional<PersonalTrainingRating> rating = ratingRepository.findBySessionId(session.getId());
                    sessionMap.put("hasRating", rating.isPresent());
                    if (rating.isPresent()) {
                        sessionMap.put("rating", rating.get().getRating());
                        sessionMap.put("comment", rating.get().getComment());
                    }
                    
                    // Determine if past or future session
                    if (session.getSessionDate().isBefore(today) || 
                       (session.getSessionDate().isEqual(today) && LocalDateTime.now().toLocalTime().isAfter(session.getSessionTime()))) {
                        pastSessions.add(sessionMap);
                    } else {
                        upcomingSessions.add(sessionMap);
                    }
                }
                
                // Sort past sessions (most recent first)
                pastSessions.sort((s1, s2) -> {
                    String date1 = (String) s1.get("date");
                    String date2 = (String) s2.get("date");
                    String time1 = (String) s1.get("time");
                    String time2 = (String) s2.get("time");
                    
                    int dateCompare = date2.compareTo(date1);
                    if (dateCompare != 0) return dateCompare;
                    return time2.compareTo(time1);
                });
                
                // Sort upcoming sessions (soonest first)
                upcomingSessions.sort((s1, s2) -> {
                    String date1 = (String) s1.get("date");
                    String date2 = (String) s2.get("date");
                    String time1 = (String) s1.get("time");
                    String time2 = (String) s2.get("time");
                    
                    int dateCompare = date1.compareTo(date2);
                    if (dateCompare != 0) return dateCompare;
                    return time1.compareTo(time2);
                });
                
                Map<String, Object> trainerData = new HashMap<>();
                trainerData.put("trainerId", trainer.getId());
                trainerData.put("trainerName", trainer.getFirstName() + " " + trainer.getLastName());
                trainerData.put("profilePhoto", trainer.getProfilePhotoPath());
                trainerData.put("email", trainer.getEmail());
                trainerData.put("phoneNumber", trainer.getPhoneNumber());
                trainerData.put("remainingSessions", relationship.getRemainingSessions());
                trainerData.put("pastSessions", pastSessions);
                trainerData.put("upcomingSessions", upcomingSessions);
                
                result.add(trainerData);
            }
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/reschedule/{sessionId}")
    public ResponseEntity<?> rescheduleSession(@PathVariable Long sessionId, @RequestBody Map<String, String> requestData) {
        try {
            TrainerSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId));
            
            LocalDate newDate = LocalDate.parse(requestData.get("date"));
            String newTimeStr = requestData.get("time");
            String[] timeParts = newTimeStr.split(":");
            java.time.LocalTime newTime = java.time.LocalTime.of(
                Integer.parseInt(timeParts[0]), 
                Integer.parseInt(timeParts[1])
            );
            
            session.setSessionDate(newDate);
            session.setSessionTime(newTime);
            
            if (requestData.containsKey("notes")) {
                session.setNotes(requestData.get("notes"));
            }
            
            TrainerSession updatedSession = sessionRepository.save(session);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", updatedSession.getId());
            response.put("date", updatedSession.getSessionDate().toString());
            response.put("time", updatedSession.getSessionTime().toString());
            response.put("type", updatedSession.getSessionType());
            response.put("notes", updatedSession.getNotes());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/reschedule-request/{sessionId}")
    public ResponseEntity<?> requestSessionReschedule(@PathVariable Long sessionId, @RequestBody Map<String, String> requestData) {
        try {
            TrainerSession session = sessionRepository.findById(sessionId)
                    .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId));
            
            // Parse the new date and time
            LocalDate newDate = LocalDate.parse(requestData.get("date"));
            String newTimeStr = requestData.get("time");
            String[] timeParts = newTimeStr.split(":");
            LocalTime newTime = LocalTime.of(
                Integer.parseInt(timeParts[0]), 
                Integer.parseInt(timeParts[1])
            );
            
            // Check if a reschedule request already exists for this session
            List<TrainerSessionRescheduleRequest> existingRequests = rescheduleRequestRepository.findBySessionId(sessionId);
            TrainerSessionRescheduleRequest request;
            
            if (!existingRequests.isEmpty()) {
                // Update the existing request
                request = existingRequests.get(0);
                request.setNewSessionDate(newDate);
                request.setNewSessionTime(newTime);
            } else {
                // Create a new reschedule request
                request = new TrainerSessionRescheduleRequest();
                request.setSession(session);
                request.setNewSessionDate(newDate);
                request.setNewSessionTime(newTime);
            }
            
            TrainerSessionRescheduleRequest savedRequest = rescheduleRequestRepository.save(request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", savedRequest.getId());
            response.put("sessionId", session.getId());
            response.put("newDate", savedRequest.getNewSessionDate().toString());
            response.put("newTime", savedRequest.getNewSessionTime().toString());
            response.put("message", "Reschedule request submitted successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
} 