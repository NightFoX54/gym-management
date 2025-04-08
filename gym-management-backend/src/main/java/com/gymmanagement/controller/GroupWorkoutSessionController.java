package com.gymmanagement.controller;

import com.gymmanagement.model.GroupWorkout;
import com.gymmanagement.model.GroupWorkoutSession;
import com.gymmanagement.repository.GroupWorkoutRepository;
import com.gymmanagement.repository.GroupWorkoutSessionRepository;
import com.gymmanagement.repository.GroupWorkoutEnrollRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/group-workout-sessions")
@CrossOrigin(origins = "*")
public class GroupWorkoutSessionController {

    @Autowired
    private GroupWorkoutSessionRepository sessionRepository;
    
    @Autowired
    private GroupWorkoutRepository groupWorkoutRepository;
    
    @Autowired
    private GroupWorkoutEnrollRepository enrollRepository;

    @GetMapping
    public ResponseEntity<?> getGroupWorkoutSessions(@RequestParam(required = false) Long trainerId) {
        try {
            List<GroupWorkoutSession> sessions;
            
            if (trainerId != null) {
                // Find all sessions for workouts owned by this trainer
                sessions = sessionRepository.findSessionsByTrainerId(trainerId);
            } else {
                sessions = sessionRepository.findAll();
            }
            
            // Transform into a DTO with additional enrollment information
            List<Map<String, Object>> sessionDTOs = sessions.stream()
                .map(session -> {
                    GroupWorkout workout = session.getGroupWorkout();
                    long enrollmentCount = enrollRepository.countBySessionId(session.getId());
                    
                    Map<String, Object> sessionMap = new HashMap<>();
                    sessionMap.put("id", session.getId());
                    sessionMap.put("groupWorkoutId", workout.getId());
                    sessionMap.put("groupWorkoutName", workout.getName());
                    sessionMap.put("date", session.getDate());
                    sessionMap.put("time", session.getTime());
                    sessionMap.put("capacity", workout.getCapacity());
                    sessionMap.put("enrollmentCount", enrollmentCount);
                    sessionMap.put("level", workout.getLevel() != null ? workout.getLevel().getLevelName() : "Beginner");
                    sessionMap.put("category", workout.getCategory() != null ? workout.getCategory().getCategoryName() : "General");
                    sessionMap.put("notes", session.getNotes() != null ? session.getNotes() : "");
                    return sessionMap;
                })
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(sessionDTOs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving group workout sessions: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createGroupWorkoutSession(@RequestBody Map<String, Object> request) {
        try {
            Integer groupWorkoutId = (Integer) request.get("groupWorkoutId");
            String dateStr = (String) request.get("date");
            String timeStr = (String) request.get("time");
            String notes = (String) request.get("notes");
            
            // Validate required fields
            if (groupWorkoutId == null || dateStr == null || timeStr == null) {
                return ResponseEntity.badRequest().body("Required fields missing");
            }
            
            // Find the group workout
            Optional<GroupWorkout> workoutOpt = groupWorkoutRepository.findById(groupWorkoutId);
            if (workoutOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Group workout not found");
            }
            
            // Parse date and time
            LocalDate date = LocalDate.parse(dateStr);
            LocalTime time = LocalTime.parse(timeStr);
            
            // Create and save the session
            GroupWorkoutSession session = new GroupWorkoutSession();
            session.setGroupWorkout(workoutOpt.get());
            session.setDate(date);
            session.setTime(time);
            session.setNotes(notes);
            
            GroupWorkoutSession savedSession = sessionRepository.save(session);
            
            // Create a response with additional information
            Map<String, Object> response = Map.of(
                "id", savedSession.getId(),
                "groupWorkoutId", savedSession.getGroupWorkout().getId(),
                "groupWorkoutName", savedSession.getGroupWorkout().getName(),
                "date", savedSession.getDate(),
                "time", savedSession.getTime(),
                "capacity", savedSession.getGroupWorkout().getCapacity(),
                "enrollmentCount", 0,
                "level", savedSession.getGroupWorkout().getLevel() != null ? 
                    savedSession.getGroupWorkout().getLevel().getLevelName() : "Beginner",
                "category", savedSession.getGroupWorkout().getCategory() != null ? 
                    savedSession.getGroupWorkout().getCategory().getCategoryName() : "General",
                "notes", savedSession.getNotes() != null ? savedSession.getNotes() : ""
            );
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error creating group workout session: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateGroupWorkoutSession(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> request) {
        try {
            Optional<GroupWorkoutSession> sessionOpt = sessionRepository.findById(id);
            if (sessionOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            GroupWorkoutSession session = sessionOpt.get();
            
            // Update group workout if provided
            if (request.containsKey("groupWorkoutId")) {
                Integer groupWorkoutId = (Integer) request.get("groupWorkoutId");
                Optional<GroupWorkout> workoutOpt = groupWorkoutRepository.findById(groupWorkoutId);
                if (workoutOpt.isPresent()) {
                    session.setGroupWorkout(workoutOpt.get());
                }
            }
            
            // Update date if provided
            if (request.containsKey("date")) {
                String dateStr = (String) request.get("date");
                session.setDate(LocalDate.parse(dateStr));
            }
            
            // Update time if provided
            if (request.containsKey("time")) {
                String timeStr = (String) request.get("time");
                session.setTime(LocalTime.parse(timeStr));
            }
            
            // Update notes if provided
            if (request.containsKey("notes")) {
                session.setNotes((String) request.get("notes"));
            }
            
            // Save the updated session
            GroupWorkoutSession updatedSession = sessionRepository.save(session);
            
            // Count enrollments
            long enrollmentCount = enrollRepository.countBySessionId(updatedSession.getId());
            
            // Create a response with additional information
            Map<String, Object> response = Map.of(
                "id", updatedSession.getId(),
                "groupWorkoutId", updatedSession.getGroupWorkout().getId(),
                "groupWorkoutName", updatedSession.getGroupWorkout().getName(),
                "date", updatedSession.getDate(),
                "time", updatedSession.getTime(),
                "capacity", updatedSession.getGroupWorkout().getCapacity(),
                "enrollmentCount", enrollmentCount,
                "level", updatedSession.getGroupWorkout().getLevel() != null ? 
                    updatedSession.getGroupWorkout().getLevel().getLevelName() : "Beginner",
                "category", updatedSession.getGroupWorkout().getCategory() != null ? 
                    updatedSession.getGroupWorkout().getCategory().getCategoryName() : "General",
                "notes", updatedSession.getNotes() != null ? updatedSession.getNotes() : ""
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error updating group workout session: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGroupWorkoutSession(@PathVariable Integer id) {
        try {
            Optional<GroupWorkoutSession> sessionOpt = sessionRepository.findById(id);
            if (sessionOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            // Delete any enrollments for this session
            enrollRepository.deleteBySessionId(id);
            
            // Delete the session
            sessionRepository.deleteById(id);
            
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error deleting group workout session: " + e.getMessage());
        }
    }
}
