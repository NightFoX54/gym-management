package com.gymmanagement.repository;

import com.gymmanagement.model.ExerciseProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseProgressRepository extends JpaRepository<ExerciseProgress, Long> {
    List<ExerciseProgress> findByUserId(Long userId);
}
