package com.gymmanagement.controller;

import com.gymmanagement.model.*;
import com.gymmanagement.repository.*;
import com.gymmanagement.service.GroupWorkoutService;
import com.gymmanagement.service.TrainerService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user-sessions")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.PATCH, RequestMethod.PUT})
public class UserSessionController {

    @Autowired
    private TrainerService trainerService;
    
    @Autowired
    private GroupWorkoutService groupWorkoutService;
    
    @Autowired
    private TrainerSessionRepository trainerSessionRepository;
    
    @Autowired
    private GroupWorkoutEnrollRepository groupWorkoutEnrollRepository;
    
    @Autowired
    private GroupWorkoutSessionRepository groupSessionRepository;
    
    @GetMapping("/{userId}")
    public ResponseEntity<?> getAllUserSessions(@PathVariable Long userId) {
        try {
            Map<String, Object> response = new HashMap<>();
            
            // Get trainer sessions where user is the client
            List<TrainerSession> trainerSessions = trainerSessionRepository.findByClientId(userId);
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
            
            List<Map<String, Object>> formattedTrainerSessions = trainerSessions.stream()
                .map(session -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", session.getId());
                    map.put("type", "trainer");
                    map.put("trainerName", session.getTrainer().getFirstName() + " " + session.getTrainer().getLastName());
                    map.put("trainerId", session.getTrainer().getId());
                    map.put("date", session.getSessionDate().format(dateFormatter));
                    map.put("time", session.getSessionTime().format(timeFormatter));
                    map.put("sessionType", session.getSessionType());
                    map.put("notes", session.getNotes());
                    map.put("color", "#4e73df"); // Blue color for trainer sessions
                    return map;
                })
                .collect(Collectors.toList());
            
            // Get group workout sessions where user is enrolled
            List<GroupWorkoutEnroll> enrollments = groupWorkoutEnrollRepository.findByMemberId(userId);
            
            List<Map<String, Object>> formattedGroupSessions = enrollments.stream()
                .map(enroll -> {
                    GroupWorkoutSession groupSession = enroll.getSession();
                    GroupWorkout workout = groupSession.getGroupWorkout();
                    
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", groupSession.getId());
                    map.put("type", "group");
                    map.put("workoutId", workout.getId());
                    map.put("title", workout.getName());
                    map.put("trainer", workout.getTrainer().getFirstName() + " " + workout.getTrainer().getLastName());
                    map.put("trainerId", workout.getTrainer().getId());
                    map.put("date", groupSession.getDate().format(dateFormatter));
                    map.put("time", groupSession.getTime().format(timeFormatter));
                    map.put("category", workout.getCategory().getCategoryName());
                    map.put("duration", workout.getDuration() + " min");
                    map.put("level", workout.getLevel().getLevelName());
                    map.put("image", workout.getImagePath() != null ? workout.getImagePath() : 
                        "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80");
                    map.put("color", "#1cc88a"); // Green color for group sessions
                    return map;
                })
                .collect(Collectors.toList());
            
            response.put("trainerSessions", formattedTrainerSessions);
            response.put("groupSessions", formattedGroupSessions);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }
} 