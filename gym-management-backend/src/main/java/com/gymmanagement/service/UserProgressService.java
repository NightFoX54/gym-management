package com.gymmanagement.service;

import com.gymmanagement.dto.*;
import com.gymmanagement.model.UserProgressGoals;
import com.gymmanagement.model.UserStatistics;
import com.gymmanagement.model.User;
import com.gymmanagement.model.TrainerClient;
import com.gymmanagement.repository.TrainerClientRepository;
import com.gymmanagement.repository.UserRepository;
import com.gymmanagement.repository.UserProgressGoalsRepository;
import com.gymmanagement.repository.UserStatisticsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserProgressService {

    @Autowired
    private UserProgressGoalsRepository goalRepository;

    @Autowired
    private TrainerClientRepository trainerClientRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserStatisticsRepository statisticsRepository;

    public UserProgressResponseDTO getUserProgress(Long userId) {
        UserProgressResponseDTO response = new UserProgressResponseDTO();
        User user = trainerClientRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found")).getClient();

        // Get latest goal (or null)
        Optional<UserProgressGoals> goalOpt = goalRepository.findByUserId(user.getId())
                .stream().sorted((a, b) -> b.getGoalDate().compareTo(a.getGoalDate())).findFirst();

        goalOpt.ifPresent(goal -> {
            UserProgressGoalDTO goalDTO = new UserProgressGoalDTO();
            goalDTO.setId(goal.getId());
            goalDTO.setUserId(goal.getUserId());
            goalDTO.setSetBy(goal.getSetBy());
            goalDTO.setGoalDate(goal.getGoalDate());
            goalDTO.setTargetWeight(goal.getTargetWeight());
            goalDTO.setTargetBodyFat(goal.getTargetBodyFat());
            goalDTO.setNotes(goal.getNotes());
            response.setGoal(goalDTO);
        });

        // Get all statistics, sorted by date ascending
        List<UserStatistics> stats = statisticsRepository.findByUserIdOrderByEntryDateAsc(user.getId());
        List<UserStatisticsDTO> statsDTOs = stats.stream().map(stat -> {
            UserStatisticsDTO dto = new UserStatisticsDTO();
            dto.setId(stat.getId());
            dto.setUserId(stat.getUserId());
            dto.setEnteredBy(stat.getEnteredBy());
            dto.setEntryDate(stat.getEntryDate());
            dto.setWeight(stat.getWeight());
            dto.setBodyFat(stat.getBodyFat());
            dto.setHeight(stat.getHeight());
            dto.setNotes(stat.getNotes());
            return dto;
        }).collect(Collectors.toList());
        response.setStatisticsHistory(statsDTOs);

        return response;
    }

    public UserProgressGoalDTO setGoal(UserProgressGoalDTO dto) {
        // Find the latest goal for the user
        User user = trainerClientRepository.findById(dto.getUserId()).orElseThrow(() -> new RuntimeException("User not found")).getClient();
        List<UserProgressGoals> goals = goalRepository.findByUserId(user.getId());
        UserProgressGoals goal;
        if (!goals.isEmpty()) {
            // Update the latest goal (by date)
            goal = goals.stream().sorted((a, b) -> b.getGoalDate().compareTo(a.getGoalDate())).findFirst().get();
            goal.setSetBy(dto.getSetBy());
            goal.setGoalDate(dto.getGoalDate());
            goal.setTargetWeight(dto.getTargetWeight());
            goal.setTargetBodyFat(dto.getTargetBodyFat());
            goal.setNotes(dto.getNotes());
        } else {
            // Insert new goal
            goal = new UserProgressGoals();
            goal.setUserId(user.getId());
            goal.setSetBy(dto.getSetBy());
            goal.setGoalDate(dto.getGoalDate());
            goal.setTargetWeight(dto.getTargetWeight());
            goal.setTargetBodyFat(dto.getTargetBodyFat());
            goal.setNotes(dto.getNotes());
        }
        UserProgressGoals saved = goalRepository.save(goal);
        dto.setId(saved.getId());
        return dto;
    }

    public UserStatisticsDTO addStatistics(UserStatisticsDTO dto) {
        User user = trainerClientRepository.findById(dto.getUserId()).orElseThrow(() -> new RuntimeException("User not found")).getClient();
        UserStatistics stat = new UserStatistics();
        stat.setUserId(user.getId());
        stat.setEnteredBy(dto.getEnteredBy());
        stat.setEntryDate(dto.getEntryDate());
        stat.setWeight(dto.getWeight());
        stat.setBodyFat(dto.getBodyFat());
        stat.setHeight(dto.getHeight());
        stat.setNotes(dto.getNotes());
        UserStatistics saved = statisticsRepository.save(stat);

        dto.setId(saved.getId());
        return dto;
    }
}
