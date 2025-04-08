package com.gymmanagement.repository;

import com.gymmanagement.model.GroupWorkoutSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GroupWorkoutSessionRepository extends JpaRepository<GroupWorkoutSession, Integer> {
    List<GroupWorkoutSession> findByGroupWorkoutId(Integer groupWorkoutId);
} 