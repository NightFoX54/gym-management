package com.gymmanagement.controller;

import com.gymmanagement.dto.ExerciseProgressDTO;
import com.gymmanagement.dto.ExerciseProgressGoalDTO;
import com.gymmanagement.service.ExerciseProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/exercise-progress")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT})
public class ExerciseProgressController {

    @Autowired
    private ExerciseProgressService progressService;

    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> getExerciseProgress(@PathVariable Long userId) {
        return ResponseEntity.ok(progressService.getExerciseProgress(userId));
    }

    @PostMapping("/goal")
    public ResponseEntity<ExerciseProgressGoalDTO> setGoal(@RequestBody ExerciseProgressGoalDTO dto) {
        return ResponseEntity.ok(progressService.setGoal(dto));
    }

    @PostMapping("/progress")
    public ResponseEntity<ExerciseProgressDTO> addProgress(@RequestBody ExerciseProgressDTO dto) {
        return ResponseEntity.ok(progressService.addProgress(dto));
    }
} 