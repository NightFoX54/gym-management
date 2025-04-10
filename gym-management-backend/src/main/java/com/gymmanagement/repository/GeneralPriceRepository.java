package com.gymmanagement.repository;

import com.gymmanagement.model.GeneralPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GeneralPriceRepository extends JpaRepository<GeneralPrice, Integer> {
} 