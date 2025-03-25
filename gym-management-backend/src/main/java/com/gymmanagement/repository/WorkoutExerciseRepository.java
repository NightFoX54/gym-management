package com.gymmanagement.repository;

import com.gymmanagement.model.WorkoutExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface WorkoutExerciseRepository extends JpaRepository<WorkoutExercise, Long> {
    List<WorkoutExercise> findByWorkoutId(Long workoutId);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM WorkoutExercise e WHERE e.workout.id = :workoutId")
    void deleteAllByWorkoutId(Long workoutId);
}
