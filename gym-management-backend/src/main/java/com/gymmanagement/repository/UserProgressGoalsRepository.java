package com.gymmanagement.repository;

import com.gymmanagement.model.UserProgressGoals;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserProgressGoalsRepository extends JpaRepository<UserProgressGoals, Long> {
    List<UserProgressGoals> findByUserId(Long userId);
}
