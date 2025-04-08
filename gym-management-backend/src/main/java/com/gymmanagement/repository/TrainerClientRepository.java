package com.gymmanagement.repository;

import com.gymmanagement.model.TrainerClient;
import com.gymmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TrainerClientRepository extends JpaRepository<TrainerClient, Long> {
    List<TrainerClient> findByTrainer(User trainer);
    List<TrainerClient> findByClient(User client);
    List<TrainerClient> findByTrainerId(Long trainerId);
    List<TrainerClient> findByClientId(Long clientId);
}
