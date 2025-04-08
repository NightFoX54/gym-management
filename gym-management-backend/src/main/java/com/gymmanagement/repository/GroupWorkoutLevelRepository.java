package com.gymmanagement.repository;

import com.gymmanagement.model.GroupWorkoutLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupWorkoutLevelRepository extends JpaRepository<GroupWorkoutLevel, Integer> {
    GroupWorkoutLevel findByLevelName(String name);
}