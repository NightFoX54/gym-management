package com.gymmanagement.repository;

import com.gymmanagement.model.ForumLike;
import com.gymmanagement.model.ForumPost;
import com.gymmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForumLikeRepository extends JpaRepository<ForumLike, Integer> {
    
    boolean existsByUserAndPost(User user, ForumPost post);
    
    void deleteByUserAndPost(User user, ForumPost post);
    
    long countByPost(ForumPost post);
    
    List<ForumLike> findByPost(ForumPost post);
} 