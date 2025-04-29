package com.gymmanagement.repository;

import com.gymmanagement.model.ForumPost;
import com.gymmanagement.model.ForumThread;
import com.gymmanagement.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForumPostRepository extends JpaRepository<ForumPost, Integer> {
    
    Page<ForumPost> findByThreadOrderByCreatedAtAsc(ForumThread thread, Pageable pageable);
    
    @Query("SELECT p.user, COUNT(p) as postCount FROM ForumPost p GROUP BY p.user ORDER BY postCount DESC")
    List<Object[]> findTopContributors(Pageable pageable);
    
    boolean existsByUserAndThread(User user, ForumThread thread);
    
    void deleteByUserAndThread(User user, ForumThread thread);
} 