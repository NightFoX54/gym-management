package com.gymmanagement.repository;

import com.gymmanagement.model.MarketCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MarketCategoryRepository extends JpaRepository<MarketCategory, Long> {
    boolean existsByName(String name);
} 