package com.gymmanagement.repository;

import com.gymmanagement.model.MarketProductSale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MarketProductSaleRepository extends JpaRepository<MarketProductSale, Long> {
} 