package com.gymmanagement.repository;

import com.gymmanagement.model.MarketSalesInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MarketSalesInvoiceRepository extends JpaRepository<MarketSalesInvoice, Long> {
    List<MarketSalesInvoice> findByUserIdOrderBySaleDateDesc(Long userId);
    long countByOrderNoStartingWith(String prefix);
} 