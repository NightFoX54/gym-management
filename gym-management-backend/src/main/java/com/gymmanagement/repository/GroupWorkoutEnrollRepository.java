package com.gymmanagement.repository;

import com.gymmanagement.model.GroupWorkoutEnroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface GroupWorkoutEnrollRepository extends JpaRepository<GroupWorkoutEnroll, Integer> {
    List<GroupWorkoutEnroll> findBySessionId(Integer sessionId);
    List<GroupWorkoutEnroll> findByMemberId(Long memberId);
    long countBySessionId(Integer sessionId);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM GroupWorkoutEnroll e WHERE e.session.id = :sessionId")
    void deleteBySessionId(Integer sessionId);
}