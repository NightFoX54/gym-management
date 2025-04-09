package com.gymmanagement.repository;

import com.gymmanagement.model.TrainerSessionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainerSessionRequestRepository extends JpaRepository<TrainerSessionRequest, Integer> {
    List<TrainerSessionRequest> findByTrainerId(Long trainerId);
    List<TrainerSessionRequest> findByClientId(Long clientId);
} 