package com.gymmanagement.repository;

import com.gymmanagement.model.FreePtUse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FreePtUseRepository extends JpaRepository<FreePtUse, Long> {
    List<FreePtUse> findByMemberId(Long memberId);
    
    @Query("SELECT COUNT(f) FROM FreePtUse f WHERE f.member.id = :memberId AND f.useTime BETWEEN :startDate AND :endDate")
    int countByMemberIdAndUseTimeBetween(@Param("memberId") Long memberId, 
                                         @Param("startDate") LocalDateTime startDate, 
                                         @Param("endDate") LocalDateTime endDate);

    List<FreePtUse> findBySessionRequestId(Integer sessionRequestId);
} 