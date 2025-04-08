package com.gymmanagement.controller;

import com.gymmanagement.dto.GroupWorkoutDTO;
import com.gymmanagement.model.GroupWorkout;
import com.gymmanagement.model.GroupWorkoutCategory;
import com.gymmanagement.model.GroupWorkoutLevel;
import com.gymmanagement.model.User;
import com.gymmanagement.repository.GroupWorkoutCategoryRepository;
import com.gymmanagement.repository.GroupWorkoutLevelRepository;
import com.gymmanagement.repository.GroupWorkoutRepository;
import com.gymmanagement.repository.UserRepository;
import com.gymmanagement.service.GroupWorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/group-workouts")
@CrossOrigin(origins = "*")
public class GroupWorkoutController {

    @Autowired
    private GroupWorkoutService groupWorkoutService;
    
    @Autowired
    private GroupWorkoutRepository groupWorkoutRepository;
    
    @Autowired
    private GroupWorkoutCategoryRepository categoryRepository;
    
    @Autowired
    private GroupWorkoutLevelRepository levelRepository;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<GroupWorkoutDTO>> getAllGroupWorkouts(@RequestParam(required = false) Long userId,
                                                                     @RequestParam(required = false) Long trainerId) {
        try {
            if (trainerId != null) {
                List<GroupWorkoutDTO> trainerWorkouts = groupWorkoutService.getGroupWorkoutsByTrainer(trainerId, userId);
                return ResponseEntity.ok(trainerWorkouts);
            } else {
                List<GroupWorkoutDTO> allWorkouts = groupWorkoutService.getAllGroupWorkouts(userId);
                return ResponseEntity.ok(allWorkouts);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupWorkoutDTO> getGroupWorkoutById(@PathVariable Integer id,
                                                             @RequestParam(required = false) Long userId) {
        try {
            GroupWorkoutDTO workout = groupWorkoutService.getGroupWorkoutById(id, userId);
            return ResponseEntity.ok(workout);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping
    public ResponseEntity<?> createGroupWorkout(@RequestBody Map<String, Object> request) {
        try {
            Integer categoryId = (Integer) request.get("category_id");
            Integer levelId = (Integer) request.get("level_id");
            Long trainerId = ((Number) request.get("trainer_id")).longValue();
            String name = (String) request.get("name");
            String description = (String) request.get("description");
            Integer capacity = (Integer) request.get("capacity");
            Integer duration = (Integer) request.get("duration");
            String imagePath = (String) request.get("image_path");
            
            // Validate required fields
            if (name == null || capacity == null || duration == null || categoryId == null || levelId == null || trainerId == null) {
                return ResponseEntity.badRequest().body("Required fields are missing");
            }
            
            // Find trainer, level, and category
            Optional<User> trainerOpt = userRepository.findById(trainerId);
            Optional<GroupWorkoutLevel> levelOpt = levelRepository.findById(levelId);
            Optional<GroupWorkoutCategory> categoryOpt = categoryRepository.findById(categoryId);
            
            if (trainerOpt.isEmpty() || levelOpt.isEmpty() || categoryOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Trainer, level, or category not found");
            }
            
            // Create new group workout
            GroupWorkout groupWorkout = new GroupWorkout();
            groupWorkout.setName(name);
            groupWorkout.setDescription(description);
            groupWorkout.setCapacity(capacity);
            groupWorkout.setDuration(duration);
            groupWorkout.setTrainer(trainerOpt.get());
            groupWorkout.setLevel(levelOpt.get());
            groupWorkout.setCategory(categoryOpt.get());
            groupWorkout.setImagePath(imagePath);
            
            // Save to database
            GroupWorkout savedWorkout = groupWorkoutRepository.save(groupWorkout);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedWorkout);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating group workout: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateGroupWorkout(@PathVariable Integer id, @RequestBody Map<String, Object> request) {
        try {
            Optional<GroupWorkout> workoutOpt = groupWorkoutRepository.findById(id);
            if (workoutOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            GroupWorkout groupWorkout = workoutOpt.get();
            
            // Update fields if present in request
            if (request.containsKey("name")) {
                groupWorkout.setName((String) request.get("name"));
            }
            
            if (request.containsKey("description")) {
                groupWorkout.setDescription((String) request.get("description"));
            }
            
            if (request.containsKey("capacity")) {
                groupWorkout.setCapacity((Integer) request.get("capacity"));
            }
            
            if (request.containsKey("duration")) {
                groupWorkout.setDuration((Integer) request.get("duration"));
            }
            
            if (request.containsKey("image_path")) {
                groupWorkout.setImagePath((String) request.get("image_path"));
            }
            
            if (request.containsKey("category_id")) {
                Integer categoryId = (Integer) request.get("category_id");
                Optional<GroupWorkoutCategory> categoryOpt = categoryRepository.findById(categoryId);
                if (categoryOpt.isPresent()) {
                    groupWorkout.setCategory(categoryOpt.get());
                }
            }
            
            if (request.containsKey("level_id")) {
                Integer levelId = (Integer) request.get("level_id");
                Optional<GroupWorkoutLevel> levelOpt = levelRepository.findById(levelId);
                if (levelOpt.isPresent()) {
                    groupWorkout.setLevel(levelOpt.get());
                }
            }
            
            if (request.containsKey("trainer_id")) {
                Long trainerId = ((Number) request.get("trainer_id")).longValue();
                Optional<User> trainerOpt = userRepository.findById(trainerId);
                if (trainerOpt.isPresent()) {
                    groupWorkout.setTrainer(trainerOpt.get());
                }
            }
            
            // Save updated workout
            GroupWorkout updatedWorkout = groupWorkoutRepository.save(groupWorkout);
            return ResponseEntity.ok(updatedWorkout);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating group workout: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGroupWorkout(@PathVariable Integer id) {
        try {
            Optional<GroupWorkout> workoutOpt = groupWorkoutRepository.findById(id);
            if (workoutOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            groupWorkoutRepository.deleteById(id);
            return ResponseEntity.ok().body("Group workout deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting group workout: " + e.getMessage());
        }
    }
    
    @GetMapping("/categories")
    public ResponseEntity<List<GroupWorkoutCategory>> getAllCategories() {
        try {
            List<GroupWorkoutCategory> categories = groupWorkoutService.getAllCategories();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    @GetMapping("/levels")
    public ResponseEntity<List<GroupWorkoutLevel>> getAllLevels() {
        try {
            List<GroupWorkoutLevel> levels = groupWorkoutService.getAllLevels();
            return ResponseEntity.ok(levels);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    @PostMapping("/init")
    public ResponseEntity<?> initializeData() {
        try {
            groupWorkoutService.initializeDefaultData();
            return ResponseEntity.ok("Group workout data initialized successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error initializing data: " + e.getMessage());
        }
    }
}