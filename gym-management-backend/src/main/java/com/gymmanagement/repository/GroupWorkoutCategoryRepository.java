package com.gymmanagement.repository;

import com.gymmanagement.model.GroupWorkoutCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupWorkoutCategoryRepository extends JpaRepository<GroupWorkoutCategory, Integer> {
    GroupWorkoutCategory findByCategoryName(String name);
}