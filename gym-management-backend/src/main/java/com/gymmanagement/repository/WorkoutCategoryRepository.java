package com.gymmanagement.repository;

import com.gymmanagement.model.WorkoutCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkoutCategoryRepository extends JpaRepository<WorkoutCategory, Long> {
    WorkoutCategory findByName(String name);
}
