package com.gymmanagement.service;

import com.gymmanagement.dto.TrainingPlanDTO;
import com.gymmanagement.model.MemberTrainingPlan;
import com.gymmanagement.model.User;
import com.gymmanagement.model.Workout;
import com.gymmanagement.repository.MemberTrainingPlanRepository;
import com.gymmanagement.repository.UserRepository;
import com.gymmanagement.repository.WorkoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TrainingPlanService {
    
    @Autowired
    private MemberTrainingPlanRepository trainingPlanRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private WorkoutRepository workoutRepository;
    
    public List<TrainingPlanDTO> getUserTrainingPlan(Long userId) {
        return trainingPlanRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public TrainingPlanDTO addWorkoutToTrainingPlan(Long userId, Long workoutId, Integer dayOfWeek) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Workout workout = workoutRepository.findById(workoutId)
                .orElseThrow(() -> new RuntimeException("Workout not found"));
        
        // Check if user already has a workout for this day
        Optional<MemberTrainingPlan> existingPlan = trainingPlanRepository.findByUserIdAndDayOfWeek(userId, dayOfWeek);
        
        MemberTrainingPlan trainingPlan;
        if (existingPlan.isPresent()) {
            // Update existing entry
            trainingPlan = existingPlan.get();
            trainingPlan.setWorkout(workout);
        } else {
            // Create new entry
            trainingPlan = new MemberTrainingPlan();
            trainingPlan.setUser(user);
            trainingPlan.setWorkout(workout);
            trainingPlan.setDayOfWeek(dayOfWeek);
        }
        
        trainingPlan = trainingPlanRepository.save(trainingPlan);
        return convertToDTO(trainingPlan);
    }
    
    @Transactional
    public TrainingPlanDTO updateTrainingPlan(Long userId, Long planId, Long workoutId, Integer dayOfWeek) {
        MemberTrainingPlan trainingPlan = trainingPlanRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Training plan entry not found"));
        
        // Security check - ensure the plan belongs to current user
        if (!trainingPlan.getUser().getId().equals(userId)) {
            throw new RuntimeException("You do not have permission to modify this training plan");
        }
        
        Workout workout = workoutRepository.findById(workoutId)
                .orElseThrow(() -> new RuntimeException("Workout not found"));
        
        trainingPlan.setWorkout(workout);
        if (dayOfWeek != null) {
            trainingPlan.setDayOfWeek(dayOfWeek);
        }
        
        trainingPlan = trainingPlanRepository.save(trainingPlan);
        return convertToDTO(trainingPlan);
    }
    
    @Transactional
    public void removeFromTrainingPlan(Long userId, Long planId) {
        MemberTrainingPlan trainingPlan = trainingPlanRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Training plan entry not found"));
        
        // Security check - ensure the plan belongs to current user
        if (!trainingPlan.getUser().getId().equals(userId)) {
            throw new RuntimeException("You do not have permission to modify this training plan");
        }
        
        trainingPlanRepository.delete(trainingPlan);
    }
    
    private TrainingPlanDTO convertToDTO(MemberTrainingPlan trainingPlan) {
        TrainingPlanDTO dto = new TrainingPlanDTO();
        dto.setId(trainingPlan.getId());
        dto.setUserId(trainingPlan.getUser().getId());
        dto.setWorkoutId(trainingPlan.getWorkout().getId());
        dto.setWorkoutName(trainingPlan.getWorkout().getName());
        dto.setDayOfWeek(trainingPlan.getDayOfWeek());
        
        if (trainingPlan.getWorkout().getCategory() != null) {
            dto.setWorkoutType(trainingPlan.getWorkout().getCategory().getName());
        }
        
        dto.setWorkoutDuration(trainingPlan.getWorkout().getDuration());
        
        if (trainingPlan.getWorkout().getLevel() != null) {
            dto.setWorkoutDifficulty(trainingPlan.getWorkout().getLevel().getName());
        }
        
        return dto;
    }
} 