package com.gymmanagement.controller;

import com.gymmanagement.dto.UserProgressGoalDTO;
import com.gymmanagement.dto.UserProgressResponseDTO;
import com.gymmanagement.dto.UserStatisticsDTO;
import com.gymmanagement.model.UserProgressGoals;
import com.gymmanagement.model.UserStatistics;
import com.gymmanagement.repository.UserProgressGoalsRepository;
import com.gymmanagement.repository.UserRepository;
import com.gymmanagement.repository.UserStatisticsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/member-progress")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class MemberProgressController {

    @Autowired
    private UserProgressGoalsRepository goalRepository;

    @Autowired
    private UserStatisticsRepository statisticsRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getMemberProgress(@PathVariable Long userId) {
        try {
            UserProgressResponseDTO response = new UserProgressResponseDTO();

            // Get latest goal (or null)
            List<UserProgressGoals> goals = goalRepository.findByUserId(userId);
            if (!goals.isEmpty()) {
                // Sort by date descending and get the first one
                Optional<UserProgressGoals> latestGoal = goals.stream()
                    .sorted((a, b) -> b.getGoalDate().compareTo(a.getGoalDate()))
                    .findFirst();
                
                if (latestGoal.isPresent()) {
                    UserProgressGoals goal = latestGoal.get();
                    UserProgressGoalDTO goalDTO = new UserProgressGoalDTO();
                    goalDTO.setId(goal.getId());
                    goalDTO.setUserId(goal.getUserId());
                    goalDTO.setSetBy(goal.getSetBy());
                    goalDTO.setGoalDate(goal.getGoalDate());
                    goalDTO.setTargetWeight(goal.getTargetWeight());
                    goalDTO.setTargetBodyFat(goal.getTargetBodyFat());
                    goalDTO.setNotes(goal.getNotes());
                    response.setGoal(goalDTO);
                }
            }

            // Get all statistics, sorted by date ascending
            List<UserStatistics> stats = statisticsRepository.findByUserIdOrderByEntryDateAsc(userId);
            List<UserStatisticsDTO> statsDTOs = new ArrayList<>();
            
            for (UserStatistics stat : stats) {
                UserStatisticsDTO dto = new UserStatisticsDTO();
                dto.setId(stat.getId());
                dto.setUserId(stat.getUserId());
                dto.setEnteredBy(stat.getEnteredBy());
                dto.setEntryDate(stat.getEntryDate());
                dto.setWeight(stat.getWeight());
                dto.setBodyFat(stat.getBodyFat());
                dto.setHeight(stat.getHeight());
                dto.setNotes(stat.getNotes());
                statsDTOs.add(dto);
            }
            
            response.setStatisticsHistory(statsDTOs);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching progress data: " + e.getMessage());
        }
    }

    @PostMapping("/goal")
    public ResponseEntity<?> setMemberGoal(@RequestBody UserProgressGoalDTO dto) {
        try {
            // Find the latest goal for the user
            List<UserProgressGoals> goals = goalRepository.findByUserId(dto.getUserId());
            UserProgressGoals goal;
            
            if (!goals.isEmpty()) {
                // Update the latest goal (by date)
                goal = goals.stream()
                    .sorted((a, b) -> b.getGoalDate().compareTo(a.getGoalDate()))
                    .findFirst()
                    .get();
                    
                goal.setSetBy(dto.getSetBy());
                goal.setGoalDate(dto.getGoalDate());
                goal.setTargetWeight(dto.getTargetWeight());
                goal.setTargetBodyFat(dto.getTargetBodyFat());
                goal.setNotes(dto.getNotes());
            } else {
                // Insert new goal
                goal = new UserProgressGoals();
                goal.setUserId(dto.getUserId());
                goal.setSetBy(dto.getSetBy());
                goal.setGoalDate(dto.getGoalDate());
                goal.setTargetWeight(dto.getTargetWeight());
                goal.setTargetBodyFat(dto.getTargetBodyFat());
                goal.setNotes(dto.getNotes());
            }
            
            UserProgressGoals saved = goalRepository.save(goal);
            dto.setId(saved.getId());
            
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error setting goal: " + e.getMessage());
        }
    }

    @PostMapping("/statistics")
    public ResponseEntity<?> addMemberStatistics(@RequestBody UserStatisticsDTO dto) {
        try {
            UserStatistics stat = new UserStatistics();
            stat.setUserId(dto.getUserId());
            stat.setEnteredBy(dto.getEnteredBy());
            stat.setEntryDate(dto.getEntryDate());
            stat.setWeight(dto.getWeight());
            stat.setBodyFat(dto.getBodyFat());
            stat.setHeight(dto.getHeight());
            stat.setNotes(dto.getNotes());
            
            UserStatistics saved = statisticsRepository.save(stat);
            dto.setId(saved.getId());
            
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error adding statistics: " + e.getMessage());
        }
    }
} 