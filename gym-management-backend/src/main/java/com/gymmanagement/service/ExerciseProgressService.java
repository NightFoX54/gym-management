package com.gymmanagement.service;

import com.gymmanagement.dto.ExerciseProgressDTO;
import com.gymmanagement.dto.ExerciseProgressGoalDTO;
import com.gymmanagement.model.ExerciseProgress;
import com.gymmanagement.model.ExerciseProgressGoals;
import com.gymmanagement.repository.ExerciseProgressRepository;
import com.gymmanagement.repository.ExerciseProgressGoalsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
public class ExerciseProgressService {

    @Autowired
    private ExerciseProgressRepository progressRepository;

    @Autowired
    private ExerciseProgressGoalsRepository goalsRepository;

    public ExerciseProgressGoalDTO setGoal(ExerciseProgressGoalDTO dto) {
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
        return dto;
    }

    public ExerciseProgressDTO addProgress(ExerciseProgressDTO dto) {
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
        return dto;
    }

    public Map<String, Object> getExerciseProgress(Long userId) {
        Map<String, Object> response = new HashMap<>();

        // Get all goals for the user
        List<ExerciseProgressGoals> goals = goalsRepository.findByUserId(userId);
        List<ExerciseProgressGoalDTO> goalDTOs = goals.stream().map(goal -> {
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
            return dto;
        }).collect(Collectors.toList());

        // Get all progress entries for the user
        List<ExerciseProgress> progressEntries = progressRepository.findByUserId(userId);
        List<ExerciseProgressDTO> progressDTOs = progressEntries.stream().map(progress -> {
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
            return dto;
        }).collect(Collectors.toList());

        response.put("goals", goalDTOs);
        response.put("progress", progressDTOs);
        return response;
    }
} 