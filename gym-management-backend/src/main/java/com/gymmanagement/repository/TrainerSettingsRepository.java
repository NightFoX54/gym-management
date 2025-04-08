package com.gymmanagement.repository;

import com.gymmanagement.model.TrainerSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TrainerSettingsRepository extends JpaRepository<TrainerSettings, Long> {
    Optional<TrainerSettings> findByTrainerId(Long trainerId);
}
 