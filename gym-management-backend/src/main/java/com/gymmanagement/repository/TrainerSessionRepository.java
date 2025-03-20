package com.gymmanagement.repository;

import com.gymmanagement.model.TrainerSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainerSessionRepository extends JpaRepository<TrainerSession, Long> {
    List<TrainerSession> findByTrainerId(Long trainerId);
    List<TrainerSession> findByClientId(Long clientId);
}
