package com.gymmanagement.controller;

import com.gymmanagement.model.*;
import com.gymmanagement.service.GroupWorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/group-workouts")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.PATCH, RequestMethod.PUT})
public class GroupWorkoutController {

    @Autowired
    private GroupWorkoutService groupWorkoutService;

    @GetMapping("/categories")
    public ResponseEntity<?> getAllCategories() {
        try {
            List<GroupWorkoutCategory> categories = groupWorkoutService.getAllCategories();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllWorkouts(@RequestParam(required = false) Integer categoryId) {
        try {
            List<GroupWorkout> workouts;
            if (categoryId != null) {
                workouts = groupWorkoutService.getWorkoutsByCategory(categoryId);
            } else {
                workouts = groupWorkoutService.getAllWorkouts();
            }
            
            // Format workout data for frontend
            List<Map<String, Object>> formattedWorkouts = workouts.stream()
                .map(workout -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", workout.getId());
                    map.put("title", workout.getName());
                    map.put("description", workout.getDescription());
                    map.put("duration", workout.getDuration() + " min");
                    map.put("capacity", workout.getCapacity());
                    map.put("level", workout.getLevel().getLevelName());
                    map.put("category", workout.getCategory().getCategoryName());
                    map.put("categoryId", workout.getCategory().getId());
                    map.put("trainer", workout.getTrainer().getFirstName() + " " + workout.getTrainer().getLastName());
                    map.put("trainerId", workout.getTrainer().getId());
                    
                    // Use the image URL from the database if available, otherwise use a category-based fallback
                    if (workout.getImagePath() != null && !workout.getImagePath().isEmpty()) {
                        map.put("image", workout.getImagePath());
                    } else {
                        // Fallback to a default Unsplash image based on category
                        String defaultImage;
                        String categoryName = workout.getCategory().getCategoryName().toLowerCase();
                        
                        if (categoryName.contains("yoga")) {
                            defaultImage = "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
                        } else if (categoryName.contains("hiit")) {
                            defaultImage = "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
                        } else if (categoryName.contains("pilates")) {
                            defaultImage = "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
                        } else if (categoryName.contains("cardio")) {
                            defaultImage = "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
                        } else if (categoryName.contains("strength")) {
                            defaultImage = "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
                        } else if (categoryName.contains("dance")) {
                            defaultImage = "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
                        } else {
                            defaultImage = "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
                        }
                        
                        map.put("image", defaultImage);
                    }
                    
                    return map;
                })
                .collect(Collectors.toList());
                
            return ResponseEntity.ok(formattedWorkouts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @GetMapping("/{workoutId}/sessions")
    public ResponseEntity<?> getSessionsForWorkout(@PathVariable Integer workoutId) {
        try {
            List<GroupWorkoutSession> sessions = groupWorkoutService.getSessionsForWorkout(workoutId);
            
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
            
            List<Map<String, Object>> formattedSessions = sessions.stream()
                .map(session -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", session.getId());
                    map.put("date", session.getDate().format(dateFormatter));
                    map.put("time", session.getTime().format(timeFormatter));
                    map.put("formattedDateTime", session.getDate().format(dateFormatter) + " at " + 
                            session.getTime().format(timeFormatter));
                    return map;
                })
                .collect(Collectors.toList());
                
            return ResponseEntity.ok(formattedSessions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}/enrollments")
    public ResponseEntity<?> getUserEnrollments(@PathVariable Long userId) {
        try {
            List<GroupWorkoutEnroll> enrollments = groupWorkoutService.getEnrollmentsForUser(userId);
            
            List<Integer> enrolledSessionIds = enrollments.stream()
                .map(enroll -> enroll.getSession().getId())
                .collect(Collectors.toList());
                
            return ResponseEntity.ok(enrolledSessionIds);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @PostMapping("/enroll")
    public ResponseEntity<?> enrollUserInSession(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.parseLong(request.get("userId").toString());
            Integer sessionId = Integer.parseInt(request.get("sessionId").toString());
            
            GroupWorkoutEnroll enrollment = groupWorkoutService.enrollUserInSession(userId, sessionId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Successfully enrolled in session");
            response.put("enrollmentId", enrollment.getId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @PutMapping("/{workoutId}/image")
    public ResponseEntity<?> updateWorkoutImage(
            @PathVariable Integer workoutId,
            @RequestParam("imagePath") String imagePath) {
        try {
            Optional<GroupWorkout> workoutOpt = groupWorkoutService.getWorkoutById(workoutId);
            
            if (!workoutOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Collections.singletonMap("error", "Workout not found"));
            }
            
            GroupWorkout workout = workoutOpt.get();
            workout.setImagePath(imagePath);
            groupWorkoutService.updateWorkout(workout);
            
            return ResponseEntity.ok(Collections.singletonMap("message", "Workout image updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }
} 