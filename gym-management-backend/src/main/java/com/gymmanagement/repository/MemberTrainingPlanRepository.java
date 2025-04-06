package com.gymmanagement.repository;

import com.gymmanagement.model.MemberTrainingPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberTrainingPlanRepository extends JpaRepository<MemberTrainingPlan, Long> {
    List<MemberTrainingPlan> findByUserId(Long userId);
    Optional<MemberTrainingPlan> findByUserIdAndDayOfWeek(Long userId, Integer dayOfWeek);
} 