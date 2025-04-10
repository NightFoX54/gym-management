package com.gymmanagement.repository;

import com.gymmanagement.model.TrainerEmployeeDetails;
import com.gymmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TrainerEmployeeDetailsRepository extends JpaRepository<TrainerEmployeeDetails, Integer> {
    Optional<TrainerEmployeeDetails> findByUser(User user);
    Optional<TrainerEmployeeDetails> findByUserId(Long userId);
} 