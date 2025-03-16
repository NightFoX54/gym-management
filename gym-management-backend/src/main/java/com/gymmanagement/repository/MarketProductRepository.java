package com.gymmanagement.repository;

import com.gymmanagement.model.MarketProduct;
import com.gymmanagement.model.MarketCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MarketProductRepository extends JpaRepository<MarketProduct, Long> {
    List<MarketProduct> findByCategory(MarketCategory category);
    List<MarketProduct> findByCategoryId(Long categoryId);
    List<MarketProduct> findByProductNameContainingIgnoreCase(String productName);
} 