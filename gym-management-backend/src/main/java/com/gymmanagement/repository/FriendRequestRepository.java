package com.gymmanagement.repository;

import com.gymmanagement.model.FriendRequest;
import com.gymmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {
    
    List<FriendRequest> findByReceiver(User receiver);
    
    List<FriendRequest> findBySender(User sender);
    
    @Query("SELECT fr FROM FriendRequest fr WHERE fr.sender.id = ?1")
    List<FriendRequest> findBySenderId(Long senderId);
    
    @Query("SELECT CASE WHEN COUNT(fr) > 0 THEN true ELSE false END FROM FriendRequest fr " +
           "WHERE (fr.sender = ?1 AND fr.receiver = ?2) OR (fr.sender = ?2 AND fr.receiver = ?1)")
    boolean existsBetweenUsers(User user1, User user2);
    
    FriendRequest findBySenderAndReceiver(User sender, User receiver);
} 