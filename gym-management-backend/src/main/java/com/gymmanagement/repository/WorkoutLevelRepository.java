package com.gymmanagement.repository;

import com.gymmanagement.model.WorkoutLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkoutLevelRepository extends JpaRepository<WorkoutLevel, Long> {
    WorkoutLevel findByName(String name);
}
