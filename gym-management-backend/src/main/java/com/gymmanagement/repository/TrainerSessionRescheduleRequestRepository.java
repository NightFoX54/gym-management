package com.gymmanagement.repository;

import com.gymmanagement.model.TrainerSessionRescheduleRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainerSessionRescheduleRequestRepository extends JpaRepository<TrainerSessionRescheduleRequest, Long> {
    List<TrainerSessionRescheduleRequest> findBySessionId(Long sessionId);
} 