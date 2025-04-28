package com.gymmanagement.repository;

import com.gymmanagement.model.TrainingSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TrainingSessionRepository extends JpaRepository<TrainingSession, Long> {
    List<TrainingSession> findByTrainerIdAndDateBetween(Long trainerId, LocalDate startDate, LocalDate endDate);
    List<TrainingSession> findByTrainerIdAndClientIdAndDateBetween(Long trainerId, Long clientId, LocalDate startDate, LocalDate endDate);
} 