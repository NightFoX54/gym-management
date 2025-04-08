package com.gymmanagement.service;

import com.gymmanagement.dto.GroupWorkoutDTO;
import com.gymmanagement.dto.GroupWorkoutSessionDTO;
import com.gymmanagement.model.*;
import com.gymmanagement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GroupWorkoutService {

    @Autowired
    private GroupWorkoutRepository groupWorkoutRepository;
    
    @Autowired
    private GroupWorkoutCategoryRepository categoryRepository;
    
    @Autowired
    private GroupWorkoutLevelRepository levelRepository;
    
    @Autowired
    private GroupWorkoutSessionRepository sessionRepository;
    
    @Autowired
    private GroupWorkoutEnrollRepository enrollRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Transactional(readOnly = true)
    public List<GroupWorkoutDTO> getAllGroupWorkouts(Long userId) {
        List<GroupWorkout> workouts = groupWorkoutRepository.findAll();
        return workouts.stream()
                .map(workout -> convertToDTO(workout, userId))
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public GroupWorkoutDTO getGroupWorkoutById(Integer id, Long userId) {
        GroupWorkout workout = groupWorkoutRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Group workout not found with id: " + id));
        return convertToDTO(workout, userId);
    }
    
    @Transactional(readOnly = true)
    public List<GroupWorkoutDTO> getGroupWorkoutsByCategory(Integer categoryId, Long userId) {
        List<GroupWorkout> workouts = groupWorkoutRepository.findByCategoryId(categoryId);
        return workouts.stream()
                .map(workout -> convertToDTO(workout, userId))
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<GroupWorkoutDTO> getGroupWorkoutsByTrainer(Long trainerId, Long userId) {
        List<GroupWorkout> workouts = groupWorkoutRepository.findByTrainerId(trainerId);
        return workouts.stream()
                .map(workout -> convertToDTO(workout, userId))
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<GroupWorkoutCategory> getAllCategories() {
        return categoryRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public List<GroupWorkoutLevel> getAllLevels() {
        return levelRepository.findAll();
    }
    
    @Transactional
    public void initializeDefaultData() {
        // Initialize default categories if they don't exist
        if (categoryRepository.count() == 0) {
            List<GroupWorkoutCategory> defaultCategories = new ArrayList<>();
            defaultCategories.add(new GroupWorkoutCategory(null, "HIIT", "High-Intensity Interval Training"));
            defaultCategories.add(new GroupWorkoutCategory(null, "Yoga", "Mind and body practices"));
            defaultCategories.add(new GroupWorkoutCategory(null, "Cycling", "Indoor cycling workouts"));
            defaultCategories.add(new GroupWorkoutCategory(null, "Zumba", "Dance fitness program"));
            defaultCategories.add(new GroupWorkoutCategory(null, "Pilates", "System of physical exercises"));
            defaultCategories.add(new GroupWorkoutCategory(null, "Dance Fitness", "Fun and energetic dance workouts"));
            categoryRepository.saveAll(defaultCategories);
        }
        
        // Initialize default levels if they don't exist
        if (levelRepository.count() == 0) {
            List<GroupWorkoutLevel> defaultLevels = new ArrayList<>();
            defaultLevels.add(new GroupWorkoutLevel(null, "Beginner", "For newcomers to fitness"));
            defaultLevels.add(new GroupWorkoutLevel(null, "Intermediate", "For those with some experience"));
            defaultLevels.add(new GroupWorkoutLevel(null, "Advanced", "For experienced fitness enthusiasts"));
            levelRepository.saveAll(defaultLevels);
        }
    }
    
    private GroupWorkoutDTO convertToDTO(GroupWorkout workout, Long userId) {
        try {
            if (workout == null) {
                return null;
            }
            
            // Find sessions for this workout
            List<GroupWorkoutSession> sessions = new ArrayList<>();
            try {
                sessions = sessionRepository.findByGroupWorkoutId(workout.getId());
            } catch (Exception e) {
                System.out.println("Error fetching sessions: " + e.getMessage());
                // Don't reassign, leave as empty list
            }
            
            // Create session DTOs
            List<GroupWorkoutSessionDTO> sessionDTOs = new ArrayList<>();
            if (sessions != null && !sessions.isEmpty()) {
                sessionDTOs = sessions.stream()
                    .map(session -> {
                        int enrolledCount = 0;
                        try {
                            enrolledCount = (int) enrollRepository.countBySessionId(session.getId());
                        } catch (Exception e) {
                            System.out.println("Error counting enrollments: " + e.getMessage());
                        }
                        
                        return GroupWorkoutSessionDTO.builder()
                                .id(session.getId())
                                .groupWorkoutId(workout.getId())
                                .date(session.getDate())
                                .time(session.getTime())
                                .enrollmentCount(enrolledCount)
                                .capacity(workout.getCapacity())
                                .isFull(enrolledCount >= workout.getCapacity())
                                .build();
                    })
                    .collect(Collectors.toList());
            }
            
            // Calculate total enrollment
            int totalEnrollment = 0;
            if (!sessionDTOs.isEmpty()) {
                totalEnrollment = sessionDTOs.stream()
                        .mapToInt(GroupWorkoutSessionDTO::getEnrollmentCount)
                        .sum();
            }
            
            // Check if user is enrolled
            boolean isEnrolled = false;
            if (userId != null && sessions != null && !sessions.isEmpty()) {
                try {
                    List<GroupWorkoutEnroll> userEnrolls = enrollRepository.findByMemberId(userId);
                    if (userEnrolls != null && !userEnrolls.isEmpty()) {
                        final List<GroupWorkoutSession> finalSessions = sessions;
                        isEnrolled = userEnrolls.stream()
                                .anyMatch(enroll -> finalSessions.stream()
                                        .anyMatch(session -> session.getId().equals(enroll.getSession().getId())));
                    }
                } catch (Exception e) {
                    System.out.println("Error checking enrollment: " + e.getMessage());
                }
            }
            
            // Get trainer name
            String trainerName = "";
            if (workout.getTrainer() != null) {
                trainerName = workout.getTrainer().getFirstName() + " " + workout.getTrainer().getLastName();
            }
            
            Integer levelId = null;
            String levelName = null;
            if (workout.getLevel() != null) {
                levelId = workout.getLevel().getId();
                levelName = workout.getLevel().getLevelName();
            }
            
            Integer categoryId = null;
            String categoryName = null;
            if (workout.getCategory() != null) {
                categoryId = workout.getCategory().getId();
                categoryName = workout.getCategory().getCategoryName();
            }
            
            return GroupWorkoutDTO.builder()
                    .id(workout.getId())
                    .name(workout.getName())
                    .description(workout.getDescription())
                    .capacity(workout.getCapacity())
                    .duration(workout.getDuration())
                    .level(levelName)
                    .level_id(levelId)
                    .trainerId(workout.getTrainer() != null ? workout.getTrainer().getId() : null)
                    .trainerName(trainerName)
                    .category(categoryName)
                    .category_id(categoryId)
                    .imagePath(workout.getImagePath())
                    .sessions(sessionDTOs)
                    .enrollmentCount(totalEnrollment)
                    .isEnrolled(isEnrolled)
                    .build();
        } catch (Exception e) {
            e.printStackTrace();
            
            // Return a minimal DTO with just the basic info to prevent 500 errors
            return GroupWorkoutDTO.builder()
                    .id(workout.getId())
                    .name(workout.getName())
                    .description(workout.getDescription())
                    .capacity(workout.getCapacity())
                    .duration(workout.getDuration())
                    .level(workout.getLevel() != null ? workout.getLevel().getLevelName() : null)
                    .level_id(workout.getLevel() != null ? workout.getLevel().getId() : null)
                    .trainerId(workout.getTrainer() != null ? workout.getTrainer().getId() : null)
                    .trainerName("")
                    .category(workout.getCategory() != null ? workout.getCategory().getCategoryName() : null)
                    .category_id(workout.getCategory() != null ? workout.getCategory().getId() : null)
                    .imagePath(workout.getImagePath())
                    .sessions(new ArrayList<>())
                    .enrollmentCount(0)
                    .isEnrolled(false)
                    .build();
        }
    }
}