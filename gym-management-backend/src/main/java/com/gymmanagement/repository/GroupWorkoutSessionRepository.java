package com.gymmanagement.repository;

import com.gymmanagement.model.GroupWorkoutSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupWorkoutSessionRepository extends JpaRepository<GroupWorkoutSession, Integer> {
    List<GroupWorkoutSession> findByGroupWorkoutId(Integer groupWorkoutId);
    
    @Query("SELECT s FROM GroupWorkoutSession s WHERE s.groupWorkout.trainer.id = :trainerId")
    List<GroupWorkoutSession> findSessionsByTrainerId(@Param("trainerId") Long trainerId);
}