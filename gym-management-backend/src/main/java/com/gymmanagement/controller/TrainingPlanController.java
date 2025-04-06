package com.gymmanagement.controller;

import com.gymmanagement.dto.TrainingPlanDTO;
import com.gymmanagement.service.TrainingPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/training-plans")
@CrossOrigin(origins = "*")
public class TrainingPlanController {
    
    @Autowired
    private TrainingPlanService trainingPlanService;
    
    @PostMapping("")
    public ResponseEntity<TrainingPlanDTO> addWorkoutToWeeklyPlan(@RequestBody Map<String, Object> request) {
        Long userId = Long.parseLong(request.get("userId").toString());
        Long workoutId = Long.parseLong(request.get("workoutId").toString());
        Integer dayOfWeek = Integer.parseInt(request.get("dayOfWeek").toString());
        
        return ResponseEntity.ok(trainingPlanService.addWorkoutToTrainingPlan(userId, workoutId, dayOfWeek));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TrainingPlanDTO>> getUserTrainingPlan(@PathVariable Long userId) {
        return ResponseEntity.ok(trainingPlanService.getUserTrainingPlan(userId));
    }
    
    @PostMapping("/add-workout")
    public ResponseEntity<TrainingPlanDTO> addWorkoutFromProgram(@RequestBody Map<String, Object> request) {
        Long userId = Long.parseLong(request.get("userId").toString());
        Long workoutId = Long.parseLong(request.get("workoutId").toString());
        Integer dayOfWeek = Integer.parseInt(request.get("dayOfWeek").toString());
        
        return ResponseEntity.ok(trainingPlanService.addWorkoutToTrainingPlan(userId, workoutId, dayOfWeek));
    }
    
    @PostMapping("/user/{userId}")
    public ResponseEntity<TrainingPlanDTO> addWorkoutToTrainingPlan(
            @PathVariable Long userId,
            @RequestBody Map<String, Object> request) {
        
        Long workoutId = Long.parseLong(request.get("workoutId").toString());
        Integer dayOfWeek = Integer.parseInt(request.get("dayOfWeek").toString());
        
        return ResponseEntity.ok(trainingPlanService.addWorkoutToTrainingPlan(userId, workoutId, dayOfWeek));
    }
    
    @PutMapping("/user/{userId}/plan/{planId}")
    public ResponseEntity<TrainingPlanDTO> updateTrainingPlan(
            @PathVariable Long userId,
            @PathVariable Long planId,
            @RequestBody Map<String, Object> request) {
        
        Long workoutId = Long.parseLong(request.get("workoutId").toString());
        Integer dayOfWeek = Integer.parseInt(request.get("dayOfWeek").toString());
        
        return ResponseEntity.ok(trainingPlanService.updateTrainingPlan(userId, planId, workoutId, dayOfWeek));
    }
    
    @DeleteMapping("/user/{userId}/plan/{planId}")
    public ResponseEntity<Void> removeFromTrainingPlan(
            @PathVariable Long userId,
            @PathVariable Long planId) {
        
        trainingPlanService.removeFromTrainingPlan(userId, planId);
        return ResponseEntity.ok().build();
    }
} 