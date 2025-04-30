package com.gymmanagement.repository;

import com.gymmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // This method will be automatically implemented by Spring Data JPA
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(String role);
    
    // Check if phone number exists
    boolean existsByPhoneNumber(String phoneNumber);
    
    // Search users by first name or last name
    List<User> findByFirstNameContainingOrLastNameContaining(String firstName, String lastName);
} 