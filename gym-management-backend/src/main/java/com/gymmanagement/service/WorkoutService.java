package com.gymmanagement.service;

import com.gymmanagement.dto.WorkoutDTO;
import com.gymmanagement.dto.WorkoutExerciseDTO;
import com.gymmanagement.dto.WorkoutRequest;
import com.gymmanagement.model.*;
import com.gymmanagement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class WorkoutService {

    @Autowired
    private WorkoutRepository workoutRepository;
    
    @Autowired
    private WorkoutCategoryRepository categoryRepository;
    
    @Autowired
    private WorkoutLevelRepository levelRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private WorkoutExerciseRepository exerciseRepository;
    
    @Transactional(readOnly = true)
    public List<WorkoutDTO> getUserWorkouts(Long userId, Boolean isTrainer) {
        System.out.println("Fetching workouts for user ID: " + userId + ", isTrainer: " + isTrainer);
        try {
            // For now, return a mock workout for testing
            if (workoutRepository.count() == 0) {
                System.out.println("No workouts found in database, initializing mock data");
                initializeDefaultCategoriesAndLevels();
                createMockWorkout(userId, isTrainer);
            }
            
            List<Workout> workouts = workoutRepository.findByUserIdAndIsTrainer(userId, isTrainer);
            System.out.println("Found " + workouts.size() + " workouts");
            return workouts.stream().map(this::convertToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error in getUserWorkouts: " + e.getMessage());
            e.printStackTrace();
            // Return an empty list instead of throwing exception
            return new ArrayList<>();
        }
    }
    
    @Transactional(readOnly = true)
    public WorkoutDTO getWorkoutById(Long workoutId) {
        Workout workout = workoutRepository.findById(workoutId)
                .orElseThrow(() -> new RuntimeException("Workout not found with id: " + workoutId));
        return convertToDTO(workout);
    }
    
    @Transactional
    public WorkoutDTO createWorkout(Long userId, WorkoutRequest request) {
        // Initialize database with default categories and levels if not exist
        initializeDefaultCategoriesAndLevels();
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        // Use the exact category name from the request, don't normalize it
        WorkoutCategory category = categoryRepository.findByName(request.getType());
        if (category == null) {
            throw new RuntimeException("Invalid workout type: " + request.getType());
        }
        
        // Use the exact level name from the request, don't normalize it
        WorkoutLevel level = levelRepository.findByName(request.getDifficulty());
        if (level == null) {
            throw new RuntimeException("Invalid difficulty level: " + request.getDifficulty());
        }
        
        Workout workout = new Workout();
        workout.setUser(user);
        workout.setIsTrainer(user.getRole().equals("TRAINER"));
        workout.setLevel(level);
        workout.setCategory(category);
        workout.setDuration(request.getDuration());
        workout.setName(request.getName());
        workout.setDescription(request.getDescription());
        workout.setCalories(request.getCalories());
        workout.setEquipment(String.join(",", request.getEquipment()));
        workout.setTargetMuscles(String.join(",", request.getTargetMuscles()));
        
        Workout savedWorkout = workoutRepository.save(workout);
        
        // Save exercises
        List<WorkoutExercise> exercises = new ArrayList<>();
        if (request.getExercises() != null) {
            for (WorkoutExerciseDTO exerciseDTO : request.getExercises()) {
                WorkoutExercise exercise = new WorkoutExercise();
                exercise.setWorkout(savedWorkout);
                exercise.setExerciseName(exerciseDTO.getExerciseName());
                exercise.setSets(exerciseDTO.getSets());
                exercise.setRepRange(exerciseDTO.getRepRange());
                exercises.add(exercise);
            }
            exerciseRepository.saveAll(exercises);
        }
        
        savedWorkout.setExercises(exercises);
        return convertToDTO(savedWorkout);
    }
    
    @Transactional
    public WorkoutDTO updateWorkout(Long workoutId, WorkoutRequest request) {
        System.out.println("Service: Updating workout with ID: " + workoutId);
        try {
            Optional<Workout> existingWorkoutOpt = workoutRepository.findById(workoutId);
            
            if (existingWorkoutOpt.isEmpty()) {
                throw new RuntimeException("Workout not found with ID: " + workoutId);
            }
            
            Workout existingWorkout = existingWorkoutOpt.get();
            
            // Update fields
            existingWorkout.setName(request.getName());
            existingWorkout.setDescription(request.getDescription());
            existingWorkout.setDuration(request.getDuration());
            
            // Update category if provided
            String categoryName = request.getType();
            if (categoryName != null && !categoryName.isEmpty()) {
                WorkoutCategory category = categoryRepository.findByName(categoryName);
                if (category != null) {
                    existingWorkout.setCategory(category);
                }
            }
            
            // Update level if provided
            String levelName = request.getDifficulty();
            if (levelName != null && !levelName.isEmpty()) {
                WorkoutLevel level = levelRepository.findByName(levelName);
                if (level != null) {
                    existingWorkout.setLevel(level);
                }
            }
            
            // Update equipment and targetMuscles
            if (request.getEquipment() != null) {
                existingWorkout.setEquipment(String.join(",", request.getEquipment()));
            }
            
            if (request.getTargetMuscles() != null) {
                existingWorkout.setTargetMuscles(String.join(",", request.getTargetMuscles()));
            }
            
            existingWorkout.setCalories(request.getCalories());
            
            // Save the updated workout
            Workout updatedWorkout = workoutRepository.save(existingWorkout);
            
            // Update exercises if provided
            if (request.getExercises() != null && !request.getExercises().isEmpty()) {
                // Delete existing exercises
                List<WorkoutExercise> existingExercises = exerciseRepository.findByWorkoutId(workoutId);
                exerciseRepository.deleteAll(existingExercises);
                
                // Add new exercises
                List<WorkoutExercise> newExercises = new ArrayList<>();
                for (WorkoutExerciseDTO exerciseDTO : request.getExercises()) {
                    WorkoutExercise exercise = new WorkoutExercise();
                    exercise.setWorkout(updatedWorkout);
                    exercise.setExerciseName(exerciseDTO.getExerciseName());
                    exercise.setSets(exerciseDTO.getSets());
                    exercise.setRepRange(exerciseDTO.getRepRange());
                    newExercises.add(exercise);
                }
                exerciseRepository.saveAll(newExercises);
                updatedWorkout.setExercises(newExercises);
            }
            
            System.out.println("Service: Workout updated successfully");
            return convertToDTO(updatedWorkout);
        } catch (Exception e) {
            System.err.println("Service error in updateWorkout: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @Transactional
    public void deleteWorkout(Long workoutId) {
        Workout workout = workoutRepository.findById(workoutId)
                .orElseThrow(() -> new RuntimeException("Workout not found with id: " + workoutId));
        
        // Delete associated exercises first
        List<WorkoutExercise> exercises = exerciseRepository.findByWorkoutId(workoutId);
        exerciseRepository.deleteAll(exercises);
        
        // Then delete the workout
        workoutRepository.delete(workout);
    }
    
    private WorkoutDTO convertToDTO(Workout workout) {
        List<WorkoutExercise> exercises = exerciseRepository.findByWorkoutId(workout.getId());
        
        // Generate a random completion percentage for UI demonstration
        Random random = new Random();
        int completion = random.nextInt(101); // 0-100
        
        List<String> equipmentList = Arrays.asList(workout.getEquipment().split(","));
        List<String> musclesList = Arrays.asList(workout.getTargetMuscles().split(","));
        
        // Filter out empty strings
        equipmentList = equipmentList.stream()
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
        
        musclesList = musclesList.stream()
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
        
        // Map exercises to DTOs
        List<WorkoutExerciseDTO> exerciseDTOs = exercises.stream()
                .map(exercise -> WorkoutExerciseDTO.builder()
                        .id(exercise.getId())
                        .exerciseName(exercise.getExerciseName())
                        .sets(exercise.getSets())
                        .repRange(exercise.getRepRange())
                        .build())
                .collect(Collectors.toList());
        
        return WorkoutDTO.builder()
                .id(workout.getId())
                .name(workout.getName())
                .type(workout.getCategory().getName())
                .difficulty(workout.getLevel().getName())
                .duration(workout.getDuration())
                .calories(workout.getCalories())
                .description(workout.getDescription())
                .equipment(equipmentList)
                .targetMuscles(musclesList)
                .exercises(exercises.size())
                .completion(completion)
                .exerciseList(exerciseDTOs)
                .build();
    }
    
    @Transactional
    public void initializeDefaultCategoriesAndLevels() {
        // Initialize default categories if they don't exist
        if (categoryRepository.count() == 0) {
            List<WorkoutCategory> categories = Arrays.asList(
                    new WorkoutCategory(null, "Strength Training"),
                    new WorkoutCategory(null, "Cardio"),
                    new WorkoutCategory(null, "HIIT"),
                    new WorkoutCategory(null, "Flexibility"),
                    new WorkoutCategory(null, "CrossFit")
            );
            categoryRepository.saveAll(categories);
        }
        
        // Initialize default levels if they don't exist
        if (levelRepository.count() == 0) {
            List<WorkoutLevel> levels = Arrays.asList(
                    new WorkoutLevel(null, "Beginner"),
                    new WorkoutLevel(null, "Intermediate"),
                    new WorkoutLevel(null, "Advanced")
            );
            levelRepository.saveAll(levels);
        }
    }
    
    @Transactional
    private void createMockWorkout(Long userId, Boolean isTrainer) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
            
            WorkoutCategory category = categoryRepository.findByName("Strength Training");
            if (category == null) {
                throw new RuntimeException("Category not found");
            }
            
            WorkoutLevel level = levelRepository.findByName("Intermediate");
            if (level == null) {
                throw new RuntimeException("Level not found");
            }
            
            Workout workout = new Workout();
            workout.setUser(user);
            workout.setIsTrainer(isTrainer);
            workout.setLevel(level);
            workout.setCategory(category);
            workout.setDuration(60);
            workout.setName("Full Body Strength");
            workout.setDescription("Complete full body workout focusing on major muscle groups");
            workout.setCalories(450);
            workout.setEquipment("Dumbbells,Barbell,Resistance Bands");
            workout.setTargetMuscles("Chest,Back,Legs,Shoulders");
            
            Workout savedWorkout = workoutRepository.save(workout);
            
            // Create some exercises
            List<WorkoutExercise> exercises = new ArrayList<>();
            
            WorkoutExercise exercise1 = new WorkoutExercise();
            exercise1.setWorkout(savedWorkout);
            exercise1.setExerciseName("Barbell Squat");
            exercise1.setSets(4);
            exercise1.setRepRange("8-12 reps");
            exercises.add(exercise1);
            
            WorkoutExercise exercise2 = new WorkoutExercise();
            exercise2.setWorkout(savedWorkout);
            exercise2.setExerciseName("Bench Press");
            exercise2.setSets(4);
            exercise2.setRepRange("8-12 reps");
            exercises.add(exercise2);
            
            exerciseRepository.saveAll(exercises);
            
            System.out.println("Mock workout created successfully!");
        } catch (Exception e) {
            System.err.println("Error creating mock workout: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    @Transactional(readOnly = true)
    public List<WorkoutCategory> getAllWorkoutTypes() {
        return categoryRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public List<WorkoutLevel> getAllWorkoutLevels() {
        return levelRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public List<WorkoutDTO> getAllTrainerWorkouts() {
        System.out.println("Fetching all trainer workouts");
        try {
            // Find all workouts where isTrainer = true
            List<Workout> workouts = workoutRepository.findByIsTrainer(true);
            System.out.println("Found " + workouts.size() + " trainer workouts");
            return workouts.stream().map(this::convertToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error in getAllTrainerWorkouts: " + e.getMessage());
            e.printStackTrace();
            // Return an empty list instead of throwing exception
            return new ArrayList<>();
        }
    }
    
    public List<WorkoutExerciseDTO> getExercisesByWorkoutId(Long workoutId) {
        List<WorkoutExercise> exercises = exerciseRepository.findByWorkoutId(workoutId);
        return exercises.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    private WorkoutExerciseDTO convertToDTO(WorkoutExercise exercise) {
        return WorkoutExerciseDTO.builder()
            .id(exercise.getId())
            .exerciseName(exercise.getExerciseName())
            .sets(exercise.getSets())
            .repRange(exercise.getRepRange())
            .build();
    }
}
