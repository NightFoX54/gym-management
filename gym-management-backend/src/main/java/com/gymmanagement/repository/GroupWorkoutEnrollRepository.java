package com.gymmanagement.repository;

import com.gymmanagement.model.GroupWorkoutEnroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GroupWorkoutEnrollRepository extends JpaRepository<GroupWorkoutEnroll, Integer> {
    List<GroupWorkoutEnroll> findByMemberId(Long memberId);
    boolean existsBySessionIdAndMemberId(Integer sessionId, Long memberId);
} 