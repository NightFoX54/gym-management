package com.gymmanagement.controller;

import com.gymmanagement.model.*;
import com.gymmanagement.repository.*;
import com.gymmanagement.service.GroupWorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/group-workout-sessions")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.PATCH, RequestMethod.PUT})
public class GroupWorkoutSessionController {

    @Autowired
    private GroupWorkoutSessionRepository sessionRepository;
    
    @Autowired
    private GroupWorkoutRepository groupWorkoutRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private GroupWorkoutEnrollRepository enrollRepository;
    
    @Autowired
    private GroupWorkoutService groupWorkoutService;
    
    @GetMapping
    public ResponseEntity<?> getGroupWorkoutSessions(@RequestParam(required = false) Long trainerId) {
        try {
            List<GroupWorkoutSession> sessions;
            
            if (trainerId != null) {
                // Filter sessions by trainer ID
                sessions = sessionRepository.findAll().stream()
                    .filter(session -> session.getGroupWorkout().getTrainer().getId().equals(trainerId))
                    .collect(Collectors.toList());
            } else {
                sessions = sessionRepository.findAll();
            }
            
            List<Map<String, Object>> formattedSessions = sessions.stream().map(session -> {
                GroupWorkout workout = session.getGroupWorkout();
                User trainer = workout.getTrainer();
                
                Map<String, Object> map = new HashMap<>();
                map.put("id", session.getId());
                map.put("groupWorkoutId", workout.getId());
                map.put("groupWorkoutName", workout.getName());
                map.put("date", session.getDate().toString());
                map.put("time", session.getTime().toString());
                map.put("capacity", workout.getCapacity());
                map.put("level", workout.getLevel().getLevelName());
                map.put("category", workout.getCategory().getCategoryName());
                map.put("notes", session.getNotes());
                
                // Count enrollments for this session
                long enrollmentCount = enrollRepository.findAll().stream()
                    .filter(enroll -> enroll.getSession().getId().equals(session.getId()))
                    .count();
                
                map.put("enrollmentCount", enrollmentCount);
                
                return map;
            }).collect(Collectors.toList());
            
            return ResponseEntity.ok(formattedSessions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("error", e.getMessage()));
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createGroupWorkoutSession(@RequestBody Map<String, Object> request) {
        try {
            Integer groupWorkoutId = Integer.parseInt(request.get("groupWorkoutId").toString());
            String dateStr = (String) request.get("date");
            String timeStr = (String) request.get("time");
            String notes = request.get("notes") != null ? (String) request.get("notes") : "";
            
            GroupWorkout groupWorkout = groupWorkoutRepository.findById(groupWorkoutId)
                .orElseThrow(() -> new RuntimeException("Group workout not found with id: " + groupWorkoutId));
            
            LocalDate date = LocalDate.parse(dateStr);
            LocalTime time = LocalTime.parse(timeStr);
            
            GroupWorkoutSession session = new GroupWorkoutSession();
            session.setGroupWorkout(groupWorkout);
            session.setDate(date);
            session.setTime(time);
            session.setNotes(notes);
            
            GroupWorkoutSession savedSession = sessionRepository.save(session);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", savedSession.getId());
            response.put("groupWorkoutId", groupWorkout.getId());
            response.put("date", savedSession.getDate().toString());
            response.put("time", savedSession.getTime().toString());
            response.put("message", "Group workout session created successfully");
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{sessionId}")
    public ResponseEntity<?> updateGroupWorkoutSession(
            @PathVariable Integer sessionId,
            @RequestBody Map<String, Object> request) {
        try {
            GroupWorkoutSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Group workout session not found with id: " + sessionId));
            
            Integer groupWorkoutId = Integer.parseInt(request.get("groupWorkoutId").toString());
            String dateStr = (String) request.get("date");
            String timeStr = (String) request.get("time");
            String notes = request.get("notes") != null ? (String) request.get("notes") : "";
            
            GroupWorkout groupWorkout = groupWorkoutRepository.findById(groupWorkoutId)
                .orElseThrow(() -> new RuntimeException("Group workout not found with id: " + groupWorkoutId));
            
            session.setGroupWorkout(groupWorkout);
            session.setDate(LocalDate.parse(dateStr));
            session.setTime(LocalTime.parse(timeStr));
            session.setNotes(notes);
            
            GroupWorkoutSession updatedSession = sessionRepository.save(session);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", updatedSession.getId());
            response.put("groupWorkoutId", groupWorkout.getId());
            response.put("date", updatedSession.getDate().toString());
            response.put("time", updatedSession.getTime().toString());
            response.put("message", "Group workout session updated successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{sessionId}")
    public ResponseEntity<?> deleteGroupWorkoutSession(@PathVariable Integer sessionId) {
        try {
            // First check if the session exists
            if (!sessionRepository.existsById(sessionId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("error", "Group workout session not found with id: " + sessionId));
            }
            
            // Delete all enrollments for this session first
            List<GroupWorkoutEnroll> enrollments = enrollRepository.findAll().stream()
                .filter(enroll -> enroll.getSession().getId().equals(sessionId))
                .collect(Collectors.toList());
            
            enrollRepository.deleteAll(enrollments);
            
            // Then delete the session
            sessionRepository.deleteById(sessionId);
            
            return ResponseEntity.ok(Collections.singletonMap("message", "Group workout session deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("error", e.getMessage()));
        }
    }
} 