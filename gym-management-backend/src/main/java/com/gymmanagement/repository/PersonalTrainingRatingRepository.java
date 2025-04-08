package com.gymmanagement.repository;

import com.gymmanagement.model.PersonalTrainingRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonalTrainingRatingRepository extends JpaRepository<PersonalTrainingRating, Integer> {
    List<PersonalTrainingRating> findByMemberId(Long memberId);
    Optional<PersonalTrainingRating> findBySessionId(Long sessionId);
    Optional<PersonalTrainingRating> findByMemberIdAndSessionId(Long memberId, Long sessionId);
} 