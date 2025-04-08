package com.gymmanagement.repository;

import com.gymmanagement.model.TrainerSession;
import com.gymmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TrainerSessionRepository extends JpaRepository<TrainerSession, Long> {
    List<TrainerSession> findByTrainer(User trainer);
    List<TrainerSession> findByClient(User client);
    List<TrainerSession> findByTrainerAndSessionDateBetween(User trainer, LocalDate startDate, LocalDate endDate);
    List<TrainerSession> findByClientAndSessionDateBetween(User client, LocalDate startDate, LocalDate endDate);
}
