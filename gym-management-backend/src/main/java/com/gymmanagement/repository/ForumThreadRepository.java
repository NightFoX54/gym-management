package com.gymmanagement.repository;

import com.gymmanagement.model.ForumThread;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ForumThreadRepository extends JpaRepository<ForumThread, Integer> {
    
    @Query("SELECT t FROM ForumThread t ORDER BY (SELECT MAX(p.createdAt) FROM ForumPost p WHERE p.thread = t) DESC NULLS LAST")
    Page<ForumThread> findAllOrderByLatestPost(Pageable pageable);
    
    @Query("SELECT t FROM ForumThread t WHERE t IN (SELECT p.thread FROM ForumPost p WHERE p.createdAt >= ?1 GROUP BY p.thread ORDER BY COUNT(p) DESC)")
    List<ForumThread> findHotThreads(LocalDateTime since, Pageable pageable);
} 