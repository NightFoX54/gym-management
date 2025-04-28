package com.gymmanagement.controller;

import com.gymmanagement.dto.*;
import com.gymmanagement.service.UserProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/progress")
public class UserProgressController {

    @Autowired
    private UserProgressService progressService;

    // Get progress (goal + history) for a user
    @GetMapping("/{userId}")
    public UserProgressResponseDTO getUserProgress(@PathVariable Long userId) {
        return progressService.getUserProgress(userId);
    }

    // Set a new goal
    @PostMapping("/goal")
    public UserProgressGoalDTO setGoal(@RequestBody UserProgressGoalDTO dto) {
        return progressService.setGoal(dto);
    }

    // Add a new statistics entry
    @PostMapping("/statistics")
    public UserStatisticsDTO addStatistics(@RequestBody UserStatisticsDTO dto) {
        return progressService.addStatistics(dto);
    }
}
