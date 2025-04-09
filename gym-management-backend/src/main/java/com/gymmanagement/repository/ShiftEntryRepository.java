package com.gymmanagement.repository;

import com.gymmanagement.model.ShiftEntry;
import com.gymmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ShiftEntryRepository extends JpaRepository<ShiftEntry, Long> {
    
    // Find all shift entries for a specific user, ordered by day and start time
    List<ShiftEntry> findByUserOrderByDayOfWeekAscStartTimeAsc(User user);
} 