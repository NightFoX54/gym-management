package com.gymmanagement.repository;

import com.gymmanagement.model.UserStatistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserStatisticsRepository extends JpaRepository<UserStatistics, Long> {
    List<UserStatistics> findByUserIdOrderByEntryDateAsc(Long userId);
}
