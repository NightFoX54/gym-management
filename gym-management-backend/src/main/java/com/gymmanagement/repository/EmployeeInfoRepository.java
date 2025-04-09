package com.gymmanagement.repository;

import com.gymmanagement.model.EmployeeInfo;
import com.gymmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeInfoRepository extends JpaRepository<EmployeeInfo, Long> {
    
    // Find employee info by User object
    Optional<EmployeeInfo> findByUser(User user);
} 