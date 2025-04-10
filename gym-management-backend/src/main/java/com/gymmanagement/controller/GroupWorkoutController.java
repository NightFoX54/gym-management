package com.gymmanagement.controller;

import com.gymmanagement.model.*;
import com.gymmanagement.service.GroupWorkoutService;
import com.gymmanagement.repository.MembershipRepository;
import com.gymmanagement.repository.UserRepository;
import com.gymmanagement.repository.MembershipPlanRepository;
import com.gymmanagement.repository.GeneralPriceRepository;
import com.gymmanagement.repository.GroupClassesSaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.math.BigDecimal;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/group-workouts")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.PATCH, RequestMethod.PUT})
public class GroupWorkoutController {

    @Autowired
    private GroupWorkoutService groupWorkoutService;

    @Autowired
    private MembershipRepository membershipRepository;

    @Autowired
    private MembershipPlanRepository membershipPlanRepository;

    @Autowired
    private GeneralPriceRepository generalPriceRepository;

    @Autowired
    private GroupClassesSaleRepository groupClassesSaleRepository;

    @Autowired
    private UserRepository userRepository;

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
    public ResponseEntity<?> getAllWorkouts(
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Long trainerId) {
        try {
            List<GroupWorkout> workouts;
            
            if (trainerId != null) {
                // Filter workouts by trainer ID
                workouts = groupWorkoutService.getWorkoutsByTrainer(trainerId);
            } else if (categoryId != null) {
                // Filter workouts by category
                workouts = groupWorkoutService.getWorkoutsByCategory(categoryId);
            } else {
                // Get all workouts
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
    
    @PostMapping
    public ResponseEntity<?> createGroupWorkout(@RequestBody Map<String, Object> request) {
        try {
            String name = (String) request.get("name");
            String description = (String) request.get("description");
            Integer capacity = Integer.parseInt(request.get("capacity").toString());
            Integer duration = Integer.parseInt(request.get("duration").toString());
            Integer levelId = Integer.parseInt(request.get("level_id").toString());
            Integer categoryId = Integer.parseInt(request.get("category_id").toString());
            Long trainerId = Long.parseLong(request.get("trainer_id").toString());
            
            // Fix image path handling - check both possible keys
            String imagePath = null;
            if (request.get("imagePath") != null) {
                imagePath = (String) request.get("imagePath");
            } else if (request.get("image_path") != null) {
                imagePath = (String) request.get("image_path");
            }
            
            GroupWorkout newWorkout = groupWorkoutService.createGroupWorkout(
                name, description, capacity, duration, levelId, categoryId, trainerId, imagePath);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", newWorkout.getId());
            response.put("title", newWorkout.getName());
            response.put("description", newWorkout.getDescription());
            response.put("capacity", newWorkout.getCapacity());
            response.put("duration", newWorkout.getDuration());
            response.put("level", newWorkout.getLevel().getLevelName());
            response.put("category", newWorkout.getCategory().getCategoryName());
            response.put("trainer", newWorkout.getTrainer().getFirstName() + " " + newWorkout.getTrainer().getLastName());
            response.put("message", "Group workout created successfully");
            
            // Add image path to response
            response.put("image", newWorkout.getImagePath());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }
    
    @GetMapping("/trainer/{trainerId}")
    public ResponseEntity<?> getTrainerWorkouts(@PathVariable Long trainerId) {
        try {
            List<Map<String, Object>> workouts = groupWorkoutService.getWorkoutsByTrainerId(trainerId)
                .stream()
                .map(workout -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", workout.getId());
                    map.put("title", workout.getName());
                    map.put("description", workout.getDescription());
                    map.put("capacity", workout.getCapacity());
                    map.put("duration", workout.getDuration() + " min");
                    map.put("level", workout.getLevel().getLevelName());
                    map.put("category", workout.getCategory().getCategoryName());
                    map.put("image", workout.getImagePath());
                    map.put("trainer", workout.getTrainer().getFirstName() + " " + 
                            workout.getTrainer().getLastName());
                    return map;
                })
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(workouts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{workoutId}")
    public ResponseEntity<?> updateGroupWorkout(
            @PathVariable Integer workoutId,
            @RequestBody Map<String, Object> request) {
        try {
            Optional<GroupWorkout> workoutOpt = groupWorkoutService.getWorkoutById(workoutId);
            
            if (!workoutOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Collections.singletonMap("error", "Workout not found"));
            }
            
            String name = (String) request.get("name");
            String description = (String) request.get("description");
            Integer capacity = Integer.parseInt(request.get("capacity").toString());
            Integer duration = Integer.parseInt(request.get("duration").toString());
            Integer levelId = Integer.parseInt(request.get("level_id").toString());
            Integer categoryId = Integer.parseInt(request.get("category_id").toString());
            String imagePath = request.get("imagePath") != null ? (String) request.get("imagePath") : null;
            
            GroupWorkout updatedWorkout = groupWorkoutService.updateGroupWorkout(
                workoutId, name, description, capacity, duration, levelId, categoryId, imagePath);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", updatedWorkout.getId());
            response.put("title", updatedWorkout.getName());
            response.put("description", updatedWorkout.getDescription());
            response.put("capacity", updatedWorkout.getCapacity());
            response.put("duration", updatedWorkout.getDuration());
            response.put("level", updatedWorkout.getLevel().getLevelName());
            response.put("category", updatedWorkout.getCategory().getCategoryName());
            response.put("trainer", updatedWorkout.getTrainer().getFirstName() + " " + updatedWorkout.getTrainer().getLastName());
            response.put("message", "Group workout updated successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGroupWorkout(@PathVariable Integer id) {
        try {
            groupWorkoutService.deleteGroupWorkout(id);
            return ResponseEntity.ok(Collections.singletonMap("message", "Group workout deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}/check-payment-required")
    public ResponseEntity<?> checkPaymentRequired(@PathVariable Long userId) {
        try {
            // Get user by ID first
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
            
            // Then get user's membership using the user object
            Optional<Membership> membershipOpt = membershipRepository.findByUser(user);
            
            if (membershipOpt.isEmpty()) {
                return ResponseEntity.ok(Map.of(
                    "paymentRequired", true,
                    "message", "No active membership found"
                ));
            }
            
            Membership membership = membershipOpt.get();
            MembershipPlan plan = membership.getPlan();
            
            // Check if group classes are free for this plan (-1 means unlimited free classes)
            boolean paymentRequired = plan.getGroupClassCount() == 0;
            
            Map<String, Object> response = new HashMap<>();
            response.put("paymentRequired", paymentRequired);
            
            if (paymentRequired) {
                // Get price from general_prices table (ID 2 for group classes)
                GeneralPrice groupClassPrice = generalPriceRepository.findById(2)
                    .orElseThrow(() -> new RuntimeException("Group class price not found"));
                    
                response.put("price", groupClassPrice.getPrice());
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @PostMapping("/enroll-with-payment")
    public ResponseEntity<?> enrollUserWithPayment(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.parseLong(request.get("userId").toString());
            Integer sessionId = Integer.parseInt(request.get("sessionId").toString());
            Boolean isPaid = Boolean.parseBoolean(request.get("isPaid").toString());
            
            // Enroll the user
            GroupWorkoutEnroll enrollment = groupWorkoutService.enrollUserInSession(userId, sessionId);
            
            // If it's a paid enrollment, save the payment record
            if (isPaid && request.get("price") != null) {
                BigDecimal price = new BigDecimal(request.get("price").toString());
                
                GroupClassesSale sale = new GroupClassesSale();
                sale.setEnrollmentId(enrollment.getId());
                sale.setPrice(price);
                sale.setSaleDate(LocalDate.now());
                
                groupClassesSaleRepository.save(sale);
            }
            
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
} 