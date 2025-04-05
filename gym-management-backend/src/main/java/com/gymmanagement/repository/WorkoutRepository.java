package com.gymmanagement.repository;

import com.gymmanagement.model.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {
    List<Workout> findByUserId(Long userId);
    List<Workout> findByUserIdAndIsTrainer(Long userId, Boolean isTrainer);
    List<Workout> findByIsTrainer(Boolean isTrainer);
}
