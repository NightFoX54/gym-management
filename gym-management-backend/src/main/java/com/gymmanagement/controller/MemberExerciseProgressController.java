package com.gymmanagement.controller;

import com.gymmanagement.dto.ExerciseProgressDTO;
import com.gymmanagement.dto.ExerciseProgressGoalDTO;
import com.gymmanagement.model.ExerciseProgress;
import com.gymmanagement.model.ExerciseProgressGoals;
import com.gymmanagement.repository.ExerciseProgressGoalsRepository;
import com.gymmanagement.repository.ExerciseProgressRepository;
import com.gymmanagement.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/member-exercise-progress")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT})
public class MemberExerciseProgressController {

    @Autowired
    private ExerciseProgressRepository progressRepository;
    
    @Autowired
    private ExerciseProgressGoalsRepository goalsRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/{userId}")
    public ResponseEntity<?> getMemberExerciseProgress(@PathVariable Long userId) {
        try {
            Map<String, Object> response = new HashMap<>();

            // Get all goals for the user
            List<ExerciseProgressGoals> goals = goalsRepository.findByUserId(userId);
            List<ExerciseProgressGoalDTO> goalDTOs = new ArrayList<>();
            
            for (ExerciseProgressGoals goal : goals) {
                ExerciseProgressGoalDTO dto = new ExerciseProgressGoalDTO();
                dto.setId(goal.getId());
                dto.setUserId(goal.getUserId());
                dto.setExerciseName(goal.getExerciseName());
                dto.setSetBy(goal.getSetBy());
                dto.setGoalDate(goal.getGoalDate());
                dto.setTargetWeight(goal.getTargetWeight());
                dto.setTargetReps(goal.getTargetReps());
                dto.setTargetDuration(goal.getTargetDuration());
                dto.setTargetDistance(goal.getTargetDistance());
                dto.setNotes(goal.getNotes());
                goalDTOs.add(dto);
            }

            // Get all progress entries for the user
            List<ExerciseProgress> progressEntries = progressRepository.findByUserId(userId);
            List<ExerciseProgressDTO> progressDTOs = new ArrayList<>();
            
            for (ExerciseProgress progress : progressEntries) {
                ExerciseProgressDTO dto = new ExerciseProgressDTO();
                dto.setId(progress.getId());
                dto.setUserId(progress.getUserId());
                dto.setExerciseName(progress.getExerciseName());
                dto.setEntryDate(progress.getEntryDate());
                dto.setWeight(progress.getWeight());
                dto.setReps(progress.getReps());
                dto.setDuration(progress.getDuration());
                dto.setDistance(progress.getDistance());
                dto.setNotes(progress.getNotes());
                dto.setEnteredBy(progress.getEnteredBy());
                progressDTOs.add(dto);
            }

            response.put("goals", goalDTOs);
            response.put("progress", progressDTOs);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching exercise progress: " + e.getMessage());
        }
    }

    @PostMapping("/goal")
    public ResponseEntity<?> setMemberExerciseGoal(@RequestBody ExerciseProgressGoalDTO dto) {
        try {
            ExerciseProgressGoals goal = new ExerciseProgressGoals();
            goal.setUserId(dto.getUserId());
            goal.setExerciseName(dto.getExerciseName());
            goal.setSetBy(dto.getSetBy());
            goal.setGoalDate(dto.getGoalDate());
            goal.setTargetWeight(dto.getTargetWeight());
            goal.setTargetReps(dto.getTargetReps());
            goal.setTargetDuration(dto.getTargetDuration());
            goal.setTargetDistance(dto.getTargetDistance());
            goal.setNotes(dto.getNotes());

            ExerciseProgressGoals saved = goalsRepository.save(goal);
            dto.setId(saved.getId());
            
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error setting exercise goal: " + e.getMessage());
        }
    }

    @PostMapping("/progress")
    public ResponseEntity<?> addMemberExerciseProgress(@RequestBody ExerciseProgressDTO dto) {
        try {
            ExerciseProgress progress = new ExerciseProgress();
            progress.setUserId(dto.getUserId());
            progress.setExerciseName(dto.getExerciseName());
            progress.setEntryDate(dto.getEntryDate());
            progress.setWeight(dto.getWeight());
            progress.setReps(dto.getReps());
            progress.setDuration(dto.getDuration());
            progress.setDistance(dto.getDistance());
            progress.setNotes(dto.getNotes());
            progress.setEnteredBy(dto.getEnteredBy());

            ExerciseProgress saved = progressRepository.save(progress);
            dto.setId(saved.getId());
            
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error adding exercise progress: " + e.getMessage());
        }
    }
} 