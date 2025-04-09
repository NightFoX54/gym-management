package com.gymmanagement.repository;

import com.gymmanagement.model.ClubVisit;
import com.gymmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClubVisitRepository extends JpaRepository<ClubVisit, Long> {
    Optional<ClubVisit> findTopByUserAndCheckOutDateIsNullOrderByIdDesc(User user);
    List<ClubVisit> findByUser(User user);
} 