package com.gymmanagement.repository;

import com.gymmanagement.model.Friends;
import com.gymmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FriendsRepository extends JpaRepository<Friends, Long> {
    
    @Query("SELECT f FROM Friends f WHERE f.user1 = ?1 OR f.user2 = ?1")
    List<Friends> findAllFriendsByUser(User user);
    
    @Query("SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END FROM Friends f " +
           "WHERE (f.user1 = ?1 AND f.user2 = ?2) OR (f.user1 = ?2 AND f.user2 = ?1)")
    boolean areFriends(User user1, User user2);
    
    @Query("SELECT f FROM Friends f WHERE (f.user1 = ?1 AND f.user2 = ?2) OR (f.user1 = ?2 AND f.user2 = ?1)")
    Friends findFriendshipBetween(User user1, User user2);
} 