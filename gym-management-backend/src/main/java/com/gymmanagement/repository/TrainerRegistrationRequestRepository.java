package com.gymmanagement.repository;

import com.gymmanagement.model.TrainerRegistrationRequest;
import com.gymmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrainerRegistrationRequestRepository extends JpaRepository<TrainerRegistrationRequest, Long> {
    List<TrainerRegistrationRequest> findByTrainer(User trainer);
    List<TrainerRegistrationRequest> findByClient(User client);
    List<TrainerRegistrationRequest> findByTrainerAndClient(User trainer, User client);
}
