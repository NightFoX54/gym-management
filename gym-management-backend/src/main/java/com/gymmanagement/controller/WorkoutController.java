package com.gymmanagement.controller;

import com.gymmanagement.dto.WorkoutDTO;
import com.gymmanagement.dto.WorkoutRequest;
import com.gymmanagement.service.WorkoutService;
import com.gymmanagement.model.WorkoutCategory;
import com.gymmanagement.model.WorkoutLevel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/workouts")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.PUT, RequestMethod.PATCH})
public class WorkoutController {

    @Autowired
    private WorkoutService workoutService;
    
    @GetMapping
    public ResponseEntity<List<WorkoutDTO>> getUserWorkouts(
            @RequestParam Long userId, 
            @RequestParam(defaultValue = "false") Boolean isTrainer) {
        System.out.println("Controller: Getting workouts for userId=" + userId + ", isTrainer=" + isTrainer);
        try {
            List<WorkoutDTO> workouts = workoutService.getUserWorkouts(userId, isTrainer);
            System.out.println("Controller: Found " + workouts.size() + " workouts");
            return ResponseEntity.ok(workouts);
        } catch (Exception e) {
            System.err.println("Controller error in getUserWorkouts: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @GetMapping("/{workoutId}")
    public ResponseEntity<WorkoutDTO> getWorkoutById(@PathVariable Long workoutId) {
        return ResponseEntity.ok(workoutService.getWorkoutById(workoutId));
    }
    
    @PostMapping
    public ResponseEntity<WorkoutDTO> createWorkout(
            @RequestParam Long userId,
            @RequestBody WorkoutRequest request) {
        return ResponseEntity.ok(workoutService.createWorkout(userId, request));
    }
    
    @PutMapping("/{workoutId}")
    public ResponseEntity<WorkoutDTO> updateWorkout(
            @PathVariable Long workoutId,
            @RequestBody WorkoutRequest request) {
        System.out.println("Controller: Updating workout with ID: " + workoutId);
        try {
            WorkoutDTO updatedWorkout = workoutService.updateWorkout(workoutId, request);
            System.out.println("Controller: Workout updated successfully");
            return ResponseEntity.ok(updatedWorkout);
        } catch (Exception e) {
            System.err.println("Controller error in updateWorkout: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @DeleteMapping("/{workoutId}")
    public ResponseEntity<Void> deleteWorkout(@PathVariable Long workoutId) {
        workoutService.deleteWorkout(workoutId);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/init")
    public ResponseEntity<Void> initializeData() {
        System.out.println("Controller: Initializing workout data");
        try {
            workoutService.initializeDefaultCategoriesAndLevels();
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Controller error in initializeData: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @GetMapping("/types")
    public ResponseEntity<List<WorkoutCategory>> getWorkoutTypes() {
        System.out.println("Controller: Getting workout types");
        try {
            List<WorkoutCategory> types = workoutService.getAllWorkoutTypes();
            return ResponseEntity.ok(types);
        } catch (Exception e) {
            System.err.println("Controller error in getWorkoutTypes: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @GetMapping("/levels")
    public ResponseEntity<List<WorkoutLevel>> getWorkoutLevels() {
        System.out.println("Controller: Getting workout levels");
        try {
            List<WorkoutLevel> levels = workoutService.getAllWorkoutLevels();
            return ResponseEntity.ok(levels);
        } catch (Exception e) {
            System.err.println("Controller error in getWorkoutLevels: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping("/trainer")
    public ResponseEntity<List<WorkoutDTO>> getAllTrainerWorkouts() {
        System.out.println("Controller: Getting all trainer workouts");
        try {
            List<WorkoutDTO> workouts = workoutService.getAllTrainerWorkouts();
            System.out.println("Controller: Found " + workouts.size() + " trainer workouts");
            return ResponseEntity.ok(workouts);
        } catch (Exception e) {
            System.err.println("Controller error in getAllTrainerWorkouts: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(new ArrayList<>());
        }
    }
}
