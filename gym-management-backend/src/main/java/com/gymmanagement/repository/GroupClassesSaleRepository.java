package com.gymmanagement.repository;

import com.gymmanagement.model.GroupClassesSale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupClassesSaleRepository extends JpaRepository<GroupClassesSale, Integer> {
} 