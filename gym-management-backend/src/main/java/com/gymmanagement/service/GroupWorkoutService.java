package com.gymmanagement.service;

import com.gymmanagement.model.*;
import com.gymmanagement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GroupWorkoutService {

    @Autowired
    private GroupWorkoutRepository groupWorkoutRepository;
    
    @Autowired
    private GroupWorkoutCategoryRepository categoryRepository;
    
    @Autowired
    private GroupWorkoutSessionRepository sessionRepository;
    
    @Autowired
    private GroupWorkoutEnrollRepository enrollRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private GroupWorkoutLevelRepository levelRepository;
    
    public List<GroupWorkoutCategory> getAllCategories() {
        return categoryRepository.findAll();
    }
    
    public List<GroupWorkout> getAllWorkouts() {
        return groupWorkoutRepository.findAll();
    }
    
    public List<GroupWorkout> getWorkoutsByCategory(Integer categoryId) {
        return groupWorkoutRepository.findByCategoryId(categoryId);
    }
    
    public List<GroupWorkout> getWorkoutsByTrainer(Long trainerId) {
        return groupWorkoutRepository.findAll().stream()
            .filter(workout -> workout.getTrainer().getId().equals(trainerId))
            .collect(Collectors.toList());
    }
    
    public List<GroupWorkoutSession> getSessionsForWorkout(Integer workoutId) {
        return sessionRepository.findByGroupWorkoutId(workoutId);
    }
    
    public List<GroupWorkoutEnroll> getEnrollmentsForUser(Long userId) {
        return enrollRepository.findByMemberId(userId);
    }
    
    @Transactional
    public GroupWorkoutEnroll enrollUserInSession(Long userId, Integer sessionId) {
        // Check if user already enrolled
        if (enrollRepository.existsBySessionIdAndMemberId(sessionId, userId)) {
            throw new RuntimeException("User already enrolled in this session");
        }
        
        // Get user and session
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        GroupWorkoutSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        // Create enrollment
        GroupWorkoutEnroll enroll = new GroupWorkoutEnroll();
        enroll.setMember(user);
        enroll.setSession(session);
        
        return enrollRepository.save(enroll);
    }

    public Optional<GroupWorkout> getWorkoutById(Integer id) {
        return groupWorkoutRepository.findById(id);
    }

    public GroupWorkout updateWorkout(GroupWorkout workout) {
        return groupWorkoutRepository.save(workout);
    }
    
    @Transactional
    public GroupWorkout createGroupWorkout(
            String name, 
            String description, 
            Integer capacity, 
            Integer duration, 
            Integer levelId, 
            Integer categoryId, 
            Long trainerId, 
            String imagePath) {
        
        // Get trainer
        User trainer = userRepository.findById(trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer not found with id: " + trainerId));
        
        // Get level
        GroupWorkoutLevel level = levelRepository.findById(levelId)
                .orElseThrow(() -> new RuntimeException("Workout level not found with id: " + levelId));
        
        // Get category
        GroupWorkoutCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Workout category not found with id: " + categoryId));
        
        // Create new workout
        GroupWorkout workout = new GroupWorkout();
        workout.setName(name);
        workout.setDescription(description);
        workout.setCapacity(capacity);
        workout.setDuration(duration);
        workout.setLevel(level);
        workout.setCategory(category);
        workout.setTrainer(trainer);
        workout.setImagePath(imagePath);
        
        return groupWorkoutRepository.save(workout);
    }
    
    @Transactional
    public GroupWorkout updateGroupWorkout(
            Integer workoutId,
            String name, 
            String description, 
            Integer capacity, 
            Integer duration, 
            Integer levelId, 
            Integer categoryId, 
            String imagePath) {
        
        // Get existing workout
        GroupWorkout workout = groupWorkoutRepository.findById(workoutId)
                .orElseThrow(() -> new RuntimeException("Workout not found with id: " + workoutId));
        
        // Update the fields if they are provided
        if (name != null) workout.setName(name);
        if (description != null) workout.setDescription(description);
        if (capacity != null) workout.setCapacity(capacity);
        if (duration != null) workout.setDuration(duration);
        
        // Update level if provided
        if (levelId != null) {
            GroupWorkoutLevel level = levelRepository.findById(levelId)
                .orElseThrow(() -> new RuntimeException("Workout level not found with id: " + levelId));
            workout.setLevel(level);
        }
        
        // Update category if provided
        if (categoryId != null) {
            GroupWorkoutCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Workout category not found with id: " + categoryId));
            workout.setCategory(category);
        }
        
        // Update image path if provided
        if (imagePath != null && !imagePath.isEmpty()) {
            workout.setImagePath(imagePath);
        }
        
        return groupWorkoutRepository.save(workout);
    }

    public List<GroupWorkout> getWorkoutsByTrainerId(Long trainerId) {
        // Get user by ID
        User trainer = userRepository.findById(trainerId)
            .orElseThrow(() -> new RuntimeException("Trainer not found with ID: " + trainerId));
        
        // Find all workouts for this trainer
        return groupWorkoutRepository.findByTrainer(trainer);
    }

    public void deleteGroupWorkout(Integer id) {
        groupWorkoutRepository.deleteById(id);
    }
} 