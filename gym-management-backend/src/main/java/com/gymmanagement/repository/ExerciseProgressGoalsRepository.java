package com.gymmanagement.repository;

import com.gymmanagement.model.ExerciseProgressGoals;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseProgressGoalsRepository extends JpaRepository<ExerciseProgressGoals, Long> {
    List<ExerciseProgressGoals> findByUserId(Long userId);
}
