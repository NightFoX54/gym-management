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
    
    public List<GroupWorkoutCategory> getAllCategories() {
        return categoryRepository.findAll();
    }
    
    public List<GroupWorkout> getAllWorkouts() {
        return groupWorkoutRepository.findAll();
    }
    
    public List<GroupWorkout> getWorkoutsByCategory(Integer categoryId) {
        return groupWorkoutRepository.findByCategoryId(categoryId);
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
} 