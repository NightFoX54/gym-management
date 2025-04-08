package com.gymmanagement.repository;

import com.gymmanagement.model.GroupWorkout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupWorkoutRepository extends JpaRepository<GroupWorkout, Integer> {
    List<GroupWorkout> findByCategoryId(Integer categoryId);
    List<GroupWorkout> findByTrainerId(Long trainerId);
}